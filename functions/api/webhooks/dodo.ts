import {
  grantCreditsFromPayment,
  markWebhookProcessed,
  reserveWebhookEvent,
  updateSubscriptionStatus,
} from "../../_shared/billing";
import { optionsResponse } from "../../_shared/cors";
import type { Env } from "../../_shared/env";
import { getPlanConfig } from "../../_shared/plans";
import {
  getWebhookPaymentContext,
  getWebhookType,
  verifyWebhook,
} from "../../_shared/dodo";
import { errorResponse, jsonResponse } from "../../_shared/http";

export const onRequestOptions: PagesFunction = async () => optionsResponse();

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let verified;

  try {
    verified = await verifyWebhook(context.request, context.env);
  } catch (error) {
    console.error("Failed to verify Dodo webhook:", error);
    return errorResponse(401, "invalid_webhook_signature", "Webhook signature verification failed.");
  }

  const eventType = getWebhookType(verified.event);
  const reserved = await reserveWebhookEvent(context.env, verified.eventId, eventType, verified.event);
  if (reserved === "duplicate") {
    return jsonResponse({ ok: true, duplicate: true });
  }

  try {
    const paymentContext = getWebhookPaymentContext(verified.event);

    if (!paymentContext) {
      await markWebhookProcessed(context.env, verified.eventId, "ignored");
      return jsonResponse({ ok: true, ignored: true });
    }

    const plan = getPlanConfig(paymentContext.planCode);
    if (!plan) {
      await markWebhookProcessed(context.env, verified.eventId, "ignored");
      return jsonResponse({ ok: true, ignored: true });
    }

    if (eventType === "payment.succeeded") {
      await grantCreditsFromPayment(context.env, {
        userId: paymentContext.userId,
        email: paymentContext.email,
        planCode: paymentContext.planCode,
        credits: plan.credits,
        paymentId: paymentContext.paymentId,
        subscriptionId: paymentContext.subscriptionId,
        customerId: paymentContext.customerId,
        status: "active",
        currentPeriodEnd: paymentContext.currentPeriodEnd,
        cancelAtPeriodEnd: paymentContext.cancelAtPeriodEnd,
        eventTimestamp: paymentContext.timestamp,
      });

      await markWebhookProcessed(context.env, verified.eventId, "processed");
      return jsonResponse({ ok: true, processed: true });
    }

    if (
      eventType === "subscription.active" ||
      eventType === "subscription.on_hold" ||
      eventType === "subscription.canceled" ||
      eventType === "payment.failed"
    ) {
      const mappedStatus =
        eventType === "payment.failed"
          ? "payment_failed"
          : eventType.replace("subscription.", "");

      await updateSubscriptionStatus(context.env, {
        userId: paymentContext.userId,
        email: paymentContext.email,
        planCode: paymentContext.planCode,
        subscriptionId: paymentContext.subscriptionId,
        customerId: paymentContext.customerId,
        status: mappedStatus,
        currentPeriodEnd: paymentContext.currentPeriodEnd,
        cancelAtPeriodEnd: paymentContext.cancelAtPeriodEnd,
      });

      await markWebhookProcessed(context.env, verified.eventId, "processed");
      return jsonResponse({ ok: true, processed: true });
    }

    await markWebhookProcessed(context.env, verified.eventId, "ignored");
    return jsonResponse({ ok: true, ignored: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown webhook error";
    console.error("Failed to process Dodo webhook:", error);
    await markWebhookProcessed(context.env, verified.eventId, "failed", message);
    return errorResponse(500, "webhook_processing_failed", message);
  }
};
