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
