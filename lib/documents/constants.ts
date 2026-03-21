export const DOCUMENTS_BUCKET = "documents";

/** Max upload size per PRD (10 MB) */
export const DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;

export const DOCUMENT_ACCEPT = ".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg";

export const DOCUMENT_TYPE_OPTIONS = [
  { value: "id_proof", label: "ID Proof" },
  { value: "income_proof", label: "Income Proof" },
  { value: "bank_statement", label: "Bank Statement" },
  { value: "property_docs", label: "Property Documents" },
  { value: "business_registration", label: "Business Registration" },
  { value: "other", label: "Other" },
] as const;

export type DocumentStatus = "Uploaded" | "Under Review" | "Approved" | "Re-upload";

/** Required doc types for underwriting checklist (home loan) */
export const REQUIRED_DOCUMENT_TYPES_HOME = [
  "id_proof",
  "income_proof",
  "bank_statement",
  "property_docs",
] as const;

/** Required doc types for underwriting checklist (business loan) */
export const REQUIRED_DOCUMENT_TYPES_BUSINESS = [
  "id_proof",
  "income_proof",
  "bank_statement",
  "business_registration",
] as const;

export function documentTypeLabel(value: string) {
  const found = DOCUMENT_TYPE_OPTIONS.find((o) => o.value === value);
  return found?.label ?? value.replace(/_/g, " ");
}

export function requiredDocumentTypesForLoan(loanType: "home" | "business") {
  return loanType === "home"
    ? REQUIRED_DOCUMENT_TYPES_HOME
    : REQUIRED_DOCUMENT_TYPES_BUSINESS;
}
