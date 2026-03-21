-- CrediWise: customer advisory requests + staff triage on /admin/advisory
-- Run after `applications` and `profiles` exist.

begin;

create table if not exists public.advisory_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users (id) on delete cascade,
  application_id uuid references public.applications (id) on delete set null,
  subject text not null,
  body text not null,
  category text not null default 'general'
    check (category in ('general', 'loan', 'documents', 'payments', 'other')),
  request_type text not null default 'general'
    check (request_type in ('general', 'loan', 'documents', 'payments', 'other')),
  priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'resolved', 'closed')),
  staff_response text,
  resolved_at timestamptz,
  resolved_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Legacy table may lack id / customer_id (CREATE TABLE IF NOT EXISTS skipped).
alter table public.advisory_requests add column if not exists id uuid;
alter table public.advisory_requests add column if not exists customer_id uuid;

update public.advisory_requests set id = gen_random_uuid() where id is null;

alter table public.advisory_requests alter column id set not null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'advisory_requests'
      and column_name = 'user_id'
  ) then
    execute $q$
      update public.advisory_requests
      set customer_id = user_id
      where customer_id is null
    $q$;
  end if;
end $$;

-- requester_id: legacy tables may only have this column; sync with customer_id before NOT NULL checks
alter table public.advisory_requests add column if not exists requester_id uuid;

update public.advisory_requests
set customer_id = requester_id
where customer_id is null
  and requester_id is not null;

update public.advisory_requests
set requester_id = customer_id
where requester_id is null
  and customer_id is not null;

do $$
begin
  if exists (select 1 from public.advisory_requests where customer_id is null limit 1) then
    raise exception
      'advisory_requests has rows with NULL customer_id (and no user_id / requester_id to copy). Fix or run: DROP TABLE public.advisory_requests CASCADE; then re-run this script.';
  end if;
end $$;

alter table public.advisory_requests alter column id set default gen_random_uuid();
alter table public.advisory_requests alter column customer_id set not null;

update public.advisory_requests set requester_id = customer_id where requester_id is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint c
    join pg_class t on c.conrelid = t.oid
    join pg_namespace n on t.relnamespace = n.oid
    where n.nspname = 'public'
      and t.relname = 'advisory_requests'
      and c.contype = 'p'
  ) then
    alter table public.advisory_requests add primary key (id);
  end if;
exception
  when others then
    raise notice 'advisory_requests: could not add primary key on id — %', sqlerrm;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'advisory_requests_customer_id_fkey'
  ) then
    alter table public.advisory_requests
      add constraint advisory_requests_customer_id_fkey
      foreign key (customer_id) references auth.users (id) on delete cascade;
  end if;
exception
  when others then
    raise notice 'advisory_requests: could not add customer_id FK — %', sqlerrm;
end $$;

do $$
begin
  if exists (
    select 1
    from public.advisory_requests
    where customer_id is not null
      and requester_id is not null
      and customer_id is distinct from requester_id
  ) then
    raise exception 'advisory_requests: customer_id and requester_id differ for some rows; align manually.';
  end if;
end $$;

alter table public.advisory_requests alter column requester_id set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'advisory_requests_requester_id_fkey'
  ) then
    alter table public.advisory_requests
      add constraint advisory_requests_requester_id_fkey
      foreign key (requester_id) references auth.users (id) on delete cascade;
  end if;
exception
  when others then
    raise notice 'advisory_requests: could not add requester_id FK — %', sqlerrm;
end $$;

create index if not exists idx_advisory_requests_requester on public.advisory_requests (requester_id);

-- If the table already existed (CREATE TABLE skipped), other columns may be missing.
alter table public.advisory_requests add column if not exists subject text;
alter table public.advisory_requests add column if not exists body text;
alter table public.advisory_requests add column if not exists message text;
alter table public.advisory_requests add column if not exists category text;
alter table public.advisory_requests add column if not exists request_type text;
alter table public.advisory_requests add column if not exists priority text;
alter table public.advisory_requests add column if not exists status text;
alter table public.advisory_requests add column if not exists staff_response text;
alter table public.advisory_requests add column if not exists resolved_at timestamptz;
alter table public.advisory_requests add column if not exists resolved_by uuid references auth.users (id) on delete set null;
alter table public.advisory_requests add column if not exists application_id uuid references public.applications (id) on delete set null;
alter table public.advisory_requests add column if not exists created_at timestamptz;
alter table public.advisory_requests add column if not exists updated_at timestamptz;

-- Align `request_type` CHECK with app categories (legacy DBs may use e.g. `payment` or other literals).
alter table public.advisory_requests drop constraint if exists advisory_requests_request_type_check;

update public.advisory_requests
set request_type = case
  when trim(coalesce(request_type, '')) in ('general', 'loan', 'documents', 'payments', 'other')
    then trim(request_type)
  when trim(coalesce(request_type, '')) = 'payment'
    then 'payments'
  when trim(coalesce(category, '')) in ('general', 'loan', 'documents', 'payments', 'other')
    then trim(category)
  when trim(coalesce(category, '')) = 'payment'
    then 'payments'
  else 'general'
