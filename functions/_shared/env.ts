export interface Env {
  DEEPSEEK_API_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  DODO_API_KEY?: string;
  DODO_API_BASE_URL?: string;
  DODO_WEBHOOK_SECRET?: string;
  DODO_PRICE_ID_PACK_25_MONTHLY?: string;
  DODO_PRICE_ID_PACK_50_MONTHLY?: string;
  DODO_PRICE_ID_PACK_100_MONTHLY?: string;
  DODO_RETURN_URL_SUCCESS?: string;
  DODO_RETURN_URL_CANCEL?: string;
  DODO_PORTAL_RETURN_URL?: string;
}

export function requireEnv(env: Env, key: keyof Env): string {
  const value = env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}
