import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import type { Env } from "./env";
import { requireEnv } from "./env";

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(env: Env): SupabaseClient {
  if (adminClient) {
    return adminClient;
  }

  adminClient = createClient(
    requireEnv(env, "SUPABASE_URL"),
    requireEnv(env, "SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  return adminClient;
}

export async function verifyAccessToken(
  env: Env,
  accessToken: string
): Promise<User | null> {
  const admin = getSupabaseAdmin(env);
  const { data, error } = await admin.auth.getUser(accessToken);

  if (error) {
    console.warn("Supabase auth.getUser failed:", error.message);
    return null;
  }

  return data.user ?? null;
}
