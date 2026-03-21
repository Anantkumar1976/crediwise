import Link from "next/link";
import { redirect } from "next/navigation";
import {
  formatNullable,
  getCustomerDisplayName,
  loadCustomerProfilesByIds,
} from "@/lib/admin/customer-profiles";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { adminUpdateApplicationStatus, adminUpdateDocumentStatus } from "@/app/admin/actions";
import { DOCUMENTS_BUCKET } from "@/lib/documents/constants";
import { getRequiredDocumentTypesForNextTransition } from "@/lib/documents/stage-rules";
import { documentGateDetails } from "@/lib/documents/verification-gate";
import { EmiManagerSection, type EmiRecordRow } from "./emi-manager-section";

const staffRoles = new Set(["advisor", "operations_executive", "super_admin"]);
const nextStatusMap: Record<string, string | null> = {
  Draft: "Submitted",
  Submitted: "Verified",
  Verified: "Processing",
  Processing: "Approved",
  Approved: "Disbursed",
  Disbursed: null,
};

interface ApplicationRecord {
  id: string;
  customer_id: string;
  loan_type: "home" | "business";
  current_status: "Draft" | "Submitted" | "Verified" | "Processing" | "Approved" | "Disbursed";
  created_at: string;
}

interface StatusHistoryRow {
  id: string;
  previous_status: string | null;
  new_status: string;
  note: string | null;
  created_at: string;
}

interface AdminDocumentRow {
  id: string;
  document_type: string;
  file_name: string | null;
  status: string;
  storage_path: string;
  created_at: string;
  signedUrl: string | null;
}

interface AdminHomeLoanDetails {
  property_address: string | null;
  property_value: number | null;
  down_payment: number | null;
  loan_amount: number | null;
  applicant_count: number | null;
  occupation: string | null;
  annual_salary_or_revenue: number | null;
}

interface AdminBusinessLoanDetails {
  business_name: string | null;
  purpose: string | null;
  working_capital: number | null;
  loan_amount: number | null;
  year_of_incorporation: number | null;
  annual_business_revenue: number | null;
}

