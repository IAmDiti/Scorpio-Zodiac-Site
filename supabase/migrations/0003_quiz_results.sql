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
