// Unit-tests the validation contract that gates every Contact form submission (and therefore
// every submitLead("contact", ...) / logToGoogleSheet call) — see contact.tsx's onSubmit.
import { describe, expect, it } from "vitest";
import { schema } from "./contact";

const valid = {
  name: "Asha Patel",
  email: "asha@example.com",
  phone: "9876543210",
  message: "Looking to book a campaign for our sneaker launch next month.",
};

describe("contact form schema", () => {
  it("accepts a valid submission", () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it("rejects a name under 2 characters", () => {
    expect(schema.safeParse({ ...valid, name: "A" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(schema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects a phone number under 8 characters", () => {
    expect(schema.safeParse({ ...valid, phone: "123" }).success).toBe(false);
  });

  it("rejects a message under 10 characters", () => {
    expect(schema.safeParse({ ...valid, message: "Hi there" }).success).toBe(false);
  });

  it("rejects a message over 1000 characters", () => {
    expect(schema.safeParse({ ...valid, message: "x".repeat(1001) }).success).toBe(false);
  });

  it("trims whitespace-only fields to empty and rejects them", () => {
    expect(schema.safeParse({ ...valid, name: "   " }).success).toBe(false);
  });
});
