import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { isCustomerProfileComplete } from "@/lib/profile/completion";

/** Redirects to profile when required fields are missing (loan application flows). */
export async function assertCustomerProfileCompleteForLoan(
  supabase: SupabaseClient,
  user: User
): Promise<void> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, alt_phone, address, email")
    .eq("id", user.id)
    .maybeSingle();

  if (!isCustomerProfileComplete(profile, user.email)) {
    redirect("/dashboard/profile?required=1");
  }
}
