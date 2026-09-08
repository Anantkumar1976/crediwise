"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { BrandLogo } from "@/components/landing/brand-logo";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/components/i18n/locale-provider";

function SignInContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/dashboard";
  const supabase = getSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!supabase) {
      setErrorMessage(t.auth.missingConfig);
      return;
    }

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.push(redirectTo);
    });
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10 sm:px-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <Link href="/" aria-label={t.nav.homeAria} className="inline-block rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A88E]">
            <BrandLogo heightPx={40} />
          </Link>
          <p className="mt-3 text-sm text-slate-600">{t.auth.signInSubtitle}</p>
        </div>
        <LanguageSwitcher />
      </header>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {!supabase ? (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {t.auth.missingConfigBanner}
          </p>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              {t.auth.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              {t.auth.password}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:ring-2"
            />
          </div>

          {errorMessage ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending || !supabase}
            className="h-10 w-full rounded-lg bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
          >
            {isPending ? t.auth.signingIn : t.auth.signIn}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          {t.auth.noAccount}{" "}
          <a className="font-medium text-slate-900 underline" href="/auth/sign-up">
            {t.nav.signUp}
          </a>
        </p>
      </section>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-md px-6 py-10 sm:px-8" />}>
      <SignInContent />
    </Suspense>
  );
}

