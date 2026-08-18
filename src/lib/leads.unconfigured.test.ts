// Separate file from leads.test.ts because this needs a different static mock of
// "@/integrations/supabase/client" for its entire module lifetime: supabase === null, the
// state used everywhere else in the app to mean "not configured" (e.g. local dev with no
// .env). Public writes must silently no-op; admin reads/writes must reject instead of
// pretending to succeed.
import { describe, expect, it, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: null,
  requireSupabase: () => {
    throw new Error(
      "Supabase is not configured — set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
    );
  },
}));

const { submitLead, subscribeNewsletter, listLeads, deleteLead, listNewsletterSubscribers } =
  await import("./leads");

describe("leads.ts when Supabase is not configured", () => {
  it("submitLead is a silent no-op", () => {
    expect(() => submitLead("contact", { name: "Asha" })).not.toThrow();
  });

  it("subscribeNewsletter is a silent no-op", () => {
    expect(() => subscribeNewsletter("fan@example.com")).not.toThrow();
  });

  it("admin reads reject instead of silently returning nothing", async () => {
    await expect(listLeads()).rejects.toThrow("not configured");
    await expect(listNewsletterSubscribers()).rejects.toThrow("not configured");
  });

  it("admin writes reject instead of silently succeeding", async () => {
    await expect(deleteLead("1")).rejects.toThrow("not configured");
  });
});
