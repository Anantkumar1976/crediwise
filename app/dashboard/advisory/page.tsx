import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  ADVISORY_CATEGORY_OPTIONS,
  advisoryRequestBodyText,
} from "@/lib/advisory/constants";
import { submitAdvisoryRequest } from "@/app/dashboard/advisory-actions";

interface AdvisoryRow {
  id: string;
  subject: string;
  body: string | null;
  category: string;
  priority: string;
  status: string;
  staff_response: string | null;
  application_id: string | null;
  created_at: string;
  updated_at: string;
}

interface ApplicationOption {
  id: string;
  loan_type: string;
  current_status: string;
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "open":
      return "bg-amber-100 text-amber-900";
    case "in_progress":
      return "bg-sky-100 text-sky-900";
    case "resolved":
      return "bg-emerald-100 text-emerald-900";
    case "closed":
      return "bg-slate-200 text-slate-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export default async function CustomerAdvisoryPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?redirect=/dashboard/advisory");
  }

  const { data: requestsRaw, error: requestsError } = await supabase
    .from("advisory_requests")
    .select(
      "id, subject, body, message, category, priority, status, staff_response, application_id, created_at, updated_at"
    )
    .or(`customer_id.eq.${user.id},requester_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const requests = (requestsRaw ?? []) as AdvisoryRow[];

  const { data: appsRaw } = await supabase
    .from("applications")
    .select("id, loan_type, current_status")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  const applications = (appsRaw ?? []) as ApplicationOption[];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Advisory</h1>
        <p className="mt-2 text-sm text-slate-600">
          Ask our team a question or flag an issue. We’ll respond here when the request is updated.
        </p>
      </header>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Raise a new request</h2>
        <form action={submitAdvisoryRequest} className="mt-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium text-slate-800">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              required
              minLength={3}
              maxLength={200}
              placeholder="Short summary"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium text-slate-800">
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue="general"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
            >
              {ADVISORY_CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="applicationId" className="text-sm font-medium text-slate-800">
              Related application (optional)
            </label>
            <select
              id="applicationId"
              name="applicationId"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
            >
              <option value="">— None —</option>
              {applications.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.loan_type} · {a.current_status} · {a.id.slice(0, 8)}…
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="body" className="text-sm font-medium text-slate-800">
              Details
            </label>
            <textarea
              id="body"
              name="body"
              required
              minLength={10}
              rows={5}
              placeholder="Describe what you need help with."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-slate-900/10 focus:ring-2"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Submit request
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Your requests</h2>
        {requestsError ? (
          <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            Could not load requests: {requestsError.message}
          </p>
        ) : requests.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">No requests yet.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {requests.map((r) => (
              <li key={r.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{r.subject}</p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadgeClass(
                      r.status
                    )}`}
                  >
                    {r.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {advisoryRequestBodyText(r)}
                </p>
                {r.staff_response ? (
                  <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-950">
                    <p className="font-semibold text-emerald-900">Team response</p>
                    <p className="mt-1 whitespace-pre-wrap">{r.staff_response}</p>
                  </div>
                ) : null}
                <p className="mt-3 text-xs text-slate-500">
                  Submitted {new Date(r.created_at).toLocaleString()}
                  {r.application_id ? (
                    <>
                      {" "}
                      ·{" "}
                      <Link
                        href={`/dashboard/applications/${r.application_id}`}
                        className="font-medium text-slate-700 underline"
                      >
                        Linked application
                      </Link>
                    </>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
