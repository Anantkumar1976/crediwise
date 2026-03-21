"use server";

import { revalidatePath } from "next/cache";
import { STAFF_ROLE_SET } from "@/lib/admin/staff";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function ensureStaffAccess() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !STAFF_ROLE_SET.has(profile.role)) {
    throw new Error("Access denied.");
  }

  return { supabase, userId: user.id };
}

export async function adminUpdateApplicationStatus(formData: FormData) {
  const applicationId = formData.get("applicationId");
  const targetStatus = formData.get("targetStatus");

  if (typeof applicationId !== "string" || !applicationId) return;
  if (typeof targetStatus !== "string" || !targetStatus) return;

  const { supabase } = await ensureStaffAccess();

  const { error } = await supabase.rpc("admin_update_application_status", {
    p_application_id: applicationId,
    p_new_status: targetStatus,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath("/dashboard");
}

export async function adminUpdateDocumentStatus(formData: FormData) {
  const documentId = formData.get("documentId");
  const applicationId = formData.get("applicationId");
  const status = formData.get("status");

  if (typeof documentId !== "string" || !documentId) return;
  if (typeof applicationId !== "string" || !applicationId) return;
  if (typeof status !== "string" || !status) return;

  const allowed = new Set(["Uploaded", "Under Review", "Approved", "Re-upload"]);
  if (!allowed.has(status)) {
    throw new Error("Invalid document status.");
  }

  const { supabase } = await ensureStaffAccess();

  const { error } = await supabase.from("documents").update({ status }).eq("id", documentId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath(`/dashboard/applications/${applicationId}`);
}

const emiStatuses = new Set(["scheduled", "paid", "partial", "waived"]);

function parseOptionalMoney(raw: FormDataEntryValue | null): number | null {
  if (raw === null || raw === undefined) return null;
  const s = String(raw).trim();
  if (s === "") return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0) {
    throw new Error("Invalid amount.");
  }
  return Math.round(n * 100) / 100;
}

function parseRequiredMoney(raw: FormDataEntryValue | null): number {
  const n = parseOptionalMoney(raw);
  if (n === null) {
    throw new Error("EMI amount is required.");
  }
  return n;
}

export async function adminInsertEmiRecord(formData: FormData) {
  const applicationId = formData.get("applicationId");
  const installmentRaw = formData.get("installmentNumber");
  const dueDate = formData.get("dueDate");
  const status = formData.get("status");

  if (typeof applicationId !== "string" || !applicationId) return;
  if (typeof dueDate !== "string" || !dueDate) {
    throw new Error("Due date is required.");
  }
  if (typeof installmentRaw !== "string" || !installmentRaw) {
    throw new Error("Installment # is required.");
  }
  const installmentNumber = Number.parseInt(installmentRaw, 10);
  if (!Number.isFinite(installmentNumber) || installmentNumber < 1) {
    throw new Error("Installment # must be a positive integer.");
  }

  const emiAmount = parseRequiredMoney(formData.get("emiAmount"));
  const principalAmount = parseOptionalMoney(formData.get("principalAmount"));
  const interestAmount = parseOptionalMoney(formData.get("interestAmount"));
  const closingBalance = parseOptionalMoney(formData.get("closingBalance"));

  const st = typeof status === "string" && emiStatuses.has(status) ? status : "scheduled";
  const paidDateRaw = formData.get("paidDate");
  const paidDate =
    typeof paidDateRaw === "string" && paidDateRaw.trim() !== "" ? paidDateRaw : null;
  const notesRaw = formData.get("notes");
  const notes = typeof notesRaw === "string" && notesRaw.trim() !== "" ? notesRaw.trim() : null;

  const { supabase } = await ensureStaffAccess();

  const { error } = await supabase.from("emi_records").insert({
    application_id: applicationId,
    installment_number: installmentNumber,
    due_date: dueDate,
    emi_amount: emiAmount,
    principal_amount: principalAmount,
    interest_amount: interestAmount,
    closing_balance: closingBalance,
    status: st,
    paid_date: paidDate,
    notes,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/applications/${applicationId}`);
}

export async function adminUpdateEmiRecord(formData: FormData) {
  const emiId = formData.get("emiId");
  const applicationId = formData.get("applicationId");
  const installmentRaw = formData.get("installmentNumber");
  const dueDate = formData.get("dueDate");
  const status = formData.get("status");

  if (typeof emiId !== "string" || !emiId) return;
  if (typeof applicationId !== "string" || !applicationId) return;
  if (typeof dueDate !== "string" || !dueDate) {
    throw new Error("Due date is required.");
  }
  if (typeof installmentRaw !== "string" || !installmentRaw) {
    throw new Error("Installment # is required.");
  }
  const installmentNumber = Number.parseInt(installmentRaw, 10);
  if (!Number.isFinite(installmentNumber) || installmentNumber < 1) {
    throw new Error("Installment # must be a positive integer.");
  }

  const emiAmount = parseRequiredMoney(formData.get("emiAmount"));
  const principalAmount = parseOptionalMoney(formData.get("principalAmount"));
  const interestAmount = parseOptionalMoney(formData.get("interestAmount"));
  const closingBalance = parseOptionalMoney(formData.get("closingBalance"));

  const st = typeof status === "string" && emiStatuses.has(status) ? status : "scheduled";
  const paidDateRaw = formData.get("paidDate");
  const paidDate =
    typeof paidDateRaw === "string" && paidDateRaw.trim() !== "" ? paidDateRaw : null;
  const notesRaw = formData.get("notes");
  const notes = typeof notesRaw === "string" && notesRaw.trim() !== "" ? notesRaw.trim() : null;

  const { supabase } = await ensureStaffAccess();

  const { error } = await supabase
    .from("emi_records")
    .update({
      installment_number: installmentNumber,
      due_date: dueDate,
      emi_amount: emiAmount,
      principal_amount: principalAmount,
      interest_amount: interestAmount,
      closing_balance: closingBalance,
      status: st,
      paid_date: paidDate,
      notes,
    })
    .eq("id", emiId)
    .eq("application_id", applicationId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/applications/${applicationId}`);
}

export async function adminDuplicateEmiRecord(formData: FormData) {
  const sourceEmiId = formData.get("sourceEmiId");
  const applicationId = formData.get("applicationId");

  if (typeof sourceEmiId !== "string" || !sourceEmiId) return;
  if (typeof applicationId !== "string" || !applicationId) return;

  const { supabase } = await ensureStaffAccess();

  const { data: source, error: fetchError } = await supabase
    .from("emi_records")
    .select(
      "due_date, emi_amount, principal_amount, interest_amount, closing_balance, status, notes"
    )
    .eq("id", sourceEmiId)
    .eq("application_id", applicationId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }
  if (!source) {
    throw new Error("EMI row not found.");
  }

  const st =
    typeof source.status === "string" && emiStatuses.has(source.status)
      ? source.status
      : "scheduled";

  const { data: maxRow, error: maxError } = await supabase
    .from("emi_records")
    .select("installment_number")
    .eq("application_id", applicationId)
    .order("installment_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (maxError) {
    throw new Error(maxError.message);
  }

  const nextInstallment = (maxRow?.installment_number ?? 0) + 1;

  const { error: insertError } = await supabase.from("emi_records").insert({
    application_id: applicationId,
    installment_number: nextInstallment,
    due_date: source.due_date,
    emi_amount: source.emi_amount,
    principal_amount: source.principal_amount,
    interest_amount: source.interest_amount,
    closing_balance: source.closing_balance,
    status: st,
    paid_date: null,
    notes: source.notes,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/applications/${applicationId}`);
}

export async function adminDeleteEmiRecord(formData: FormData) {
  const emiId = formData.get("emiId");
  const applicationId = formData.get("applicationId");

  if (typeof emiId !== "string" || !emiId) return;
  if (typeof applicationId !== "string" || !applicationId) return;

  const { supabase } = await ensureStaffAccess();

  const { error } = await supabase
    .from("emi_records")
    .delete()
    .eq("id", emiId)
    .eq("application_id", applicationId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/applications/${applicationId}`);
}

const advisoryStatuses = new Set(["open", "in_progress", "resolved", "closed"]);
const advisoryPriorities = new Set(["low", "normal", "high", "urgent"]);

export async function adminUpdateAdvisoryRequest(formData: FormData) {
  const requestId = formData.get("requestId");
  const statusRaw = formData.get("status");
  const priorityRaw = formData.get("priority");
  const staffResponseRaw = formData.get("staffResponse");

  if (typeof requestId !== "string" || !requestId) return;
  if (typeof statusRaw !== "string" || !advisoryStatuses.has(statusRaw)) {
    throw new Error("Invalid status.");
  }
  if (typeof priorityRaw !== "string" || !advisoryPriorities.has(priorityRaw)) {
    throw new Error("Invalid priority.");
  }
  const staffResponse = typeof staffResponseRaw === "string" ? staffResponseRaw : "";

  const { supabase, userId } = await ensureStaffAccess();

  const updates: {
    status: string;
    priority: string;
    staff_response: string | null;
    resolved_at: string | null;
    resolved_by: string | null;
  } = {
    status: statusRaw,
    priority: priorityRaw,
    staff_response: staffResponse.trim() === "" ? null : staffResponse.trim(),
    resolved_at: null,
    resolved_by: null,
  };

  if (statusRaw === "resolved" || statusRaw === "closed") {
    updates.resolved_at = new Date().toISOString();
    updates.resolved_by = userId;
  }

  const { error } = await supabase.from("advisory_requests").update(updates).eq("id", requestId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/advisory");
  revalidatePath(`/admin/advisory/${requestId}`);
  revalidatePath("/dashboard/advisory");
}

