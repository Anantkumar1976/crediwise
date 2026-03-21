/** Customer profile fields stored in `public.profiles` (+ auth email). */

export interface CustomerProfileFields {
  full_name: string | null;
  phone: string | null;
  alt_phone: string | null;
  address: string | null;
  /** Contact email on profile (optional if auth email exists). */
  email: string | null;
}

const MIN_NAME = 2;
const MIN_PHONE = 5;
const MIN_ADDRESS = 5;

/**
 * Loan flows require: full name, phone, address, and at least one email
 * (Supabase Auth email or profile email). Alt phone is optional.
 */
export function isCustomerProfileComplete(
  profile: CustomerProfileFields | null,
  authEmail: string | null | undefined
): boolean {
  const name = profile?.full_name?.trim() ?? "";
  const phone = profile?.phone?.trim() ?? "";
  const address = profile?.address?.trim() ?? "";
  const profileEmail = profile?.email?.trim() ?? "";
  const fromAuth = authEmail?.trim() ?? "";

  const emailOk = Boolean(fromAuth || profileEmail);

  return (
    name.length >= MIN_NAME &&
    phone.length >= MIN_PHONE &&
    address.length >= MIN_ADDRESS &&
    emailOk
  );
}

/** Human-readable list of missing requirements (for UI). */
export function missingCustomerProfileItems(
  profile: CustomerProfileFields | null,
  authEmail: string | null | undefined
): string[] {
  const missing: string[] = [];
  const name = profile?.full_name?.trim() ?? "";
  const phone = profile?.phone?.trim() ?? "";
  const address = profile?.address?.trim() ?? "";
  const profileEmail = profile?.email?.trim() ?? "";
  const fromAuth = authEmail?.trim() ?? "";

  if (name.length < MIN_NAME) missing.push("Full name");
  if (!fromAuth && !profileEmail) missing.push("Email");
  if (phone.length < MIN_PHONE) missing.push("Phone");
  if (address.length < MIN_ADDRESS) missing.push("Address");
  return missing;
}
