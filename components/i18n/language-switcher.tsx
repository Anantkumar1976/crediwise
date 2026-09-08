"use client";

import { LOCALES, LOCALE_LABELS } from "@/lib/i18n/config";
import { useI18n } from "@/components/i18n/locale-provider";

const SHORT_LABELS = {
  en: "EN",
  hi: "हिं",
  mr: "मरा",
} as const;

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, t, isPending } = useI18n();

  return (
    <div
      className={`inline-flex h-9 shrink-0 items-center rounded-lg border border-slate-200 bg-white p-0.5 ${className}`.trim()}
      role="group"
      aria-label={t.language.label}
    >
      {LOCALES.map((code) => {
        const selected = code === locale;
        return (
          <button
            key={code}
            type="button"
            disabled={isPending}
            aria-pressed={selected}
            title={LOCALE_LABELS[code]}
            onClick={() => setLocale(code)}
            className={`h-8 rounded-md px-2 text-xs font-semibold transition disabled:opacity-60 ${
              selected ? "bg-[#0A2540] text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {SHORT_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
