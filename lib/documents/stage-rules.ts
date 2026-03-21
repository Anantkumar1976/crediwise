import type { SupabaseClient } from "@supabase/supabase-js";
import { requiredDocumentTypesForLoan } from "./constants";

/** Match DB + admin RPC normalization (lowercase, single spaces). */
export function normalizeWorkflowStatus(status: string): string {
  return status.trim().toLowerCase().replace(/\s+/g, " ");
}

export interface DocumentStageRuleRow {
  document_type: string;
  is_required: boolean;
  sort_order: number;
}

function fallbackRequiredTypesForTransition(
  loanType: "home" | "business",
  fromNorm: string,
  toNorm: string
): string[] {
  if (fromNorm === "submitted" && toNorm === "verified") {
    return [...requiredDocumentTypesForLoan(loanType)];
  }
  if (fromNorm === "processing" && toNorm === "approved") {
    return [...requiredDocumentTypesForLoan(loanType)];
  }
  return [];
}

/**
 * Required document types for the next workflow transition (from `document_stage_rules`).
 * If the table is empty or missing rows, falls back to legacy hardcoded lists for
 * Submitted→Verified and Processing→Approved so the UI still matches enforcement intent.
 */
export async function getRequiredDocumentTypesForNextTransition(
  supabase: SupabaseClient,
  loanType: "home" | "business",
  currentStatus: string,
  nextStatus: string | null
): Promise<string[]> {
  if (!nextStatus) {
    return [];
  }

  const fromNorm = normalizeWorkflowStatus(currentStatus);
  const toNorm = normalizeWorkflowStatus(nextStatus);

  const { data, error } = await supabase
    .from("document_stage_rules")
    .select("document_type, is_required, sort_order")
    .eq("from_status", fromNorm)
    .eq("to_status", toNorm)
    .eq("is_active", true)
    .or(`loan_type.eq.${loanType},loan_type.eq.all`)
    .order("sort_order", { ascending: true });

  if (error) {
    return fallbackRequiredTypesForTransition(loanType, fromNorm, toNorm);
  }

  const rows = (data ?? []) as DocumentStageRuleRow[];
  const seen = new Set<string>();
  const required: string[] = [];

  for (const row of rows) {
    if (!row.is_required) {
      continue;
    }
    if (seen.has(row.document_type)) {
      continue;
    }
    seen.add(row.document_type);
    required.push(row.document_type);
  }

  if (required.length > 0) {
    return required;
  }

  return fallbackRequiredTypesForTransition(loanType, fromNorm, toNorm);
}
