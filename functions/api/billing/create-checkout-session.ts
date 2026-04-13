import { getOptionalAuthenticatedUser } from "../../_shared/auth";
import { optionsResponse } from "../../_shared/cors";
import type { Env } from "../../_shared/env";
import { createCheckoutSession } from "../../_shared/dodo";
import { errorResponse, jsonResponse, readJson } from "../../_shared/http";
import { ensureUserRecords } from "../../_shared/billing";
import { getPlanConfig } from "../../_shared/plans";

interface RequestBody {
  planCode: string;
}

export const onRequestOptions: PagesFunction = async () => optionsResponse();

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await getOptionalAuthenticatedUser(context.request, context.env);
  if (!auth) {
    return errorResponse(401, "unauthorized", "You must be signed in to create a checkout session.");
  }

  let body: RequestBody;
  try {
    body = await readJson<RequestBody>(context.request);
  } catch {
    return errorResponse(400, "invalid_json", "Invalid JSON body.");
  }

  const plan = getPlanConfig(body.planCode);
  if (!plan) {
    return errorResponse(400, "invalid_plan", "Unknown billing plan.");
  }

  await ensureUserRecords(context.env, auth.user);

  try {
    const session = await createCheckoutSession(context.env, {
      planCode: plan.code,
      userId: auth.user.id,
      email: auth.user.email ?? "",
      origin: new URL(context.request.url).origin,
    });

    return jsonResponse({
      planCode: plan.code,
      checkoutUrl: session.checkout_url,
      sessionId: session.session_id,
    });
  } catch (error) {
    console.error("Failed to create Dodo checkout session:", error);
    return errorResponse(502, "checkout_creation_failed", "Unable to create checkout session.");
  }
};
