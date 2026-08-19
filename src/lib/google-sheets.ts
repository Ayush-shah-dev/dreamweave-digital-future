// Fire-and-forget logging of form submissions to a Google Sheet, via a Google Apps Script Web
// App (see google-sheets/README.md and google-sheets/Code.gs for the full plan and setup).
// This never blocks or fails the caller — the WhatsApp hand-off next to every call site here is
// the primary lead channel; a lost log row is an acceptable trade-off for never blocking it.
const WEBHOOK_URL = import.meta.env["VITE_GOOGLE_SHEETS_WEBHOOK_URL"] as string | undefined;

export type SheetName = "Contact" | "Apply" | "BookCampaign" | "Newsletter";

export function logToGoogleSheet(sheet: SheetName, data: Record<string, string>): void {
  if (!WEBHOOK_URL) return; // not configured (e.g. local dev, or setup not done yet) — silent no-op

  // Apps Script's web app endpoint doesn't handle CORS preflight (OPTIONS) requests, so a
  // request with a JSON Content-Type triggers a preflight that fails before the POST ever lands.
  // text/plain avoids the preflight; Code.gs still parses e.postData.contents as JSON.
  // mode: "no-cors" means the response can never be read here — fine, this is fire-and-forget.
  fetch(WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ sheet, data }),
  }).catch(() => {
    // Swallow errors deliberately — see file header comment.
  });
}
