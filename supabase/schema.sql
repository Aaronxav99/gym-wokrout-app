-- Training Ledger: private cloud record schema
-- Run this entire file in Supabase Dashboard > SQL Editor > New query.

create table if not exists public.training_records (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.training_records enable row level security;

drop policy if exists "Users can view only their own training record" on public.training_records;
create policy "Users can view only their own training record"
on public.training_records for select
using (auth.uid() = user_id);

drop policy if exists "Users can create only their own training record" on public.training_records;
create policy "Users can create only their own training record"
on public.training_records for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update only their own training record" on public.training_records;
create policy "Users can update only their own training record"
on public.training_records for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