end;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'advisory_requests_request_type_check'
  ) then
    alter table public.advisory_requests
      add constraint advisory_requests_request_type_check
      check (request_type in ('general', 'loan', 'documents', 'payments', 'other'));
  end if;
exception
  when others then
    raise notice 'advisory_requests: could not add request_type check — %', sqlerrm;
end $$;

-- Align `status` CHECK with app (new tickets use `open`; legacy DBs may use `pending`, `new`, etc.).
alter table public.advisory_requests drop constraint if exists advisory_requests_status_check;

update public.advisory_requests
set status = case
  when trim(coalesce(status, '')) in ('open', 'in_progress', 'resolved', 'closed')
    then trim(status)
  when lower(trim(coalesce(status, ''))) in ('pending', 'new', 'submitted')
    then 'open'
  when lower(trim(coalesce(status, ''))) in ('in progress', 'in_progress')
    then 'in_progress'
  else 'open'
end;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'advisory_requests_status_check'
  ) then
    alter table public.advisory_requests
      add constraint advisory_requests_status_check
      check (status in ('open', 'in_progress', 'resolved', 'closed'));
  end if;
exception
  when others then
    raise notice 'advisory_requests: could not add status check — %', sqlerrm;
end $$;

-- Copy legacy `message` -> `body` when present
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'advisory_requests'
      and column_name = 'message'
  ) then
    execute $q$
      update public.advisory_requests
      set body = message
      where body is null or trim(body) = ''
    $q$;
  end if;
end $$;

-- Keep legacy `message` in sync with `body` (some DBs require NOT NULL `message`)
update public.advisory_requests
set message = body
where message is null
  or trim(coalesce(message, '')) = '';

update public.advisory_requests
set body = message
where (body is null or trim(coalesce(body, '')) = '')
  and message is not null
  and trim(coalesce(message, '')) <> '';

update public.advisory_requests
set
  subject = coalesce(nullif(trim(subject), ''), 'Advisory request'),
  body = coalesce(nullif(trim(body), ''), '—'),
  message = coalesce(nullif(trim(body), ''), '—'),
  category = case
    when category is null or trim(category) = '' then 'general'
    when category not in ('general', 'loan', 'documents', 'payments', 'other') then 'general'
    else category
  end,
  request_type = case
    when category is null or trim(category) = '' then 'general'
    when category not in ('general', 'loan', 'documents', 'payments', 'other') then 'general'
    else category
  end,
  priority = case
    when priority is null or trim(priority) = '' then 'normal'
    when priority not in ('low', 'normal', 'high', 'urgent') then 'normal'
    else priority
  end,
  status = case
    when status is null or trim(status) = '' then 'open'
    when trim(status) in ('open', 'in_progress', 'resolved', 'closed') then trim(status)
    when lower(trim(status)) in ('pending', 'new', 'submitted') then 'open'
    when lower(trim(status)) in ('in progress', 'in_progress') then 'in_progress'
    when status not in ('open', 'in_progress', 'resolved', 'closed') then 'open'
    else status
  end,
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now())
where subject is null
   or body is null
   or message is null
   or category is null
   or request_type is null
   or priority is null
   or status is null
   or created_at is null
   or updated_at is null;

alter table public.advisory_requests alter column subject set not null;
alter table public.advisory_requests alter column body set not null;
alter table public.advisory_requests alter column message set not null;
alter table public.advisory_requests alter column category set not null;
alter table public.advisory_requests alter column request_type set not null;
alter table public.advisory_requests alter column priority set not null;
alter table public.advisory_requests alter column status set not null;
alter table public.advisory_requests alter column created_at set not null;
alter table public.advisory_requests alter column updated_at set not null;

create index if not exists idx_advisory_requests_customer on public.advisory_requests (customer_id);
create index if not exists idx_advisory_requests_status_created on public.advisory_requests (status, created_at desc);

comment on table public.advisory_requests is
  'Customer advisory tickets; staff triage via RLS update policy.';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_advisory_requests_updated_at on public.advisory_requests;
create trigger trg_advisory_requests_updated_at
before update on public.advisory_requests
for each row execute function public.set_updated_at();

alter table public.advisory_requests enable row level security;

drop policy if exists "advisory_requests_select_own_or_staff" on public.advisory_requests;
create policy "advisory_requests_select_own_or_staff"
on public.advisory_requests
for select
to authenticated
using (
  customer_id = auth.uid()
  or requester_id = auth.uid()
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('advisor', 'operations_executive', 'super_admin')
  )
);

drop policy if exists "advisory_requests_insert_own" on public.advisory_requests;
create policy "advisory_requests_insert_own"
on public.advisory_requests
for insert
to authenticated
with check (
  customer_id = auth.uid()
  and requester_id = auth.uid()
  and (
    application_id is null
    or exists (
      select 1
      from public.applications a
      where a.id = application_id
        and a.customer_id = auth.uid()
    )
  )
);

drop policy if exists "advisory_requests_update_staff" on public.advisory_requests;
create policy "advisory_requests_update_staff"
on public.advisory_requests
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('advisor', 'operations_executive', 'super_admin')
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('advisor', 'operations_executive', 'super_admin')
  )
);

commit;
