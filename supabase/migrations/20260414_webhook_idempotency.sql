create unique index if not exists credit_ledger_subscription_payment_id_idx
  on public.credit_ledger (dodo_payment_id)
  where dodo_payment_id is not null and reason = 'subscription_payment';

create or replace function public.apply_subscription_payment(
  p_user_id uuid,
  p_email text,
  p_plan_code text,
  p_credits integer,
  p_payment_id text,
  p_subscription_id text,
  p_customer_id text,
  p_status text,
  p_current_period_end timestamptz,
  p_cancel_at_period_end boolean,
  p_event_timestamp timestamptz
)
returns void
language plpgsql
set search_path = public, private
as $$
declare
  v_lock_key text := coalesce(p_payment_id, p_user_id::text);
  v_existing_payment bigint;
  v_current_balance integer := 0;
  v_current_expires_at timestamptz := null;
  v_next_expires_at timestamptz := p_event_timestamp + interval '30 days';
begin
  perform pg_advisory_xact_lock(917204, hashtext(v_lock_key));

  insert into public.profiles (user_id, email)
  values (p_user_id, coalesce(p_email, ''))
  on conflict (user_id) do update set
    email = excluded.email,
    updated_at = now();

  insert into public.credit_wallets (user_id)
  values (p_user_id)
  on conflict (user_id) do nothing;

  if p_payment_id is not null then
    select id
    into v_existing_payment
    from public.credit_ledger
    where reason = 'subscription_payment'
      and dodo_payment_id = p_payment_id
    limit 1;
  end if;

  if v_existing_payment is null then
    select credits_balance, expires_at
    into v_current_balance, v_current_expires_at
    from public.credit_wallets
    where user_id = p_user_id
    for update;

    if coalesce(v_current_balance, 0) > 0 then
      insert into public.credit_ledger (
        user_id,
        delta,
        reason,
        dodo_subscription_id,
        resulting_balance,
        resulting_expires_at
      )
      values (
        p_user_id,
        -v_current_balance,
        'renewal_reset',
        p_subscription_id,
        0,
        v_current_expires_at
      );
    end if;

    update public.credit_wallets
    set credits_balance = p_credits,
        expires_at = v_next_expires_at,
        current_plan_code = p_plan_code,
        updated_at = now()
    where user_id = p_user_id;

    insert into public.credit_ledger (
      user_id,
      delta,
      reason,
      dodo_payment_id,
      dodo_subscription_id,
      resulting_balance,
      resulting_expires_at
    )
    values (
      p_user_id,
      p_credits,
      'subscription_payment',
      p_payment_id,
      p_subscription_id,
      p_credits,
      v_next_expires_at
    );
  end if;

  insert into public.billing_subscriptions (
    user_id,
    dodo_customer_id,
    dodo_subscription_id,
    plan_code,
    status,
    current_period_end,
    cancel_at_period_end
  )
  values (
    p_user_id,
    p_customer_id,
    p_subscription_id,
    p_plan_code,
    p_status,
    p_current_period_end,
    coalesce(p_cancel_at_period_end, false)
  )
  on conflict (user_id) do update set
    dodo_customer_id = excluded.dodo_customer_id,
    dodo_subscription_id = excluded.dodo_subscription_id,
    plan_code = excluded.plan_code,
    status = excluded.status,
    current_period_end = excluded.current_period_end,
    cancel_at_period_end = excluded.cancel_at_period_end,
    updated_at = now();
end;
$$;
