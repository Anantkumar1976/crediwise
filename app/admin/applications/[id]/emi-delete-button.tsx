"use client";

import { adminDeleteEmiRecord } from "@/app/admin/actions";

export function EmiDeleteButton(props: { emiId: string; applicationId: string }) {
  return (
    <form
      action={adminDeleteEmiRecord}
      onSubmit={(e) => {
        if (!confirm("Delete this EMI row?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="emiId" value={props.emiId} />
      <input type="hidden" name="applicationId" value={props.applicationId} />
      <button
        type="submit"
        className="inline-flex h-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-2 text-xs font-semibold text-rose-900 hover:bg-rose-100"
      >
        Delete
      </button>
    </form>
  );
}
