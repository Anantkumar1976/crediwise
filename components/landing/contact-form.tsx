"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "@/app/contact-actions";

const LOAN_OPTIONS = [
  "Home Loan",
  "Car Loan",
  "Personal Loan",
  "Business Loan",
  "Not sure yet",
] as const;

const initialState: ContactFormState = { ok: false, message: null };

const fieldClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-[#0A2540] outline-none ring-[#00A88E]/30 focus:ring-2";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  return (
    <form action={formAction} className="mt-8 max-w-2xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-[#0A2540]">
            Full name <span className="text-rose-600">*</span>
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
            Phone <span className="text-rose-600">*</span>
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
          Email ID <span className="text-rose-600">*</span>
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
          Type of loan <span className="text-rose-600">*</span>
        </label>
        <select id="loanType" name="loanType" required defaultValue="" className={fieldClass}>
          <option value="" disabled>
            Select type of loan
          </option>
          {LOAN_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium text-[#0A2540]">
          Additional notes
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

      {state.message ? (
        <p
          role="status"
          className={`rounded-lg px-3 py-2 text-sm ${
            state.ok
              ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-[#00A88E] px-8 text-sm font-semibold text-white transition hover:bg-[#00957D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A88E] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
