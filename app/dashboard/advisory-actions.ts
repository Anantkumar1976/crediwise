"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ADVISORY_DEFAULT_NEW_STATUS } from "@/lib/advisory/constants";

const categories = new Set(["general", "loan", "documents", "payments", "other"]);

export async function submitAdvisoryRequest(formData: FormData) {
  const subject = formData.get("subject");
  const body = formData.get("body");
  const categoryRaw = formData.get("category");
  const applicationIdRaw = formData.get("applicationId");

  if (typeof subject !== "string" || subject.trim().length < 3) {
    throw new Error("Subject must be at least 3 characters.");
  }
  if (typeof body !== "string" || body.trim().length < 10) {
    throw new Error("Please describe your request in at least 10 characters.");
  }

  const category =
    typeof categoryRaw === "string" && categories.has(categoryRaw) ? categoryRaw : "general";

  const applicationId =
    typeof applicationIdRaw === "string" && applicationIdRaw.trim() !== ""
      ? applicationIdRaw.trim()
      : null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?redirect=/dashboard/advisory");
  }

  // Some DBs use requester_id; our schema uses customer_id — set both so either naming works.
  const { error } = await supabase.from("advisory_requests").insert({
    customer_id: user.id,
    requester_id: user.id,
    application_id: applicationId,
    subject: subject.trim(),
    body: body.trim(),
    // Legacy column name in some DBs (same text as body)
    message: body.trim(),
    category,
    // Legacy / alternate column name in some DBs (must match category values)
    request_type: category,
    // Some DBs have NOT NULL without a default — match advisory_requests.sql
    priority: "normal",
    status: ADVISORY_DEFAULT_NEW_STATUS,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/advisory");
}
