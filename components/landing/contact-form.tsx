"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "@/app/contact-actions";
import { useI18n } from "@/components/i18n/locale-provider";

const LOAN_VALUES = [
  { value: "Home Loan", key: "home" },
  { value: "Car Loan", key: "car" },
  { value: "Personal Loan", key: "personal" },
  { value: "Business Loan", key: "business" },
  { value: "Not sure yet", key: "unsure" },
] as const;

const initialState: ContactFormState = { ok: false, code: null };

const fieldClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-[#0A2540] outline-none ring-[#00A88E]/30 focus:ring-2";

export function ContactForm() {
  const { t } = useI18n();
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const copy = t.contact;

  return (
    <form action={formAction} className="mt-8 max-w-2xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-[#0A2540]">
            {copy.fullName} <span className="text-rose-600">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            minLength={2}
            maxLength={200}
            autoComplete="name"
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-[#0A2540]">
            {copy.phone} <span className="text-rose-600">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            minLength={8}
            maxLength={40}
            autoComplete="tel"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-[#0A2540]">
          {copy.email} <span className="text-rose-600">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={320}
          autoComplete="email"
          className={fieldClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="loanType" className="text-sm font-medium text-[#0A2540]">
          {copy.loanType} <span className="text-rose-600">*</span>
        </label>
        <select id="loanType" name="loanType" required defaultValue="" className={fieldClass}>
          <option value="" disabled>
            {copy.loanTypePlaceholder}
          </option>
          {LOAN_VALUES.map((option) => (
            <option key={option.value} value={option.value}>
              {copy.loanOptions[option.key]}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium text-[#0A2540]">
          {copy.notes}
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          maxLength={2000}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[#0A2540] outline-none ring-[#00A88E]/30 focus:ring-2"
        />
      </div>

      <div className="hidden" aria-hidden>
        <label htmlFor="companyWebsite">Company website</label>
        <input id="companyWebsite" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.code ? (
        <p
          role="status"
          className={`rounded-lg px-3 py-2 text-sm ${
            state.ok
              ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {copy.messages[state.code]}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-[#00A88E] px-8 text-sm font-semibold text-white transition hover:bg-[#00957D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A88E] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? copy.sending : copy.submit}
      </button>
    </form>
  );
}
