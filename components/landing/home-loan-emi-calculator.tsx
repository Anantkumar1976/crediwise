"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { useI18n } from "@/components/i18n/locale-provider";
import { formatMessage } from "@/lib/i18n/format";
import { LOCALE_TAGS } from "@/lib/i18n/config";
import {
  HOME_LOAN_EMI,
  calculateEmi,
  formatInrWhole,
  formatRate,
} from "@/lib/emi/home-loan";

function SliderField({
  id,
  label,
  valueLabel,
  min,
  max,
  step,
  value,
  minCaption,
  maxCaption,
  onChange,
}: {
  id: string;
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  minCaption: string;
  maxCaption: string;
  onChange: (next: number) => void;
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-[#0A2540]">
          {label}
        </label>
        <p className="rounded-lg bg-[#F3F7FA] px-3 py-1.5 text-sm font-semibold tabular-nums text-[#0A2540]">
          {valueLabel}
        </p>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={valueLabel}
        className="emi-slider mt-3 w-full cursor-pointer"
      />
      <div className="mt-1.5 flex justify-between text-xs text-[#3D4F63]">
        <span>{minCaption}</span>
        <span>{maxCaption}</span>
      </div>
    </div>
  );
}

export function HomeLoanEmiCalculator() {
  const { t, locale } = useI18n();
  const copy = t.emiCalculator;
  const localeTag = LOCALE_TAGS[locale];
  const headingId = useId();
  const amountId = useId();
  const tenureId = useId();
  const rateId = useId();

  const [amount, setAmount] = useState(HOME_LOAN_EMI.defaultAmount);
  const [years, setYears] = useState(HOME_LOAN_EMI.defaultYears);
  const [marketRate, setMarketRate] = useState(HOME_LOAN_EMI.defaultRate);

  const months = years * 12;
  const market = useMemo(
    () => calculateEmi(amount, marketRate, months),
    [amount, marketRate, months],
  );
  const savedInterest = market.totalInterest * HOME_LOAN_EMI.interestSavingsFactor;

  const money = (value: number) => formatInrWhole(value, localeTag);
  const tenureLabel = years === 1 ? `1 ${copy.yearSuffix}` : `${years} ${copy.yearsSuffix}`;

  return (
    <section
      id="emi-calculator"
      className="scroll-mt-24 bg-white py-16 sm:py-20"
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-6xl overflow-x-clip px-4 sm:px-6 lg:px-10">
        <p className="text-xs font-semibold tracking-[0.18em] text-[#00A88E]">{copy.eyebrow}</p>
        <h2
          id={headingId}
          className="mt-3 text-3xl font-bold tracking-tight text-[#0A2540] sm:text-4xl"
        >
          {copy.heading}
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-[#3D4F63]">{copy.subheading}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8">
            <div className="space-y-8">
              <SliderField
                id={amountId}
                label={copy.amountLabel}
                valueLabel={money(amount)}
                min={HOME_LOAN_EMI.minAmount}
                max={HOME_LOAN_EMI.maxAmount}
                step={HOME_LOAN_EMI.amountStep}
                value={amount}
                minCaption={copy.amountMin}
                maxCaption={copy.amountMax}
                onChange={setAmount}
              />
              <SliderField
                id={tenureId}
                label={copy.tenureLabel}
                valueLabel={tenureLabel}
                min={HOME_LOAN_EMI.minYears}
                max={HOME_LOAN_EMI.maxYears}
                step={1}
                value={years}
                minCaption={`${HOME_LOAN_EMI.minYears} ${copy.yearsSuffix}`}
                maxCaption={`${HOME_LOAN_EMI.maxYears} ${copy.yearsSuffix}`}
                onChange={setYears}
              />
              <SliderField
                id={rateId}
                label={copy.rateLabel}
                valueLabel={`${formatRate(marketRate)} ${copy.rateSuffix}`}
                min={HOME_LOAN_EMI.minRate}
                max={HOME_LOAN_EMI.maxRate}
                step={HOME_LOAN_EMI.rateStep}
                value={marketRate}
                minCaption={`${formatRate(HOME_LOAN_EMI.minRate)}${copy.rateSuffix}`}
                maxCaption={`${formatRate(HOME_LOAN_EMI.maxRate)}${copy.rateSuffix}`}
                onChange={setMarketRate}
              />
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-3xl bg-[#0A2540] text-white shadow-sm">
            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#7EE0D2]">{copy.marketTitle}</p>
              <p className="mt-4 text-sm text-white/70">{copy.monthlyEmi}</p>
              <p className="mt-1 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
                {money(market.emi)}
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/15 pt-6">
                <div>
                  <dt className="text-xs text-white/65">{copy.totalInterest}</dt>
                  <dd className="mt-1 text-base font-semibold tabular-nums sm:text-lg">
                    {money(market.totalInterest)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-white/65">{copy.totalPayable}</dt>
                  <dd className="mt-1 text-base font-semibold tabular-nums sm:text-lg">
                    {money(market.totalPayable)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-auto bg-[#00A88E] p-6 sm:p-8">
              <p className="text-xs font-semibold tracking-[0.16em] text-white/80">{copy.crediwiseTitle}</p>
              <div className="mt-4 flex items-end justify-between gap-3">
                <p className="text-sm font-semibold text-white">{copy.youSave}</p>
                <p className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
                  {money(savedInterest)}
                </p>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/25" aria-hidden>
                <div className="h-full w-1/2 rounded-full bg-white" />
              </div>
              <p className="mt-3 text-sm font-semibold text-white">{copy.savePercent}</p>
              <Link
                href="/auth/sign-up"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#0A2540] transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {copy.compareCta}
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-[#3D4F63]">{copy.disclaimer}</p>
        <p className="sr-only" aria-live="polite">
          {formatMessage(copy.liveSummary, {
            emi: money(market.emi),
            interest: money(market.totalInterest),
            saved: money(savedInterest),
          })}
        </p>
      </div>
    </section>
  );
}
