// Support lookup: diagnose a customer's billing/credit state.
// Usage:  node scripts/support-lookup.mjs <email>
// Reads SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .dev.vars (gitignored).
// Read-only. Does NOT modify anything.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadDevVars() {
  const out = {};
  let text;
  try {
    text = readFileSync(join(root, ".dev.vars"), "utf8");
  } catch {
    console.error("Could not read .dev.vars");
    process.exit(1);
  }
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const email = (process.argv[2] || "").trim();
if (!email) {
  console.error("Usage: node scripts/support-lookup.mjs <email>");
  process.exit(1);
}

const env = loadDevVars();
const url = env.SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .dev.vars.\n" +
      "Add them from Supabase dashboard > Project Settings > API."
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function header(title) {
  console.log("\n" + "=".repeat(60) + "\n" + title + "\n" + "=".repeat(60));
}

const { data: profile } = await admin
  .from("profiles")
  .select("*")
  .ilike("email", email)
  .maybeSingle();

header("1. PROFILE / ACCOUNT");
if (!profile) {
  console.log(`No profile found for email matching "${email}".`);
  console.log(
    "=> The customer likely paid WITHOUT a registered account, or signed up with a different email."
  );
} else {
  console.log(profile);
}

const userId = profile?.user_id ?? null;

if (userId) {
  header("2. CREDIT WALLET");
  const { data: wallet } = await admin
    .from("credit_wallets")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  console.log(wallet ?? "(no wallet row)");

  header("3. SUBSCRIPTION");
  const { data: sub } = await admin
    .from("billing_subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  console.log(sub ?? "(no subscription row)");

  header("4. CREDIT LEDGER (last 20)");
  const { data: ledger } = await admin
    .from("credit_ledger")
    .select("created_at, delta, reason, pool, resulting_balance, dodo_payment_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  console.log(ledger?.length ? ledger : "(no ledger entries — no credits ever granted)");
}

header("5. DODO WEBHOOK EVENTS mentioning this customer");
const { data: events } = await admin
  .from("billing_webhook_events")
  .select("dodo_event_id, event_type, processing_status, error_text, created_at, processed_at, payload_json")
  .order("created_at", { ascending: false })
  .limit(400);

const needle = email.toLowerCase();
const matched = (events ?? []).filter((e) => {
  const blob = JSON.stringify(e.payload_json ?? {}).toLowerCase();
  return blob.includes(needle) || (userId && blob.includes(userId.toLowerCase()));
});

if (!matched.length) {
  console.log(
    `No webhook events reference "${email}".\n` +
      "=> Either Dodo never delivered a webhook, or it arrived without this email/user_id in the payload.\n" +
      "   Check the Dodo dashboard > Webhooks > delivery log for this payment."
  );
} else {
  for (const e of matched) {
    console.log("\n---");
    console.log("event_id:        ", e.dodo_event_id);
    console.log("type:            ", e.event_type);
    console.log("processing:      ", e.processing_status);
    console.log("error_text:      ", e.error_text ?? "(none)");
    console.log("created_at:      ", e.created_at);
    const md =
      e.payload_json?.data?.metadata ??
      e.payload_json?.data?.subscription?.metadata ??
      e.payload_json?.data?.customer?.metadata ??
      null;
    console.log("payload metadata:", md ?? "(NO METADATA — this is why credits were not granted)");
  }
}

console.log("\nDone.");
