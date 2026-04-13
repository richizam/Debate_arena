create schema if not exists private;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  credits_balance integer not null default 0 check (credits_balance >= 0),
  expires_at timestamptz,
  current_plan_code text check (
    current_plan_code is null
    or current_plan_code in ('pack_25_monthly', 'pack_50_monthly', 'pack_100_monthly')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_ledger (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  delta integer not null,
  reason text not null,
  dodo_payment_id text,
  dodo_subscription_id text,
  resulting_balance integer not null check (resulting_balance >= 0),
  resulting_expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.billing_subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  dodo_customer_id text,
  dodo_subscription_id text unique,
  plan_code text not null check (
    plan_code in ('pack_25_monthly', 'pack_50_monthly', 'pack_100_monthly')
  ),
  status text not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.billing_webhook_events (
  dodo_event_id text primary key,
  event_type text not null,
  payload_json jsonb not null,
  processing_status text not null default 'processing',
  processed_at timestamptz,
  error_text text,
  created_at timestamptz not null default now()
);

create index if not exists credit_ledger_user_id_created_at_idx
  on public.credit_ledger (user_id, created_at desc);

create index if not exists credit_wallets_expires_at_idx
  on public.credit_wallets (expires_at);

create index if not exists billing_subscriptions_status_idx
  on public.billing_subscriptions (status);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (user_id, email)
  values (new.id, coalesce(new.email, ''))
  on conflict (user_id) do update set
    email = excluded.email,
    updated_at = now();

  insert into public.credit_wallets (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function private.set_updated_at();

drop trigger if exists set_credit_wallets_updated_at on public.credit_wallets;
create trigger set_credit_wallets_updated_at
before update on public.credit_wallets
for each row
execute function private.set_updated_at();

drop trigger if exists set_billing_subscriptions_updated_at on public.billing_subscriptions;
create trigger set_billing_subscriptions_updated_at
before update on public.billing_subscriptions
for each row
execute function private.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.credit_wallets enable row level security;
alter table public.credit_ledger enable row level security;
alter table public.billing_subscriptions enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "credit_wallets_select_own" on public.credit_wallets;
create policy "credit_wallets_select_own"
on public.credit_wallets
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "credit_ledger_select_own" on public.credit_ledger;
create policy "credit_ledger_select_own"
on public.credit_ledger
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "billing_subscriptions_select_own" on public.billing_subscriptions;
create policy "billing_subscriptions_select_own"
on public.billing_subscriptions
for select
to authenticated
using (auth.uid() = user_id);
