-- Phase 9: lightweight email capture.
--
-- The homepage hero, the quiz unlock and the compatibility teaser all ask for
-- an email and nothing else — no password, no confirmation round-trip. Those
-- addresses land here. A subscriber can be upgraded to a full auth account
-- later (same email), on their terms.
--
-- Writes go through the service-role key (a Server Action that has validated
-- the address); there are no client-facing policies.

create table if not exists public.subscribers (
  email             text primary key,
  source            text not null default 'hero'
                      check (source in ('hero', 'quiz', 'compat', 'preview', 'footer')),
  marketing_opt_in  boolean not null default true,
  ref_quiz_slug     text,
  ref_result_key    text,
  confirmed_at      timestamptz,
  created_at        timestamptz not null default now()
);

alter table public.subscribers enable row level security;
-- no policies on purpose: only the service-role client touches this table

create index if not exists subscribers_created_idx
  on public.subscribers (created_at desc);
