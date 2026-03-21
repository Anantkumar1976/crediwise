-- CrediWise: customer profile fields (full name, contact, address) + RLS for own row.
-- Run once in Supabase SQL Editor. Safe to re-run (IF NOT EXISTS / idempotent adds).

begin;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists alt_phone text;
alter table public.profiles add column if not exists address text;
alter table public.profiles add column if not exists email text;

comment on column public.profiles.email is
  'Contact email (optional if auth.users.email is set; required for profile completion otherwise).';

create index if not exists idx_profiles_role on public.profiles (role);

-- updated_at trigger (reuse global helper if present)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

-- Staff check MUST NOT query `profiles` inside a policy on `profiles` (infinite recursion).
-- This helper runs with definer rights and bypasses RLS for the inner read.
create or replace function public.cw_profile_is_staff_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('advisor', 'operations_executive', 'super_admin')
  );
$$;

revoke all on function public.cw_profile_is_staff_user() from public;
grant execute on function public.cw_profile_is_staff_user() to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Staff can read all profiles (admin UI / triage)
drop policy if exists "profiles_select_staff" on public.profiles;
create policy "profiles_select_staff"
on public.profiles
for select
to authenticated
using (public.cw_profile_is_staff_user());

commit;
