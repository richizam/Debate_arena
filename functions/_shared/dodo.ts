import { Webhook } from "standardwebhooks";
import type { Env } from "./env";
import { requireEnv } from "./env";
import { getPlanConfig, getPlanPriceId, isPlanCode, type PlanCode } from "./plans";

interface DodoCheckoutResponse {
  session_id: string;
  checkout_url: string;
}

interface DodoPortalResponse {
  link: string;
}

interface DodoWebhookEvent {
  type?: string;
  timestamp?: string;
  data?: Record<string, unknown>;
}

interface DodoPaymentContext {
  userId: string;
  email: string;
  planCode: PlanCode;
  paymentId: string | null;
  subscriptionId: string | null;
  customerId: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  timestamp: string;
}

function extractHeaders(request: Request): Record<string, string> {
  return {
    "webhook-id": request.headers.get("webhook-id") ?? "",
    "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
    "webhook-signature": request.headers.get("webhook-signature") ?? "",
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function getMetadata(payload: Record<string, unknown>): Record<string, unknown> {
  const direct = asRecord(payload.metadata);
  if (direct) {
    return direct;
  }

  const customer = asRecord(payload.customer);
  if (customer) {
    const customerMetadata = asRecord(customer.metadata);
    if (customerMetadata) {
      return customerMetadata;
    }
  }

  const subscription = asRecord(payload.subscription);
  if (subscription) {
    const subscriptionMetadata = asRecord(subscription.metadata);
    if (subscriptionMetadata) {
      return subscriptionMetadata;
    }
  }

  return {};
}

async function dodoRequest<T>(
  env: Env,
  path: string,
  init: RequestInit
): Promise<T> {
  const apiBaseUrl = env.DODO_API_BASE_URL || "https://live.dodopayments.com";

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${requireEnv(env, "DODO_API_KEY")}`,
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Dodo request failed (${response.status}): ${body}`);
  }

  return response.json() as Promise<T>;
}

export async function createCheckoutSession(
  env: Env,
  input: {
    planCode: PlanCode;
    userId: string;
    email: string;
    origin: string;
  }
): Promise<DodoCheckoutResponse> {
  const plan = getPlanConfig(input.planCode);
  if (!plan) {
    throw new Error(`Unknown plan code: ${input.planCode}`);
  }

  const successUrl =
    env.DODO_RETURN_URL_SUCCESS ?? `${input.origin.replace(/\/+$/, "")}/account`;

  return dodoRequest<DodoCheckoutResponse>(env, "/checkouts", {
    method: "POST",
    body: JSON.stringify({
      product_cart: [
        {
          product_id: getPlanPriceId(env, input.planCode),
          quantity: 1,
        },
      ],
      customer: {
        email: input.email,
      },
      metadata: {
        user_id: input.userId,
        plan_code: input.planCode,
        email: input.email,
      },
      return_url: successUrl,
    }),
  });
}

export async function createPortalSession(
  env: Env,
  input: {
    customerId: string;
    origin: string;
  }
): Promise<DodoPortalResponse> {
  const returnUrl =
    env.DODO_PORTAL_RETURN_URL ?? `${input.origin.replace(/\/+$/, "")}/account`;

  return dodoRequest<DodoPortalResponse>(env, `/customers/${input.customerId}/portal/session`, {
    method: "POST",
    body: JSON.stringify({ return_url: returnUrl }),
  });
}

export async function verifyWebhook(request: Request, env: Env): Promise<{
  eventId: string;
  event: DodoWebhookEvent;
}> {
  const payload = await request.text();
  const headers = extractHeaders(request);
  const webhook = new Webhook(requireEnv(env, "DODO_WEBHOOK_SECRET"));
  const parsed = webhook.verify(payload, headers) as DodoWebhookEvent;

  return {
    eventId: headers["webhook-id"],
    event: parsed,
  };
}

export function getWebhookType(event: DodoWebhookEvent): string {
  return event.type ?? "unknown";
}

export function getWebhookPaymentContext(event: DodoWebhookEvent): DodoPaymentContext | null {
  const data = asRecord(event.data);
  if (!data) {
    return null;
  }

  const metadata = getMetadata(data);
  const userId = asString(metadata.user_id);
  const email =
    asString(metadata.email) ??
    asString(data.customer_email) ??
    asString(asRecord(data.customer)?.email);
  const planCode = asString(metadata.plan_code);

  if (!userId || !email || !planCode || !isPlanCode(planCode)) {
    return null;
  }

  const subscription = asRecord(data.subscription);
  const customer = asRecord(data.customer);

  return {
    userId,
    email,
    planCode,
    paymentId: asString(data.payment_id) ?? asString(data.id),
    subscriptionId: asString(data.subscription_id) ?? asString(subscription?.id),
    customerId: asString(data.customer_id) ?? asString(customer?.id),
    currentPeriodEnd:
      asString(data.current_period_end) ??
      asString(subscription?.current_period_end) ??
      null,
    cancelAtPeriodEnd:
      asBoolean(data.cancel_at_period_end) || asBoolean(subscription?.cancel_at_period_end),
    timestamp: asString(event.timestamp) ?? new Date().toISOString(),
  };
}
