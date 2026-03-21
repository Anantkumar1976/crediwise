/** PostgREST / Supabase client messages when DB columns or cache are out of sync. */

const MISSING_SCHEMA_PATTERNS =
  /schema cache|Could not find the ['`].*['`] column|column .* does not exist|PGRST204/i;

export function isMissingColumnOrSchemaCacheError(message: string | undefined | null): boolean {
  if (!message) return false;
  return MISSING_SCHEMA_PATTERNS.test(message);
}

export const PROFILE_COLUMNS_SETUP_MESSAGE =
  "Your Supabase project is missing the customer profile columns. In the Supabase SQL Editor, run the script `supabase/sql/profiles_customer_fields.sql` (adds full_name, phone, alt_phone, address, email). Then go to Project Settings → API → Reload schema (or wait ~1 minute).";

export const PROFILE_RLS_RECURSION_MESSAGE =
  'RLS on `profiles` is misconfigured (staff policy caused infinite recursion). In the Supabase SQL Editor, run `supabase/sql/profiles_rls_recursion_hotfix.sql`, then Project Settings → API → Reload schema if needed.';

export function isProfilesRlsRecursionError(message: string | undefined | null): boolean {
  if (!message) return false;
  return /infinite recursion detected in policy.*profiles/i.test(message);
}
