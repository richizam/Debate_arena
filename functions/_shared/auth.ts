import type { User } from "@supabase/supabase-js";
import type { Env } from "./env";
import { verifyAccessToken } from "./supabase";

export interface AuthenticatedUser {
  user: User;
  accessToken: string;
}

export function getBearerToken(request: Request): string | null {
  const header = request.headers.get("Authorization");

  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

export async function getOptionalAuthenticatedUser(
  request: Request,
  env: Env
): Promise<AuthenticatedUser | null> {
  const accessToken = getBearerToken(request);

  if (!accessToken) {
    return null;
  }

  const user = await verifyAccessToken(env, accessToken);
  if (!user) {
    return null;
  }

  return { user, accessToken };
}
