import test, { afterEach } from "node:test";
import assert from "node:assert/strict";

import {
  createCheckoutSession,
  createPortalSession,
} from "../.test-build/functions/_shared/dodo.js";

const originalFetch = global.fetch;

function jsonResponse(payload) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

test("createCheckoutSession defaults the return URL to /account", async () => {
  let requestBody = null;

  global.fetch = async (_url, init) => {
    requestBody = JSON.parse(init.body);
    return jsonResponse({
      session_id: "sess_123",
      checkout_url: "https://checkout.example.com",
    });
  };

  await createCheckoutSession(
    {
      DODO_API_KEY: "secret",
      DODO_API_BASE_URL: "https://payments.example.com",
      DODO_PRICE_ID_PACK_25_MONTHLY: "price_25",
    },
    {
      planCode: "pack_25_monthly",
      userId: "user_1",
      email: "user@example.com",
      origin: "https://debatearena.example.com/",
    }
  );

  assert.equal(requestBody.return_url, "https://debatearena.example.com/account");
});

test("createPortalSession defaults the return URL to /account", async () => {
  let requestBody = null;

  global.fetch = async (_url, init) => {
    requestBody = JSON.parse(init.body);
    return jsonResponse({
      link: "https://portal.example.com",
    });
  };

  await createPortalSession(
    {
      DODO_API_KEY: "secret",
      DODO_API_BASE_URL: "https://payments.example.com",
    },
    {
      customerId: "cus_123",
      origin: "https://debatearena.example.com",
    }
  );

  assert.equal(requestBody.return_url, "https://debatearena.example.com/account");
});

afterEach(() => {
  global.fetch = originalFetch;
});
