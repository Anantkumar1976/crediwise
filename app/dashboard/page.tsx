import Link from "next/link";
import {
  isCustomerProfileComplete,
  missingCustomerProfileItems,
} from "@/lib/profile/completion";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardHomePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: applications } = await supabase
    .from("applications")
    .select("id, current_status")
    .eq("customer_id", user.id);

  const rows = applications ?? [];
  const totalApps = rows.length;
  const drafts = rows.filter((r) => r.current_status === "Draft").length;
  const loans = rows.filter((r) =>
    ["Approved", "Disbursed"].includes(r.current_status ?? "")
  ).length;
  const inProgress = rows.filter(
    (r) => r.current_status && !["Draft", "Approved", "Disbursed"].includes(r.current_status)
  ).length;

  let safeDocCount = 0;
  if (rows.length > 0) {
    const { count } = await supabase
      .from("documents")
      .select("id", { count: "exact", head: true })
      .in(
        "application_id",
        rows.map((r) => r.id)
      );
    safeDocCount = count ?? 0;
  }

  const { count: advisoryOpen } = await supabase
    .from("advisory_requests")
    .select("id", { count: "exact", head: true })
    .or(`customer_id.eq.${user.id},requester_id.eq.${user.id}`)
    .in("status", ["open", "in_progress"]);

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, alt_phone, address, email")
    .eq("id", user.id)
    .maybeSingle();

  const profileComplete = isCustomerProfileComplete(profile, user.email);
  const missingProfile = missingCustomerProfileItems(profile, user.email);

  const cards = [
    {
      label: "Applications",
      value: totalApps,
      sub: `${drafts} draft${drafts !== 1 ? "s" : ""}`,
      href: "/dashboard/applications",
      accent: "border-l-sky-500",
    },
    {
      label: "In progress",
      value: inProgress,
      sub: "Submitted → processing",
      href: "/dashboard/applications",
      accent: "border-l-amber-500",
    },
    {
      label: "Active loans",
      value: loans,
      sub: "Approved or disbursed",
      href: "/dashboard/loans",
      accent: "border-l-emerald-500",
    },
    {
      label: "Documents",
      value: safeDocCount,
      sub: "Files uploaded",
      href: "/dashboard/documents",
      accent: "border-l-violet-500",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {!profileComplete ? (
        <div
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-4 text-sm text-amber-950"
          role="alert"
        >
          <p className="font-semibold">Complete your profile to apply for a loan</p>
          <p className="mt-1 text-amber-900">
            Missing: {missingProfile.join(", ")}.
          </p>
          <Link
            href="/dashboard/profile"
            className="mt-3 inline-flex font-semibold text-amber-950 underline underline-offset-2 hover:text-amber-900"
          >
            Go to My Profile →
          </Link>
        </div>
      ) : null}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Overview of your applications, loans, and requests.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md border-l-4 ${c.accent}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{c.label}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{c.value}</p>
            <p className="mt-1 text-sm text-slate-600">{c.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href="/dashboard/applications"
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                Start or continue an application
                <span aria-hidden>→</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/documents"
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                View all uploaded documents
                <span aria-hidden>→</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/advisory"
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                Advisory support
                {advisoryOpen ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
                    {advisoryOpen} open
                  </span>
                ) : (
                  <span aria-hidden>→</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/profile"
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                Account &amp; profile
                <span aria-hidden>→</span>
              </Link>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-sm">
          <h2 className="text-lg font-semibold">Need help?</h2>
          <p className="mt-2 text-sm text-slate-300">
            Send a message to our team — we’ll reply in your advisory thread.
          </p>
          <Link
            href="/dashboard/advisory"
            className="mt-6 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          >
            Open advisory
          </Link>
        </section>
      </div>
    </div>
  );
}
