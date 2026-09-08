export const EMI_STATUS_OPTIONS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "paid", label: "Paid" },
  { value: "partial", label: "Partial" },
  { value: "waived", label: "Waived" },
] as const;

export type EmiRecordStatus = (typeof EMI_STATUS_OPTIONS)[number]["value"];

export function emiStatusLabel(value: string) {
  const found = EMI_STATUS_OPTIONS.find((o) => o.value === value);
  return found?.label ?? value;
}

export function formatMoneyInr(
  amount: number | null | undefined,
  localeTag = "en-IN",
) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return "—";
  }
  return new Intl.NumberFormat(localeTag, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}
