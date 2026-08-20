-- Training Ledger: owner-controlled account access
-- Run in Supabase Dashboard > SQL Editor after replacing the two email placeholders below.
-- This limits account creation to the exact addresses listed here. Existing users can still sign in.

create table if not exists public.training_approved_emails (
  email text primary key,
  created_at timestamptz not null default now(),
  constraint training_approved_emails_lowercase check (email = lower(email))
);

alter table public.training_approved_emails enable row level security;
revoke all on table public.training_approved_emails from anon, authenticated;

-- REQUIRED: Replace this with the email address of the existing owner account.
insert into public.training_approved_emails (email)
values ('replace-with-your-email@example.com')
on conflict (email) do nothing;

-- OPTIONAL: Uncomment this line only if one additional person should be allowed to create an account.
-- insert into public.training_approved_emails (email)
-- values ('replace-with-second-person@example.com')
-- on conflict (email) do nothing;

create or replace function public.require_approved_training_ledger_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.training_approved_emails
    where email = lower(new.email)
  ) then
    raise exception 'This Training Ledger is private. This email address is not approved for account creation.';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_training_ledger_approved_email on auth.users;
create trigger enforce_training_ledger_approved_email
before insert on auth.users
for each row execute procedure public.require_approved_training_ledger_email();
