import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { adminUpdateAdvisoryRequest } from "@/app/admin/actions";
import {
  ADVISORY_PRIORITY_OPTIONS,
  ADVISORY_STATUS_OPTIONS,
  advisoryCategoryLabel,
  advisoryPriorityLabel,
  advisoryRequestBodyText,
  advisoryStatusLabel,
} from "@/lib/advisory/constants";

const staffRoles = new Set(["advisor", "operations_executive", "super_admin"]);

interface AdvisoryDetail {
  id: string;
  customer_id: string | null;
  requester_id: string | null;
  application_id: string | null;
  subject: string;
  body: string | null;
  message?: string | null;
  category: string;
  priority: string;
  status: string;
  staff_response: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
}

export default async function AdminAdvisoryDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const requestId = params.id;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/sign-in?redirect=/admin/advisory/${requestId}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !staffRoles.has(profile.role)) {
    redirect("/dashboard");
  }

  const { data: row, error } = await supabase
    .from("advisory_requests")
    .select(
      "id, customer_id, requester_id, application_id, subject, body, message, category, priority, status, staff_response, resolved_at, resolved_by, created_at, updated_at"
    )
    .eq("id", requestId)
    .maybeSingle();

  if (error || !row) {
    return (
      <div className="mx-auto max-w-4xl">
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error?.message ?? "Request not found."}
        </p>
        <Link href="/admin/advisory" className="mt-4 inline-flex text-sm font-semibold text-sky-800 hover:underline">
          ← Back to advisory queue
        </Link>
      </div>
    );
  }

  const req = row as AdvisoryDetail;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Link href="/admin/advisory" className="text-sm font-semibold text-sky-800 hover:underline">
          ← Back to advisory queue
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Triage request</h1>
        <p className="mt-2 text-xs text-slate-500">
          Request ID: {req.id} · Customer:{" "}
          <span className="font-mono">{req.customer_id ?? req.requester_id}</span>
        </p>
      </header>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{req.subject}</h2>
        <p className="mt-2 text-sm text-slate-600">
          Category: {advisoryCategoryLabel(req.category)} · Created:{" "}
          {new Date(req.created_at).toLocaleString()}
        </p>
        {req.application_id ? (
          <p className="mt-2 text-sm">
            <Link
              href={`/admin/applications/${req.application_id}`}
              className="font-medium text-sky-800 underline"
            >
              Open linked application
            </Link>
          </p>
        ) : null}
        <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">Customer message</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
            {advisoryRequestBodyText(req)}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Update & resolve</h2>
        <p className="mt-2 text-sm text-slate-600">
          Set status and priority, add a response the customer can read on their dashboard.
        </p>
        <form action={adminUpdateAdvisoryRequest} className="mt-4 space-y-4">
          <input type="hidden" name="requestId" value={req.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={req.status}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
              >
                {ADVISORY_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                defaultValue={req.priority}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
              >
                {ADVISORY_PRIORITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="staffResponse" className="text-sm font-medium">
              Response to customer (optional)
            </label>
            <textarea
              id="staffResponse"
              name="staffResponse"
              rows={5}
              defaultValue={req.staff_response ?? ""}
              placeholder="Visible on the customer advisory page when saved."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Save update
          </button>
        </form>
        <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <p>
            Current: {advisoryStatusLabel(req.status)} · Priority {advisoryPriorityLabel(req.priority)}
          </p>
          {req.resolved_at ? (
            <p className="mt-1">
              Last resolved: {new Date(req.resolved_at).toLocaleString()}
              {req.resolved_by ? (
                <>
                  {" "}
                  · By <span className="font-mono">{req.resolved_by}</span>
                </>
              ) : null}
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
