"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DOCUMENT_ACCEPT,
  DOCUMENT_MAX_BYTES,
  DOCUMENT_TYPE_OPTIONS,
  DOCUMENTS_BUCKET,
  documentTypeLabel,
  requiredDocumentTypesForLoan,
} from "@/lib/documents/constants";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export interface CustomerDocumentRow {
  id: string;
  document_type: string;
  file_name: string | null;
  status: string;
  storage_path: string;
  created_at: string;
  version: number | null;
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 180);
}

function allowedMimeType(mime: string) {
  return (
    mime === "application/pdf" || mime === "image/png" || mime === "image/jpeg"
  );
}

function formatStorageUploadError(raw: string) {
  const lower = raw.toLowerCase();
  const isBucketMissing =
    lower.includes("bucket not found") ||
    (lower.includes("bucket") && lower.includes("not found"));
  if (isBucketMissing) {
    return (
      'Storage bucket "documents" does not exist yet. In Supabase: open Storage → "New bucket" → name it exactly documents (keep it private). Or run the SQL in supabase/sql/documents_storage.sql (creates the bucket + policies), then try again.'
    );
  }
  return raw;
}

function getLatestForType(
  docs: CustomerDocumentRow[],
  type: string
): CustomerDocumentRow | null {
  const matches = docs.filter((d) => d.document_type === type);
  if (matches.length === 0) return null;
  return matches.reduce((best, cur) =>
    new Date(cur.created_at) > new Date(best.created_at) ? cur : best
  );
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "Approved":
      return "bg-emerald-100 text-emerald-900";
    case "Under Review":
      return "bg-sky-100 text-sky-900";
    case "Re-upload":
      return "bg-rose-100 text-rose-900";
    case "Uploaded":
      return "bg-amber-100 text-amber-900";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

function DocumentChecklist({
  loanType,
  documents,
}: {
  loanType: "home" | "business";
  documents: CustomerDocumentRow[];
}) {
  const required = [...requiredDocumentTypesForLoan(loanType)];
  const approvedCount = required.filter(
    (t) => getLatestForType(documents, t)?.status === "Approved"
  ).length;
  const submittedCount = required.filter((t) => getLatestForType(documents, t) != null)
    .length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Required document checklist</h3>
      <p className="mt-1 text-xs text-slate-600">
        {loanType === "home"
          ? "Home loan: upload ID, income, bank statements, and property-related documents."
          : "Business loan: upload ID, income, bank statements, and business registration."}{" "}
        <span className="font-medium text-slate-800">
          {approvedCount}/{required.length} approved
        </span>
        ·{" "}
        <span className="font-medium text-slate-800">
          {submittedCount}/{required.length} received
        </span>
      </p>
      <ul className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200">
        {required.map((type) => {
          const latest = getLatestForType(documents, type);
          const label = documentTypeLabel(type);
          return (
            <li key={type} className="flex flex-col gap-1 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-medium text-slate-800">{label}</span>
              {!latest ? (
                <span className="inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  Not uploaded
                </span>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(
                      latest.status
                    )}`}
                  >
                    {latest.status}
                  </span>
                  {latest.status === "Re-upload" ? (
                    <span className="text-xs font-medium text-rose-700">
                      Ops requested a new file — use “Replace file” below.
                    </span>
                  ) : null}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-slate-500">
        Use <strong>Add another document</strong> for each required type (and optional{" "}
        <strong>Other</strong> extras). Status changes after operations reviews your files.
      </p>
    </div>
  );
}

interface CustomerDocumentsSectionProps {
  applicationId: string;
  loanType: "home" | "business";
  allowUpload: boolean;
  initialDocuments: CustomerDocumentRow[];
}

export function CustomerDocumentsSection({
  applicationId,
  loanType,
  allowUpload,
  initialDocuments,
}: CustomerDocumentsSectionProps) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [reuploadingId, setReuploadingId] = useState<string | null>(null);

  async function handleDownload(path: string) {
    if (!supabase) {
      setMessage("Supabase client not configured.");
      return;
    }
    const { data, error } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUrl(path, 3600);
    if (error || !data?.signedUrl) {
      setMessage(error?.message ?? "Could not create download link.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function handleUpload(formData: FormData) {
    setMessage(null);
    if (!supabase) {
      setMessage("Supabase client not configured.");
      return;
    }

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setMessage("Please choose a file.");
      return;
    }
    if (file.size > DOCUMENT_MAX_BYTES) {
      setMessage("File must be 10 MB or smaller.");
      return;
    }
    if (!allowedMimeType(file.type)) {
      setMessage("Only PDF, PNG, and JPG files are allowed.");
      return;
    }

    const documentType = formData.get("documentType");
    if (typeof documentType !== "string" || !documentType) {
      setMessage("Please select a document type.");
      return;
    }

    setIsUploading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setMessage("You must be signed in.");
        return;
      }

      const storagePath = `${applicationId}/${crypto.randomUUID()}_${sanitizeFileName(file.name)}`;

      const { error: uploadError } = await supabase.storage
        .from(DOCUMENTS_BUCKET)
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        setMessage(formatStorageUploadError(uploadError.message));
        return;
      }

      const { error: rpcError } = await supabase.rpc("register_customer_document", {
        p_application_id: applicationId,
        p_document_type: documentType,
        p_file_name: file.name,
        p_mime_type: file.type,
        p_file_size_bytes: file.size,
        p_storage_path: storagePath,
        p_storage_bucket: DOCUMENTS_BUCKET,
      });

      if (rpcError) {
        const fallback = await supabase.from("documents").insert({
          application_id: applicationId,
          uploaded_by: user.id,
          document_type: documentType,
          file_name: file.name,
          mime_type: file.type,
          file_size_bytes: file.size,
          storage_bucket: DOCUMENTS_BUCKET,
          storage_path: storagePath,
          status: "Uploaded",
        });
        if (fallback.error) {
          setMessage(
            `${rpcError.message}. If this mentions RLS, run supabase/sql/documents_rls_hotfix.sql in Supabase. (${fallback.error.message})`
          );
          return;
        }
      }

      setMessage("Document uploaded.");
      router.refresh();
    } finally {
      setIsUploading(false);
    }
  }

  async function handleReupload(documentId: string, previousStoragePath: string, formData: FormData) {
    setMessage(null);
    if (!supabase) {
      setMessage("Supabase client not configured.");
      return;
    }

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setMessage("Please choose a replacement file.");
      return;
    }
    if (file.size > DOCUMENT_MAX_BYTES) {
      setMessage("File must be 10 MB or smaller.");
      return;
    }
    if (!allowedMimeType(file.type)) {
      setMessage("Only PDF, PNG, and JPG files are allowed.");
      return;
    }

    setReuploadingId(documentId);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setMessage("You must be signed in.");
        return;
      }

      const newPath = `${applicationId}/${crypto.randomUUID()}_${sanitizeFileName(file.name)}`;

      const { error: uploadError } = await supabase.storage
        .from(DOCUMENTS_BUCKET)
        .upload(newPath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        setMessage(formatStorageUploadError(uploadError.message));
        return;
      }

      const current = initialDocuments.find((d) => d.id === documentId);
      const nextVersion = (current?.version ?? 1) + 1;

      const { error: updateError } = await supabase
        .from("documents")
        .update({
          storage_path: newPath,
          file_name: file.name,
          mime_type: file.type,
          file_size_bytes: file.size,
          status: "Uploaded",
          version: nextVersion,
        })
        .eq("id", documentId)
        .eq("uploaded_by", user.id);

      if (updateError) {
        setMessage(updateError.message);
        await supabase.storage.from(DOCUMENTS_BUCKET).remove([newPath]);
        return;
      }

      if (previousStoragePath && previousStoragePath !== newPath) {
        await supabase.storage.from(DOCUMENTS_BUCKET).remove([previousStoragePath]);
      }

      setMessage("Document replaced. Our team will review the new file.");
      router.refresh();
    } finally {
      setReuploadingId(null);
    }
  }

  const reuploadDocs = initialDocuments.filter((d) => d.status === "Re-upload");

  return (
    <section className="mt-6 space-y-6">
      <DocumentChecklist loanType={loanType} documents={initialDocuments} />

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Documents</h2>
        <p className="mt-2 text-sm text-slate-600">
          Upload PDF, PNG, or JPG up to 10 MB. Status updates appear after operations review.
        </p>

        {message ? (
          <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
            {message}
          </p>
        ) : null}

        {allowUpload && reuploadDocs.length > 0 ? (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50/80 p-4">
            <h3 className="text-sm font-semibold text-rose-900">Replace files (re-upload requested)</h3>
            <p className="mt-1 text-xs text-rose-800">
              Operations marked these documents for a new upload. Replace each one with a corrected file.
            </p>
            <ul className="mt-3 space-y-4">
              {reuploadDocs.map((doc) => (
                <li
                  key={doc.id}
                  className="rounded-lg border border-rose-200 bg-white p-3"
                >
                  <p className="text-sm font-medium capitalize text-slate-800">
                    {doc.document_type.replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-slate-500">Previous: {doc.file_name ?? doc.storage_path}</p>
                  <form
                    className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end"
                    action={(fd) => handleReupload(doc.id, doc.storage_path, fd)}
                  >
                    <input
                      name="file"
                      type="file"
                      required
                      accept={DOCUMENT_ACCEPT}
                      className="block w-full max-w-sm text-sm text-slate-600"
                    />
                    <button
                      type="submit"
                      disabled={reuploadingId === doc.id || !supabase}
                      className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-rose-700 px-4 text-sm font-semibold text-white hover:bg-rose-800 disabled:opacity-50"
                    >
                      {reuploadingId === doc.id ? "Uploading…" : "Replace file"}
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {allowUpload ? (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-800">Add another document</h3>
            <form
              className="mt-2 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
              action={handleUpload}
            >
              <div className="space-y-2">
                <label htmlFor="documentType" className="text-sm font-medium">
                  Document type
                </label>
                <select
                  id="documentType"
                  name="documentType"
                  required
                  className="h-10 w-full max-w-md rounded-lg border border-slate-300 bg-white px-3 text-sm"
                >
                  {DOCUMENT_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="file" className="text-sm font-medium">
                  File
                </label>
                <input
                  id="file"
                  name="file"
                  type="file"
                  required
                  accept={DOCUMENT_ACCEPT}
                  className="block w-full text-sm text-slate-600"
                />
              </div>
              <button
                type="submit"
                disabled={isUploading || !supabase}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {isUploading ? "Uploading…" : "Upload"}
              </button>
            </form>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-600">
            Uploads are closed for this application status.
          </p>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-800">All uploaded files</h3>
          {initialDocuments.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">No documents yet.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {initialDocuments.map((doc) => (
                <li
                  key={doc.id}
                  className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {doc.document_type.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-slate-500">{doc.file_name ?? doc.storage_path}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(
                          doc.status
                        )}`}
                      >
                        {doc.status}
                      </span>
                      {doc.version != null ? <span>v{doc.version}</span> : null}
                      <span>{new Date(doc.created_at).toLocaleString()}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDownload(doc.storage_path)}
                    className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    View / Download
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
