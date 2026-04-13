import { getOptionalAuthenticatedUser } from "../../_shared/auth";
import { getBillingStatus, ensureUserRecords } from "../../_shared/billing";
import { optionsResponse } from "../../_shared/cors";
import type { Env } from "../../_shared/env";
import { createPortalSession } from "../../_shared/dodo";
import { getSupabaseAdmin } from "../../_shared/supabase";
import { errorResponse, jsonResponse } from "../../_shared/http";

export const onRequestOptions: PagesFunction = async () => optionsResponse();

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await getOptionalAuthenticatedUser(context.request, context.env);
  if (!auth) {
    return errorResponse(401, "unauthorized", "You must be signed in to manage billing.");
  }

  await ensureUserRecords(context.env, auth.user);
  await getBillingStatus(context.env, auth.user);

  const admin = getSupabaseAdmin(context.env);
  const { data: subscription, error } = await admin
    .from("billing_subscriptions")
    .select("*")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load billing subscription:", error);
    return errorResponse(500, "billing_lookup_failed", "Unable to load billing status.");
  }

  if (!subscription?.dodo_customer_id) {
    return errorResponse(404, "no_billing_portal", "No Dodo customer portal is available for this user yet.");
  }

  try {
    const session = await createPortalSession(context.env, {
      customerId: subscription.dodo_customer_id,
      origin: new URL(context.request.url).origin,
    });

    return jsonResponse({
      portalUrl: session.link,
    });
  } catch (portalError) {
    console.error("Failed to create portal session:", portalError);
    return errorResponse(502, "portal_creation_failed", "Unable to create billing portal session.");
  }
};
