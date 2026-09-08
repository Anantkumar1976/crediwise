"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DOCUMENT_ACCEPT,
  DOCUMENT_MAX_BYTES,
  DOCUMENT_TYPE_OPTIONS,
  DOCUMENTS_BUCKET,
  requiredDocumentTypesForLoan,
} from "@/lib/documents/constants";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useI18n } from "@/components/i18n/locale-provider";
import { formatDashboardDateTime, formatMessage } from "@/lib/i18n/format";
import { docStatusLabel, docTypeLabel } from "@/lib/i18n/labels";

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

function formatStorageUploadError(raw: string, bucketMissing: string) {
  const lower = raw.toLowerCase();
  const isBucketMissing =
    lower.includes("bucket not found") ||
    (lower.includes("bucket") && lower.includes("not found"));
  if (isBucketMissing) {
    return bucketMissing;
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
  const { t } = useI18n();
  const copy = t.dashboard.docs;
  const required = [...requiredDocumentTypesForLoan(loanType)];
  const approvedCount = required.filter(
    (t) => getLatestForType(documents, t)?.status === "Approved"
  ).length;
  const submittedCount = required.filter((t) => getLatestForType(documents, t) != null)
    .length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{copy.checklistTitle}</h3>
      <p className="mt-1 text-xs text-slate-600">
        {loanType === "home" ? copy.checklistHome : copy.checklistBusiness}{" "}
        <span className="font-medium text-slate-800">
          {formatMessage(copy.approvedCount, { n: approvedCount, total: required.length })}
        </span>
        ·{" "}
        <span className="font-medium text-slate-800">
          {formatMessage(copy.receivedCount, { n: submittedCount, total: required.length })}
        </span>
      </p>
      <ul className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200">
        {required.map((type) => {
          const latest = getLatestForType(documents, type);
          const label = docTypeLabel(t, type);
          return (
            <li key={type} className="flex flex-col gap-1 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-medium text-slate-800">{label}</span>
              {!latest ? (
                <span className="inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  {copy.notUploaded}
                </span>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(
                      latest.status
                    )}`}
                  >
                    {docStatusLabel(t, latest.status)}
                  </span>
                  {latest.status === "Re-upload" ? (
                    <span className="text-xs font-medium text-rose-700">
                      {copy.reuploadHint}
                    </span>
                  ) : null}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-slate-500">
        {copy.checklistFooter}
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
  const { t, locale } = useI18n();
  const copy = t.dashboard.docs;
  const supabase = getSupabaseBrowserClient();
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [reuploadingId, setReuploadingId] = useState<string | null>(null);

  async function handleDownload(path: string) {
    if (!supabase) {
      setMessage(copy.supabaseMissing);
      return;
    }
    const { data, error } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUrl(path, 3600);
    if (error || !data?.signedUrl) {
      setMessage(error?.message ?? copy.downloadLink);
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function handleUpload(formData: FormData) {
    setMessage(null);
    if (!supabase) {
      setMessage(copy.supabaseMissing);
      return;
    }

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setMessage(copy.chooseFile);
      return;
    }
    if (file.size > DOCUMENT_MAX_BYTES) {
      setMessage(copy.fileTooLarge);
      return;
    }
    if (!allowedMimeType(file.type)) {
      setMessage(copy.fileType);
      return;
    }

    const documentType = formData.get("documentType");
    if (typeof documentType !== "string" || !documentType) {
      setMessage(copy.chooseType);
      return;
    }

    setIsUploading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setMessage(copy.signedIn);
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
        setMessage(formatStorageUploadError(uploadError.message, copy.bucketMissing));
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

      setMessage(copy.uploaded);
      router.refresh();
    } finally {
      setIsUploading(false);
    }
  }

  async function handleReupload(documentId: string, previousStoragePath: string, formData: FormData) {
    setMessage(null);
    if (!supabase) {
      setMessage(copy.supabaseMissing);
      return;
    }

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setMessage(copy.chooseReplacement);
      return;
    }
    if (file.size > DOCUMENT_MAX_BYTES) {
      setMessage(copy.fileTooLarge);
      return;
    }
    if (!allowedMimeType(file.type)) {
      setMessage(copy.fileType);
      return;
    }

    setReuploadingId(documentId);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setMessage(copy.signedIn);
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
        setMessage(formatStorageUploadError(uploadError.message, copy.bucketMissing));
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

      setMessage(copy.replaced);
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
        <h2 className="text-lg font-semibold">{copy.title}</h2>
        <p className="mt-2 text-sm text-slate-600">{copy.body}</p>

        {message ? (
          <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
            {message}
          </p>
        ) : null}

        {allowUpload && reuploadDocs.length > 0 ? (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50/80 p-4">
            <h3 className="text-sm font-semibold text-rose-900">{copy.replaceTitle}</h3>
            <p className="mt-1 text-xs text-rose-800">{copy.replaceBody}</p>
            <ul className="mt-3 space-y-4">
              {reuploadDocs.map((doc) => (
                <li
                  key={doc.id}
                  className="rounded-lg border border-rose-200 bg-white p-3"
                >
                  <p className="text-sm font-medium text-slate-800">
                    {docTypeLabel(t, doc.document_type)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatMessage(copy.previous, { name: doc.file_name ?? doc.storage_path })}
                  </p>
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
                      {reuploadingId === doc.id ? copy.uploading : copy.replaceFile}
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {allowUpload ? (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-800">{copy.addTitle}</h3>
            <form
              className="mt-2 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
              action={handleUpload}
            >
              <div className="space-y-2">
                <label htmlFor="documentType" className="text-sm font-medium">
                  {copy.documentType}
                </label>
                <select
                  id="documentType"
                  name="documentType"
                  required
                  className="h-10 w-full max-w-md rounded-lg border border-slate-300 bg-white px-3 text-sm"
                >
                  {DOCUMENT_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {docTypeLabel(t, o.value)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="file" className="text-sm font-medium">
                  {copy.file}
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
                {isUploading ? copy.uploading : copy.upload}
              </button>
            </form>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-600">
            {copy.uploadsClosed}
          </p>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-800">{copy.allFiles}</h3>
          {initialDocuments.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">{copy.empty}</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {initialDocuments.map((doc) => (
                <li
                  key={doc.id}
                  className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {docTypeLabel(t, doc.document_type)}
                    </p>
                    <p className="text-xs text-slate-500">{doc.file_name ?? doc.storage_path}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(
                          doc.status
                        )}`}
                      >
                        {docStatusLabel(t, doc.status)}
                      </span>
                      {doc.version != null ? <span>v{doc.version}</span> : null}
                      <span>{formatDashboardDateTime(doc.created_at, locale)}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDownload(doc.storage_path)}
                    className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    {copy.download}
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
