"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BrandLogo } from "@/components/landing/brand-logo";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/components/i18n/locale-provider";

const SECTION_HREFS = [
  "#about",
  "#why-crediwise",
  "#how-it-works",
  "#services",
  "#contact",
] as const;

export function SiteHeader() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const sectionLinks = [
    { href: SECTION_HREFS[0], label: t.nav.about },
    { href: SECTION_HREFS[1], label: t.nav.why },
    { href: SECTION_HREFS[2], label: t.nav.how },
    { href: SECTION_HREFS[3], label: t.nav.services },
    { href: SECTION_HREFS[4], label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="shrink-0 rounded-md transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A88E]"
          aria-label={t.nav.homeAria}
        >
          <BrandLogo preload heightPx={56} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={t.nav.primary}>
          {sectionLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <Link
            href="/auth/sign-in"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            {t.nav.signIn}
          </Link>
          <Link
            href="/auth/sign-up"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            {t.nav.signUp}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-0 top-[4.5rem] z-40 bg-slate-950/40 lg:hidden"
          onClick={close}
          aria-hidden
        >
          <div
            className="ml-auto flex h-[calc(100vh-4.5rem)] w-full max-w-sm flex-col border-l border-slate-200 bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-1" aria-label={t.nav.mobile}>
              {sectionLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-3 text-base font-medium text-slate-800 hover:bg-slate-50"
                  onClick={close}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 flex flex-col gap-2 border-t border-slate-100 pt-6">
              <Link
                href="/auth/sign-in"
                className="rounded-lg border border-slate-200 py-3 text-center text-sm font-semibold text-slate-800 hover:bg-slate-50"
                onClick={close}
              >
                {t.nav.signIn}
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-lg bg-slate-900 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
                onClick={close}
              >
                {t.nav.signUp}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
