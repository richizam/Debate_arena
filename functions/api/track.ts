import { getOptionalAuthenticatedUser } from "../_shared/auth";
import { optionsResponse } from "../_shared/cors";
import type { Env } from "../_shared/env";
import { errorResponse, jsonResponse, readJson } from "../_shared/http";
import { getSupabaseAdmin } from "../_shared/supabase";

interface TrackBody {
  event?: unknown;
  props?: unknown;
}

const ALLOWED_EVENTS = new Set([
  "suggestion_shown",
  "suggestion_clicked",
  "battle_started",
  "battle_completed",
  "vote",
  "share_clicked",
  "share_claim_attempted",
  "limit_reached",
  "plan_clicked",
  "checkout_started",
]);

const RATE_WINDOW_MS = 60_000;
const RATE_MAX_PER_WINDOW = 60;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

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

function sanitizeProps(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const result: Record<string, unknown> = {};
  let count = 0;

  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (count >= 16) {
      break;
    }
    if (typeof key !== "string" || key.length > 64) {
      continue;
    }
    if (
      raw === null ||
      typeof raw === "boolean" ||
      typeof raw === "number" ||
      (typeof raw === "string" && raw.length <= 200)
    ) {
      result[key] = raw;
      count += 1;
    }
  }

  return result;
}

export const onRequestOptions: PagesFunction = async () => optionsResponse();

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const ip = getClientIp(context.request);

  if (isRateLimited(ip)) {
    return errorResponse(429, "rate_limited", "Too many tracking events.");
  }

  let body: TrackBody;
  try {
    body = await readJson<TrackBody>(context.request);
  } catch {
    return errorResponse(400, "invalid_json", "Invalid JSON body.");
  }

  const event = typeof body.event === "string" ? body.event : null;
  if (!event || !ALLOWED_EVENTS.has(event)) {
    return errorResponse(400, "invalid_event", "Unknown event name.");
  }

  if (!context.env.SUPABASE_URL || !context.env.SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ ok: true, persisted: false });
  }

  const auth = await getOptionalAuthenticatedUser(context.request, context.env);
  const ipHash = await hashIp(ip);

  try {
    const admin = getSupabaseAdmin(context.env);
    const { error } = await admin.from("analytics_events").insert({
      event,
      props_json: sanitizeProps(body.props),
      user_id: auth?.user.id ?? null,
      ip_hash: ipHash,
    });

    if (error) {
      console.warn("analytics insert failed:", error.message);
      return jsonResponse({ ok: true, persisted: false });
    }
  } catch (error) {
    console.warn("analytics insert threw:", error);
    return jsonResponse({ ok: true, persisted: false });
  }

  return jsonResponse({ ok: true, persisted: true });
};
