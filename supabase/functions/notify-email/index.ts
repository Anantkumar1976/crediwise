import { sendViaResend } from "../_shared/email.ts";
import { getAuthEmailForUser, getServiceClient } from "../_shared/supabase-admin.ts";
import { escapeHtml, layout, loanLabel } from "../_shared/templates.ts";

/** Supabase Database Webhook payload (see docs/email-notifications.md). */
interface DbWebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: Record<string, unknown> | null;
  old_record: Record<string, unknown> | null;
}

function norm(s: unknown): string {
  return String(s ?? "")
    .trim()
    .toLowerCase();
}

function appUrl(): string {
  return (Deno.env.get("APP_PUBLIC_URL") ?? "https://example.com").replace(/\/$/, "");
}

function verifySecret(req: Request): boolean {
  const expected = Deno.env.get("NOTIFY_WEBHOOK_SECRET");
  if (!expected) {
    console.warn("NOTIFY_WEBHOOK_SECRET not set — webhook verification skipped (dev only)");
    return true;
  }
  const header = req.headers.get("x-webhook-secret") ?? req.headers.get("X-Webhook-Secret");
  if (header === expected) return true;
  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${expected}`) return true;
  return false;
}

Deno.serve(async (req) => {
  if (req.method === "GET") {
    return new Response(JSON.stringify({ ok: true, service: "notify-email" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!verifySecret(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  let payload: DbWebhookPayload;
  try {
    payload = (await req.json()) as DbWebhookPayload;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const base = appUrl();

  try {
    if (payload.schema !== "public" || !payload.table) {
      return jsonOk({ skipped: "unsupported schema/table" });
    }

    if (payload.table === "applications" && payload.type === "UPDATE") {
      return await handleApplicationsUpdate(payload, base);
    }

    if (payload.table === "documents" && payload.type === "UPDATE") {
      return await handleDocumentsUpdate(payload, base);
    }

    if (payload.table === "advisory_requests" && payload.type === "INSERT") {
      return await handleAdvisoryInsert(payload, base);
    }

    return jsonOk({ skipped: "no handler for event", table: payload.table, type: payload.type });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("notify-email error:", msg);
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
});

function jsonOk(body: Record<string, unknown>) {
  return new Response(JSON.stringify({ ok: true, ...body }), {
    headers: { "Content-Type": "application/json" },
  });
}

async function handleApplicationsUpdate(
  payload: DbWebhookPayload,
  base: string
): Promise<Response> {
  const rec = payload.record;
  const old = payload.old_record;
  if (!rec || !old) return jsonOk({ skipped: "missing record" });

  const customerId = String(rec.customer_id ?? "");
  if (!customerId) return jsonOk({ skipped: "no customer_id" });

  const prev = norm(old.current_status);
  const next = norm(rec.current_status);

  if (prev === "draft" && next === "submitted") {
    const email = await getAuthEmailForUser(customerId);
    if (!email) return jsonOk({ skipped: "no customer email" });

    const loan = String(rec.loan_type ?? "");
    const id = String(rec.id ?? "");
    const subject = "Your loan application was submitted";
    const html = layout(
      subject,
      `<p>We received your <strong>${escapeHtml(loanLabel(loan))}</strong> application.</p>
       <p>We’ll review it and update you here as the status changes.</p>
       <p style="margin-top:16px;"><a href="${escapeHtml(
         `${base}/dashboard/applications/${id}`
       )}" style="color:#0ea5e9;">View application</a></p>`,
      base
    );
    const r = await sendViaResend({ to: email, subject, html });
    if (!r.ok) return new Response(JSON.stringify({ ok: false, error: r.error }), { status: 500 });
    return jsonOk({ sent: "application_submitted" });
  }

  if (prev !== "approved" && next === "approved") {
    const email = await getAuthEmailForUser(customerId);
    if (!email) return jsonOk({ skipped: "no customer email" });

    const loan = String(rec.loan_type ?? "");
    const id = String(rec.id ?? "");
    const subject = "Your loan application was approved";
    const html = layout(
      subject,
      `<p>Good news — your <strong>${escapeHtml(loanLabel(loan))}</strong> application is <strong>approved</strong>.</p>
       <p>Next steps will appear in your dashboard.</p>
       <p style="margin-top:16px;"><a href="${escapeHtml(
         `${base}/dashboard/applications/${id}`
       )}" style="color:#0ea5e9;">Open application</a></p>`,
      base
    );
    const r = await sendViaResend({ to: email, subject, html });
    if (!r.ok) return new Response(JSON.stringify({ ok: false, error: r.error }), { status: 500 });
    return jsonOk({ sent: "application_approved" });
  }

  if (prev !== "disbursed" && next === "disbursed") {
    const email = await getAuthEmailForUser(customerId);
    if (!email) return jsonOk({ skipped: "no customer email" });

    const loan = String(rec.loan_type ?? "");
    const id = String(rec.id ?? "");
    const subject = "Your loan has been disbursed";
    const html = layout(
      subject,
      `<p>Your <strong>${escapeHtml(loanLabel(loan))}</strong> application is marked <strong>disbursed</strong>.</p>
       <p>Repayment schedule and EMI details (if added by our team) are available in your dashboard.</p>
       <p style="margin-top:16px;"><a href="${escapeHtml(
         `${base}/dashboard/applications/${id}`
       )}" style="color:#0ea5e9;">View application</a></p>`,
      base
    );
    const r = await sendViaResend({ to: email, subject, html });
    if (!r.ok) return new Response(JSON.stringify({ ok: false, error: r.error }), { status: 500 });
    return jsonOk({ sent: "application_disbursed" });
  }

  return jsonOk({ skipped: "applications update not a notification transition" });
}

