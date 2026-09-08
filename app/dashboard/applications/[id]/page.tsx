import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { saveApplicationDetails } from "./actions";
import {
  CustomerDocumentsSection,
  type CustomerDocumentRow,
} from "./customer-documents";
import {
  CustomerRepaymentScheduleSection,
  type CustomerEmiRow,
} from "./customer-repayment-schedule";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatMessage } from "@/lib/i18n/format";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";
import { appStatusLabel, loanTypeLabel } from "@/lib/i18n/labels";

interface ApplicationRecord {
  id: string;
  loan_type: "home" | "business";
  current_status: "Draft" | "Submitted" | "Verified" | "Processing" | "Approved" | "Disbursed";
}

interface HomeDetailsRecord {
  property_address: string | null;
  property_value: number | null;
  down_payment: number | null;
  loan_amount: number | null;
  applicant_count: number | null;
  occupation: "service" | "business" | null;
  annual_salary_or_revenue: number | null;
}

interface BusinessDetailsRecord {
  business_name: string | null;
  purpose: string | null;
  working_capital: number | null;
  loan_amount: number | null;
  year_of_incorporation: number | null;
  annual_business_revenue: number | null;
}

export default async function ApplicationDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const applicationId = params.id;
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const d = t.dashboard;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/sign-in?redirect=/dashboard/applications/${applicationId}`);
  }

  const { data: application, error } = await supabase
    .from("applications")
    .select("id, loan_type, current_status")
    .eq("id", applicationId)
    .eq("customer_id", user.id)
    .single();

  if (error || !application) {
    return (
      <div className="mx-auto max-w-4xl">
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {d.applicationDetail.notFound}
        </p>
        <Link
          href="/dashboard/applications"
          className="mt-4 inline-flex text-sm font-medium text-sky-800 underline"
        >
          {d.applicationDetail.back}
        </Link>
      </div>
    );
  }

  const app = application as ApplicationRecord;
  const isDraft = app.current_status === "Draft";
  const allowDocumentUpload = app.current_status !== "Disbursed";

  const { data: documentsRaw, error: documentsError } = await supabase
    .from("documents")
    .select("id, document_type, file_name, status, storage_path, created_at, version")
    .eq("application_id", app.id)
    .order("created_at", { ascending: false });

  const customerDocuments = (documentsRaw ?? []) as CustomerDocumentRow[];

  const showRepaymentSchedule =
    app.current_status === "Approved" || app.current_status === "Disbursed";

  let emiRows: CustomerEmiRow[] = [];
  let emiError: string | null = null;
  if (showRepaymentSchedule) {
    const { data: emiRaw, error: emiErrorRaw } = await supabase
      .from("emi_records")
      .select(
        "id, installment_number, due_date, emi_amount, principal_amount, interest_amount, closing_balance, status, paid_date, notes"
      )
      .eq("application_id", app.id)
      .order("installment_number", { ascending: true });

    if (emiErrorRaw) {
      emiError = emiErrorRaw.message;
    } else {
      emiRows = (emiRaw ?? []) as CustomerEmiRow[];
    }
  }

  let homeDetails: HomeDetailsRecord | null = null;
  let businessDetails: BusinessDetailsRecord | null = null;
  let detailsError: string | null = null;

  if (app.loan_type === "home") {
    const { data, error: homeError } = await supabase
      .from("home_loan_details")
      .select(
        "property_address, property_value, down_payment, loan_amount, applicant_count, occupation, annual_salary_or_revenue"
      )
      .eq("application_id", app.id)
      .maybeSingle();

    if (homeError) {
      detailsError = homeError.message;
    } else {
      homeDetails = (data as HomeDetailsRecord | null) ?? null;
    }
  } else {
    const { data, error: businessError } = await supabase
      .from("business_loan_details")
      .select("business_name, purpose, working_capital, loan_amount, year_of_incorporation, annual_business_revenue")
      .eq("application_id", app.id)
      .maybeSingle();

    if (businessError) {
      detailsError = businessError.message;
    } else {
      businessDetails = (data as BusinessDetailsRecord | null) ?? null;
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Link href="/dashboard/applications" className="text-sm font-semibold text-sky-800 hover:underline">
          ← {d.applicationDetail.back}
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {formatMessage(d.applicationDetail.heading, { type: loanTypeLabel(t, app.loan_type) })}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {formatMessage(d.applicationDetail.applicationId, { id: app.id })}
        </p>
        <p className="mt-1 text-sm text-slate-600">
          {formatMessage(d.applicationDetail.status, { status: appStatusLabel(t, app.current_status) })}
        </p>
      </header>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {detailsError ? (
          <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {formatMessage(d.applicationDetail.loadDetailsError, { error: detailsError })}
          </p>
        ) : null}

        <form action={saveApplicationDetails} className="space-y-4">
          <input type="hidden" name="applicationId" value={app.id} />

          {app.loan_type === "home" ? (
            <>
              <div className="space-y-2">
                <label htmlFor="propertyAddress" className="text-sm font-medium">
                  {d.applicationDetail.propertyAddress}
                </label>
                <input
                  id="propertyAddress"
                  name="propertyAddress"
                  defaultValue={homeDetails?.property_address ?? ""}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="propertyValue" className="text-sm font-medium">
                    {d.applicationDetail.propertyValue}
                  </label>
                  <input
                    id="propertyValue"
                    name="propertyValue"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={homeDetails?.property_value ?? ""}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="downPayment" className="text-sm font-medium">
                    {d.applicationDetail.downPayment}
                  </label>
                  <input
                    id="downPayment"
                    name="downPayment"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={homeDetails?.down_payment ?? ""}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="loanAmount" className="text-sm font-medium">
                    {d.applicationDetail.loanAmount}
                  </label>
                  <input
                    id="loanAmount"
                    name="loanAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={homeDetails?.loan_amount ?? ""}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="applicantCount" className="text-sm font-medium">
                    {d.applicationDetail.applicantCount}
                  </label>
                  <input
                    id="applicantCount"
                    name="applicantCount"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={homeDetails?.applicant_count ?? ""}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
                  />
                </div>
              </div>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <h3 className="text-base font-semibold text-slate-900">{d.applicationDetail.employmentTitle}</h3>
                <p className="mt-1 text-xs text-slate-600">{d.applicationDetail.employmentBody}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="occupation" className="text-sm font-medium">
                      {d.applicationDetail.occupation}
                    </label>
                    <select
                      id="occupation"
                      name="occupation"
                      defaultValue={homeDetails?.occupation ?? ""}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
                    >
                      <option value="">{d.applicationDetail.occupationSelect}</option>
                      <option value="service">{d.applicationDetail.occupationService}</option>
                      <option value="business">{d.applicationDetail.occupationBusiness}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="annualSalaryOrRevenue" className="text-sm font-medium">
                      {d.applicationDetail.annualSalary}
                    </label>
                    <input
                      id="annualSalaryOrRevenue"
                      name="annualSalaryOrRevenue"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder={d.applicationDetail.annualSalaryPlaceholder}
                      defaultValue={homeDetails?.annual_salary_or_revenue ?? ""}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="businessName" className="text-sm font-medium">
                  {d.applicationDetail.businessName}
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  defaultValue={businessDetails?.business_name ?? ""}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="purpose" className="text-sm font-medium">
                  {d.applicationDetail.purpose}
                </label>
                <textarea
                  id="purpose"
                  name="purpose"
                  rows={4}
                  defaultValue={businessDetails?.purpose ?? ""}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-slate-900/10 focus:ring-2"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="workingCapital" className="text-sm font-medium">
                    {d.applicationDetail.workingCapital}
                  </label>
                  <input
                    id="workingCapital"
                    name="workingCapital"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={businessDetails?.working_capital ?? ""}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="loanAmount" className="text-sm font-medium">
                    {d.applicationDetail.loanAmount}
                  </label>
                  <input
                    id="loanAmount"
                    name="loanAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={businessDetails?.loan_amount ?? ""}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
                  />
                </div>
              </div>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <h3 className="text-base font-semibold text-slate-900">{d.applicationDetail.businessDetailsTitle}</h3>
                <p className="mt-1 text-xs text-slate-600">{d.applicationDetail.businessDetailsBody}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="yearOfIncorporation" className="text-sm font-medium">
                      {d.applicationDetail.yearOfIncorporation}
                    </label>
                    <input
                      id="yearOfIncorporation"
                      name="yearOfIncorporation"
                      type="number"
                      min="1800"
                      max="2100"
                      step="1"
                      placeholder={d.applicationDetail.yearPlaceholder}
                      defaultValue={businessDetails?.year_of_incorporation ?? ""}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="annualBusinessRevenue" className="text-sm font-medium">
                      {d.applicationDetail.annualRevenue}
                    </label>
                    <input
                      id="annualBusinessRevenue"
                      name="annualBusinessRevenue"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder={d.applicationDetail.annualRevenuePlaceholder}
                      defaultValue={businessDetails?.annual_business_revenue ?? ""}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              name="intent"
              value="save"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              {d.applicationDetail.saveDraft}
            </button>
            <button
              type="submit"
              name="intent"
              value="submit"
              disabled={!isDraft}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {d.applicationDetail.saveAndSubmit}
            </button>
          </div>
        </form>
      </section>

      {documentsError ? (
        <section className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {formatMessage(d.applicationDetail.loadDocumentsError, { error: documentsError.message })}
        </section>
      ) : (
        <CustomerDocumentsSection
          applicationId={app.id}
          loanType={app.loan_type}
          allowUpload={allowDocumentUpload}
          initialDocuments={customerDocuments}
        />
      )}

      {showRepaymentSchedule ? (
        <CustomerRepaymentScheduleSection emiRows={emiRows} emiError={emiError} t={t} locale={locale} />
      ) : null}
    </div>
  );
}

