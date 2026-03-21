import { formatNullable, getCustomerDisplayName } from "@/lib/admin/customer-profiles";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface ProfileRow {
  id: string;
  role: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  alt_phone: string | null;
  address: string | null;
}

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, role, full_name, email, phone, alt_phone, address")
    .order("full_name", { ascending: true, nullsFirst: false });

  const rows = (profiles ?? []) as ProfileRow[];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">All users</h1>
        <p className="mt-1 text-sm text-slate-600">
          Customer contact details come from each user&apos;s <strong>My Profile</strong> (stored on{" "}
          <code className="rounded bg-slate-100 px-1 text-xs">profiles</code>). Sign-in email may differ
          from the profile email shown here.
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {error ? (
          <div className="p-6">
            <p className="text-sm font-medium text-rose-800">Could not load users: {error.message}</p>
            <p className="mt-2 text-sm text-slate-600">
              If columns are missing, run <code className="rounded bg-slate-100 px-1 text-xs">supabase/sql/profiles_customer_fields.sql</code>{" "}
              and reload the API schema. If RLS blocks reads, ensure staff can select all profiles.
            </p>
          </div>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-slate-600">No profiles found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full border-collapse text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Alt phone
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Address
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Role
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    User ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => {
                  const address = row.address?.trim() ?? "";
                  return (
                    <tr key={row.id} className="align-top hover:bg-slate-50/80">
                      <td className="max-w-[200px] px-4 py-3 font-medium text-slate-900">
                        {getCustomerDisplayName(row)}
                      </td>
                      <td className="max-w-[220px] px-4 py-3 text-slate-800">
                        {formatNullable(row.email)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-800">
                        {formatNullable(row.phone)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-800">
                        {formatNullable(row.alt_phone)}
                      </td>
                      <td className="max-w-[280px] px-4 py-3 text-slate-800">
                        {address ? (
                          <span className="line-clamp-3 break-words" title={address}>
                            {address}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium capitalize text-slate-800">
                          {row.role ?? "—"}
                        </span>
                      </td>
                      <td className="max-w-[140px] px-4 py-3 font-mono text-[11px] leading-snug text-slate-600">
                        {row.id}
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
