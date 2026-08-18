// Covers src/lib/leads.ts against a mocked Supabase client: the public fire-and-forget writes
// (submitLead, subscribeNewsletter), the pure display helpers, and the admin-only reads/writes
// used by AdminLeads/AdminOverview. The "not configured" branch (supabase === null) is covered
// separately in leads.unconfigured.test.ts, since that requires a different static mock of
// "@/integrations/supabase/client" for the whole file.
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FormSubmission, NewsletterSubscriber } from "@/integrations/supabase/types";

type MockResult = { data?: unknown; error?: unknown };

function createBuilder() {
  let result: MockResult = { data: null, error: null };
  const builder = {
    __setResult: (r: MockResult) => {
      result = r;
    },
    insert: vi.fn(() => builder),
    select: vi.fn(() => builder),
    order: vi.fn(() => builder),
    update: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    single: vi.fn(() => builder),
    then: (resolve: (value: MockResult) => unknown, reject?: (reason: unknown) => unknown) =>
      Promise.resolve(result).then(resolve, reject),
  };
  return builder;
}

const builder = createBuilder();
const fromMock = vi.fn(() => builder);
const mockClient = { from: fromMock };

vi.mock("@/integrations/supabase/client", () => ({
  supabase: mockClient,
  requireSupabase: () => mockClient,
}));

const {
  submitLead,
  subscribeNewsletter,
  summarizeLead,
  listLeads,
  updateLeadStatus,
  deleteLead,
  listNewsletterSubscribers,
  deleteNewsletterSubscriber,
} = await import("./leads");

const flush = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => {
  fromMock.mockClear();
  for (const m of [
    builder.insert,
    builder.select,
    builder.order,
    builder.update,
    builder.delete,
    builder.eq,
    builder.single,
  ]) {
    m.mockClear();
  }
  builder.__setResult({ data: null, error: null });
});

describe("submitLead", () => {
  it("inserts a row scoped to the given form type", async () => {
    builder.__setResult({ data: null, error: null });
    submitLead("contact", { name: "Asha", email: "asha@example.com" });
    await flush();
    expect(fromMock).toHaveBeenCalledWith("form_submissions");
    expect(builder.insert).toHaveBeenCalledWith({
      form_type: "contact",
      data: { name: "Asha", email: "asha@example.com" },
    });
  });

  it("logs but never throws when the insert fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    builder.__setResult({ data: null, error: { message: "boom" } });
    expect(() => submitLead("apply", { name: "Ravi" })).not.toThrow();
    await flush();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("apply"), "boom");
    consoleSpy.mockRestore();
  });
});

describe("subscribeNewsletter", () => {
  it("inserts the email", async () => {
    builder.__setResult({ data: null, error: null });
    subscribeNewsletter("fan@example.com");
    await flush();
    expect(fromMock).toHaveBeenCalledWith("newsletter_subscribers");
    expect(builder.insert).toHaveBeenCalledWith({ email: "fan@example.com" });
  });

  it("silently ignores a duplicate-email (unique violation) error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    builder.__setResult({ data: null, error: { code: "23505", message: "duplicate key" } });
    subscribeNewsletter("fan@example.com");
    await flush();
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("logs a non-duplicate error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    builder.__setResult({ data: null, error: { code: "500", message: "network down" } });
    subscribeNewsletter("fan@example.com");
    await flush();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe("summarizeLead", () => {
  it("summarizes a contact lead", () => {
    expect(
      summarizeLead("contact", { name: "Asha", email: "asha@example.com", phone: "", message: "" }),
    ).toEqual({
      title: "Asha",
      subtitle: "asha@example.com",
    });
  });

  it("falls back to phone when a contact lead has no email", () => {
    expect(
      summarizeLead("contact", { name: "Asha", email: "", phone: "9876543210", message: "" }),
    ).toEqual({
      title: "Asha",
      subtitle: "9876543210",
    });
  });

  it("summarizes a creator application", () => {
    expect(
      summarizeLead("apply", {
        name: "Ravi",
        city: "Ahmedabad",
        instagram: "@ravi",
        whatsapp: "",
        followers: "",
        category: "",
        portfolio: "",
        mediakit: "",
      }),
    ).toEqual({ title: "Ravi", subtitle: "@ravi · Ahmedabad" });
  });

  it("summarizes a campaign brief", () => {
    expect(
      summarizeLead("book_campaign", {
        business: "Sole Co.",
        industry: "Footwear",
        budget: "₹50k-1L",
        goal: "",
        location: "",
        timeline: "",
      }),
    ).toEqual({ title: "Sole Co.", subtitle: "Footwear · ₹50k-1L" });
  });

  it("falls back to 'Unknown' when the primary field is missing", () => {
    expect(summarizeLead("contact", { name: "", email: "", phone: "", message: "" }).title).toBe(
      "Unknown",
    );
  });
});

describe("listLeads", () => {
  it("returns rows ordered by created_at desc", async () => {
    const rows = [{ id: "1" }] as unknown as FormSubmission[];
    builder.__setResult({ data: rows, error: null });
    await expect(listLeads()).resolves.toEqual(rows);
    expect(fromMock).toHaveBeenCalledWith("form_submissions");
    expect(builder.select).toHaveBeenCalledWith("*");
    expect(builder.order).toHaveBeenCalledWith("created_at", { ascending: false });
  });

  it("throws when the query errors", async () => {
    builder.__setResult({ data: null, error: { message: "db unreachable" } });
    await expect(listLeads()).rejects.toEqual({ message: "db unreachable" });
  });
});

describe("updateLeadStatus", () => {
  it("updates the row's status and returns it", async () => {
    const row = { id: "1", status: "contacted" } as unknown as FormSubmission;
    builder.__setResult({ data: row, error: null });
    await expect(updateLeadStatus("1", "contacted")).resolves.toEqual(row);
    expect(builder.update).toHaveBeenCalledWith({ status: "contacted" });
    expect(builder.eq).toHaveBeenCalledWith("id", "1");
  });
});

describe("deleteLead", () => {
  it("deletes by id", async () => {
    builder.__setResult({ data: null, error: null });
    await deleteLead("1");
    expect(fromMock).toHaveBeenCalledWith("form_submissions");
    expect(builder.delete).toHaveBeenCalled();
    expect(builder.eq).toHaveBeenCalledWith("id", "1");
  });

  it("throws when the delete errors", async () => {
    builder.__setResult({ data: null, error: { message: "not allowed" } });
    await expect(deleteLead("1")).rejects.toEqual({ message: "not allowed" });
  });
});

describe("listNewsletterSubscribers / deleteNewsletterSubscriber", () => {
  it("lists subscribers ordered by created_at desc", async () => {
    const rows = [{ id: "s1" }] as unknown as NewsletterSubscriber[];
    builder.__setResult({ data: rows, error: null });
    await expect(listNewsletterSubscribers()).resolves.toEqual(rows);
    expect(fromMock).toHaveBeenCalledWith("newsletter_subscribers");
  });

  it("deletes a subscriber by id", async () => {
    builder.__setResult({ data: null, error: null });
    await deleteNewsletterSubscriber("s1");
    expect(fromMock).toHaveBeenCalledWith("newsletter_subscribers");
    expect(builder.eq).toHaveBeenCalledWith("id", "s1");
  });
});
