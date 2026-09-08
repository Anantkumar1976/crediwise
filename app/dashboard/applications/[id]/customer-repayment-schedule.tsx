import { formatMoneyInr } from "@/lib/emi/constants";
import { LOCALE_TAGS, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { formatDashboardDate, formatMessage } from "@/lib/i18n/format";
import { emiStatusCopy } from "@/lib/i18n/labels";

export interface CustomerEmiRow {
  id: string;
  installment_number: number;
  due_date: string;
  emi_amount: number | string;
  principal_amount: number | string | null;
  interest_amount: number | string | null;
  closing_balance: number | string | null;
  status: string;
  paid_date: string | null;
  notes: string | null;
}

function num(v: number | string | null | undefined): number | null {
  if (v === null || v === undefined) return null;
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : null;
}

export function CustomerRepaymentScheduleSection(props: {
  emiRows: CustomerEmiRow[];
  emiError: string | null;
  t: Dictionary;
  locale: Locale;
}) {
  const { emiRows, emiError, t, locale } = props;
  const copy = t.dashboard.repayment;
  const moneyLocale = LOCALE_TAGS[locale];

  if (emiError) {
    return (
      <section className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-rose-900">{copy.title}</h2>
        <p className="mt-2 text-sm text-rose-800">
          {formatMessage(copy.loadError, { error: emiError })}
        </p>
      </section>
    );
  }

  if (emiRows.length === 0) {
    return null;
  }

  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{copy.title}</h2>
      <p className="mt-2 text-sm text-slate-600">{copy.body}</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="py-2 pr-2">{copy.colNum}</th>
              <th className="py-2 pr-2">{copy.colDue}</th>
              <th className="py-2 pr-2">{copy.colEmi}</th>
              <th className="py-2 pr-2">{copy.colPrincipal}</th>
              <th className="py-2 pr-2">{copy.colInterest}</th>
              <th className="py-2 pr-2">{copy.colBalance}</th>
              <th className="py-2 pr-2">{copy.colStatus}</th>
              <th className="py-2 pr-2">{copy.colPaid}</th>
              <th className="py-2 pr-2">{copy.colNotes}</th>
            </tr>
          </thead>
          <tbody>
            {emiRows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100">
                <td className="py-3 pr-2 font-medium text-slate-900">{row.installment_number}</td>
                <td className="py-3 pr-2 text-slate-700">{formatDashboardDate(row.due_date, locale)}</td>
                <td className="py-3 pr-2">{formatMoneyInr(num(row.emi_amount), moneyLocale)}</td>
                <td className="py-3 pr-2">{formatMoneyInr(num(row.principal_amount), moneyLocale)}</td>
                <td className="py-3 pr-2">{formatMoneyInr(num(row.interest_amount), moneyLocale)}</td>
                <td className="py-3 pr-2">{formatMoneyInr(num(row.closing_balance), moneyLocale)}</td>
                <td className="py-3 pr-2">{emiStatusCopy(t, row.status)}</td>
                <td className="py-3 pr-2 text-slate-700">
                  {row.paid_date ? formatDashboardDate(row.paid_date, locale) : "—"}
                </td>
                <td className="py-3 pr-2 text-slate-600">{row.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
