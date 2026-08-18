// logToGoogleSheet reads its webhook URL from import.meta.env at module load time, so each
// test stubs the env var and re-imports the module fresh (vi.resetModules) to pick it up.
import { afterEach, describe, expect, it, vi } from "vitest";

const originalFetch = global.fetch;

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  global.fetch = originalFetch;
});

describe("logToGoogleSheet", () => {
  it("does nothing when the webhook URL is not configured", async () => {
    vi.stubEnv("VITE_GOOGLE_SHEETS_WEBHOOK_URL", "");
    const fetchMock = vi.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    vi.resetModules();

    const { logToGoogleSheet } = await import("./google-sheets");
    logToGoogleSheet("Contact", { name: "Asha" });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the sheet name and data as text/plain in no-cors mode", async () => {
    vi.stubEnv("VITE_GOOGLE_SHEETS_WEBHOOK_URL", "https://script.google.com/macros/s/xyz/exec");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof fetch;
    vi.resetModules();

    const { logToGoogleSheet } = await import("./google-sheets");
    logToGoogleSheet("Apply", { name: "Asha", city: "Gandhinagar" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://script.google.com/macros/s/xyz/exec",
      expect.objectContaining({
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ sheet: "Apply", data: { name: "Asha", city: "Gandhinagar" } }),
      }),
    );
  });

  it("swallows a rejected fetch instead of throwing", async () => {
    vi.stubEnv("VITE_GOOGLE_SHEETS_WEBHOOK_URL", "https://script.google.com/macros/s/xyz/exec");
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"));
    global.fetch = fetchMock as unknown as typeof fetch;
    vi.resetModules();

    const { logToGoogleSheet } = await import("./google-sheets");
    expect(() => logToGoogleSheet("Contact", { name: "Asha" })).not.toThrow();

    await new Promise((r) => setTimeout(r, 0));
    expect(fetchMock).toHaveBeenCalled();
  });
});
