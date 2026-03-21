"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertCustomerProfileCompleteForLoan } from "@/lib/profile/assert-loan";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createDraftApplication(formData: FormData) {
  const loanTypeValue = formData.get("loanType");
  const loanType =
    loanTypeValue === "home" || loanTypeValue === "business" ? loanTypeValue : null;

  if (!loanType) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?redirect=/dashboard");
  }

  await assertCustomerProfileCompleteForLoan(supabase, user);

  const { error } = await supabase.from("applications").insert({
    customer_id: user.id,
    loan_type: loanType,
    current_status: "Draft",
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}

export async function submitApplication(formData: FormData) {
  const applicationId = formData.get("applicationId");
  if (typeof applicationId !== "string" || !applicationId) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?redirect=/dashboard");
  }

  await assertCustomerProfileCompleteForLoan(supabase, user);

  const { error } = await supabase.rpc("submit_customer_application", {
    p_application_id: applicationId,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

