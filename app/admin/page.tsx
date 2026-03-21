import Link from "next/link";
import {
  getCustomerDisplayName,
  loadCustomerProfilesByIds,
} from "@/lib/admin/customer-profiles";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const STATUSES = [
  "Draft",
  "Submitted",
  "Verified",
  "Processing",
  "Approved",
  "Disbursed",
] as const;

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const { data: applications, error: appsError } = await supabase
    .from("applications")
    .select("id, customer_id, loan_type, current_status, created_at")
    .order("created_at", { ascending: false });

  const rows = applications ?? [];
  const byStatus: Record<string, number> = {};
  for (const s of STATUSES) byStatus[s] = 0;
  for (const a of rows) {
    const st = a.current_status ?? "";
    byStatus[st] = (byStatus[st] ?? 0) + 1;
  }

  const { count: profileCount, error: profilesError } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  const { count: advisoryQueue, error: advisoryCountError } = await supabase
    .from("advisory_requests")
    .select("id", { count: "exact", head: true })
    .in("status", ["open", "in_progress"]);

  const recent = rows.slice(0, 6);
  const recentCustomerIds = recent.map((r) => r.customer_id as string);
  const recentCustomers = await loadCustomerProfilesByIds(supabase, recentCustomerIds);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Operations dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Snapshot of applications, users, and advisory workload.
        </p>
      </div>

      {appsError ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          Could not load applications: {appsError.message}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/admin/applications"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Applications</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{rows.length}</p>
          <p className="mt-1 text-sm text-slate-600">Total in system</p>
        </Link>
        <Link
          href="/admin/users"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Users</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">
            {profilesError ? "—" : (profileCount ?? 0)}
          </p>
          <p className="mt-1 text-sm text-slate-600">Profiles</p>
        </Link>
        <Link
          href="/admin/advisory"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Advisory queue</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">
            {advisoryCountError ? "—" : (advisoryQueue ?? 0)}
          </p>
          <p className="mt-1 text-sm text-slate-600">Open + in progress</p>
        </Link>
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Quick link</p>
          <p className="mt-3 text-sm text-slate-200">Jump to full queues or triage advisory.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/admin/applications"
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-slate-100"
            >
              All applications
            </Link>
            <Link
              href="/admin/advisory"
              className="rounded-lg border border-slate-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Advisory
            </Link>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">By status</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-800"
            >
              {s}
              <span className="tabular-nums text-slate-600">{byStatus[s] ?? 0}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent applications</h2>
          <Link href="/admin/applications" className="text-sm font-semibold text-sky-800 hover:underline">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="p-6 text-sm text-slate-600">No applications yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase text-slate-500">
                  <th className="px-4 py-3 font-semibold">Loan</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 text-right font-semibold">Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 capitalize text-slate-900">{row.loan_type}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium">
                        {row.current_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        {getCustomerDisplayName(recentCustomers.get(row.customer_id))}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-slate-500" title={row.customer_id}>
                        {String(row.customer_id).slice(0, 8)}…
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/applications/${row.id}`}
                        className="font-semibold text-sky-800 hover:underline"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
