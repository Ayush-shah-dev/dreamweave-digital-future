// Covers the Footer newsletter signup — the one form on the site with no page of its own —
// against a mocked @/lib/leads and @tanstack/react-router (Footer only needs <Link> to render
// as a plain anchor for these purposes; no router context is otherwise exercised here).
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    hash: _hash,
    ...props
  }: {
    children: ReactNode;
    to: string;
    hash?: string;
    [key: string]: unknown;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

const toastError = vi.fn();
const toastSuccess = vi.fn();
vi.mock("sonner", () => ({
  toast: {
    error: (...args: unknown[]) => toastError(...args),
    success: (...args: unknown[]) => toastSuccess(...args),
  },
}));

const subscribeNewsletter = vi.fn();
vi.mock("@/lib/leads", () => ({
  subscribeNewsletter: (...args: unknown[]) => subscribeNewsletter(...args),
}));

const { Footer } = await import("./Footer");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Footer newsletter form", () => {
  it("rejects an invalid email without subscribing", async () => {
    const user = userEvent.setup();
    render(<Footer />);

    // "person@localhost" satisfies the <input type="email"> browser-native constraint (so the
    // submit event actually fires, both here in jsdom and in a real browser) but still fails
    // the component's own stricter regex, which requires a dot after the @ — this is the only
    // kind of string that can actually reach the toast.error branch instead of being blocked
    // upstream by native validation.
    await user.type(screen.getByLabelText("Newsletter"), "person@localhost");
    await user.click(screen.getByRole("button", { name: "Join" }));

    expect(subscribeNewsletter).not.toHaveBeenCalled();
    expect(toastError).toHaveBeenCalledWith("Enter a valid email address");
    expect(toastSuccess).not.toHaveBeenCalled();
  });

  it("subscribes a valid email and clears the field", async () => {
    const user = userEvent.setup();
    render(<Footer />);

    const input = screen.getByLabelText("Newsletter") as HTMLInputElement;
    await user.type(input, "fan@example.com");
    await user.click(screen.getByRole("button", { name: "Join" }));

    expect(subscribeNewsletter).toHaveBeenCalledWith("fan@example.com");
    expect(toastSuccess).toHaveBeenCalled();
    expect(input.value).toBe("");
  });
});
