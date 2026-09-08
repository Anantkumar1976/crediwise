import { LOCALE_TAGS, type Locale } from "@/lib/i18n/config";

export function formatMessage(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}

export function formatDashboardDate(value: string, locale: Locale): string {
  return new Date(value).toLocaleDateString(LOCALE_TAGS[locale], { dateStyle: "medium" });
}

export function formatDashboardDateTime(value: string, locale: Locale): string {
  return new Date(value).toLocaleString(LOCALE_TAGS[locale]);
}
