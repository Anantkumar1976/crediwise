-- Minimal: add customer profile columns only (no RLS, no triggers).
-- Use if `profiles_customer_fields.sql` fails partway, or you only need columns first.
-- After running: Supabase → Project Settings → API → **Reload schema**.

alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists alt_phone text;
alter table public.profiles add column if not exists address text;
alter table public.profiles add column if not exists email text;
