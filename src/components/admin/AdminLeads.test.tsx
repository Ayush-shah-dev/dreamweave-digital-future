// Exercises AdminLeads end to end against a mocked src/lib/leads data layer: rendering leads
// from all forms, filtering by tab/search/status, expanding a row's full data, changing a
// lead's status, and deleting a lead / subscriber through the confirm dialog.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { AdminLeads } from "./AdminLeads";
import type { FormSubmission, NewsletterSubscriber } from "@/integrations/supabase/types";

vi.mock("@/lib/leads", async () => {
  const actual = await vi.importActual<typeof import("@/lib/leads")>("@/lib/leads");
  return {
    ...actual,
    listLeads: vi.fn(),
    listNewsletterSubscribers: vi.fn(),
    updateLeadStatus: vi.fn(),
    deleteLead: vi.fn(),
    deleteNewsletterSubscriber: vi.fn(),
  };
});

const leadsLib = await import("@/lib/leads");
const mocked = vi.mocked(leadsLib);

function renderWithClient(ui: ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

const sampleLeads: FormSubmission[] = [
  {
    id: "1",
    form_type: "contact",
    data: {
      name: "Asha Patel",
      email: "asha@example.com",
      phone: "9876543210",
      message: "Hi there",
    },
    status: "new",
    created_at: "2026-01-01T10:00:00.000Z",
    updated_at: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "2",
    form_type: "apply",
    data: {
      name: "Ravi Shah",
      city: "Ahmedabad",
      whatsapp: "9123456780",
      instagram: "@ravishoots",
      followers: "25k",
      category: "Fashion",
      portfolio: "",
      mediakit: "",
    },
    status: "contacted",
    created_at: "2026-01-02T10:00:00.000Z",
    updated_at: "2026-01-02T10:00:00.000Z",
  },
];

const sampleSubscribers: NewsletterSubscriber[] = [
  { id: "s1", email: "fan@example.com", created_at: "2026-01-03T10:00:00.000Z" },
];

beforeEach(() => {
  vi.clearAllMocks();
  mocked.listLeads.mockResolvedValue(sampleLeads);
  mocked.listNewsletterSubscribers.mockResolvedValue(sampleSubscribers);
  mocked.updateLeadStatus.mockResolvedValue(sampleLeads[0]!);
  mocked.deleteLead.mockResolvedValue(undefined);
  mocked.deleteNewsletterSubscriber.mockResolvedValue(undefined);
});

describe("AdminLeads", () => {
  it("renders leads from every form with per-tab counts", async () => {
    renderWithClient(<AdminLeads />);
    expect(await screen.findByText("Asha Patel")).toBeInTheDocument();
    expect(screen.getByText("Ravi Shah")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /All leads \(2\)/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Contact \(1\)/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Newsletter \(1\)/ })).toBeInTheDocument();
  });

  it("filters to a single form type via its tab", async () => {
    const user = userEvent.setup();
    renderWithClient(<AdminLeads />);
    await screen.findByText("Asha Patel");

    await user.click(screen.getByRole("button", { name: /Creator applications/ }));

    expect(screen.queryByText("Asha Patel")).not.toBeInTheDocument();
    expect(screen.getByText("Ravi Shah")).toBeInTheDocument();
  });

  it("switches to the newsletter tab and lists subscribers", async () => {
    const user = userEvent.setup();
    renderWithClient(<AdminLeads />);
    await screen.findByText("Asha Patel");

    await user.click(screen.getByRole("button", { name: /^Newsletter/ }));

    expect(await screen.findByText("fan@example.com")).toBeInTheDocument();
    expect(screen.queryByText("Asha Patel")).not.toBeInTheDocument();
  });

  it("filters leads by search text", async () => {
    const user = userEvent.setup();
    renderWithClient(<AdminLeads />);
    await screen.findByText("Asha Patel");

    await user.type(screen.getByPlaceholderText("Search leads..."), "ravi");

    expect(screen.queryByText("Asha Patel")).not.toBeInTheDocument();
    expect(screen.getByText("Ravi Shah")).toBeInTheDocument();
  });

  it("expands a lead row to show its full submitted data", async () => {
    const user = userEvent.setup();
    renderWithClient(<AdminLeads />);
    await screen.findByText("Asha Patel");

    await user.click(screen.getByText("Asha Patel"));

    expect(await screen.findByText("asha@example.com")).toBeInTheDocument();
    expect(screen.getByText("Hi there")).toBeInTheDocument();
  });

  it("changes a lead's status", async () => {
    const user = userEvent.setup();
    renderWithClient(<AdminLeads />);
    await screen.findByText("Asha Patel");

    await user.selectOptions(screen.getByLabelText("Status for Asha Patel"), "contacted");

    expect(mocked.updateLeadStatus).toHaveBeenCalledWith("1", "contacted");
  });

  it("deletes a lead after the confirm dialog is accepted", async () => {
    const user = userEvent.setup();
    renderWithClient(<AdminLeads />);
    await screen.findByText("Asha Patel");

    await user.click(screen.getByRole("button", { name: "Delete lead from Asha Patel" }));
    await user.click(await screen.findByRole("button", { name: "Delete" }));

    await waitFor(() => expect(mocked.deleteLead).toHaveBeenCalledWith("1"));
  });

  it("removes a newsletter subscriber after the confirm dialog is accepted", async () => {
    const user = userEvent.setup();
    renderWithClient(<AdminLeads />);
    await screen.findByText("Asha Patel");
    await user.click(screen.getByRole("button", { name: /^Newsletter/ }));
    await screen.findByText("fan@example.com");

    await user.click(screen.getByRole("button", { name: "Remove fan@example.com" }));
    await user.click(await screen.findByRole("button", { name: "Delete" }));

    await waitFor(() => expect(mocked.deleteNewsletterSubscriber).toHaveBeenCalledWith("s1"));
  });

  it("shows an empty state when there are no leads", async () => {
    mocked.listLeads.mockResolvedValue([]);
    renderWithClient(<AdminLeads />);
    expect(await screen.findByText("No leads yet.")).toBeInTheDocument();
  });
});
