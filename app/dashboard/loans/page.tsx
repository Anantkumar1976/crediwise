import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatMessage } from "@/lib/i18n/format";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";
import { appStatusLabel, loanTypeLabel } from "@/lib/i18n/labels";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface LoanRow {
  id: string;
  loan_type: "home" | "business";
  current_status: "Approved" | "Disbursed";
  created_at: string;
}

export default async function MyLoansPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const d = t.dashboard;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: raw, error } = await supabase
    .from("applications")
    .select("id, loan_type, current_status, created_at")
    .eq("customer_id", user.id)
    .in("current_status", ["Approved", "Disbursed"])
    .order("created_at", { ascending: false });

  const rows = (raw ?? []) as LoanRow[];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{d.loans.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{d.loans.subtitle}</p>
      </div>

      {error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error.message}
        </p>
      ) : null}

      {rows.length === 0 ? (
        <section className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-700">{d.loans.emptyTitle}</p>
          <p className="mt-2 text-sm text-slate-600">{d.loans.emptyBody}</p>
          <Link
            href="/dashboard/applications"
            className="mt-6 inline-flex rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {d.loans.viewApplications}
          </Link>
        </section>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {rows.map((row) => (
            <article
              key={row.id}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {formatMessage(d.loans.loanLabel, { type: loanTypeLabel(t, row.loan_type) })}
                  </p>
                  <p className="mt-1 font-mono text-xs text-slate-500">{row.id}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    row.current_status === "Disbursed"
                      ? "bg-violet-100 text-violet-900"
                      : "bg-emerald-100 text-emerald-900"
                  }`}
                >
                  {appStatusLabel(t, row.current_status)}
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-600">{d.loans.cardBody}</p>
              <Link
                href={`/dashboard/applications/${row.id}`}
                className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {d.loans.viewLoan}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
