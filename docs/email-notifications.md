# Email notifications (Supabase Database Webhooks + Edge Function)

Customer emails are sent by the Edge Function **`notify-email`**, which uses [Resend](https://resend.com/) for delivery. Triggers are **Supabase Database Webhooks** on `public` tables (no Postgres triggers required in-repo).

## What gets sent

| Event | Table | Condition | Recipient |
|--------|--------|-----------|------------|
| Application submitted | `applications` | `UPDATE`: `Draft` → `Submitted` | Customer (`auth.users` email) |
| Application approved | `applications` | `UPDATE`: → `Approved` (from non-approved) | Customer |
| Loan disbursed | `applications` | `UPDATE`: → `Disbursed` (from non-disbursed) | Customer |
| Document approved | `documents` | `UPDATE`: `status` → `Approved` | Customer |
| Re-upload requested | `documents` | `UPDATE`: `status` → `Re-upload` | Customer |
| Advisory submitted | `advisory_requests` | `INSERT` | Customer + optional staff (see below) |

Status comparisons are **case-insensitive** (`Draft` / `draft` both work).

## 1. Resend

1. Create a [Resend](https://resend.com/) account and API key.
2. Add and verify a **sending domain** (or use Resend’s sandbox sender for testing).
3. You will use:
   - **`RESEND_API_KEY`**
   - **`EMAIL_FROM`** — e.g. `CrediWise <notifications@yourdomain.com>` (must be allowed by Resend).

## 2. Deploy the Edge Function

From the repo root (with [Supabase CLI](https://supabase.com/docs/guides/cli) installed and project linked):

```bash
supabase functions deploy notify-email --no-verify-jwt
```

`verify_jwt` is disabled for this function so **Database Webhooks** can call it with a **shared secret** instead of a user JWT. (Configured in `supabase/config.toml`.)

## 3. Secrets (Supabase Dashboard)

**Project → Edge Functions → notify-email → Secrets** (or CLI):

| Secret | Purpose |
|--------|---------|
| `SUPABASE_URL` | Usually auto-injected; set if missing |
| `SUPABASE_SERVICE_ROLE_KEY` | **Required** — fetch `auth.users` email by `customer_id` |
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | Verified sender string |
| `APP_PUBLIC_URL` | Public site URL for links (e.g. `https://your-app.vercel.app`) |
| `NOTIFY_WEBHOOK_SECRET` | Long random string; must match webhook header (see below) |
| `STAFF_NOTIFY_EMAIL` | *(Optional)* If set, advisory `INSERT` also emails this address |

```bash
supabase secrets set RESEND_API_KEY=re_xxx EMAIL_FROM="CrediWise <notifications@domain.com>" APP_PUBLIC_URL=https://... NOTIFY_WEBHOOK_SECRET=$(openssl rand -hex 32) SUPABASE_SERVICE_ROLE_KEY=your_service_role
```

Use the **service role** from **Project Settings → API** (server-only; never expose to the browser).

## 4. Database Webhooks

In Supabase: **Database → Webhooks → Create a new hook**.

- **URL:** `https://<PROJECT_REF>.supabase.co/functions/v1/notify-email`
- **Method:** `POST`
- **Headers:** add one of:
  - `x-webhook-secret: <NOTIFY_WEBHOOK_SECRET>`  
  - or `Authorization: Bearer <NOTIFY_WEBHOOK_SECRET>`

Create **three** hooks (same URL and headers):

1. **Applications** — table `public.applications`, event **UPDATE** (optionally filter columns if your project supports it; the function ignores non-matching transitions).
2. **Documents** — table `public.documents`, event **UPDATE**.
3. **Advisory** — table `public.advisory_requests`, event **INSERT**.

If `NOTIFY_WEBHOOK_SECRET` is unset in the Edge Function, verification is skipped (**development only**).

## 5. Test

```bash
curl -sS -X POST "https://<PROJECT_REF>.supabase.co/functions/v1/notify-email" \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: <NOTIFY_WEBHOOK_SECRET>" \
  -d '{"type":"UPDATE","schema":"public","table":"applications","record":{"id":"...","customer_id":"...","loan_type":"home","current_status":"Submitted"},"old_record":{"current_status":"Draft"}}'
```

Expect `200` and `"sent":"application_submitted"` when email sends successfully.

## Troubleshooting

- **401 Unauthorized:** Webhook secret mismatch or missing header.
- **500 + Resend error:** Invalid `EMAIL_FROM` domain or API key.
- **skipped: no customer email:** User has no email on `auth.users` (e.g. phone-only auth).
- **Webhook not firing:** Confirm webhook is enabled and events match (UPDATE vs INSERT).

## Alternative: invoke from Next.js

You can also POST the same JSON payload from a Route Handler after a successful action; keep the **shared secret** for authentication. Database Webhooks avoid coupling email to the Next.js deployment.
