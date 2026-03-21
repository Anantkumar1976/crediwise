"use client";

import { adminDuplicateEmiRecord } from "@/app/admin/actions";

export function EmiDuplicateButton(props: { sourceEmiId: string; applicationId: string }) {
  return (
    <form action={adminDuplicateEmiRecord}>
      <input type="hidden" name="sourceEmiId" value={props.sourceEmiId} />
      <input type="hidden" name="applicationId" value={props.applicationId} />
      <button
        type="submit"
        className="inline-flex h-8 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 px-3 text-xs font-semibold text-sky-950 hover:bg-sky-100"
        title="Creates a new row with the same amounts and dates; installment # becomes next available; paid date cleared."
      >
        Duplicate row
      </button>
    </form>
  );
}
