-- ============================================================
-- Supabase migration: create reading_requests table
-- Run this in your Supabase SQL editor
-- Project: aayazvvolxdyyvzbrsnf
-- ============================================================

create table if not exists public.reading_requests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  birthdate   date not null,
  status      text not null check (status in ('single','dating','relationship','complicated','separated')),
  problem     text not null,
  email       text not null,
  paid        boolean not null default false,
  order_id    text,                        -- Lemon Squeezy order ID after payment
  delivered   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Row-level security: only service role can read (admin only)
alter table public.reading_requests enable row level security;

-- Allow inserts from anon (the form submission)
create policy "Anyone can submit a reading request"
  on public.reading_requests
  for insert
  to anon
  with check (true);

-- Only service role (your backend) can read/update
create policy "Service role can read all"
  on public.reading_requests
  for select
  to service_role
  using (true);

create policy "Service role can update"
  on public.reading_requests
  for update
  to service_role
  using (true);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger reading_requests_updated_at
  before update on public.reading_requests
  for each row execute function public.handle_updated_at();

-- Index on email for quick lookups
create index reading_requests_email_idx on public.reading_requests(email);
create index reading_requests_paid_idx  on public.reading_requests(paid);
