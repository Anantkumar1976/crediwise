import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

function GoldCoinMark() {
  return (
    <svg viewBox="0 0 160 160" className="h-28 w-28 sm:h-36 sm:w-36" aria-hidden>
      <defs>
        <radialGradient id="coin-face" cx="32%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FFF3C4" />
          <stop offset="45%" stopColor="#F5C542" />
          <stop offset="100%" stopColor="#C98912" />
        </radialGradient>
        <linearGradient id="coin-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE58A" />
          <stop offset="50%" stopColor="#D4A017" />
          <stop offset="100%" stopColor="#A56B08" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="74" fill="url(#coin-rim)" />
      <circle cx="80" cy="80" r="64" fill="url(#coin-face)" />
      <circle cx="80" cy="80" r="56" fill="none" stroke="#F6E27A" strokeWidth="2" />
      <text
        x="80"
        y="76"
        textAnchor="middle"
        fill="#8A5A08"
        fontFamily="Georgia, serif"
        fontSize="22"
        fontWeight="700"
      >
        1 gm
      </text>
      <text
        x="80"
        y="100"
        textAnchor="middle"
        fill="#8A5A08"
        fontFamily="Georgia, serif"
        fontSize="13"
        fontWeight="600"
        letterSpacing="1.5"
      >
        GOLD
      </text>
    </svg>
  );
}

export function GoldCoinOffer({ t }: { t: Dictionary }) {
  const copy = t.goldOffer;

  return (
    <section
      id="offers"
      className="scroll-mt-24 px-4 py-6 sm:px-6 sm:py-8 lg:px-10"
      aria-labelledby="gold-offer-heading"
    >
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFF8E8] via-[#FFF3D6] to-[#F7E7B8] p-6 shadow-sm ring-1 ring-[#E8D48A]/80 sm:p-8 lg:p-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
          <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full bg-white/50 shadow-inner sm:h-40 sm:w-40">
            <GoldCoinMark />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#B45309]">{copy.eyebrow}</p>
            <h2
              id="gold-offer-heading"
              className="mt-2 text-2xl font-bold tracking-tight text-[#0A2540] sm:text-3xl"
            >
              {copy.heading}
            </h2>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-[#3D4F63] sm:text-lg">
              {copy.body}
            </p>
            <Link
              href="/auth/sign-up"
              className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-[#0A2540] px-7 text-sm font-semibold text-white transition hover:bg-[#143656] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A2540]"
            >
              {copy.cta}
            </Link>
            <p className="mt-4 max-w-xl text-xs leading-relaxed text-[#6B5A32]">{copy.disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
