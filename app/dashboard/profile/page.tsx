import {
  isMissingColumnOrSchemaCacheError,
  PROFILE_COLUMNS_SETUP_MESSAGE,
} from "@/lib/supabase/schema-errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { missingCustomerProfileItems, isCustomerProfileComplete } from "@/lib/profile/completion";
import { updateCustomerProfile } from "@/app/dashboard/profile-actions";
import { signOutAction } from "@/app/dashboard/actions";

export default async function MyProfilePage(props: {
  searchParams?: Promise<{ required?: string }>;
}) {
  const searchParams = (await props.searchParams) ?? {};
  const showRequired = searchParams.required === "1";

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, full_name, phone, alt_phone, address, email")
    .eq("id", user.id)
    .maybeSingle();

  const profileSchemaBroken =
    profileError && isMissingColumnOrSchemaCacheError(profileError.message);

  const complete = profileSchemaBroken
    ? false
    : isCustomerProfileComplete(profile, user.email);
  const missing = profileSchemaBroken
    ? ["Database setup required (see below)"]
    : missingCustomerProfileItems(profile, user.email);

  const defaultEmail = profile?.email?.trim() || user.email?.trim() || "";
  const emailRequired = !user.email?.trim();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">My Profile</h1>
        <p className="mt-1 text-sm text-slate-600">
          Keep your contact details up to date. A complete profile is required before you can start a loan
          application.
        </p>
      </div>

      {profileSchemaBroken ? (
        <div
          className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-950"
          role="alert"
        >
          <p className="font-semibold">Database setup required</p>
          <p className="mt-1 text-rose-900">{PROFILE_COLUMNS_SETUP_MESSAGE}</p>
        </div>
      ) : null}

      {showRequired && !complete && !profileSchemaBroken ? (
        <div
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="alert"
        >
          <p className="font-semibold">Complete your profile first</p>
          <p className="mt-1 text-amber-900">
            Please fill in: {missing.join(", ")}. Then you can create or submit loan applications.
          </p>
        </div>
      ) : null}

      {!profileSchemaBroken && complete ? (
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
          Profile complete — you can apply for loans
        </span>
      ) : null}
      {!profileSchemaBroken && !complete ? (
        <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
          Profile incomplete — finish the form below to apply
        </span>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Contact details</h2>
        <form action={updateCustomerProfile} className="mt-6 space-y-4">
          <fieldset
            disabled={profileSchemaBroken}
            className={`m-0 min-w-0 border-0 p-0 ${profileSchemaBroken ? "space-y-4 opacity-60" : "space-y-4"}`}
          >
            <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-slate-800">
              Full name <span className="text-rose-600">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              required
              minLength={2}
              maxLength={200}
              defaultValue={profile?.full_name ?? ""}
              autoComplete="name"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
            />
            </div>

            <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-800">
              Email <span className="text-rose-600">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required={emailRequired}
              maxLength={320}
              defaultValue={defaultEmail}
              autoComplete="email"
              placeholder={user.email ? user.email : "you@example.com"}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
            />
            {user.email ? (
              <p className="text-xs text-slate-500">
                Your sign-in email is <strong>{user.email}</strong>. You can store a contact email here
                too; at least one is required.
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                No email on your account yet — enter a contact email so we can reach you.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-slate-800">
              Phone <span className="text-rose-600">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              minLength={5}
              maxLength={40}
              defaultValue={profile?.phone ?? ""}
              autoComplete="tel"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="altPhone" className="text-sm font-medium text-slate-800">
              Alt phone
            </label>
            <input
              id="altPhone"
              name="altPhone"
              type="tel"
              maxLength={40}
              defaultValue={profile?.alt_phone ?? ""}
              autoComplete="tel"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
            />
            <p className="text-xs text-slate-500">Optional secondary number.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium text-slate-800">
              Address <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              required
              minLength={5}
              maxLength={2000}
              rows={3}
              defaultValue={profile?.address ?? ""}
              autoComplete="street-address"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-slate-900/10 focus:ring-2"
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save profile
          </button>
          </fieldset>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Account</h2>
        <dl className="mt-4 space-y-4">
          <div>
            <dt className="text-xs font-medium text-slate-500">User ID</dt>
            <dd className="mt-1 font-mono text-xs text-slate-700 break-all">{user.id}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Role</dt>
            <dd className="mt-1 text-sm text-slate-900 capitalize">{profile?.role ?? "customer"}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Session</h2>
        <p className="mt-2 text-sm text-slate-600">
          Sign out on this device when you&apos;re done, especially on a shared computer.
        </p>
        <form action={signOutAction} className="mt-4">
          <button
            type="submit"
            className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Sign out
          </button>
        </form>
      </section>
    </div>
  );
}
