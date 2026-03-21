-- CrediWise: EMI schedule rows per application (staff-managed).
-- Run after `applications` and `profiles` exist. Reuses `public.set_updated_at` from documents_storage.sql if present.

begin;

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table if not exists public.emi_records (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  installment_number int not null check (installment_number >= 1),
  due_date date not null,
  emi_amount numeric(14, 2) not null check (emi_amount >= 0),
  principal_amount numeric(14, 2) check (principal_amount is null or principal_amount >= 0),
  interest_amount numeric(14, 2) check (interest_amount is null or interest_amount >= 0),
  closing_balance numeric(14, 2),
  status text not null default 'scheduled'
    check (status in ('scheduled', 'paid', 'partial', 'waived')),
  paid_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint emi_records_application_installment_unique unique (application_id, installment_number)
);

-- ---------------------------------------------------------------------------
-- Align legacy/partial `emi_records` (CREATE TABLE IF NOT EXISTS was skipped)
-- so every column the app expects exists before indexes / triggers / RLS.
-- ---------------------------------------------------------------------------
alter table public.emi_records add column if not exists application_id uuid;
alter table public.emi_records add column if not exists installment_number int;
alter table public.emi_records add column if not exists due_date date;
alter table public.emi_records add column if not exists emi_amount numeric(14, 2);
alter table public.emi_records add column if not exists principal_amount numeric(14, 2);
alter table public.emi_records add column if not exists interest_amount numeric(14, 2);
alter table public.emi_records add column if not exists closing_balance numeric(14, 2);
alter table public.emi_records add column if not exists status text;
alter table public.emi_records add column if not exists paid_date date;
alter table public.emi_records add column if not exists notes text;
alter table public.emi_records add column if not exists created_at timestamptz;
alter table public.emi_records add column if not exists updated_at timestamptz;

-- Backfill required fields (safe when table was empty or partially filled)
update public.emi_records
set
  due_date = coalesce(due_date, current_date),
  emi_amount = coalesce(emi_amount, 0),
  status = case
    when status is null or btrim(status) = '' then 'scheduled'
    when status not in ('scheduled', 'paid', 'partial', 'waived') then 'scheduled'
    else status
  end,
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

do $$
begin
  if exists (select 1 from public.emi_records where application_id is null) then
    raise exception
      'emi_records has rows with NULL application_id. Fix data or DROP TABLE public.emi_records CASCADE and re-run this script.';
  end if;
end $$;

-- Assign installment # per application when missing (stable order; requires application_id set)
update public.emi_records e
set installment_number = s.rn
from (
  select
    id,
    row_number() over (
      partition by application_id
      order by coalesce(created_at, now()), id
    ) as rn
  from public.emi_records
) s
where e.id = s.id
  and (e.installment_number is null or e.installment_number < 1);

alter table public.emi_records alter column installment_number set not null;
alter table public.emi_records alter column due_date set not null;
alter table public.emi_records alter column emi_amount set not null;
alter table public.emi_records alter column status set not null;
alter table public.emi_records alter column created_at set not null;
alter table public.emi_records alter column updated_at set not null;

-- Legacy mistake: UNIQUE(application_id) alone (constraint name often emi_records_application_id_key)
-- allows only one EMI row per application. Multiple installments need composite uniqueness instead.
alter table public.emi_records drop constraint if exists emi_records_application_id_key;
drop index if exists emi_records_application_id_key;

-- Unique (application_id, installment_number) if not already present
do $$
begin
  if not exists (
    select 1 from pg_constraint c
    join pg_class t on c.conrelid = t.oid
    where t.relname = 'emi_records' and c.conname = 'emi_records_application_installment_unique'
  ) then
    alter table public.emi_records
      add constraint emi_records_application_installment_unique
      unique (application_id, installment_number);
  end if;
exception
  when unique_violation then
    raise exception
      'Cannot add unique constraint: duplicate (application_id, installment_number). Remove duplicates then re-run.';
end $$;

-- FK to applications (when column was added without constraint)
do $$
begin
  if not exists (
    select 1 from pg_constraint c
    join pg_class t on c.conrelid = t.oid
    where t.relname = 'emi_records' and c.conname = 'emi_records_application_id_fkey'
  ) then
    alter table public.emi_records
      add constraint emi_records_application_id_fkey
      foreign key (application_id) references public.applications(id) on delete cascade;
  end if;
exception
  when foreign_key_violation then
    raise notice 'Skipping emi_records_application_id_fkey (orphan application_id rows): %', sqlerrm;
  when others then
    raise notice 'Skipping emi_records_application_id_fkey: %', sqlerrm;
end $$;

drop index if exists idx_emi_records_application_due;
create index if not exists idx_emi_records_application_due
  on public.emi_records (application_id, due_date);

comment on table public.emi_records is
  'Loan EMI schedule lines; staff may insert anytime; update/delete only when application is Approved or Disbursed (RLS).';

-- ---------------------------------------------------------------------------
-- updated_at (create helper if missing)
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_emi_records_updated_at on public.emi_records;
create trigger trg_emi_records_updated_at
before update on public.emi_records
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.emi_records enable row level security;

drop policy if exists "emi_records_select" on public.emi_records;
create policy "emi_records_select"
on public.emi_records
for select
to authenticated
using (
  exists (
    select 1
    from public.applications a
    where a.id = emi_records.application_id
      and (
        a.customer_id = auth.uid()
        or exists (
          select 1
          from public.profiles p
          where p.id = auth.uid()
            and p.role in ('advisor', 'operations_executive', 'super_admin')
        )
      )
  )
);

drop policy if exists "emi_records_insert_staff" on public.emi_records;
create policy "emi_records_insert_staff"
on public.emi_records
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('advisor', 'operations_executive', 'super_admin')
  )
  and exists (
    select 1
    from public.applications a
    where a.id = application_id
  )
);

drop policy if exists "emi_records_update_staff_after_approval" on public.emi_records;
create policy "emi_records_update_staff_after_approval"
on public.emi_records
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('advisor', 'operations_executive', 'super_admin')
  )
  and exists (
    select 1
    from public.applications a
    where a.id = emi_records.application_id
      and lower(trim(a.current_status)) in ('approved', 'disbursed')
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('advisor', 'operations_executive', 'super_admin')
  )
  and exists (
    select 1
    from public.applications a
    where a.id = emi_records.application_id
      and lower(trim(a.current_status)) in ('approved', 'disbursed')
  )
);

drop policy if exists "emi_records_delete_staff_after_approval" on public.emi_records;
create policy "emi_records_delete_staff_after_approval"
on public.emi_records
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('advisor', 'operations_executive', 'super_admin')
  )
  and exists (
    select 1
    from public.applications a
    where a.id = emi_records.application_id
      and lower(trim(a.current_status)) in ('approved', 'disbursed')
  )
);

commit;
