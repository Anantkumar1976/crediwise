"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  isMissingColumnOrSchemaCacheError,
  isProfilesRlsRecursionError,
  PROFILE_COLUMNS_SETUP_MESSAGE,
  PROFILE_RLS_RECURSION_MESSAGE,
} from "@/lib/supabase/schema-errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function requireString(formData: FormData, key: string, label: string, min: number): string {
  const raw = formData.get(key);
  if (typeof raw !== "string") {
    throw new Error(`${label} is required.`);
  }
  const v = raw.trim();
  if (v.length < min) {
    throw new Error(`${label} is too short (minimum ${min} characters).`);
  }
  return v;
}

function optionalString(formData: FormData, key: string): string | null {
  const raw = formData.get(key);
  if (typeof raw !== "string") return null;
  const v = raw.trim();
  return v === "" ? null : v;
}

export async function updateCustomerProfile(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?redirect=/dashboard/profile");
  }

  const fullName = requireString(formData, "fullName", "Full name", 2);
  const phone = requireString(formData, "phone", "Phone", 5);
  const address = requireString(formData, "address", "Address", 5);
  const altPhone = optionalString(formData, "altPhone");

  const authEmail = user.email?.trim() ?? "";
  const emailRaw = formData.get("email");
  const emailFromForm = typeof emailRaw === "string" ? emailRaw.trim() : "";

  if (!authEmail && !emailFromForm) {
    throw new Error("Email is required (add an email to your account or enter a contact email below).");
  }

  if (emailFromForm) {
    const basic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basic.test(emailFromForm)) {
      throw new Error("Please enter a valid email address.");
    }
  }

  const profileEmail = emailFromForm || null;

  const { data: existing } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      role: existing?.role ?? "customer",
      full_name: fullName,
      phone,
      alt_phone: altPhone,
      address,
      email: profileEmail,
    },
    { onConflict: "id" }
  );

  if (error) {
    if (isMissingColumnOrSchemaCacheError(error.message)) {
      throw new Error(PROFILE_COLUMNS_SETUP_MESSAGE);
    }
    if (isProfilesRlsRecursionError(error.message)) {
      throw new Error(PROFILE_RLS_RECURSION_MESSAGE);
    }
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard/loans");
}
