-- Extra fields on home / business loan detail tables (employment & business incorporation).
-- Run once in Supabase SQL Editor. Safe to re-run (IF NOT EXISTS).

begin;

-- Home: Employment — occupation (service vs business) + annual salary / business revenue
alter table public.home_loan_details add column if not exists occupation text;
alter table public.home_loan_details add column if not exists annual_salary_or_revenue numeric;

comment on column public.home_loan_details.occupation is
  'service = salaried employment; business = self-employed / business income.';
comment on column public.home_loan_details.annual_salary_or_revenue is
  'Annual salary (service) or annual business revenue (business), same currency as other amounts.';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'home_loan_details_occupation_check'
      and conrelid = 'public.home_loan_details'::regclass
  ) then
    alter table public.home_loan_details
      add constraint home_loan_details_occupation_check
      check (occupation is null or occupation in ('service', 'business'));
  end if;
end $$;

-- Business: incorporation year + annual revenue (ITRV note is UI-only; use income_proof upload)
alter table public.business_loan_details add column if not exists year_of_incorporation integer;
alter table public.business_loan_details add column if not exists annual_business_revenue numeric;

comment on column public.business_loan_details.year_of_incorporation is 'Calendar year the business was incorporated.';
comment on column public.business_loan_details.annual_business_revenue is
  'Annual business revenue; last-year ITRV typically attached as Income Proof.';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'business_loan_details_year_check'
      and conrelid = 'public.business_loan_details'::regclass
  ) then
    alter table public.business_loan_details
      add constraint business_loan_details_year_check
      check (
        year_of_incorporation is null
        or (year_of_incorporation >= 1800 and year_of_incorporation <= 2100)
      );
  end if;
end $$;

commit;
