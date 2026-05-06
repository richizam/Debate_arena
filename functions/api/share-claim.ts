import { getOptionalAuthenticatedUser } from "../_shared/auth";
import { optionsResponse } from "../_shared/cors";
import type { Env } from "../_shared/env";
import { errorResponse, jsonResponse, readJson } from "../_shared/http";
import { getSupabaseAdmin } from "../_shared/supabase";

interface ShareClaimBody {
  battleHash?: unknown;
  surface?: unknown;
}

const ALLOWED_SURFACES = new Set(["limit", "result"]);

const RATE_WINDOW_MS = 60_000;
const RATE_MAX_PER_WINDOW = 12;
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

export const onRequestOptions: PagesFunction = async () => optionsResponse();

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const ip = getClientIp(context.request);
  if (isRateLimited(ip)) {
    return errorResponse(429, "rate_limited", "Too many share claims.");
  }

  let body: ShareClaimBody;
  try {
    body = await readJson<ShareClaimBody>(context.request);
  } catch {
    return errorResponse(400, "invalid_json", "Invalid JSON body.");
  }

  const battleHash =
    typeof body.battleHash === "string" && body.battleHash.length > 0 && body.battleHash.length <= 96
      ? body.battleHash
      : null;

  if (!battleHash) {
    return errorResponse(400, "invalid_battle_hash", "Missing or oversized battle hash.");
  }

  const surfaceRaw = typeof body.surface === "string" ? body.surface : "";
  const surface = ALLOWED_SURFACES.has(surfaceRaw) ? surfaceRaw : "result";

  if (!context.env.SUPABASE_URL || !context.env.SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ ok: true, persisted: false });
  }

  const auth = await getOptionalAuthenticatedUser(context.request, context.env);
  const ipHash = await hashIp(ip);

  try {
    const admin = getSupabaseAdmin(context.env);
    const { error } = await admin.from("share_claims").insert({
      user_id: auth?.user.id ?? null,
      battle_hash: battleHash,
      ip_hash: ipHash,
      surface,
    });

    if (error) {
      if (error.code === "23505") {
        return jsonResponse({ ok: true, persisted: true, duplicate: true });
      }
      console.warn("share-claim insert failed:", error.message);
      return jsonResponse({ ok: true, persisted: false });
    }
  } catch (error) {
    console.warn("share-claim threw:", error);
    return jsonResponse({ ok: true, persisted: false });
  }

  return jsonResponse({ ok: true, persisted: true });
};
