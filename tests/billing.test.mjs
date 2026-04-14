import test from "node:test";
import assert from "node:assert/strict";

import {
  grantCreditsFromPaymentWithAdmin,
  reserveWebhookEventWithAdmin,
} from "../.test-build/functions/_shared/billing.js";

function createDuplicateError() {
  return {
    code: "23505",
    message: "duplicate key value violates unique constraint",
  };
}

function createWebhookAdmin({ insertError = null, existing = null, retried = null }) {
  const calls = [];

  return {
    calls,
    from(table) {
      assert.equal(table, "billing_webhook_events");

      return {
        insert(payload) {
          calls.push({ type: "insert", payload });
          return Promise.resolve({ error: insertError });
        },
        select(columns) {
          calls.push({ type: "select", columns });

          const chain = {
            eq() {
              return chain;
            },
            maybeSingle() {
              return Promise.resolve({ data: existing, error: null });
            },
          };

          return chain;
        },
        update(values) {
          calls.push({ type: "update", values });

          const chain = {
            eq() {
              return chain;
            },
            select() {
              return chain;
            },
            maybeSingle() {
              return Promise.resolve({ data: retried, error: null });
            },
          };

          return chain;
        },
      };
    },
  };
}

test("reserveWebhookEventWithAdmin returns new when insert succeeds", async () => {
  const admin = createWebhookAdmin({});

  const result = await reserveWebhookEventWithAdmin(
    admin,
    "evt_new",
    "payment.succeeded",
    { hello: "world" }
  );

  assert.equal(result, "new");
  assert.deepEqual(admin.calls.map((call) => call.type), ["insert"]);
});

test("reserveWebhookEventWithAdmin retries failed events", async () => {
  const admin = createWebhookAdmin({
    insertError: createDuplicateError(),
    existing: {
      dodo_event_id: "evt_failed",
      processing_status: "failed",
    },
    retried: {
      dodo_event_id: "evt_failed",
      processing_status: "processing",
    },
  });

  const result = await reserveWebhookEventWithAdmin(
    admin,
    "evt_failed",
    "payment.succeeded",
    { paid: true }
  );

  assert.equal(result, "retry");
  assert.deepEqual(admin.calls.map((call) => call.type), ["insert", "select", "update"]);
});

test("reserveWebhookEventWithAdmin skips already processed events", async () => {
  const admin = createWebhookAdmin({
    insertError: createDuplicateError(),
    existing: {
      dodo_event_id: "evt_done",
      processing_status: "processed",
    },
  });

  const result = await reserveWebhookEventWithAdmin(
    admin,
    "evt_done",
    "payment.succeeded",
    { paid: true }
  );

  assert.equal(result, "duplicate");
});

test("grantCreditsFromPaymentWithAdmin calls the transactional RPC with the expected payload", async () => {
  const calls = [];
  const admin = {
    rpc(name, args) {
      calls.push({ name, args });
      return Promise.resolve({ error: null });
    },
  };

  await grantCreditsFromPaymentWithAdmin(admin, {
    userId: "user-1",
    email: "user@example.com",
    planCode: "pack_50_monthly",
    credits: 50,
    paymentId: "pay_123",
    subscriptionId: "sub_123",
    customerId: "cus_123",
    status: "active",
    currentPeriodEnd: "2026-05-14T12:00:00.000Z",
    cancelAtPeriodEnd: false,
    eventTimestamp: "2026-04-14T12:00:00.000Z",
  });

  assert.deepEqual(calls, [
    {
      name: "apply_subscription_payment",
      args: {
        p_user_id: "user-1",
        p_email: "user@example.com",
        p_plan_code: "pack_50_monthly",
        p_credits: 50,
        p_payment_id: "pay_123",
        p_subscription_id: "sub_123",
        p_customer_id: "cus_123",
        p_status: "active",
        p_current_period_end: "2026-05-14T12:00:00.000Z",
        p_cancel_at_period_end: false,
        p_event_timestamp: "2026-04-14T12:00:00.000Z",
      },
    },
  ]);
});
