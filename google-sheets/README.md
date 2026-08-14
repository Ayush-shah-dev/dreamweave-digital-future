# Form submissions → Google Sheets (plan)

**Status: planning document only — nothing in this folder is wired into the app yet.** This
describes exactly what will be built, why, and how, so it can be implemented in one pass (by me
or anyone else) without re-deriving the design.

## Why this approach

The site is a static build with no server on either host it runs on (Hostinger shared hosting
has none at all; Vercel is being used in static-export mode here too — see `vercel.json`). That
rules out the "normal" way to talk to the Google Sheets API v4, which requires a service-account
private key kept secret on a server. There is no server to keep it secret on, and putting that
key in the frontend bundle would let anyone who opens dev tools read and write your spreadsheet
directly — the exact class of mistake this project has been careful to avoid with Supabase.

Instead: **a Google Apps Script deployed as a Web App**, attached directly to the destination
spreadsheet. The browser `fetch()`s a POST straight to Google's servers; Google's servers run a
tiny script (under the *sheet owner's* Google identity, not a credential shipped to visitors) that
appends a row. No secret ever exists in the frontend. No server, no hosting cost, no API key to
rotate. Apps Script's free quota (20,000 URL Fetch/web app invocations per day on a consumer
account) is far beyond what four contact forms on a marketing site will ever see.

The trade-off, and why it's acceptable here: the Web App URL is not secret (anyone who finds it
could POST junk rows to your sheet), but it can only *append* rows in the shape the script
defines — not read the sheet, not modify other rows, not touch anything else in your Google
account. Basic spam mitigation is covered below.

**Decision (confirmed): Sheets logging runs *alongside* the existing WhatsApp hand-off, not
instead of it.** Every form still opens WhatsApp exactly as it does today — that stays the
primary, instant way you're notified of a new lead. The Sheets write is a silent, best-effort
background log: if it fails (network blip, Google having a bad day), the form still succeeds and
WhatsApp still opens. A lead is never blocked or lost because Sheets was unreachable; worst case
is a missing row you can always ask the person about again.

## What gets logged

One spreadsheet, one tab per form (cleanest — each form has different fields, and separate tabs
are easier to skim than one wide, mostly-empty-celled sheet). Every tab also gets a timestamp and
a page-source column for context.

### Tab: `Contact` — from `src/routes/contact.tsx`

