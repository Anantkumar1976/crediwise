export const ADVISORY_STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
] as const;

/** New customer inserts — must match `advisory_requests_status_check` in DB after migration. */
export const ADVISORY_DEFAULT_NEW_STATUS = ADVISORY_STATUS_OPTIONS[0].value;

export const ADVISORY_PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
] as const;

export const ADVISORY_CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "loan", label: "Loan / application" },
  { value: "documents", label: "Documents" },
  { value: "payments", label: "Payments / EMI" },
  { value: "other", label: "Other" },
] as const;

export function advisoryStatusLabel(value: string) {
  return ADVISORY_STATUS_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function advisoryPriorityLabel(value: string) {
  return ADVISORY_PRIORITY_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function advisoryCategoryLabel(value: string) {
  return ADVISORY_CATEGORY_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

/** Prefer `body`; fall back to legacy `message` when present in older rows. */
export function advisoryRequestBodyText(row: {
  body?: string | null;
  message?: string | null;
}): string {
  const t = row.body ?? row.message;
  return typeof t === "string" ? t : "";
}
