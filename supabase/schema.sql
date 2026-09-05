-- Scorpio Daily — full schema (generated from supabase/migrations/, in order)
-- Paste this whole file into the Supabase SQL Editor and Run.
-- Safe to re-run: every statement is idempotent.

-- ============================================================
-- supabase/migrations/0001_horoscope_and_compatibility.sql
-- ============================================================
-- Phase 3: daily horoscope + compatibility.
-- Both tables are world-readable; all writes go through the service-role key
-- (the daily job / on-demand generation), which bypasses RLS.

-- ── daily_horoscopes ──────────────────────────────────────────────────────
create table if not exists public.daily_horoscopes (
  date          date primary key,
  sign          text not null default 'scorpio',
  overview      text not null,
  love          text not null,
  career        text not null,
  wellbeing     text not null,
  lucky_color   text not null,
  lucky_number  text not null,
  transit_data  jsonb not null,
  model         text not null,
  generated_at  timestamptz not null default now()
);

alter table public.daily_horoscopes enable row level security;

drop policy if exists "daily_horoscopes are public" on public.daily_horoscopes;
create policy "daily_horoscopes are public"
  on public.daily_horoscopes for select
  using (true);

-- ── compatibility ─────────────────────────────────────────────────────────
create table if not exists public.compatibility (
  partner_sign  text primary key,
  headline      text not null,
  summary       text not null,
  spark         text not null,
  friction      text not null,
  scores        jsonb not null,   -- { passion, trust, communication, friendship, overall }
  baseline      jsonb,            -- the element/modality-derived starting scores
  model         text not null,
  generated_at  timestamptz not null default now()
);

alter table public.compatibility enable row level security;

drop policy if exists "compatibility is public" on public.compatibility;
create policy "compatibility is public"
  on public.compatibility for select
  using (true);

-- ============================================================
-- supabase/migrations/0002_profiles_and_saved_items.sql
-- ============================================================
-- Phase 4: user profiles + saved readings.

-- ── profiles ──────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  display_name      text,
  avatar_url        text,
  birth_date        date,
  birth_time        time,
  birth_place       text,
  birth_lat         double precision,
  birth_lng         double precision,
  partner_sign      text,
  marketing_opt_in  boolean not null default false,
  onboarded         boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own"
  on public.profiles for insert with check (auth.uid() = id);

-- keep updated_at fresh
create or replace function public.touch_updated_at()
  returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- create a profile row automatically when a user signs up
create or replace function public.handle_new_user()
  returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, avatar_url, marketing_opt_in)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    coalesce((new.raw_user_meta_data ->> 'marketing_opt_in')::boolean, false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── saved_items ───────────────────────────────────────────────────────────
-- A user's saved horoscopes and compatibility reports.
create table if not exists public.saved_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  kind        text not null check (kind in ('horoscope', 'compatibility')),
  ref         text not null,          -- the date (YYYY-MM-DD) or partner sign key
  label       text not null,
  created_at  timestamptz not null default now(),
  unique (user_id, kind, ref)
);

alter table public.saved_items enable row level security;

drop policy if exists "saved_items: own rows" on public.saved_items;
create policy "saved_items: own rows"
  on public.saved_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists saved_items_user_created_idx
  on public.saved_items (user_id, created_at desc);

-- ============================================================
-- supabase/migrations/0003_quiz_results.sql
-- ============================================================
-- Phase 5: quiz results (per user). Quiz definitions themselves live in
-- lib/quizzes/ as code, so results reference a quiz by slug.

create table if not exists public.quiz_results (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  quiz_slug   text not null,
  answers     jsonb not null,
  result_key  text not null,
  created_at  timestamptz not null default now()
);

alter table public.quiz_results enable row level security;

drop policy if exists "quiz_results: own rows" on public.quiz_results;
create policy "quiz_results: own rows"
  on public.quiz_results for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists quiz_results_user_quiz_idx
  on public.quiz_results (user_id, quiz_slug, created_at desc);

-- ============================================================
-- supabase/migrations/0004_horoscope_headline.sql
-- ============================================================
-- Phase 7 polish: a short, evocative daily headline (the homepage hero uses it).
alter table public.daily_horoscopes
  add column if not exists headline text;

