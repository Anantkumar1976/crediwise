export const HOME_LOAN_EMI = {
  minAmount: 5_00_000,
  maxAmount: 5_00_00_000,
  defaultAmount: 50_00_000,
  amountStep: 50_000,
  minYears: 5,
  maxYears: 30,
  defaultYears: 20,
  minRate: 6,
  maxRate: 15,
  defaultRate: 8.5,
  rateStep: 0.05,
  interestSavingsFactor: 0.5,
} as const;

export interface EmiBreakdown {
  emi: number;
  totalPayable: number;
  totalInterest: number;
}

/** Standard reducing-balance EMI: [P × R × (1+R)^N] / [(1+R)^N − 1] */
export function calculateEmi(
  principal: number,
  annualRatePercent: number,
  tenureMonths: number,
): EmiBreakdown {
  if (principal <= 0 || tenureMonths <= 0) {
    return { emi: 0, totalPayable: 0, totalInterest: 0 };
  }

  if (annualRatePercent <= 0) {
    const emi = principal / tenureMonths;
    return { emi, totalPayable: principal, totalInterest: 0 };
  }

  const monthlyRate = annualRatePercent / 12 / 100;
  const factor = (1 + monthlyRate) ** tenureMonths;
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  const totalPayable = emi * tenureMonths;
  const totalInterest = totalPayable - principal;

  return { emi, totalPayable, totalInterest };
}

/** Indian grouping (₹12,34,567) without Intl, so SSR and the browser match. */
export function formatInrWhole(amount: number, _localeTag = "en-IN") {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  const digits = Math.abs(rounded).toString();
  const lastThree = digits.slice(-3);
  const rest = digits.slice(0, -3);
  const grouped = rest
    ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`
    : lastThree;
  return `${sign}₹${grouped}`;
}

export function formatRate(rate: number) {
  return rate.toFixed(2);
}
