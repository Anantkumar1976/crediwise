"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertCustomerProfileCompleteForLoan } from "@/lib/profile/assert-loan";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function toNumberOrNull(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function toYearOrNull(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function occupationFromForm(value: FormDataEntryValue | null): "service" | "business" | null {
  if (value !== "service" && value !== "business") return null;
  return value;
}

export async function saveApplicationDetails(formData: FormData) {
  const applicationId = formData.get("applicationId");
  const intent = formData.get("intent");

  if (typeof applicationId !== "string" || !applicationId) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/sign-in?redirect=/dashboard/applications/${applicationId}`);
  }

  const { data: application, error: applicationError } = await supabase
    .from("applications")
    .select("id, customer_id, loan_type, current_status")
    .eq("id", applicationId)
    .eq("customer_id", user.id)
    .single();

  if (applicationError || !application) {
    throw new Error(applicationError?.message ?? "Application not found.");
  }

  if (application.loan_type === "home") {
    const { error } = await supabase.from("home_loan_details").upsert(
      {
        application_id: applicationId,
        property_address: formData.get("propertyAddress")?.toString() || null,
        property_value: toNumberOrNull(formData.get("propertyValue")),
        down_payment: toNumberOrNull(formData.get("downPayment")),
        loan_amount: toNumberOrNull(formData.get("loanAmount")),
        applicant_count: toNumberOrNull(formData.get("applicantCount")),
        occupation: occupationFromForm(formData.get("occupation")),
        annual_salary_or_revenue: toNumberOrNull(formData.get("annualSalaryOrRevenue")),
      },
      { onConflict: "application_id" }
    );

    if (error) {
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase.from("business_loan_details").upsert(
      {
        application_id: applicationId,
        business_name: formData.get("businessName")?.toString() || null,
        purpose: formData.get("purpose")?.toString() || null,
        working_capital: toNumberOrNull(formData.get("workingCapital")),
        loan_amount: toNumberOrNull(formData.get("loanAmount")),
        year_of_incorporation: toYearOrNull(formData.get("yearOfIncorporation")),
        annual_business_revenue: toNumberOrNull(formData.get("annualBusinessRevenue")),
      },
      { onConflict: "application_id" }
    );

    if (error) {
      throw new Error(error.message);
    }
  }

  if (intent === "submit" && application.current_status === "Draft") {
    await assertCustomerProfileCompleteForLoan(supabase, user);

    const { error: submitError } = await supabase.rpc("submit_customer_application", {
      p_application_id: applicationId,
    });

    if (submitError) {
      throw new Error(submitError.message);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/applications/${applicationId}`);
}

