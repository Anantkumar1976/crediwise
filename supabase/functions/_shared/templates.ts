export function layout(title: string, body: string, appUrl: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>${escapeHtml(title)}</title></head>
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#0f172a;max-width:560px;margin:24px auto;padding:0 16px;">
  <p style="font-size:14px;color:#64748b;margin:0 0 24px;">CrediWise</p>
  <h1 style="font-size:20px;margin:0 0 16px;">${escapeHtml(title)}</h1>
  ${body}
  <p style="margin-top:32px;font-size:13px;color:#94a3b8;">This is an automated message. Please do not reply directly.</p>
  <p style="font-size:14px;color:#64748b;margin-top:24px;"><a href="${escapeHtml(
    appUrl
  )}" style="color:#0ea5e9;">Open dashboard</a></p>
</body></html>`;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function loanLabel(loanType: string): string {
  if (loanType === "home") return "Home loan";
  if (loanType === "business") return "Business loan";
  return loanType;
}
