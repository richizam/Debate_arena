create table if not exists public.shared_battles (
  id text primary key,
  fighters_json jsonb not null,
  topic text not null,
  language text not null,
  rounds_json jsonb not null,
  verdict_json jsonb not null,
  view_count integer not null default 0,
  user_id uuid references auth.users(id) on delete set null,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists shared_battles_created_at_idx
  on public.shared_battles (created_at desc);

create index if not exists shared_battles_user_id_idx
  on public.shared_battles (user_id)
  where user_id is not null;

alter table public.shared_battles enable row level security;

drop policy if exists shared_battles_no_select on public.shared_battles;
create policy shared_battles_no_select
  on public.shared_battles
  for select
  to authenticated, anon
  using (false);
