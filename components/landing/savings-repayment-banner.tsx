import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function SavingsRepaymentBanner({ t }: { t: Dictionary }) {
  const copy = t.savingsBanner;

  return (
    <section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10" aria-labelledby="savings-heading">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#0A2540] px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14">
        <div
          className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#00A88E]/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 right-10 h-48 w-48 rounded-full bg-[#00A88E]/15 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="min-w-0 max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#7EE0D2]">{copy.eyebrow}</p>
            <h2
              id="savings-heading"
              className="mt-3 text-3xl font-bold leading-[1.2] tracking-tight sm:text-4xl lg:text-[2.5rem]"
            >
              {copy.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
              {copy.body}
            </p>
          </div>
          <Link
            href="/auth/sign-up"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-[#00A88E] px-8 text-sm font-semibold text-white transition hover:bg-[#00957D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A88E]"
          >
            {copy.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
