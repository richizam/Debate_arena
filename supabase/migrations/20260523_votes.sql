create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  topic text not null,
  judge_winner text not null check (judge_winner in ('a', 'b')),
  user_vote text not null check (user_vote in ('a', 'b')),
  shared_battle_id text references public.shared_battles(id) on delete set null,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists votes_created_at_idx
  on public.votes (created_at desc);

create index if not exists votes_shared_battle_id_idx
  on public.votes (shared_battle_id)
  where shared_battle_id is not null;

alter table public.votes enable row level security;

drop policy if exists votes_no_select on public.votes;
create policy votes_no_select
  on public.votes
  for select
  to authenticated, anon
  using (false);
