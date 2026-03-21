-- CrediWise: configurable required/optional document rules per loan type and status transition.
-- Run in Supabase SQL Editor after `applications`, `documents`, and `admin_update_application_status` exist.
-- Replaces the one-off Submitted→Verified-only gate with rules-driven checks for any transition (e.g. Processing→Approved).

begin;

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table if not exists public.document_stage_rules (
  id uuid primary key default gen_random_uuid(),
  loan_type text not null check (loan_type in ('home', 'business', 'all')),
  from_status text not null,
  to_status text not null,
  document_type text not null,
  is_required boolean not null default true,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint document_stage_rules_transition_doc_unique
    unique (loan_type, from_status, to_status, document_type)
);

comment on table public.document_stage_rules is
  'Per-transition document requirements; is_required=true blocks admin status advance until latest doc of that type is Approved.';

create index if not exists idx_document_stage_rules_lookup
  on public.document_stage_rules (from_status, to_status, loan_type)
  where is_active = true;

-- ---------------------------------------------------------------------------
-- RLS: reference data readable by any authenticated user (staff + customers for checklists)
-- ---------------------------------------------------------------------------
alter table public.document_stage_rules enable row level security;

drop policy if exists "document_stage_rules_select_authenticated" on public.document_stage_rules;
create policy "document_stage_rules_select_authenticated"
  on public.document_stage_rules
  for select
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Seed: mirror previous hardcoded checklists; gate Processing→Approved the same way
-- Status values are normalized lowercase single words (matches admin RPC normalization).
-- ---------------------------------------------------------------------------
insert into public.document_stage_rules (loan_type, from_status, to_status, document_type, is_required, sort_order)
values
  -- Home: Submitted → Verified
  ('home', 'submitted', 'verified', 'id_proof', true, 10),
  ('home', 'submitted', 'verified', 'income_proof', true, 20),
  ('home', 'submitted', 'verified', 'bank_statement', true, 30),
  ('home', 'submitted', 'verified', 'property_docs', true, 40),
  -- Home: Processing → Approved (same underwriting set)
  ('home', 'processing', 'approved', 'id_proof', true, 10),
  ('home', 'processing', 'approved', 'income_proof', true, 20),
  ('home', 'processing', 'approved', 'bank_statement', true, 30),
  ('home', 'processing', 'approved', 'property_docs', true, 40),
  -- Business: Submitted → Verified
  ('business', 'submitted', 'verified', 'id_proof', true, 10),
  ('business', 'submitted', 'verified', 'income_proof', true, 20),
  ('business', 'submitted', 'verified', 'bank_statement', true, 30),
  ('business', 'submitted', 'verified', 'business_registration', true, 40),
  -- Business: Processing → Approved
  ('business', 'processing', 'approved', 'id_proof', true, 10),
  ('business', 'processing', 'approved', 'income_proof', true, 20),
  ('business', 'processing', 'approved', 'bank_statement', true, 30),
  ('business', 'processing', 'approved', 'business_registration', true, 40)
on conflict on constraint document_stage_rules_transition_doc_unique do nothing;

-- ---------------------------------------------------------------------------
-- Assert: latest row per required document_type must be Approved (same semantics as before)
-- ---------------------------------------------------------------------------
create or replace function public.assert_documents_for_transition(
  p_application_id uuid,
  p_loan_type text,
  p_from_status text,
  p_to_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lt text := lower(trim(p_loan_type));
  v_from text := regexp_replace(lower(trim(p_from_status)), '\s+', ' ', 'g');
  v_to text := regexp_replace(lower(trim(p_to_status)), '\s+', ' ', 'g');
  r record;
  v_latest_status text;
begin
  for r in
    select dsr.document_type
    from public.document_stage_rules dsr
    where dsr.is_active = true
      and dsr.is_required = true
      and dsr.from_status = v_from
      and dsr.to_status = v_to
      and dsr.loan_type in (v_lt, 'all')
    group by dsr.document_type
    order by min(dsr.sort_order)
  loop
    select d.status
      into v_latest_status
    from public.documents d
    where d.application_id = p_application_id
      and d.document_type = r.document_type
    order by d.created_at desc
    limit 1;

    if v_latest_status is null or v_latest_status is distinct from 'Approved' then
      raise exception
        using message = format(
          'Cannot move from %s to %s: latest document for "%s" must be Approved (current: %s).',
          initcap(v_from),
          initcap(v_to),
          r.document_type,
          coalesce(v_latest_status, 'missing')
        );
    end if;
  end loop;
end;
$$;

revoke all on function public.assert_documents_for_transition(uuid, text, text, text) from public;
grant execute on function public.assert_documents_for_transition(uuid, text, text, text) to authenticated;

-- Backwards-compatible wrapper (optional callers / old scripts)
create or replace function public.assert_required_documents_approved_for_verified(
  p_application_id uuid,
  p_loan_type text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_documents_for_transition(
    p_application_id,
    p_loan_type,
    'submitted',
    'verified'
  );
end;
$$;

revoke all on function public.assert_required_documents_approved_for_verified(uuid, text) from public;

-- ---------------------------------------------------------------------------
-- Admin RPC: enforce rules on every transition that has required rows
-- ---------------------------------------------------------------------------
create or replace function public.admin_update_application_status(
  p_application_id uuid,
  p_new_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_role text;
  v_prev_status text;
  v_prev_norm text;
  v_new_norm text;
  v_expected_next text;
  v_loan_type text;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select p.role
    into v_role
  from public.profiles p
  where p.id = v_user_id;

  if v_role is null or v_role not in ('advisor', 'operations_executive', 'super_admin') then
    raise exception 'Access denied';
  end if;

  select a.current_status, a.loan_type
    into v_prev_status, v_loan_type
  from public.applications a
  where a.id = p_application_id
  for update;

  if not found then
    raise exception 'Application not found';
  end if;

  v_prev_norm := regexp_replace(lower(trim(v_prev_status)), '\s+', ' ', 'g');
  v_new_norm := regexp_replace(lower(trim(p_new_status)), '\s+', ' ', 'g');

  v_expected_next :=
    case v_prev_norm
      when 'draft' then 'submitted'
      when 'submitted' then 'verified'
      when 'verified' then 'processing'
      when 'processing' then 'approved'
      when 'approved' then 'disbursed'
      else null
    end;

  if v_expected_next is distinct from v_new_norm then
    raise exception 'Invalid staff status transition from % to %', v_prev_status, p_new_status;
  end if;

  perform public.assert_documents_for_transition(
    p_application_id,
    v_loan_type,
    v_prev_norm,
    v_new_norm
  );

  update public.applications
  set
    current_status = initcap(v_new_norm),
    updated_at = now()
  where id = p_application_id;

  if to_regclass('public.application_status_history') is not null then
    insert into public.application_status_history (
      application_id,
      previous_status,
      new_status,
      changed_by,
      note
    )
    values (
      p_application_id,
      v_prev_status,
      initcap(v_new_norm),
      v_user_id,
      'Updated from admin panel'
    );
  end if;
end;
$$;

revoke all on function public.admin_update_application_status(uuid, text) from public;
grant execute on function public.admin_update_application_status(uuid, text) to authenticated;

commit;
