-- Phase 8: the admin panel.
--
-- Adds a blog (`posts`), moves quiz definitions into the database (`quizzes`,
-- with the code modules in lib/quizzes/ kept as a runtime fallback + seed
-- source), and creates the public `media` Storage bucket that admin uploads
-- write to. Horoscopes and compatibility need no schema change — the admin UI
-- just does CRUD on the existing tables through the service-role key.
--
-- All content tables are world-readable for published rows; every write goes
-- through the service-role key (admin Server Actions), which bypasses RLS.

-- ── posts (blog) ──────────────────────────────────────────────────────────
create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  excerpt       text not null default '',
  body          text not null default '',       -- Markdown
  cover_url     text,
  status        text not null default 'draft' check (status in ('draft', 'published')),
  author_email  text,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.posts enable row level security;

drop policy if exists "posts: published are public" on public.posts;
create policy "posts: published are public"
  on public.posts for select
  using (status = 'published');

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute function public.touch_updated_at();

create index if not exists posts_status_published_idx
  on public.posts (status, published_at desc);

-- ── quizzes ───────────────────────────────────────────────────────────────
-- The whole quiz object (metadata, questions, results, bands) is one jsonb
-- blob so the scoring code in lib/quizzes/score.js keeps working unchanged.
create table if not exists public.quizzes (
  slug        text primary key,
  definition  jsonb not null,
  image_url   text,
  status      text not null default 'published' check (status in ('draft', 'published')),
  sort_order  int not null default 99,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.quizzes enable row level security;

drop policy if exists "quizzes: published are public" on public.quizzes;
create policy "quizzes: published are public"
  on public.quizzes for select
  using (status = 'published');

drop trigger if exists quizzes_touch_updated_at on public.quizzes;
create trigger quizzes_touch_updated_at
  before update on public.quizzes
  for each row execute function public.touch_updated_at();

-- ── media bucket ──────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media: public read" on storage.objects;
create policy "media: public read"
  on storage.objects for select
  using (bucket_id = 'media');
