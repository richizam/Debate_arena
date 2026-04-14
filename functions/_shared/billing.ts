import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Env } from "./env";
import { getSupabaseAdmin } from "./supabase";
import type { PlanCode } from "./plans";

interface CreditWallet {
  user_id: string;
  credits_balance: number;
  expires_at: string | null;
  current_plan_code: string | null;
  created_at: string;
  updated_at: string;
}

interface SubscriptionRecord {
  user_id: string;
  dodo_customer_id: string | null;
  dodo_subscription_id: string | null;
  plan_code: string;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

interface WebhookEventRecord {
  dodo_event_id: string;
  processing_status: string;
}

interface LedgerInsertInput {
  userId: string;
  delta: number;
  reason: string;
  resultingBalance: number;
  resultingExpiresAt: string | null;
  dodoPaymentId?: string | null;
  dodoSubscriptionId?: string | null;
}

export interface BillingStatus {
  creditsRemaining: number;
  expiresAt: string | null;
  currentPlanCode: string | null;
  subscriptionStatus: string | null;
  cancelAtPeriodEnd: boolean;
}

export interface GrantCreditsInput {
  userId: string;
  email: string;
  planCode: PlanCode;
  credits: number;
  paymentId: string | null;
  subscriptionId: string | null;
  customerId: string | null;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  eventTimestamp: string;
}

export interface SubscriptionStatusUpdateInput {
  userId: string;
  email: string;
  planCode: PlanCode;
  subscriptionId: string | null;
  customerId: string | null;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export type WebhookReservationResult = "new" | "duplicate" | "retry" | "processing";

type AdminFromClient = Pick<SupabaseClient, "from">;
type AdminRpcClient = Pick<SupabaseClient, "rpc">;

function nowIso(): string {
  return new Date().toISOString();
}

export async function ensureUserRecords(env: Env, user: Pick<User, "id" | "email">): Promise<void> {
  const admin = getSupabaseAdmin(env);
  const email = user.email ?? "";

  const { error: profileError } = await admin.from("profiles").upsert(
    {
      user_id: user.id,
      email,
    },
    { onConflict: "user_id" }
  );

  if (profileError) {
    throw new Error(`Failed to upsert profile: ${profileError.message}`);
  }

  const { error: walletError } = await admin.from("credit_wallets").upsert(
    {
      user_id: user.id,
    },
    { onConflict: "user_id", ignoreDuplicates: true }
  );

  if (walletError) {
    throw new Error(`Failed to ensure credit wallet: ${walletError.message}`);
  }
}

async function insertLedgerEntry(env: Env, input: LedgerInsertInput): Promise<void> {
  const admin = getSupabaseAdmin(env);
  const { error } = await admin.from("credit_ledger").insert({
    user_id: input.userId,
    delta: input.delta,
    reason: input.reason,
    dodo_payment_id: input.dodoPaymentId ?? null,
    dodo_subscription_id: input.dodoSubscriptionId ?? null,
    resulting_balance: input.resultingBalance,
    resulting_expires_at: input.resultingExpiresAt,
  });

  if (error) {
    throw new Error(`Failed to insert credit ledger entry: ${error.message}`);
  }
}

async function getWallet(env: Env, userId: string): Promise<CreditWallet> {
  const admin = getSupabaseAdmin(env);
  const { data, error } = await admin
    .from("credit_wallets")
    .select("*")
    .eq("user_id", userId)
    .single<CreditWallet>();

  if (error) {
    throw new Error(`Failed to fetch credit wallet: ${error.message}`);
  }

  return data;
}

async function upsertSubscription(
  env: Env,
  input: SubscriptionStatusUpdateInput
): Promise<SubscriptionRecord> {
  const admin = getSupabaseAdmin(env);
  const { data, error } = await admin
    .from("billing_subscriptions")
    .upsert(
      {
        user_id: input.userId,
        dodo_customer_id: input.customerId,
        dodo_subscription_id: input.subscriptionId,
        plan_code: input.planCode,
        status: input.status,
        current_period_end: input.currentPeriodEnd,
        cancel_at_period_end: input.cancelAtPeriodEnd,
      },
      { onConflict: "user_id" }
    )
    .select("*")
    .single<SubscriptionRecord>();

  if (error) {
    throw new Error(`Failed to upsert subscription: ${error.message}`);
  }

  return data;
}

export async function expireWalletIfNeeded(
  env: Env,
  userId: string
): Promise<CreditWallet> {
  const admin = getSupabaseAdmin(env);
  const wallet = await getWallet(env, userId);

  if (!wallet.expires_at || new Date(wallet.expires_at).getTime() > Date.now()) {
    return wallet;
  }

  if (wallet.credits_balance === 0) {
    return wallet;
  }

  const { data, error } = await admin
    .from("credit_wallets")
    .update({
      credits_balance: 0,
      updated_at: nowIso(),
    })
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to expire credit wallet: ${error.message}`);
  }

  await insertLedgerEntry(env, {
    userId,
    delta: -wallet.credits_balance,
    reason: "expiry_reset",
    resultingBalance: 0,
    resultingExpiresAt: wallet.expires_at,
  });

  return data;
}

export async function getBillingStatus(
  env: Env,
  user: Pick<User, "id" | "email">
): Promise<BillingStatus> {
  await ensureUserRecords(env, user);
  const wallet = await expireWalletIfNeeded(env, user.id);
  const admin = getSupabaseAdmin(env);
  const { data: subscription } = await admin
    .from("billing_subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle<SubscriptionRecord>();

  return {
    creditsRemaining: wallet.credits_balance,
    expiresAt: wallet.expires_at,
    currentPlanCode: wallet.current_plan_code,
    subscriptionStatus: subscription?.status ?? null,
    cancelAtPeriodEnd: subscription?.cancel_at_period_end ?? false,
  };
}

export async function consumeBattleCredit(
  env: Env,
  user: Pick<User, "id" | "email">
): Promise<BillingStatus | null> {
  await ensureUserRecords(env, user);
  const admin = getSupabaseAdmin(env);
  const wallet = await expireWalletIfNeeded(env, user.id);

  if (!wallet.expires_at || wallet.credits_balance <= 0) {
    return null;
  }

  const currentTime = nowIso();
  if (wallet.expires_at <= currentTime) {
    return null;
  }

  const nextBalance = wallet.credits_balance - 1;
  const { data, error } = await admin
    .from("credit_wallets")
    .update({
      credits_balance: nextBalance,
      updated_at: currentTime,
    })
    .eq("user_id", user.id)
    .eq("credits_balance", wallet.credits_balance)
    .gt("expires_at", currentTime)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to consume battle credit: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  await insertLedgerEntry(env, {
    userId: user.id,
    delta: -1,
    reason: "battle_consumed",
    resultingBalance: nextBalance,
    resultingExpiresAt: data.expires_at,
  });

  const { data: subscription } = await admin
    .from("billing_subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle<SubscriptionRecord>();

  return {
    creditsRemaining: data.credits_balance,
    expiresAt: data.expires_at,
    currentPlanCode: data.current_plan_code,
    subscriptionStatus: subscription?.status ?? null,
    cancelAtPeriodEnd: subscription?.cancel_at_period_end ?? false,
  };
}

export async function grantCreditsFromPayment(
  env: Env,
  input: GrantCreditsInput
): Promise<void> {
  const admin = getSupabaseAdmin(env);
  await grantCreditsFromPaymentWithAdmin(admin, input);
}

export async function updateSubscriptionStatus(
  env: Env,
  input: SubscriptionStatusUpdateInput
): Promise<void> {
  await ensureUserRecords(env, {
    id: input.userId,
    email: input.email,
  });

  await upsertSubscription(env, input);
}

export async function grantCreditsFromPaymentWithAdmin(
  admin: AdminRpcClient,
  input: GrantCreditsInput
): Promise<void> {
  const { error } = await admin.rpc("apply_subscription_payment", {
    p_user_id: input.userId,
    p_email: input.email,
    p_plan_code: input.planCode,
    p_credits: input.credits,
    p_payment_id: input.paymentId,
    p_subscription_id: input.subscriptionId,
    p_customer_id: input.customerId,
    p_status: input.status,
    p_current_period_end: input.currentPeriodEnd,
    p_cancel_at_period_end: input.cancelAtPeriodEnd,
    p_event_timestamp: input.eventTimestamp,
  });

  if (error) {
    throw new Error(`Failed to grant credits: ${error.message}`);
  }
}

export async function reserveWebhookEventWithAdmin(
  admin: AdminFromClient,
  eventId: string,
  eventType: string,
  payload: unknown
): Promise<WebhookReservationResult> {
  const { error } = await admin.from("billing_webhook_events").insert({
    dodo_event_id: eventId,
    event_type: eventType,
    payload_json: payload as never,
    processing_status: "processing",
  });

  if (!error) {
    return "new";
  }

  if (error.code !== "23505") {
    throw new Error(`Failed to reserve webhook event: ${error.message}`);
  }

  const { data: existing, error: existingError } = await admin
    .from("billing_webhook_events")
    .select("dodo_event_id, processing_status")
    .eq("dodo_event_id", eventId)
    .maybeSingle<WebhookEventRecord>();

  if (existingError) {
    throw new Error(`Failed to load reserved webhook event: ${existingError.message}`);
  }

  if (!existing) {
    return "duplicate";
  }

  if (existing.processing_status === "failed") {
    const { data: retried, error: retryError } = await admin
      .from("billing_webhook_events")
      .update({
        processing_status: "processing",
        processed_at: null,
        error_text: null,
      })
      .eq("dodo_event_id", eventId)
      .eq("processing_status", "failed")
      .select("dodo_event_id, processing_status")
      .maybeSingle<WebhookEventRecord>();

    if (retryError) {
      throw new Error(`Failed to retry reserved webhook event: ${retryError.message}`);
    }

    return retried ? "retry" : "processing";
  }

  return existing.processing_status === "processing" ? "processing" : "duplicate";
}

export async function reserveWebhookEvent(
  env: Env,
  eventId: string,
  eventType: string,
  payload: unknown
): Promise<WebhookReservationResult> {
  const admin = getSupabaseAdmin(env);
  return reserveWebhookEventWithAdmin(admin, eventId, eventType, payload);
}

export async function markWebhookProcessed(
  env: Env,
  eventId: string,
  status: "processed" | "ignored" | "failed",
  errorText?: string
): Promise<void> {
  const admin = getSupabaseAdmin(env);
  const { error } = await admin
    .from("billing_webhook_events")
    .update({
      processing_status: status,
      processed_at: nowIso(),
      error_text: errorText ?? null,
    })
    .eq("dodo_event_id", eventId);

  if (error) {
    throw new Error(`Failed to mark webhook event: ${error.message}`);
  }
}
