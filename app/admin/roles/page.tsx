import Link from "next/link";

export default function AdminRolesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">All roles</h1>
        <p className="mt-1 text-sm text-slate-600">
          Role management UI (assign roles, permissions) will live here.
        </p>
      </div>

      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-500">Coming soon</p>
        <p className="mt-2 text-sm text-slate-600">
          Planned: view role definitions, map permissions, and assign roles to users (likely{" "}
          <strong>super_admin</strong> only).
        </p>
        <p className="mt-4 text-xs text-slate-500">
          Current app roles: <code className="rounded bg-slate-100 px-1">customer</code>,{" "}
          <code className="rounded bg-slate-100 px-1">advisor</code>,{" "}
          <code className="rounded bg-slate-100 px-1">operations_executive</code>,{" "}
          <code className="rounded bg-slate-100 px-1">super_admin</code>.
        </p>
        <Link
          href="/admin/users"
          className="mt-8 inline-flex text-sm font-semibold text-sky-800 hover:underline"
        >
          View all users →
        </Link>
      </section>
    </div>
  );
}