| Column | Source field | Notes |
| --- | --- | --- |
| Timestamp | — | Set by the script (`new Date()`), not the client (don't trust client clocks) |
| Name | `name` | |
| Email | `email` | |
| Phone | `phone` | |
| Message | `message` | |
| Page | — | Hardcoded `"contact"` per form, for when logs are ever merged/audited |

### Tab: `Apply` — from `src/routes/apply.tsx`

| Column | Source field |
| --- | --- |
| Timestamp | — |
| Name | `name` |
| City | `city` |
| WhatsApp | `whatsapp` |
| Instagram | `instagram` |
| Followers | `followers` |
| Category | `category` |
| Portfolio | `portfolio` |
| Media kit | `mediakit` |

### Tab: `BookCampaign` — from `src/routes/book-campaign.tsx`

| Column | Source field |
| --- | --- |
| Timestamp | — |
| Business | `business` |
| Industry | `industry` |
| Budget | `budget` |
| Goal | `goal` |
| Location | `location` |
| Timeline | `timeline` |

### Tab: `Newsletter` — from `src/components/site/Footer.tsx`

| Column | Source field |
| --- | --- |
| Timestamp | — |
| Email | `email` |

All four forms already validate with `zod` (contact, apply, book-campaign) or a regex
(newsletter) client-side before anything happens — the Sheets write only ever fires with data
that already passed that validation, same data that goes into the WhatsApp message today.

## Setup (one-time, in the Google account that should own the data)

1. Create a new Google Sheet — name it something like "Dreamweave Digital — Form Submissions."
2. Create the four tabs above (`Contact`, `Apply`, `BookCampaign`, `Newsletter`), and put the
   header row from each table into row 1 of the matching tab.
3. Extensions → Apps Script. Delete the placeholder `myFunction` code and paste in
   [`Code.gs`](Code.gs) from this folder.
4. Deploy → New deployment → type **Web app**.
   - Execute as: **Me** (your account — this is what lets the script write to the sheet without
     the visitor needing any Google permissions of their own).
   - Who has access: **Anyone** (required — the site's visitors are anonymous; this does not
     grant them access to the *sheet*, only to this one narrow endpoint).
5. Authorize when prompted (first deploy only) — this is Google asking *you*, the sheet owner, to
   confirm the script may edit this sheet on your behalf.
6. Copy the Web app URL (`https://script.google.com/macros/s/AKfycb.../exec`). This is the value
   that goes into the site's environment variable — see below.
7. Send a test row (see "Testing" below) before wiring up the real forms.
8. **Whenever `Code.gs` is edited later, you must create a new deployment (or "Manage
   deployments" → edit → new version) for the change to take effect** — saving the script alone
   does not update the live Web App URL's behavior.

## `Code.gs` — what it does

See [`Code.gs`](Code.gs) for the full source. Summary of what it needs to do:

- `doPost(e)` receives the POST, reads a `sheet` field to pick which tab to append to (`Contact`,
  `Apply`, `BookCampaign`, or `Newsletter`) and a `data` object with that tab's fields.
- Validates the `sheet` name against an allow-list (reject anything else — don't let a crafted
  request write to an arbitrary/nonexistent tab or throw an unhandled error that leaks a stack
  trace).
- Appends a row: `[new Date(), ...fields in the tab's declared column order]` — column order is
  defined once in the script, not trusted from the request, so a malformed payload can't shuffle
  columns.
- Returns a small JSON response (`{ok: true}` / `{ok: false, error}`) — though see the CORS note
  below on why the frontend won't actually be able to read this response body in practice.
- Basic spam guard: rejects requests with an empty required field (name/email/message-equivalent
  for that tab) and caps field lengths server-side too (defense in depth — don't only trust the
  client-side zod validation, since this endpoint is public and can be hit directly).

## Frontend integration

### New file: `src/lib/google-sheets.ts`

```ts
// Fire-and-forget: never blocks or fails the caller. A lost log row is an acceptable trade-off
// for never blocking the WhatsApp hand-off, which is the primary lead channel.
const WEBHOOK_URL = import.meta.env["VITE_GOOGLE_SHEETS_WEBHOOK_URL"] as string | undefined;

export type SheetName = "Contact" | "Apply" | "BookCampaign" | "Newsletter";

export function logToGoogleSheet(sheet: SheetName, data: Record<string, string>): void {
  if (!WEBHOOK_URL) return; // not configured (e.g. local dev) — silently skip, never throw

  // Apps Script's web app endpoint doesn't handle CORS preflight (OPTIONS) requests, so a
  // request with a JSON Content-Type triggers a preflight that fails before the POST ever
  // lands. text/plain avoids the preflight; the script still parses e.postData.contents as JSON.
  // mode: "no-cors" means we can never read the response — that's fine, this is fire-and-forget.
  fetch(WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ sheet, data }),
  }).catch(() => {
    // Swallow errors deliberately — see file header comment.
  });
}
```

### Call sites (one line added per form, right where the WhatsApp `window.open` already happens)

- `contact.tsx`: after `setErrors({})`, before/alongside the `window.open(waLink(...))` call —
  `logToGoogleSheet("Contact", result.data)`.
- `apply.tsx`: right before the existing `window.open(waLink(...))` call in the final step —
  `logToGoogleSheet("Apply", parsed.data)`.
- `book-campaign.tsx`: same spot, final step — `logToGoogleSheet("BookCampaign", form as
  Record<string, string>)`.
- `Footer.tsx` newsletter form: in the existing `onSubmit`, after the regex check passes —
  `logToGoogleSheet("Newsletter", { email })`.

No loading state, no error UI, no change to any existing validation or the WhatsApp behavior —
this is purely an additive side effect next to code that already exists and already works.

### Environment variable

Add to `.env.example` (and each real `.env` / hosting provider's env var settings):

```
VITE_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/your-deployment-id/exec
```

Not a secret in the "must never leak" sense (unlike the Supabase publishable key situation, this
one doesn't need RLS-style reasoning — see the trade-off note above), but still environment-driven
rather than hardcoded so it can differ between local dev (usually unset — logging silently no-ops)
and production, and so the URL can be rotated by redeploying a new Apps Script version without a
code change.

## Testing

1. Deploy the Apps Script, grab the exec URL, test it directly before touching the frontend:
   ```sh
   curl -X POST "https://script.google.com/macros/s/.../exec" \
     -H "Content-Type: text/plain;charset=utf-8" \
     -d '{"sheet":"Contact","data":{"name":"Test","email":"test@example.com","phone":"9999999999","message":"test row"}}'
   ```
   Confirm a row appears in the `Contact` tab.
2. Test the allow-list rejection: same request with `"sheet":"NotARealTab"` — confirm it's
   rejected (no row appended anywhere) rather than throwing an unhandled script error.
3. Wire up the frontend, submit each of the 4 forms for real (contact, apply, book-campaign,
   newsletter), confirm one row lands in the correct tab each time, and confirm WhatsApp still
   opens exactly as before in every case.
4. Turn off wifi / block the Apps Script domain and submit a form — confirm the form still
   succeeds and WhatsApp still opens (the whole point of "fire-and-forget, never blocks").
5. Submit with the browser's dev tools Network tab open — confirm no response body/error is
   visible to a casual observer that would hint at spreadsheet structure (the `no-cors` mode
   already prevents JS from reading it, but worth eyeballing once).

## Explicitly out of scope for this pass

- No admin UI to view/manage these submissions — they live in the Sheet itself, which the
  business already has a Google account for.
- No de-duplication, no CRM sync, no email notifications beyond what Sheets/Apps Script triggers
  you could add later (e.g., a time-driven trigger that emails a daily digest — straightforward
  to bolt on later, not built here).
- No rate-limiting beyond the basic field-length/required-field checks in `Code.gs`. If this ever
  gets spammed, the fix is adding a lightweight challenge (e.g., a honeypot field, already easy to
  add to the existing zod schemas) rather than anything server-side, since there's no server.

## To implement this for real

This document plus `Code.gs` are the complete spec. Say the word and the actual changes are:
create `src/lib/google-sheets.ts`, add one `logToGoogleSheet(...)` call to each of the four forms,
add the env var to `.env.example`, and you'll separately need to do the one-time Google Sheets/Apps
Script setup above yourself (same reason as Supabase — I have no browser or Google account access)
and hand me back the Web App URL.
