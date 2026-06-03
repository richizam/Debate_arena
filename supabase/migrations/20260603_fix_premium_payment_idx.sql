-- CRITICAL FIX: premium credits broke ALL paid signups.
--
-- 20260524_premium_credits.sql changed apply_subscription_payment to insert TWO
-- credit_ledger rows per payment (one pool='regular', one pool='premium'), both
-- with reason='subscription_payment' and the SAME dodo_payment_id.
--
-- But 20260414_webhook_idempotency.sql created a unique index allowing only ONE
-- subscription_payment row per dodo_payment_id. So the premium insert always
-- collided with the regular insert -> unique violation -> whole RPC rolled back
-- -> wallet stayed at 0 credits. Every plan has premiumCredits > 0, so this broke
-- 100% of real payments.
--
-- Fix: make uniqueness per (dodo_payment_id, pool) so both pools coexist, while
-- still blocking a true double-grant of the same payment+pool.

drop index if exists public.credit_ledger_subscription_payment_id_idx;

create unique index if not exists credit_ledger_subscription_payment_pool_idx
  on public.credit_ledger (dodo_payment_id, pool)
  where dodo_payment_id is not null and reason = 'subscription_payment';
