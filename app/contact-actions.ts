"use server";

import type { ContactMessageCode } from "@/lib/i18n/dictionaries";

const LOAN_TYPES = [
  "Home Loan",
  "Car Loan",
  "Personal Loan",
  "Business Loan",
  "Not sure yet",
] as const;

const CONTACT_INBOX = "support@crediwise.co.in";

export interface ContactFormState {
  ok: boolean;
  code: ContactMessageCode | null;
}

function readString(formData: FormData, key: string): string {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (readString(formData, "companyWebsite")) {
    return { ok: true, code: "received" };
  }

  const fullName = readString(formData, "fullName");
  const phone = readString(formData, "phone");
  const email = readString(formData, "email");
  const notes = readString(formData, "notes");
  const loanType = readString(formData, "loanType");

  if (fullName.length < 2 || fullName.length > 200) {
    return { ok: false, code: "invalidName" };
  }
  if (phone.length < 8 || phone.length > 40) {
    return { ok: false, code: "invalidPhone" };
  }
  if (!isValidEmail(email) || email.length > 320) {
    return { ok: false, code: "invalidEmail" };
  }
  if (!LOAN_TYPES.includes(loanType as (typeof LOAN_TYPES)[number])) {
    return { ok: false, code: "invalidLoan" };
  }
  if (notes.length > 2000) {
    return { ok: false, code: "notesTooLong" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    return { ok: false, code: "notConfigured" };
  }

  const text = [
    `New website enquiry`,
    ``,
    `Full name: ${fullName}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Type of loan: ${loanType}`,
    ``,
    `Additional notes:`,
    notes || "(none)",
  ].join("\n");

  const html = `
    <h2>New website enquiry</h2>
    <p><strong>Full name:</strong> ${escapeHtml(fullName)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Type of loan:</strong> ${escapeHtml(loanType)}</p>
    <p><strong>Additional notes:</strong></p>
    <p>${escapeHtml(notes || "(none)").replaceAll("\n", "<br />")}</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [CONTACT_INBOX],
      reply_to: email,
      subject: `Website enquiry: ${loanType} — ${fullName}`,
      text,
      html,
    }),
  });

  if (!response.ok) {
    return { ok: false, code: "sendFailed" };
  }

  return { ok: true, code: "received" };
}
