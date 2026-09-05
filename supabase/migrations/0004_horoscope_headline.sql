-- Phase 7 polish: a short, evocative daily headline (the homepage hero uses it).
alter table public.daily_horoscopes
  add column if not exists headline text;
