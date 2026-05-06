create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  props_json jsonb not null default '{}'::jsonb,
  user_id uuid references auth.users(id) on delete set null,
  ip_hash text,
  occurred_at timestamptz not null default now()
);

create index if not exists analytics_events_event_occurred_at_idx
  on public.analytics_events (event, occurred_at desc);

create index if not exists analytics_events_user_id_idx
  on public.analytics_events (user_id)
  where user_id is not null;

alter table public.analytics_events enable row level security;

drop policy if exists analytics_events_no_select on public.analytics_events;
create policy analytics_events_no_select
  on public.analytics_events
  for select
  to authenticated, anon
  using (false);