async function handleDocumentsUpdate(payload: DbWebhookPayload, base: string): Promise<Response> {
  const rec = payload.record;
  const old = payload.old_record;
  if (!rec || !old) return jsonOk({ skipped: "missing record" });

  const prevStatus = String(old.status ?? "");
  const nextStatus = String(rec.status ?? "");
  if (prevStatus === nextStatus) {
    return jsonOk({ skipped: "status unchanged" });
  }

  if (nextStatus !== "Approved" && nextStatus !== "Re-upload") {
    return jsonOk({ skipped: "document status not notification-worthy" });
  }

  const applicationId = String(rec.application_id ?? "");
  if (!applicationId) return jsonOk({ skipped: "no application_id" });

  const supabase = getServiceClient();
  const { data: appRow, error: appErr } = await supabase
    .from("applications")
    .select("customer_id, loan_type")
    .eq("id", applicationId)
    .maybeSingle();

  if (appErr || !appRow?.customer_id) {
    return jsonOk({ skipped: "application lookup failed" });
  }

  const customerId = String(appRow.customer_id);
  const email = await getAuthEmailForUser(customerId);
  if (!email) return jsonOk({ skipped: "no customer email" });

  const docType = String(rec.document_type ?? "Document");
  const fileName = rec.file_name ? String(rec.file_name) : "";

  if (nextStatus === "Approved") {
    const subject = `Document approved: ${docType}`;
    const html = layout(
      subject,
      `<p>Your document <strong>${escapeHtml(docType)}</strong>${
        fileName ? ` (${escapeHtml(fileName)})` : ""
      } was <strong>approved</strong>.</p>
       <p>Thank you for submitting the required paperwork.</p>
       <p style="margin-top:16px;"><a href="${escapeHtml(
         `${base}/dashboard/applications/${applicationId}`
       )}" style="color:#0ea5e9;">View application</a></p>`,
      base
    );
    const r = await sendViaResend({ to: email, subject, html });
    if (!r.ok) return new Response(JSON.stringify({ ok: false, error: r.error }), { status: 500 });
    return jsonOk({ sent: "document_approved" });
  }

  if (nextStatus === "Re-upload") {
    const subject = `Action needed: re-upload a document (${docType})`;
    const html = layout(
      subject,
      `<p>We need a <strong>new upload</strong> for <strong>${escapeHtml(docType)}</strong>${
        fileName ? ` (previous file: ${escapeHtml(fileName)})` : ""
      }.</p>
       <p>Please open your application and upload a replacement file.</p>
       <p style="margin-top:16px;"><a href="${escapeHtml(
         `${base}/dashboard/applications/${applicationId}`
       )}" style="color:#0ea5e9;">Upload documents</a></p>`,
      base
    );
    const r = await sendViaResend({ to: email, subject, html });
    if (!r.ok) return new Response(JSON.stringify({ ok: false, error: r.error }), { status: 500 });
    return jsonOk({ sent: "document_reupload" });
  }

  return jsonOk({ skipped: "documents" });
}

async function handleAdvisoryInsert(payload: DbWebhookPayload, base: string): Promise<Response> {
  const rec = payload.record;
  if (!rec) return jsonOk({ skipped: "missing record" });

  const customerId = String(rec.customer_id ?? rec.requester_id ?? "");
  if (!customerId) return jsonOk({ skipped: "no customer_id" });

  const email = await getAuthEmailForUser(customerId);
  if (!email) return jsonOk({ skipped: "no customer email" });

  const subj = String(rec.subject ?? "Advisory request");
  const subject = `We received your request: ${subj.slice(0, 80)}${subj.length > 80 ? "…" : ""}`;
  const html = layout(
    "Your advisory request was received",
    `<p>Thanks — we’ve logged your request.</p>
     <p><strong>${escapeHtml(subj)}</strong></p>
     <p>We’ll respond in your dashboard when there’s an update.</p>
     <p style="margin-top:16px;"><a href="${escapeHtml(
       `${base}/dashboard/advisory`
     )}" style="color:#0ea5e9;">View advisory requests</a></p>`,
    base
  );

  const r = await sendViaResend({ to: email, subject, html });
  if (!r.ok) return new Response(JSON.stringify({ ok: false, error: r.error }), { status: 500 });

  const staffNotify = Deno.env.get("STAFF_NOTIFY_EMAIL")?.trim();
  if (staffNotify) {
    const body = String(rec.body ?? rec.message ?? "");
    const staffHtml = layout(
      "New advisory request",
      `<p><strong>Customer:</strong> ${escapeHtml(email)}</p>
       <p><strong>Subject</strong> ${escapeHtml(subj)}</p>
       <p><strong>Message</strong></p><p style="white-space:pre-wrap;">${escapeHtml(
         body.slice(0, 4000)
       )}</p>
       <p><a href="${escapeHtml(`${base}/admin/advisory`)}">Admin queue</a></p>`,
      base
    );
    const r2 = await sendViaResend({
      to: staffNotify,
      subject: `[Advisory] ${subj.slice(0, 60)}`,
      html: staffHtml,
    });
    if (!r2.ok) console.error("staff notify failed:", r2.error);
  }

  return jsonOk({ sent: "advisory_submitted" });
}
