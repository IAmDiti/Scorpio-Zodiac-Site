-- Run this ONCE in Supabase → SQL Editor → New Query → Run
-- Then check Table Editor — you should see users, horoscopes, posts

create table if not exists public.users (
  id            uuid default gen_random_uuid() primary key,
  name          text not null,
  email         text not null unique,
  password_hash text not null,
  birth_date    date,
  reset_token   text,
  reset_expiry  timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create table if not exists public.horoscopes (
  id                   uuid default gen_random_uuid() primary key,
  date                 date not null unique,
  status               text default 'draft',
  love_score           int  default 75,
  career_score         int  default 70,
  health_score         int  default 72,
  spirit_score         int  default 80,
  cosmic_weather       text,
  daily_overall        text,
  daily_love           text,
  daily_career         text,
  daily_health         text,
  daily_spiritual      text,
  lucky_numbers        text,
  lucky_color          text,
  lucky_crystal        text,
  best_hour            text,
  affirmation          text,
  reflection           text,
  weekly_overview      text,
  weekly_love          text,
  weekly_career        text,
  weekly_affirmation   text,
  weekly_reflection    text,
  monthly_overview     text,
  monthly_love         text,
  monthly_career       text,
  monthly_power_dates  text,
  monthly_theme        text,
  monthly_crystal      text,
  monthly_mantra       text,
  monthly_affirmation  text,
  monthly_reflection   text,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

create table if not exists public.posts (
  id           uuid default gen_random_uuid() primary key,
  slug         text unique not null,
  title        text not null,
  excerpt      text,
  content      text,
  category     text default 'Astrology',
  tag_label    text,
  read_time    text default '5 min read',
  featured     boolean default false,
  status       text default 'draft',
  published_at timestamptz,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table if not exists public.quizzes (
  id           uuid default gen_random_uuid() primary key,
  quiz_id      text unique not null,
  icon         text default '🔮',
  title        text not null,
  sub          text,
  previews     jsonb default '[]',
  type         text default 'key',
  questions    jsonb default '[]',
  results      jsonb default '{}',
  tiers        jsonb default '[]',
  status       text default 'published',
  sort_order   int  default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.quizzes disable row level security;
alter table public.horoscopes disable row level security;
alter table public.posts      disable row level security;

-- Sample blog post
insert into public.posts (slug,title,excerpt,content,tag_label,read_time,featured,status,published_at)
values (
  'scorpio-traits',
  'The 7 Hidden Traits of Scorpio Nobody Talks About',
  'Beyond the intensity — the lesser-known gifts and shadows of Scorpio.',
  '<p>Ask anyone to describe a Scorpio and you hear the same words: intense, mysterious, passionate. But there is so much more beneath the surface.</p><h2>1. Extraordinary Loyalty</h2><p>When Scorpio commits, they commit completely.</p><h2>2. Profound Empathy</h2><p>Scorpio feels everything deeply. The armor exists because the sensitivity is so acute.</p>',
  'Personality','8 min read',true,'published',now()
) on conflict (slug) do nothing;
