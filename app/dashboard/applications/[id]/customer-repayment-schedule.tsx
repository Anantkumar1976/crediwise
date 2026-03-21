import { emiStatusLabel, formatMoneyInr } from "@/lib/emi/constants";

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
}) {
  const { emiRows, emiError } = props;

  if (emiError) {
    return (
      <section className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-rose-900">Repayment schedule</h2>
        <p className="mt-2 text-sm text-rose-800">Could not load schedule: {emiError}</p>
      </section>
    );
  }

  if (emiRows.length === 0) {
    return null;
  }

  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Repayment schedule</h2>
      <p className="mt-2 text-sm text-slate-600">
        Your EMI plan as shared by the team. For questions, contact support through your application.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="py-2 pr-2">#</th>
              <th className="py-2 pr-2">Due</th>
              <th className="py-2 pr-2">EMI</th>
              <th className="py-2 pr-2">Principal</th>
              <th className="py-2 pr-2">Interest</th>
              <th className="py-2 pr-2">Balance</th>
              <th className="py-2 pr-2">Status</th>
              <th className="py-2 pr-2">Paid</th>
              <th className="py-2 pr-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {emiRows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100">
                <td className="py-3 pr-2 font-medium text-slate-900">{row.installment_number}</td>
                <td className="py-3 pr-2 text-slate-700">{new Date(row.due_date).toLocaleDateString()}</td>
                <td className="py-3 pr-2">{formatMoneyInr(num(row.emi_amount))}</td>
                <td className="py-3 pr-2">{formatMoneyInr(num(row.principal_amount))}</td>
                <td className="py-3 pr-2">{formatMoneyInr(num(row.interest_amount))}</td>
                <td className="py-3 pr-2">{formatMoneyInr(num(row.closing_balance))}</td>
                <td className="py-3 pr-2">{emiStatusLabel(row.status)}</td>
                <td className="py-3 pr-2 text-slate-700">
                  {row.paid_date ? new Date(row.paid_date).toLocaleDateString() : "—"}
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
