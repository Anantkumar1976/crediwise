-- Minimal fixes when `advisory_requests` exists with an incomplete schema.
-- Prefer running the full `advisory_requests.sql` from the repo.

begin;

-- body (PostgREST "schema cache" / missing column)
alter table public.advisory_requests add column if not exists body text;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'advisory_requests' and column_name = 'message'
  ) then
    execute $q$
      update public.advisory_requests set body = message where body is null or trim(body) = ''
    $q$;
  end if;
end $$;

update public.advisory_requests set body = coalesce(nullif(trim(body), ''), '—') where body is null;

alter table public.advisory_requests alter column body set not null;

-- customer_id (index / RLS need this column)
alter table public.advisory_requests add column if not exists customer_id uuid;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'advisory_requests' and column_name = 'user_id'
  ) then
    execute $q$
      update public.advisory_requests set customer_id = user_id where customer_id is null
    $q$;
  end if;
end $$;

do $$
begin
  if exists (select 1 from public.advisory_requests where customer_id is null limit 1) then
    raise exception
      'Cannot set customer_id: rows have NULL and no user_id column to copy. Fix data or DROP TABLE public.advisory_requests CASCADE; then run full advisory_requests.sql.';
  end if;
end $$;

alter table public.advisory_requests alter column customer_id set not null;

-- requester_id (some DBs use this name; keep in sync with customer_id)
alter table public.advisory_requests add column if not exists requester_id uuid;

update public.advisory_requests set customer_id = requester_id where customer_id is null and requester_id is not null;
update public.advisory_requests set requester_id = customer_id where requester_id is null and customer_id is not null;

alter table public.advisory_requests alter column requester_id set not null;

-- request_type (mirrors category in app; drop legacy CHECK first so literals can be normalized)
alter table public.advisory_requests add column if not exists request_type text;

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
end $$;

alter table public.advisory_requests alter column request_type set not null;

-- status (app uses `open` for new tickets; legacy may use `pending`, etc.)
alter table public.advisory_requests add column if not exists status text;

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
end $$;

update public.advisory_requests set status = 'open' where status is null;
alter table public.advisory_requests alter column status set not null;

commit;
