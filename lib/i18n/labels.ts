import type { Dictionary } from "@/lib/i18n/dictionaries";

export function loanTypeLabel(t: Dictionary, value: string): string {
  if (value === "home" || value === "business") {
    return t.dashboard.common.loanTypes[value];
  }
  return value;
}

export function appStatusLabel(t: Dictionary, value: string): string {
  const map = t.dashboard.common.appStatus;
  return map[value as keyof typeof map] ?? value;
}

export function docStatusLabel(t: Dictionary, value: string): string {
  const map = t.dashboard.common.docStatus;
  return map[value as keyof typeof map] ?? value;
}

export function docTypeLabel(t: Dictionary, value: string): string {
  const map = t.dashboard.common.docTypes;
  return map[value as keyof typeof map] ?? value.replace(/_/g, " ");
}

export function emiStatusCopy(t: Dictionary, value: string): string {
  const map = t.dashboard.common.emiStatus;
  return map[value as keyof typeof map] ?? value;
}

export function advisoryStatusLabel(t: Dictionary, value: string): string {
  const map = t.dashboard.common.advisoryStatus;
  return map[value as keyof typeof map] ?? value.replace("_", " ");
}

export function advisoryCategoryLabel(t: Dictionary, value: string): string {
  const map = t.dashboard.common.advisoryCategories;
  return map[value as keyof typeof map] ?? value;
}

export function missingFieldLabels(t: Dictionary, keys: Array<keyof typeof t.dashboard.common.fields>): string {
  return keys.map((key) => t.dashboard.common.fields[key]).join(", ");
}
