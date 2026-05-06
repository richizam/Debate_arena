import { getOptionalAuthenticatedUser } from "../_shared/auth";
import { optionsResponse } from "../_shared/cors";
import type { Env } from "../_shared/env";
import { errorResponse, jsonResponse, readJson } from "../_shared/http";
import { getSupabaseAdmin } from "../_shared/supabase";

interface FighterInput {
  id?: unknown;
  name?: unknown;
  persona?: unknown;
}

interface RoundInput {
  speaker?: unknown;
  text?: unknown;
}

interface VerdictInput {
  winner?: unknown;
  reason?: unknown;
}

interface ShareBattleBody {
  fighters?: unknown;
  topic?: unknown;
  language?: unknown;
  rounds?: unknown;
  verdict?: unknown;
}

const RATE_WINDOW_MS = 60_000;
const RATE_MAX_PER_WINDOW = 6;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

const MAX_TEXT_LENGTH = 1200;
const MAX_NAME_LENGTH = 80;
const MAX_TOPIC_LENGTH = 200;

function getClientIp(request: Request): string {
  return (
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`v1:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .slice(0, 12)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (bucket.count >= RATE_MAX_PER_WINDOW) {
    return true;
  }
  bucket.count += 1;
  return false;
}

function generateShareId(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function trimString(value: unknown, max: number): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }
  return trimmed.slice(0, max);
}

function validateFighter(input: unknown): { id: "a" | "b"; name: string; persona: string } | null {
  if (!input || typeof input !== "object") {
    return null;
  }
  const f = input as FighterInput;
  const id = f.id === "a" || f.id === "b" ? f.id : null;
  const name = trimString(f.name, MAX_NAME_LENGTH);
  const persona = typeof f.persona === "string" ? f.persona.slice(0, MAX_TEXT_LENGTH) : "";
  if (!id || !name) {
    return null;
  }
  return { id, name, persona };
}

function validateRound(input: unknown): { speaker: "a" | "b"; text: string } | null {
  if (!input || typeof input !== "object") {
    return null;
  }
  const r = input as RoundInput;
  const speaker = r.speaker === "a" || r.speaker === "b" ? r.speaker : null;
  const text = trimString(r.text, MAX_TEXT_LENGTH);
  if (!speaker || !text) {
    return null;
  }
  return { speaker, text };
}

function validateVerdict(input: unknown): { winner: "a" | "b"; reason: string } | null {
  if (!input || typeof input !== "object") {
    return null;
  }
  const v = input as VerdictInput;
  const winner = v.winner === "a" || v.winner === "b" ? v.winner : null;
  const reason = trimString(v.reason, MAX_TEXT_LENGTH);
  if (!winner || !reason) {
    return null;
  }
  return { winner, reason };
}

export const onRequestOptions: PagesFunction = async () => optionsResponse();

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const ip = getClientIp(context.request);
  if (isRateLimited(ip)) {
    return errorResponse(429, "rate_limited", "Too many share attempts.");
  }

  let body: ShareBattleBody;
  try {
    body = await readJson<ShareBattleBody>(context.request);
  } catch {
    return errorResponse(400, "invalid_json", "Invalid JSON body.");
  }

  if (!Array.isArray(body.fighters) || body.fighters.length !== 2) {
    return errorResponse(400, "invalid_battle", "Battle must include exactly two fighters.");
  }
  const fighterA = validateFighter(body.fighters[0]);
  const fighterB = validateFighter(body.fighters[1]);
  if (!fighterA || !fighterB || fighterA.id === fighterB.id) {
    return errorResponse(400, "invalid_battle", "Fighters are missing or share an id.");
  }

  const topic = trimString(body.topic, MAX_TOPIC_LENGTH);
  const language = trimString(body.language, 8) ?? "en";
  if (!topic) {
    return errorResponse(400, "invalid_battle", "Missing topic.");
  }

  if (!Array.isArray(body.rounds) || body.rounds.length === 0 || body.rounds.length > 24) {
    return errorResponse(400, "invalid_battle", "Rounds must contain between 1 and 24 lines.");
  }
  const rounds: Array<{ speaker: "a" | "b"; text: string }> = [];
  for (const raw of body.rounds) {
    const round = validateRound(raw);
    if (!round) {
      return errorResponse(400, "invalid_battle", "Invalid round entry.");
    }
    rounds.push(round);
  }

  const verdict = validateVerdict(body.verdict);
  if (!verdict) {
    return errorResponse(400, "invalid_battle", "Invalid judge verdict.");
  }

  if (!context.env.SUPABASE_URL || !context.env.SUPABASE_SERVICE_ROLE_KEY) {
    return errorResponse(503, "storage_unavailable", "Battle sharing is temporarily unavailable.");
  }

  const auth = await getOptionalAuthenticatedUser(context.request, context.env);
  const ipHash = await hashIp(ip);
  const id = generateShareId();
  const admin = getSupabaseAdmin(context.env);

  const { error } = await admin.from("shared_battles").insert({
    id,
    fighters_json: [fighterA, fighterB],
    topic,
    language,
    rounds_json: rounds,
    verdict_json: verdict,
    user_id: auth?.user.id ?? null,
    ip_hash: ipHash,
  });

  if (error) {
    console.error("share-battle insert failed:", error.message);
    return errorResponse(500, "share_failed", "Unable to share this battle right now.");
  }

  const origin = new URL(context.request.url).origin;
  return jsonResponse({
    id,
    shareUrl: `${origin}/share/${id}`,
    matchUrl: `${origin}/?match=${id}`,
  });
};
