import { optionsResponse } from "../_shared/cors";
import type { Env } from "../_shared/env";
import { errorResponse, jsonResponse } from "../_shared/http";
import { getSupabaseAdmin } from "../_shared/supabase";

interface SharedBattleRow {
  id: string;
  fighters_json: Array<{ id: "a" | "b"; name: string; persona: string }>;
  topic: string;
  language: string;
  rounds_json: Array<{ speaker: "a" | "b"; text: string }>;
  verdict_json: { winner: "a" | "b"; reason: string };
  view_count: number;
  created_at: string;
}

const VALID_ID = /^[a-f0-9]{6,32}$/;

export const onRequestOptions: PagesFunction = async () => optionsResponse();

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const id = (url.searchParams.get("id") ?? "").toLowerCase();

  if (!VALID_ID.test(id)) {
    return errorResponse(400, "invalid_id", "Missing or malformed battle id.");
  }

  if (!context.env.SUPABASE_URL || !context.env.SUPABASE_SERVICE_ROLE_KEY) {
    return errorResponse(503, "storage_unavailable", "Battle sharing is temporarily unavailable.");
  }

  const admin = getSupabaseAdmin(context.env);
  const { data, error } = await admin
    .from("shared_battles")
    .select("id, fighters_json, topic, language, rounds_json, verdict_json, view_count, created_at")
    .eq("id", id)
    .maybeSingle<SharedBattleRow>();

  if (error) {
    console.error("get-battle select failed:", error.message);
    return errorResponse(500, "fetch_failed", "Unable to load this shared battle.");
  }

  if (!data) {
    return errorResponse(404, "not_found", "This shared battle no longer exists.");
  }

  void admin
    .from("shared_battles")
    .update({ view_count: data.view_count + 1 })
    .eq("id", id)
    .then(() => undefined);

  return jsonResponse(
    {
      id: data.id,
      topic: data.topic,
      language: data.language,
      fighters: data.fighters_json,
      rounds: data.rounds_json,
      judge: data.verdict_json,
      sharedView: true,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=900",
      },
    }
  );
};
