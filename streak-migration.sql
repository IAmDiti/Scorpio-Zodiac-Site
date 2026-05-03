-- ============================================================
-- streak-migration.sql
-- Run in Supabase SQL editor
-- ============================================================

-- 1. Add free_reading_pending to users table
alter table public.users
  add column if not exists free_reading_pending boolean not null default false;

-- 2. Daily checkins table
create table if not exists public.streak_checkins (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  checkin_date  date not null,
  created_at    timestamptz not null default now(),
  unique(user_id, checkin_date)
);

-- 3. Streak rewards table (tracks milestones so we don't double-award)
create table if not exists public.streak_rewards (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  streak_count  int not null,
  awarded_at    timestamptz not null default now(),
  unique(user_id, streak_count)
);

-- 4. RLS policies
alter table public.streak_checkins enable row level security;
alter table public.streak_rewards   enable row level security;

-- Service role can do everything (your backend uses service key)
create policy "service_all_checkins" on public.streak_checkins
  for all to service_role using (true) with check (true);

create policy "service_all_rewards" on public.streak_rewards
  for all to service_role using (true) with check (true);

-- 5. Indexes for fast streak queries
create index if not exists streak_checkins_user_date_idx
  on public.streak_checkins(user_id, checkin_date desc);

create index if not exists streak_rewards_user_idx
  on public.streak_rewards(user_id, streak_count);
