import { getOptionalAuthenticatedUser } from "../../_shared/auth";
import { getBillingStatus } from "../../_shared/billing";
import { optionsResponse } from "../../_shared/cors";
import type { Env } from "../../_shared/env";
import { errorResponse, jsonResponse } from "../../_shared/http";

export const onRequestOptions: PagesFunction = async () => optionsResponse();

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await getOptionalAuthenticatedUser(context.request, context.env);
  if (!auth) {
    return errorResponse(401, "unauthorized", "You must be signed in to view billing status.");
  }

  try {
    const status = await getBillingStatus(context.env, auth.user);
    return jsonResponse({
      email: auth.user.email,
      ...status,
    });
  } catch (error) {
    console.error("Failed to fetch billing status:", error);
    return errorResponse(500, "billing_status_failed", "Unable to load billing status.");
  }
};
