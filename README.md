This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## CrediWise: Document management (Supabase)

1. Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

2. **Create the `documents` storage bucket** (required — uploads fail with “Bucket not found” until this exists):

   - **Option A — Dashboard:** Supabase → **Storage** → **New bucket** → Name: **`documents`** exactly → create as **private** (not public).
   - **Option B — SQL:** In **SQL Editor**, run `supabase/sql/documents_storage.sql` once. That inserts the bucket and sets storage + `documents` table RLS.

   If uploads fail with **“new row violates row-level security policy”**, run **`supabase/sql/documents_rls_hotfix.sql`** once (fixes storage + insert policies and adds `register_customer_document` RPC).

2b. **Customer profile (My Profile)** — Run **`supabase/sql/profiles_customer_fields.sql`** once so `profiles` includes **full name, phone, alt phone, address, email** (plus RLS). Customers must complete required fields (**full name, phone, address**, and **email** from sign-in or profile) before **starting** or **submitting** a loan application; the dashboard and applications pages show a reminder when anything is missing. If you see **“Could not find the `address` column … schema cache”**, either the script wasn’t applied yet or PostgREST’s cache is stale — run the SQL, then **Project Settings → API → Reload schema**. For columns only (e.g. trigger errors), use **`supabase/sql/profiles_customer_columns_only.sql`** then re-run the full script for RLS/triggers. If you see **“infinite recursion detected in policy for relation profiles”**, run **`supabase/sql/profiles_rls_recursion_hotfix.sql`** (replaces the staff `SELECT` policy with a `SECURITY DEFINER` helper so staff checks don’t recurse).

2c. **Loan form fields (employment / incorporation)** — Run **`supabase/sql/loan_application_details_extensions.sql`** once so **`home_loan_details`** has **occupation** (service vs business) and **annual_salary_or_revenue**, and **`business_loan_details`** has **year_of_incorporation** and **annual_business_revenue**. Reload the API schema if PostgREST reports missing columns.

5. **Admin: document gates per transition** — Run **`supabase/sql/document_stage_rules.sql`** so required document types are driven by the `document_stage_rules` table (default seed: **Submitted → Verified** and **Processing → Approved** use the same underwriting sets as the customer checklist). The admin case page reads those rules and disables **Move to …** until each required type’s **latest** row is **Approved**. (Older one-off script `admin_gate_verified_on_documents.sql` is deprecated; use `document_stage_rules.sql` instead.)

6. **EMI Manager** — Run **`supabase/sql/emi_records.sql`** once to create `emi_records` + RLS. On each admin case page, staff can **add** EMI rows at any status; **edit** and **delete** are allowed only after the application is **Approved** or **Disbursed** (matches RLS). Customers can **read** their own application’s EMI rows via the same `applications` ownership check. If the UI reports missing columns (e.g. `installment_number`), run the **latest** `emi_records.sql` again — it aligns legacy tables that were created before all columns existed. If adding a **second** EMI row fails with `emi_records_application_id_key`, your DB had a mistaken **unique on `application_id` only**; re-run the latest `emi_records.sql` (it drops that constraint and keeps uniqueness on `(application_id, installment_number)`).

7. **Advisory requests** — Run **`supabase/sql/advisory_requests.sql`** once (re-run the latest version if you see missing-column errors such as `body` or `requester_id`). The app sets **`customer_id` and `requester_id`** to the same user so older DBs that only had `requester_id` stay compatible. It also sets **`request_type`** to the same value as **`category`** when that column exists. If inserts fail with **`advisory_requests_request_type_check`**, your DB had a different allowed set for **`request_type`** than the app — re-run the **latest** `advisory_requests.sql` (it drops that CHECK, normalizes values like `payment` → `payments`, and re-adds the constraint to match the UI). **`advisory_requests_hotfix.sql`** includes the same **`request_type`** fix if you only need that piece. If you see **`advisory_requests_status_check`**, the DB likely used different status literals (e.g. **`pending`** instead of **`open`**) — the latest script drops that CHECK, maps legacy values to **`open` / `in_progress` / `resolved` / `closed`**, and re-adds the constraint. If PostgREST still reports an old schema after `ALTER`, use Supabase **Settings → API → Reload schema** (or wait a minute).

8. **Email notifications** — Deploy the Edge Function **`supabase/functions/notify-email`** (Resend + Supabase secrets) and wire **Database Webhooks** on **`applications`** (UPDATE), **`documents`** (UPDATE), and **`advisory_requests`** (INSERT). Covers: application **Submitted** / **Approved** / **Disbursed**, document **Approved** / **Re-upload**, and advisory **submitted** (optional staff copy). Full steps: **`docs/email-notifications.md`**.

3. **Customer:** Dashboard → **Open Form** → **Documents** (PDF/PNG/JPG, max 10 MB). A **required checklist** differs for home vs business loans; **Re-upload** items can be replaced in place after ops requests a new file. **Advisory** lives under Dashboard → **Open advisory requests**. After the application is **Approved** or **Disbursed**, a read-only **Repayment schedule** appears on the same application page when staff have added EMI rows.
4. **Staff:** `/admin` → open a case → **Documents** (open file, set status). **`/admin/advisory`** for customer advisory triage.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
