import { documentTypeLabel, requiredDocumentTypesForLoan } from "./constants";

export interface VerificationGateDoc {
  document_type: string;
  status: string;
  created_at: string;
}

/**
 * Latest document per type wins (by created_at desc), matching checklist + DB RPC logic.
 */
export function getLatestStatusByType(docs: VerificationGateDoc[]): Map<string, string> {
  const sorted = [...docs].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const map = new Map<string, string>();
  for (const d of sorted) {
    if (!map.has(d.document_type)) {
      map.set(d.document_type, d.status);
    }
  }
  return map;
}

/**
 * Check that each listed document type’s latest upload is Approved (used with DB stage rules or legacy lists).
 */
export function documentGateDetails(
  requiredDocumentTypes: string[],
  docs: VerificationGateDoc[]
) {
  const latest = getLatestStatusByType(docs);
  const blocking: string[] = [];

  for (const t of requiredDocumentTypes) {
    const st = latest.get(t);
    if (st !== "Approved") {
      const label = documentTypeLabel(t);
      if (st === undefined) {
        blocking.push(`${label} — not uploaded`);
      } else {
        blocking.push(`${label} — latest status is “${st}” (must be Approved)`);
      }
    }
  }

  return { ok: blocking.length === 0, blocking };
}

/** Legacy helper: full underwriting set for a loan type (e.g. customer checklist before migration). */
export function verificationGateDetails(loanType: "home" | "business", docs: VerificationGateDoc[]) {
  return documentGateDetails([...requiredDocumentTypesForLoan(loanType)], docs);
}
