import Link from "next/link";
import {
  getCustomerDisplayName,
  loadCustomerProfilesByIds,
} from "@/lib/admin/customer-profiles";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface AdminApplicationRow {
  id: string;
  customer_id: string;
  loan_type: "home" | "business";
  current_status: string;
  created_at: string;
}

export default async function AdminAllApplicationsPage() {
  const supabase = await createSupabaseServerClient();

  const { data: applications, error } = await supabase
    .from("applications")
    .select("id, customer_id, loan_type, current_status, created_at")
    .order("created_at", { ascending: false });

  const rows = (applications ?? []) as AdminApplicationRow[];
  const customerById = await loadCustomerProfilesByIds(
    supabase,
    rows.map((r) => r.customer_id)
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">All applications</h1>
        <p className="mt-1 text-sm text-slate-600">
          Full queue — open a case to review documents, status, and EMI.
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {error ? (
          <p className="p-6 text-sm text-rose-800">Could not load applications: {error.message}</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-slate-600">No applications yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full border-collapse text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Loan
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Case
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <span className="font-medium capitalize text-slate-900">{row.loan_type}</span>
                      <p className="font-mono text-xs text-slate-500">{row.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                        {row.current_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        {getCustomerDisplayName(customerById.get(row.customer_id))}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-slate-500" title={row.customer_id}>
                        {row.customer_id.slice(0, 8)}…
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/applications/${row.id}`}
                        className="inline-flex rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                      >
                        Open case
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
