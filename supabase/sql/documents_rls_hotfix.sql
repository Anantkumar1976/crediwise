-- Run in Supabase SQL Editor if customer upload fails with:
-- "new row violates row-level security policy"
--
-- Your current policies (documents_insert / documents_select / documents_update) use
-- `documents.application_id` inside INSERT WITH CHECK. For INSERT, use bare `application_id`
-- (the new row), or the EXISTS subquery can fail and block uploads.
--
-- This migration: drops the legacy three policies, recreates a clean set, fixes Storage RLS,
-- and ensures register_customer_document() exists.

begin;

-- ---------------------------------------------------------------------------
-- Remove legacy policy names (from your screenshot / earlier migration)
-- ---------------------------------------------------------------------------
drop policy if exists "documents_insert" on public.documents;
drop policy if exists "documents_select" on public.documents;
drop policy if exists "documents_update" on public.documents;

-- Also remove duplicates if you ran our repo SQL before
drop policy if exists "documents_row_select" on public.documents;
drop policy if exists "documents_row_insert_customer" on public.documents;
drop policy if exists "documents_row_update_staff" on public.documents;
drop policy if exists "documents_row_update_customer_reupload" on public.documents;

-- ---------------------------------------------------------------------------
-- Storage: object key must be {application_id}/{...}
-- ---------------------------------------------------------------------------
drop policy if exists "documents_select" on storage.objects;
create policy "documents_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'documents'
  and (
    exists (
      select 1
      from public.applications a
      where a.id = split_part(name, '/', 1)::uuid
        and a.customer_id = auth.uid()
    )
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('advisor', 'operations_executive', 'super_admin')
    )
  )
);

drop policy if exists "documents_insert_customer" on storage.objects;
create policy "documents_insert_customer"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'documents'
  and exists (
    select 1
    from public.applications a
    where a.id = split_part(name, '/', 1)::uuid
      and a.customer_id = auth.uid()
  )
);

drop policy if exists "documents_delete_customer" on storage.objects;
create policy "documents_delete_customer"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'documents'
  and exists (
    select 1
    from public.applications a
    where a.id = split_part(name, '/', 1)::uuid
      and a.customer_id = auth.uid()
  )
);

-- ---------------------------------------------------------------------------
-- Table documents: clean RLS (INSERT uses `application_id`, not `documents.application_id`)
-- ---------------------------------------------------------------------------
create policy "documents_select"
on public.documents
for select
to authenticated
using (
  exists (
    select 1
    from public.applications a
    where a.id = documents.application_id
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

-- Customer: owns application and uploads as self
create policy "documents_insert_customer"
on public.documents
for insert
to authenticated
with check (
  uploaded_by = auth.uid()
  and exists (
    select 1
    from public.applications a
    where a.id = application_id
      and a.customer_id = auth.uid()
  )
);

-- Staff: can insert rows linked to any application (e.g. ops uploads on behalf)
create policy "documents_insert_staff"
on public.documents
for insert
to authenticated
with check (
  uploaded_by = auth.uid()
  and exists (
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

create policy "documents_update_staff"
on public.documents
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
with check (true);

create policy "documents_update_customer_reupload"
on public.documents
for update
to authenticated
using (
  uploaded_by = auth.uid()
  and status in ('Uploaded', 'Re-upload')
  and exists (
    select 1
    from public.applications a
    where a.id = documents.application_id
      and a.customer_id = auth.uid()
  )
)
with check (
  uploaded_by = auth.uid()
  and status in ('Uploaded', 'Under Review', 'Approved', 'Re-upload')
);

-- ---------------------------------------------------------------------------
-- RPC: register metadata after Storage upload (SECURITY DEFINER)
-- ---------------------------------------------------------------------------
create or replace function public.register_customer_document(
  p_application_id uuid,
  p_document_type text,
  p_file_name text,
  p_mime_type text,
  p_file_size_bytes bigint,
  p_storage_path text,
  p_storage_bucket text default 'documents'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_new_id uuid;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  if p_storage_bucket is distinct from 'documents' then
    raise exception 'Invalid storage bucket';
  end if;

  if split_part(p_storage_path, '/', 1) is distinct from p_application_id::text then
    raise exception 'Storage path must start with application id';
  end if;

  if not exists (
    select 1
    from public.applications a
    where a.id = p_application_id
      and a.customer_id = v_uid
  ) then
    raise exception 'Application not found or access denied';
  end if;

  insert into public.documents (
    application_id,
    uploaded_by,
    document_type,
    file_name,
    mime_type,
    file_size_bytes,
    storage_bucket,
    storage_path,
    status
  )
  values (
    p_application_id,
    v_uid,
    p_document_type,
    p_file_name,
    p_mime_type,
    p_file_size_bytes,
    p_storage_bucket,
    p_storage_path,
    'Uploaded'
  )
  returning id into v_new_id;

  return v_new_id;
end;
$$;

revoke all on function public.register_customer_document(uuid, text, text, text, bigint, text, text) from public;
grant execute on function public.register_customer_document(uuid, text, text, text, bigint, text, text) to authenticated;

commit;
