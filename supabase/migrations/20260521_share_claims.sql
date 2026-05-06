create table if not exists public.share_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  battle_hash text not null,
  ip_hash text,
  surface text,
  claimed_at timestamptz not null default now()
);

create index if not exists share_claims_claimed_at_idx
  on public.share_claims (claimed_at desc);

create unique index if not exists share_claims_user_battle_idx
  on public.share_claims (user_id, battle_hash)
  where user_id is not null;

create index if not exists share_claims_ip_battle_idx
  on public.share_claims (ip_hash, battle_hash)
  where user_id is null;

alter table public.share_claims enable row level security;

drop policy if exists share_claims_no_select on public.share_claims;
create policy share_claims_no_select
  on public.share_claims
  for select
  to authenticated, anon
  using (false);
