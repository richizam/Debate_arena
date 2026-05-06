import type { Env } from "./env";

export interface ContextPack {
  facts: string[];
  discourse: string[];
  uncertain: string[];
  avoid: string[];
  sourcesCount: number;
  freshness: "live" | "stale";
  fetchedAt: number;
}

interface GrokRequestInput {
  lang: string;
  topic: string;
  fighterA: string;
  fighterB: string;
}

interface GrokResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  usage?: {
    num_sources_used?: number;
  };
}

const CACHE_KEY_PREFIX = "lc:v1:";
const SUCCESS_TTL_SECONDS = 6 * 60 * 60;
const NEGATIVE_TTL_SECONDS = 24 * 60 * 60;
const FETCH_TIMEOUT_MS = 3000;
const MAX_BUCKET_ITEMS = 6;
const MAX_ITEM_LENGTH = 280;

const LANGUAGE_LABEL: Record<string, string> = {
  en: "English",
  es: "Spanish",
  de: "German",
  fr: "French",
  ru: "Russian",
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\s\p{P}]+/gu, " ")
    .trim();
}

async function sha1Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function buildCacheKey(input: GrokRequestInput): Promise<string> {
  const fighters = [normalize(input.fighterA), normalize(input.fighterB)].sort().join("|");
  const composite = `${input.lang}|${normalize(input.topic)}|${fighters}`;
  const hash = await sha1Hex(composite);
  return `${CACHE_KEY_PREFIX}${hash}`;
}

function clampList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") {
      continue;
    }
    const trimmed = item.trim().slice(0, MAX_ITEM_LENGTH);
    if (trimmed.length > 0) {
      out.push(trimmed);
    }
    if (out.length >= MAX_BUCKET_ITEMS) {
      break;
    }
  }
  return out;
}

function parsePack(raw: string, sourcesCount: number): ContextPack | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return null;
  }

  const obj = parsed as Record<string, unknown>;
  const facts = clampList(obj.facts);
  const discourse = clampList(obj.discourse);
  const uncertain = clampList(obj.uncertain);
  const avoid = clampList(obj.avoid);

  if (facts.length === 0 && discourse.length === 0) {
    return null;
  }

  return {
    facts,
    discourse,
    uncertain,
    avoid,
    sourcesCount,
    freshness: "live",
    fetchedAt: Date.now(),
  };
}

function buildPrompt(input: GrokRequestInput): { system: string; user: string } {
  const language = LANGUAGE_LABEL[input.lang] ?? "English";
  const system = `You research live public context for a debate game. Search X (Twitter), the web, and news. Return ONE JSON object with exactly these four arrays of short strings, each item under 280 chars, each array max 6 items:
{"facts": [...], "discourse": [...], "uncertain": [...], "avoid": [...]}

- facts: well-sourced, currently true things about ${input.fighterA}, ${input.fighterB}, or "${input.topic}". Include dates when relevant.
- discourse: what audiences are publicly saying right now about this topic (clearly framed as opinion or chatter, not fact).
- uncertain: claims circulating online that are NOT confirmed. Each item must read like "Some posts claim X, but this is unverified."
- avoid: subjects to keep out of the debate entirely (active legal cases, personal relationships, doxxing, harassment campaigns, accusations without confirmed reporting). Briefly say what to avoid.

Write each item in ${language}. Output ONLY the JSON object, no prose, no code fences.`;

  const user = `Topic: ${input.topic}
Fighter A: ${input.fighterA}
Fighter B: ${input.fighterB}

What is publicly happening right now that would make this debate feel current?`;

  return { system, user };
}

async function fetchFromGrok(env: Env, input: GrokRequestInput): Promise<ContextPack | null> {
  const apiKey = env.XAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const baseUrl = env.XAI_API_BASE_URL || "https://api.x.ai/v1";
  const { system, user } = buildPrompt(input);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "grok-3-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
        search_parameters: {
          mode: "on",
          sources: [{ type: "x" }, { type: "web" }, { type: "news" }],
          max_search_results: 8,
          return_citations: false,
        },
      }),
    });

    if (!response.ok) {
      console.warn("Grok request failed:", response.status, await response.text().catch(() => ""));
      return null;
    }

    const data = (await response.json()) as GrokResponse;
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return null;
    }

    const sourcesCount = data.usage?.num_sources_used ?? 0;
    return parsePack(content, sourcesCount);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.warn("Grok request timed out after", FETCH_TIMEOUT_MS, "ms");
    } else {
      console.warn("Grok request threw:", error);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function readCache(kv: KVNamespace, key: string): Promise<ContextPack | null> {
  try {
    const raw = await kv.get(key);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as ContextPack | { negative: true };
    if ("negative" in parsed) {
      return null;
    }
    return { ...parsed, freshness: "stale" };
  } catch (error) {
    console.warn("KV read failed:", error);
    return null;
  }
}

async function writeCache(kv: KVNamespace, key: string, pack: ContextPack): Promise<void> {
  try {
    await kv.put(key, JSON.stringify(pack), { expirationTtl: SUCCESS_TTL_SECONDS });
  } catch (error) {
    console.warn("KV write failed:", error);
  }
}

async function writeNegativeCache(kv: KVNamespace, key: string): Promise<void> {
  try {
    await kv.put(key, JSON.stringify({ negative: true }), { expirationTtl: NEGATIVE_TTL_SECONDS });
  } catch (error) {
    console.warn("KV negative-cache write failed:", error);
  }
}

export async function getContextPack(
  env: Env,
  input: GrokRequestInput
): Promise<ContextPack | null> {
  if (!env.XAI_API_KEY) {
    return null;
  }

  const cacheKey = await buildCacheKey(input);
  const kv = env.LIVE_CONTEXT_KV;

  if (kv) {
    const cached = await readCache(kv, cacheKey);
    if (cached) {
      return cached;
    }
  }

  const fresh = await fetchFromGrok(env, input);

  if (fresh && kv) {
    await writeCache(kv, cacheKey, fresh);
  } else if (!fresh && kv) {
    await writeNegativeCache(kv, cacheKey);
  }

  return fresh;
}
