import { getApiUrl } from "./api";
import { supabase } from "./supabase";

export type AnalyticsEvent =
  | "suggestion_shown"
  | "suggestion_clicked"
  | "battle_started"
  | "battle_completed"
  | "vote"
  | "share_clicked"
  | "share_claim_attempted"
  | "limit_reached"
  | "plan_clicked"
  | "checkout_started";

export type AnalyticsProps = Record<string, string | number | boolean | null>;

async function getAccessToken(): Promise<string | null> {
  if (!supabase) {
    return null;
  }

  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}

export async function track(event: AnalyticsEvent, props: AnalyticsProps = {}): Promise<void> {
  try {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    const token = await getAccessToken();
    if (token) {
      (headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }

    await fetch(getApiUrl("/api/track"), {
      method: "POST",
      headers,
      body: JSON.stringify({ event, props }),
      keepalive: true,
    });
  } catch {
    // Telemetry must never break the app.
  }
}
