import {
  isMissingColumnOrSchemaCacheError,
  PROFILE_COLUMNS_SETUP_MESSAGE,
} from "@/lib/supabase/schema-errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { missingCustomerProfileItems, isCustomerProfileComplete } from "@/lib/profile/completion";
import { updateCustomerProfile } from "@/app/dashboard/profile-actions";
import { signOutAction } from "@/app/dashboard/actions";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatMessage } from "@/lib/i18n/format";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";
import { missingFieldLabels } from "@/lib/i18n/labels";

export default async function MyProfilePage(props: {
  searchParams?: Promise<{ required?: string }>;
}) {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const d = t.dashboard;
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

  const profileSchemaBroken = Boolean(
    profileError && isMissingColumnOrSchemaCacheError(profileError.message),
  );

  const complete = profileSchemaBroken
    ? false
    : isCustomerProfileComplete(profile, user.email);
  const missing = profileSchemaBroken
    ? []
    : missingCustomerProfileItems(profile, user.email);

  const defaultEmail = profile?.email?.trim() || user.email?.trim() || "";
  const emailRequired = !user.email?.trim();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{d.profile.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{d.profile.subtitle}</p>
      </div>

      {profileSchemaBroken ? (
        <div
          className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-950"
          role="alert"
        >
          <p className="font-semibold">{d.profile.schemaTitle}</p>
          <p className="mt-1 text-rose-900">{PROFILE_COLUMNS_SETUP_MESSAGE}</p>
        </div>
      ) : null}

      {showRequired && !complete && !profileSchemaBroken ? (
        <div
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="alert"
        >
          <p className="font-semibold">{d.profile.requiredTitle}</p>
          <p className="mt-1 text-amber-900">
            {formatMessage(d.profile.requiredBody, { items: missingFieldLabels(t, missing) })}
          </p>
        </div>
      ) : null}

      {!profileSchemaBroken && complete ? (
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
          {d.profile.completeBadge}
        </span>
      ) : null}
      {!profileSchemaBroken && !complete ? (
        <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
          {d.profile.incompleteBadge}
        </span>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{d.profile.contactDetails}</h2>
        <form action={updateCustomerProfile} className="mt-6 space-y-4">
          <fieldset
            disabled={profileSchemaBroken}
            className={`m-0 min-w-0 border-0 p-0 ${profileSchemaBroken ? "space-y-4 opacity-60" : "space-y-4"}`}
          >
            <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-slate-800">
              {d.common.fields.fullName} <span className="text-rose-600">*</span>
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
              {d.common.fields.email} <span className="text-rose-600">*</span>
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
                {formatMessage(d.profile.signInEmail, { email: user.email })}
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                {d.profile.noAccountEmail}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-slate-800">
              {d.common.fields.phone} <span className="text-rose-600">*</span>
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
              {d.profile.altPhone}
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
            <p className="text-xs text-slate-500">{d.profile.altPhoneHint}</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium text-slate-800">
              {d.common.fields.address} <span className="text-rose-600">*</span>
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
            {d.profile.save}
          </button>
          </fieldset>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{d.profile.account}</h2>
        <dl className="mt-4 space-y-4">
          <div>
            <dt className="text-xs font-medium text-slate-500">{d.profile.userId}</dt>
            <dd className="mt-1 font-mono text-xs text-slate-700 break-all">{user.id}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">{d.profile.role}</dt>
            <dd className="mt-1 text-sm text-slate-900 capitalize">{profile?.role ?? "customer"}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{d.profile.session}</h2>
        <p className="mt-2 text-sm text-slate-600">{d.profile.sessionBody}</p>
        <form action={signOutAction} className="mt-4">
          <button
            type="submit"
            className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            {d.nav.signOut}
          </button>
        </form>
      </section>
    </div>
  );
}