function formatMoney(n: number | null) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default async function AdminApplicationDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const applicationId = params.id;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/sign-in?redirect=/admin/applications/${applicationId}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !staffRoles.has(profile.role)) {
    redirect("/dashboard");
  }

  const { data: application, error: appError } = await supabase
    .from("applications")
    .select("id, customer_id, loan_type, current_status, created_at")
    .eq("id", applicationId)
    .single();

  if (appError || !application) {
    return (
      <div className="mx-auto max-w-5xl">
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          Could not load application: {appError?.message ?? "Not found."}
        </p>
        <Link href="/admin/applications" className="mt-4 inline-flex text-sm font-semibold text-sky-800 hover:underline">
          ← Back to all applications
        </Link>
      </div>
    );
  }

  const app = application as ApplicationRecord;
  const nextStatus = nextStatusMap[app.current_status] ?? null;

  const customerById = await loadCustomerProfilesByIds(supabase, [app.customer_id]);
  const customerProfile = customerById.get(app.customer_id);
  const customerName = getCustomerDisplayName(customerProfile);
  const customerPhone = formatNullable(customerProfile?.phone);
  const customerEmail = formatNullable(customerProfile?.email);

  let homeLoanDetails: AdminHomeLoanDetails | null = null;
  let businessLoanDetails: AdminBusinessLoanDetails | null = null;
  let loanDetailsError: string | null = null;

  if (app.loan_type === "home") {
    const { data, error } = await supabase
      .from("home_loan_details")
      .select(
        "property_address, property_value, down_payment, loan_amount, applicant_count, occupation, annual_salary_or_revenue"
      )
      .eq("application_id", app.id)
      .maybeSingle();
    if (error) loanDetailsError = error.message;
    else homeLoanDetails = data as AdminHomeLoanDetails | null;
  } else {
    const { data, error } = await supabase
      .from("business_loan_details")
      .select(
        "business_name, purpose, working_capital, loan_amount, year_of_incorporation, annual_business_revenue"
      )
      .eq("application_id", app.id)
      .maybeSingle();
    if (error) loanDetailsError = error.message;
    else businessLoanDetails = data as AdminBusinessLoanDetails | null;
  }

  const { data: history, error: historyError } = await supabase
    .from("application_status_history")
    .select("id, previous_status, new_status, note, created_at")
    .eq("application_id", app.id)
    .order("created_at", { ascending: false });

  const historyRows = (history ?? []) as StatusHistoryRow[];

  const { data: documentsRaw, error: documentsError } = await supabase
    .from("documents")
    .select("id, document_type, file_name, status, storage_path, created_at")
    .eq("application_id", app.id)
    .order("created_at", { ascending: false });

  const documentRowsBase = (documentsRaw ?? []) as Omit<AdminDocumentRow, "signedUrl">[];

  const requiredForNext = await getRequiredDocumentTypesForNextTransition(
    supabase,
    app.loan_type,
    app.current_status,
    nextStatus
  );

  const transitionGate =
    requiredForNext.length > 0
      ? documentGateDetails(requiredForNext, documentRowsBase)
      : { ok: true as const, blocking: [] as string[] };

  const transitionBlocked = !transitionGate.ok;

  const documentRows: AdminDocumentRow[] = await Promise.all(
    documentRowsBase.map(async (doc) => {
      const { data: signed } = await supabase.storage
        .from(DOCUMENTS_BUCKET)
        .createSignedUrl(doc.storage_path, 3600);
      return { ...doc, signedUrl: signed?.signedUrl ?? null };
    })
  );

  const { data: emiRaw, error: emiError } = await supabase
    .from("emi_records")
    .select(
      "id, installment_number, due_date, emi_amount, principal_amount, interest_amount, closing_balance, status, paid_date, notes"
    )
    .eq("application_id", app.id)
    .order("installment_number", { ascending: true });

  const emiRows = (emiRaw ?? []) as EmiRecordRow[];
  const maxInstallment = emiRows.reduce((m, r) => Math.max(m, r.installment_number), 0);
  const nextInstallmentHint = maxInstallment > 0 ? maxInstallment + 1 : 1;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Link href="/admin/applications" className="text-sm font-semibold text-sky-800 hover:underline">
          ← Back to all applications
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Application case</h1>
        <p className="mt-2 text-sm text-slate-600">Application ID: {app.id}</p>
        <p className="mt-1 text-sm text-slate-600 capitalize">
          Loan Type: {app.loan_type} | Current Status:{" "}
          <span className="font-semibold">{app.current_status}</span>
        </p>

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer</p>
          <p className="mt-2 text-sm text-slate-900">
            <span className="font-semibold">{customerName}</span>
          </p>
          <p className="mt-1 text-sm text-slate-700">
            <span className="text-slate-500">Phone:</span> {customerPhone}
          </p>
          <p className="mt-0.5 text-sm text-slate-700">
            <span className="text-slate-500">Email:</span> {customerEmail}
          </p>
          <p className="mt-2 break-all font-mono text-xs text-slate-600">
            <span className="text-slate-500">Customer ID:</span> {app.customer_id}
          </p>
        </div>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Customer basic details</h2>
        <p className="mt-1 text-sm text-slate-600">
          From the customer profile (My Profile). Contact email may differ from sign-in email.
        </p>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Full name</dt>
            <dd className="mt-0.5 text-slate-900">{customerName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">User ID</dt>
            <dd className="mt-0.5 break-all font-mono text-xs text-slate-800">{app.customer_id}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Email (profile)</dt>
            <dd className="mt-0.5 text-slate-900">{customerEmail}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Phone</dt>
            <dd className="mt-0.5 text-slate-900">{customerPhone}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Alt phone</dt>
            <dd className="mt-0.5 text-slate-900">{formatNullable(customerProfile?.alt_phone)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Address</dt>
            <dd className="mt-0.5 whitespace-pre-wrap text-slate-900">
              {formatNullable(customerProfile?.address)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Loan application details</h2>
        {loanDetailsError ? (
          <p className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            Could not load application form details: {loanDetailsError}
          </p>
        ) : app.loan_type === "home" && homeLoanDetails ? (
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Property address</dt>
              <dd className="mt-0.5 text-slate-900">{homeLoanDetails.property_address ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Property value</dt>
              <dd className="mt-0.5 text-slate-900">{formatMoney(homeLoanDetails.property_value)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Down payment</dt>
              <dd className="mt-0.5 text-slate-900">{formatMoney(homeLoanDetails.down_payment)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Loan amount</dt>
              <dd className="mt-0.5 text-slate-900">{formatMoney(homeLoanDetails.loan_amount)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Applicant count</dt>
              <dd className="mt-0.5 text-slate-900">{homeLoanDetails.applicant_count ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Occupation</dt>
              <dd className="mt-0.5 capitalize text-slate-900">
                {homeLoanDetails.occupation === "service"
                  ? "Service (salaried)"
                  : homeLoanDetails.occupation === "business"
                    ? "Business"
                    : "—"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Annual salary / business revenue
              </dt>
              <dd className="mt-0.5 text-slate-900">
                {formatMoney(homeLoanDetails.annual_salary_or_revenue)}
              </dd>
            </div>
          </dl>
        ) : app.loan_type === "business" && businessLoanDetails ? (
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Business name</dt>
              <dd className="mt-0.5 text-slate-900">{businessLoanDetails.business_name ?? "—"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Loan purpose</dt>
              <dd className="mt-0.5 whitespace-pre-wrap text-slate-900">{businessLoanDetails.purpose ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Working capital</dt>
              <dd className="mt-0.5 text-slate-900">{formatMoney(businessLoanDetails.working_capital)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Loan amount</dt>
              <dd className="mt-0.5 text-slate-900">{formatMoney(businessLoanDetails.loan_amount)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Year of incorporation</dt>
              <dd className="mt-0.5 text-slate-900">{businessLoanDetails.year_of_incorporation ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Annual business revenue</dt>
              <dd className="mt-0.5 text-slate-900">{formatMoney(businessLoanDetails.annual_business_revenue)}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-2 text-sm text-slate-600">No saved form details yet.</p>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Documents</h2>
        <p className="mt-2 text-sm text-slate-600">
          Review uploads and set status: Uploaded, Under Review, Approved, or Re-upload.
        </p>
        {documentsError ? (
          <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            Could not load documents: {documentsError.message}
          </p>
        ) : documentRows.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">No documents uploaded yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {documentRows.map((doc) => (
              <article
                key={doc.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold capitalize">
                      {doc.document_type.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-slate-500">{doc.file_name ?? doc.storage_path}</p>
                    <p className="text-xs text-slate-500">
                      Current status:{" "}
                      <span className="font-semibold text-slate-700">{doc.status}</span> ·{" "}
                      {new Date(doc.created_at).toLocaleString()}
                    </p>
                  </div>
                  {doc.signedUrl ? (
                    <a
                      href={doc.signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                    >
                      Open file
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500">Signed URL unavailable</span>
                  )}
                </div>
                <form action={adminUpdateDocumentStatus} className="mt-3 flex flex-wrap items-end gap-2">
                  <input type="hidden" name="documentId" value={doc.id} />
                  <input type="hidden" name="applicationId" value={app.id} />
                  <label className="text-xs font-medium text-slate-600">
                    Update status
                    <select
                      name="status"
                      defaultValue={doc.status}
                      className="ml-2 h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm"
                    >
                      <option value="Uploaded">Uploaded</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Re-upload">Re-upload</option>
                    </select>
                  </label>
                  <button
                    type="submit"
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-slate-700"
                  >
                    Save
                  </button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>

      <EmiManagerSection
        applicationId={app.id}
        currentStatus={app.current_status}
        emiRows={emiRows}
        emiError={emiError?.message ?? null}
        nextInstallmentHint={nextInstallmentHint}
      />

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Process Application</h2>
        <p className="mt-2 text-sm text-slate-600">
          Status moves are allowed only when configured required document types for that transition are
          satisfied: each required type’s <strong>latest</strong> upload must be{" "}
          <strong>Approved</strong> in the Documents section above (rules live in{" "}
          <code className="rounded bg-slate-100 px-1 text-xs">document_stage_rules</code>).
        </p>

        {transitionBlocked && nextStatus ? (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <p className="font-semibold">Cannot move to {nextStatus} yet</p>
            <p className="mt-1 text-amber-900">
              Resolve the items below, then try again.
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-amber-900">
              {transitionGate.blocking.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {nextStatus ? (
          <div className="mt-4 flex flex-wrap gap-3">
            <form action={adminUpdateApplicationStatus}>
              <input type="hidden" name="applicationId" value={app.id} />
              <input type="hidden" name="targetStatus" value={nextStatus} />
              <button
                type="submit"
                disabled={transitionBlocked}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Move to {nextStatus}
              </button>
            </form>
          </div>
        ) : (
          <p className="mt-4 text-sm font-medium text-emerald-700">
            This application has reached final status: Disbursed.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Status Timeline</h2>
        {historyError ? (
          <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            Could not load history: {historyError.message}
          </p>
        ) : historyRows.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">No timeline events recorded yet.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {historyRows.map((event) => (
              <article key={event.id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-semibold">
                  {event.previous_status ?? "Unknown"} {"->"} {event.new_status}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(event.created_at).toLocaleString()}
                </p>
                {event.note ? <p className="mt-1 text-sm text-slate-700">{event.note}</p> : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

