import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface DocumentRow {
  id: string;
  application_id: string;
  document_type: string;
  file_name: string | null;
  status: string;
  created_at: string;
  version: number;
}

interface ApplicationMeta {
  id: string;
  loan_type: string;
  current_status: string;
}

export default async function MyDocumentsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: apps } = await supabase
    .from("applications")
    .select("id, loan_type, current_status")
    .eq("customer_id", user.id);

  const appList = (apps ?? []) as ApplicationMeta[];
  const appIds = appList.map((a) => a.id);
  const appById = new Map(appList.map((a) => [a.id, a]));

  let documents: DocumentRow[] = [];
  if (appIds.length > 0) {
    const { data: docs, error } = await supabase
      .from("documents")
      .select("id, application_id, document_type, file_name, status, created_at, version")
      .in("application_id", appIds)
      .order("created_at", { ascending: false });

    if (error) {
      return (
        <div className="mx-auto max-w-5xl">
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error.message}
          </p>
        </div>
      );
    }
    documents = (docs ?? []) as DocumentRow[];
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">My Documents</h1>
        <p className="mt-1 text-sm text-slate-600">
          All files uploaded across your applications, newest first.
        </p>
      </div>

      {documents.length === 0 ? (
        <section className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-700">No documents uploaded yet</p>
          <p className="mt-2 text-sm text-slate-600">
            Open an application and upload from the documents section.
          </p>
          <Link
            href="/dashboard/applications"
            className="mt-6 inline-flex rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Go to applications
          </Link>
        </section>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Document
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Application
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Uploaded
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Open
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((d) => {
                const app = appById.get(d.application_id);
                return (
                  <tr key={d.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{d.document_type}</p>
                      {d.file_name ? (
                        <p className="text-xs text-slate-500">{d.file_name}</p>
                      ) : null}
                      <p className="text-xs text-slate-400">v{d.version}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <span className="capitalize">{app?.loan_type ?? "—"}</span>
                      <span className="text-slate-400"> · </span>
                      <span className="text-slate-600">{app?.current_status ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800">
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(d.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/applications/${d.application_id}`}
                        className="font-semibold text-sky-800 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
