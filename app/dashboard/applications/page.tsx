import Link from "next/link";
import { createDraftApplication, submitApplication } from "@/app/dashboard/actions";
import {
  isCustomerProfileComplete,
  missingCustomerProfileItems,
} from "@/lib/profile/completion";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface ApplicationRow {
  id: string;
  loan_type: "home" | "business";
  current_status: "Draft" | "Submitted" | "Verified" | "Processing" | "Approved" | "Disbursed";
  created_at: string;
}

export default async function MyApplicationsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: applications, error: applicationsError } = await supabase
    .from("applications")
    .select("id, loan_type, current_status, created_at")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, alt_phone, address, email")
    .eq("id", user.id)
    .maybeSingle();

  const profileComplete = isCustomerProfileComplete(profile, user.email);
  const missingProfile = missingCustomerProfileItems(profile, user.email);

  const dataLoadError = applicationsError?.message ?? null;
  const applicationRows = (applications ?? []) as ApplicationRow[];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {!profileComplete ? (
        <div
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-4 text-sm text-amber-950"
          role="alert"
        >
          <p className="font-semibold">Complete your profile before applying for a loan</p>
          <p className="mt-1 text-amber-900">Missing: {missingProfile.join(", ")}.</p>
          <Link
            href="/dashboard/profile"
            className="mt-3 inline-flex font-semibold text-amber-950 underline underline-offset-2 hover:text-amber-900"
          >
            Go to My Profile →
          </Link>
        </div>
      ) : null}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">My Applications</h1>
        <p className="mt-1 text-sm text-slate-600">
          Create drafts, complete your details, and submit when you&apos;re ready.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Start a new application</h2>
        <p className="mt-2 text-sm text-slate-600">
          Choose a loan type to open a draft. You can submit from the application page when the status
          is Draft.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <form action={createDraftApplication}>
            <input type="hidden" name="loanType" value="home" />
            <button
              type="submit"
              disabled={!profileComplete}
              aria-disabled={!profileComplete}
              title={
                profileComplete ? undefined : "Complete My Profile before starting an application"
              }
              className={`inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold shadow-sm ${
                profileComplete
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "cursor-not-allowed bg-slate-300 text-slate-600"
              }`}
            >
              New home loan
            </button>
          </form>
          <form action={createDraftApplication}>
            <input type="hidden" name="loanType" value="business" />
            <button
              type="submit"
              disabled={!profileComplete}
              aria-disabled={!profileComplete}
              title={
                profileComplete ? undefined : "Complete My Profile before starting an application"
              }
              className={`inline-flex h-11 items-center justify-center rounded-lg border px-5 text-sm font-semibold shadow-sm ${
                profileComplete
                  ? "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                  : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
              }`}
            >
              New business loan
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Your applications</h2>

        {dataLoadError ? (
          <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            We could not load applications: {dataLoadError}
          </p>
        ) : null}

        {applicationRows.length === 0 ? (
          <p className="mt-5 text-sm text-slate-600">No applications yet. Create a draft above.</p>
        ) : (
          <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Loan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {applicationRows.map((application) => {
                  const isDraft = application.current_status === "Draft";
                  return (
                    <tr key={application.id}>
                      <td className="px-4 py-4">
                        <p className="font-medium capitalize text-slate-900">{application.loan_type}</p>
                        <p className="text-xs text-slate-500">ID {application.id.slice(0, 8)}…</p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            isDraft
                              ? "bg-amber-100 text-amber-900"
                              : application.current_status === "Approved" ||
                                  application.current_status === "Disbursed"
                                ? "bg-emerald-100 text-emerald-900"
                                : "bg-sky-100 text-sky-900"
                          }`}
                        >
                          {application.current_status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {new Date(application.created_at).toLocaleDateString(undefined, {
                          dateStyle: "medium",
                        })}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/applications/${application.id}`}
                            className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                          >
                            Open
                          </Link>
                          {isDraft ? (
                            <form action={submitApplication} className="inline">
                              <input type="hidden" name="applicationId" value={application.id} />
                              <button
                                type="submit"
                                disabled={!profileComplete}
                                aria-disabled={!profileComplete}
                                title={
                                  profileComplete
                                    ? undefined
                                    : "Complete My Profile before submitting"
                                }
                                className={`inline-flex h-9 items-center rounded-lg px-3 text-xs font-semibold ${
                                  profileComplete
                                    ? "bg-slate-900 text-white hover:bg-slate-800"
                                    : "cursor-not-allowed bg-slate-300 text-slate-600"
                                }`}
                              >
                                Submit
                              </button>
                            </form>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
