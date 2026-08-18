// Form submissions ("leads") and newsletter signups, stored in Supabase and shown on the
// admin dashboard's Leads page.
//
// The two write functions (submitLead, subscribeNewsletter) are fire-and-forget, same
// philosophy as lib/google-sheets.ts: WhatsApp is the primary hand-off for every form on the
// site, so a failed or unconfigured database write must never block or fail the caller — a
// lost lead row is an acceptable trade-off for never blocking the form.
//
// Everything below that (reads, status updates, deletes) requires an authenticated admin
// session — enforced by RLS in supabase/migrations/0002_leads.sql — and is only ever called
// from components rendered inside <AdminShell>, same convention as lib/admin-content.ts.
import { requireSupabase, supabase } from "@/integrations/supabase/client";
import type {
  FormSubmission,
  FormSubmissionStatus,
  FormSubmissionType,
  NewsletterSubscriber,
} from "@/integrations/supabase/types";

// Postgres unique_violation — used to treat "already subscribed" as a non-error.
const UNIQUE_VIOLATION = "23505";

export function submitLead(formType: FormSubmissionType, data: Record<string, string>): void {
  if (!supabase) return; // not configured (e.g. local dev, or setup not done yet) — silent no-op
  void (async () => {
    const { error } = await supabase.from("form_submissions").insert({ form_type: formType, data });
    if (error) console.error(`Failed to save ${formType} lead:`, error.message);
  })();
}

export function subscribeNewsletter(email: string): void {
  if (!supabase) return;
  void (async () => {
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    if (error && error.code !== UNIQUE_VIOLATION) {
      console.error("Failed to save newsletter signup:", error.message);
    }
  })();
}

// ---------------------------------------------------------------------------
// Display helpers — shared between AdminOverview and AdminLeads.
// ---------------------------------------------------------------------------

export const FORM_TYPE_LABELS: Record<FormSubmissionType, string> = {
  contact: "Contact",
  apply: "Creator application",
  book_campaign: "Campaign brief",
};

export const LEAD_FIELD_LABELS: Record<FormSubmissionType, Record<string, string>> = {
  contact: {
    name: "Full name",
    email: "Email",
    phone: "WhatsApp number",
    message: "Message",
  },
  apply: {
    name: "Full name",
    city: "City",
    whatsapp: "WhatsApp number",
    instagram: "Instagram handle",
    followers: "Follower count",
    category: "Primary category",
    portfolio: "Portfolio or top reel link",
    mediakit: "Media kit link",
  },
  book_campaign: {
    business: "Business name",
    industry: "Industry",
    budget: "Budget range",
    goal: "Campaign goal",
    location: "Location",
    timeline: "Timeline",
  },
};

/** A short "who is this" line for a lead row, before it's expanded to the full field list. */
export function summarizeLead(
  formType: FormSubmissionType,
  data: Record<string, string>,
): { title: string; subtitle: string } {
  switch (formType) {
    case "contact":
      return { title: data["name"] || "Unknown", subtitle: data["email"] || data["phone"] || "" };
    case "apply":
      return {
        title: data["name"] || "Unknown",
        subtitle: [data["instagram"], data["city"]].filter(Boolean).join(" · "),
      };
    case "book_campaign":
      return {
        title: data["business"] || "Unknown",
        subtitle: [data["industry"], data["budget"]].filter(Boolean).join(" · "),
      };
  }
}

// ---------------------------------------------------------------------------
// Admin reads/writes
// ---------------------------------------------------------------------------

export async function listLeads(): Promise<FormSubmission[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("form_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateLeadStatus(
  id: string,
  status: FormSubmissionStatus,
): Promise<FormSubmission> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("form_submissions")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteLead(id: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from("form_submissions").delete().eq("id", id);
  if (error) throw error;
}

export async function listNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function deleteNewsletterSubscriber(id: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from("newsletter_subscribers").delete().eq("id", id);
  if (error) throw error;
}
