import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { advisoryPriorityLabel, advisoryStatusLabel } from "@/lib/advisory/constants";

const staffRoles = new Set(["advisor", "operations_executive", "super_admin"]);

interface AdvisoryQueueRow {
  id: string;
  customer_id: string | null;
  requester_id: string | null;
  application_id: string | null;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
}

const statusOrder: Record<string, number> = {
  open: 0,
  in_progress: 1,
  resolved: 2,
  closed: 3,
};

export default async function AdminAdvisoryQueuePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?redirect=/admin/advisory");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !staffRoles.has(profile.role)) {
    redirect("/dashboard");
  }

  const { data: raw, error } = await supabase
    .from("advisory_requests")
    .select("id, customer_id, requester_id, application_id, subject, category, priority, status, created_at")
    .order("created_at", { ascending: false });

  const rows = ((raw ?? []) as AdvisoryQueueRow[]).sort((a, b) => {
    const sa = statusOrder[a.status] ?? 9;
    const sb = statusOrder[b.status] ?? 9;
    if (sa !== sb) return sa - sb;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Advisory triage</h1>
        <p className="mt-2 text-sm text-slate-600">
          Customer requests are sorted with <strong>Open</strong> and <strong>In progress</strong> first.
        </p>
      </header>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {error ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            Could not load advisory requests: {error.message}
          </p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-slate-600">No advisory requests yet.</p>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Priority</th>
                  <th className="py-2 pr-3">Subject</th>
                  <th className="py-2 pr-3">Customer</th>
                  <th className="py-2 pr-3">Created</th>
                  <th className="py-2 pr-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="py-3 pr-3 capitalize">{advisoryStatusLabel(row.status)}</td>
                    <td className="py-3 pr-3">{advisoryPriorityLabel(row.priority)}</td>
                    <td className="py-3 pr-3 font-medium text-slate-900">{row.subject}</td>
                    <td className="py-3 pr-3 font-mono text-xs text-slate-600">
                      {row.customer_id ?? row.requester_id ?? "—"}
                    </td>
                    <td className="py-3 pr-3 text-slate-600">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 pr-3">
                      <Link
                        href={`/admin/advisory/${row.id}`}
                        className="inline-flex h-8 items-center justify-center rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-slate-700"
                      >
                        Triage
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
