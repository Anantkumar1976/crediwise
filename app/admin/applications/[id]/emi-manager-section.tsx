import {
  adminInsertEmiRecord,
  adminUpdateEmiRecord,
} from "@/app/admin/actions";
import { EMI_STATUS_OPTIONS, emiStatusLabel, formatMoneyInr } from "@/lib/emi/constants";
import { EmiDuplicateButton } from "./emi-duplicate-button";
import { EmiDeleteButton } from "./emi-delete-button";

export interface EmiRecordRow {
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

function EmiEditCard(props: { row: EmiRecordRow; applicationId: string }) {
  const { row, applicationId } = props;
  return (
    <article className="rounded-lg border border-slate-200 p-4">
      <form action={adminUpdateEmiRecord} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
        <input type="hidden" name="emiId" value={row.id} />
        <input type="hidden" name="applicationId" value={applicationId} />
        <label className="text-xs font-medium text-slate-600 lg:col-span-1">
          #
          <input
            name="installmentNumber"
            type="number"
            min={1}
            required
            defaultValue={row.installment_number}
            className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="text-xs font-medium text-slate-600 lg:col-span-2">
          Due date
          <input
            name="dueDate"
            type="date"
            required
            defaultValue={row.due_date.slice(0, 10)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="text-xs font-medium text-slate-600 lg:col-span-2">
          EMI amount
          <input
            name="emiAmount"
            type="number"
            step="0.01"
            min={0}
            required
            defaultValue={num(row.emi_amount) ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="text-xs font-medium text-slate-600 lg:col-span-2">
          Principal
          <input
            name="principalAmount"
            type="number"
            step="0.01"
            min={0}
            defaultValue={num(row.principal_amount) ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="text-xs font-medium text-slate-600 lg:col-span-2">
          Interest
          <input
            name="interestAmount"
            type="number"
            step="0.01"
            min={0}
            defaultValue={num(row.interest_amount) ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="text-xs font-medium text-slate-600 lg:col-span-2">
          Closing bal.
          <input
            name="closingBalance"
            type="number"
            step="0.01"
            defaultValue={num(row.closing_balance) ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="text-xs font-medium text-slate-600 lg:col-span-1">
          Status
          <select
            name="status"
            defaultValue={row.status}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm"
          >
            {EMI_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-slate-600 lg:col-span-2">
          Paid date
          <input
            name="paidDate"
            type="date"
            defaultValue={row.paid_date ? row.paid_date.slice(0, 10) : ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="text-xs font-medium text-slate-600 lg:col-span-12">
          Notes
          <input
            name="notes"
            type="text"
            defaultValue={row.notes ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </label>
        <div className="lg:col-span-12">
          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-700"
          >
            Save row
          </button>
        </div>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <EmiDuplicateButton sourceEmiId={row.id} applicationId={applicationId} />
        <span className="text-xs text-slate-400" aria-hidden>
          ·
        </span>
        <span className="text-xs text-slate-500">Danger zone</span>
        <EmiDeleteButton emiId={row.id} applicationId={applicationId} />
      </div>
    </article>
  );
}

export function EmiManagerSection(props: {
  applicationId: string;
  currentStatus: string;
  emiRows: EmiRecordRow[];
  emiError: string | null;
  nextInstallmentHint: number;
}) {
  const { applicationId, currentStatus, emiRows, emiError, nextInstallmentHint } = props;
  const canEdit = currentStatus === "Approved" || currentStatus === "Disbursed";

  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">EMI Manager</h2>
      <p className="mt-2 text-sm text-slate-600">
        Build and track the repayment schedule for this application. Staff can <strong>add</strong> rows at any
        stage. Use <strong>Duplicate row</strong> to copy an existing line (next installment #, paid date
        cleared). <strong>Edit</strong> and <strong>delete</strong> are enabled after the case is{" "}
        <strong>Approved</strong> (or <strong>Disbursed</strong>).
      </p>

      {emiError ? (
        <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          Could not load EMI records: {emiError}
        </p>
      ) : null}

      {!emiError && emiRows.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">No EMI rows yet. Add the first installment below.</p>
      ) : null}

      {!emiError && emiRows.length > 0 && canEdit ? (
        <div className="mt-4 space-y-4">
          {emiRows.map((row) => (
            <EmiEditCard key={row.id} row={row} applicationId={applicationId} />
          ))}
        </div>
      ) : null}

      {!emiError && emiRows.length > 0 && !canEdit ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-sm">
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
                <th className="py-2 pr-2">Copy</th>
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
                  <td className="py-3 pr-2 align-middle">
                    <EmiDuplicateButton sourceEmiId={row.id} applicationId={applicationId} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-slate-500">
            Editing unlocks when status is <strong>Approved</strong> or <strong>Disbursed</strong>. You can still{" "}
            <strong>duplicate</strong> rows to build the schedule faster.
          </p>
        </div>
      ) : null}

      <div className="mt-6 border-t border-slate-200 pt-6">
        <h3 className="text-sm font-semibold text-slate-900">Add EMI row</h3>
        <form action={adminInsertEmiRecord} className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
          <input type="hidden" name="applicationId" value={applicationId} />
          <label className="text-xs font-medium text-slate-600 lg:col-span-1">
            #
            <input
              name="installmentNumber"
              type="number"
              min={1}
              required
              defaultValue={nextInstallmentHint}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-slate-600 lg:col-span-2">
            Due date
            <input
              name="dueDate"
              type="date"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-slate-600 lg:col-span-2">
            EMI amount
            <input
              name="emiAmount"
              type="number"
              step="0.01"
              min={0}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-slate-600 lg:col-span-2">
            Principal
            <input
              name="principalAmount"
              type="number"
              step="0.01"
              min={0}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-slate-600 lg:col-span-2">
            Interest
            <input
              name="interestAmount"
              type="number"
              step="0.01"
              min={0}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-slate-600 lg:col-span-2">
            Closing bal.
            <input
              name="closingBalance"
              type="number"
              step="0.01"
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-slate-600 lg:col-span-1">
            Status
            <select
              name="status"
              defaultValue="scheduled"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm"
            >
              {EMI_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-slate-600 lg:col-span-2">
            Paid date
            <input name="paidDate" type="date" className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
          </label>
          <label className="text-xs font-medium text-slate-600 lg:col-span-12">
            Notes
            <input name="notes" type="text" className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
          </label>
          <div className="lg:col-span-12">
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Add EMI row
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
