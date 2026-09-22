import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const PARTNER_BANKS = [
  { key: "hdfc" as const, src: "/images/crediwise/partners/hdfc-bank.svg" },
  { key: "icici" as const, src: "/images/crediwise/partners/icici-bank.svg" },
  { key: "sbi" as const, src: "/images/crediwise/partners/sbi.svg" },
  { key: "axis" as const, src: "/images/crediwise/partners/axis-bank.svg" },
  { key: "kotak" as const, src: "/images/crediwise/partners/kotak.svg" },
];

export function PartnerBanks({ t }: { t: Dictionary }) {
  const copy = t.partnerBanks;

  return (
    <section
      id="partner-banks"
      className="scroll-mt-24 py-16 sm:py-20"
      aria-labelledby="partners-heading"
    >
      <div className="mx-auto max-w-6xl overflow-x-clip px-4 sm:px-6 lg:px-10">
        <p className="text-xs font-semibold tracking-[0.18em] text-[#00A88E]">{copy.eyebrow}</p>
        <h2
          id="partners-heading"
          className="mt-3 text-3xl font-bold tracking-tight text-[#0A2540] sm:text-4xl"
        >
          {copy.heading}
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-[#3D4F63]">{copy.subheading}</p>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {PARTNER_BANKS.map((bank) => {
            const name = copy.names[bank.key];
            return (
              <li
                key={bank.key}
                className="max-sm:last:col-span-2 max-sm:last:mx-auto max-sm:last:w-full max-sm:last:max-w-[calc(50%-0.5rem)]"
              >
                <div className="flex h-28 flex-col items-center justify-center gap-2 rounded-2xl bg-white px-3 shadow-sm ring-1 ring-slate-200/80">
                  <Image
                    src={bank.src}
                    alt=""
                    width={64}
                    height={48}
                    unoptimized
                    className="h-10 w-auto object-contain"
                  />
                  <p className="text-center text-xs font-semibold leading-tight text-[#0A2540]">{name}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
