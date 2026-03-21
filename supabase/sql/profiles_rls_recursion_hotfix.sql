-- Fix: "infinite recursion detected in policy for relation profiles"
-- Cause: `profiles_select_staff` queried `profiles` inside an RLS policy on `profiles`.
-- Run once in Supabase SQL Editor (safe to re-run).

begin;

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

drop policy if exists "profiles_select_staff" on public.profiles;
create policy "profiles_select_staff"
on public.profiles
for select
to authenticated
using (public.cw_profile_is_staff_user());

commit;
