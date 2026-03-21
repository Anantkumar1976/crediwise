import type { SupabaseClient } from "@supabase/supabase-js";

/** Customer-facing profile fields staff can read via `profiles_select_staff`. */
export interface AdminCustomerProfileRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  alt_phone: string | null;
  email: string | null;
  address: string | null;
}

export async function loadCustomerProfilesByIds(
  supabase: SupabaseClient,
  ids: string[]
): Promise<Map<string, AdminCustomerProfileRow>> {
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return new Map();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, alt_phone, email, address")
    .in("id", unique);

  if (error || !data) return new Map();

  const map = new Map<string, AdminCustomerProfileRow>();
  for (const row of data as AdminCustomerProfileRow[]) {
    map.set(row.id, row);
  }
  return map;
}

export function getCustomerDisplayName(profile: AdminCustomerProfileRow | undefined): string {
  const n = profile?.full_name?.trim();
  if (n) return n;
  return "—";
}

export function formatNullable(value: string | null | undefined): string {
  const n = value?.trim();
  return n ? n : "—";
}
