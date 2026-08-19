// Unit-tests the validation contract that gates the final "Submit application" step in
// apply.tsx (schema.safeParse(...) right before submitLead("apply", ...)).
import { describe, expect, it } from "vitest";
import { schema } from "./apply";

const valid = {
  name: "Ravi Shah",
  city: "Ahmedabad",
  whatsapp: "9876543210",
  instagram: "@ravishoots",
  followers: "25k",
  category: "Fashion",
  portfolio: "https://instagram.com/reel/xyz",
  mediakit: "",
};

describe("apply form schema", () => {
  it("accepts a valid submission", () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it("accepts empty portfolio and mediakit (only max length is enforced)", () => {
    expect(schema.safeParse({ ...valid, portfolio: "", mediakit: "" }).success).toBe(true);
  });

  it("rejects a name under 2 characters", () => {
    expect(schema.safeParse({ ...valid, name: "R" }).success).toBe(false);
  });

  it("rejects a whatsapp number under 8 characters", () => {
    expect(schema.safeParse({ ...valid, whatsapp: "123" }).success).toBe(false);
  });

  it("rejects a category under 2 characters", () => {
    expect(schema.safeParse({ ...valid, category: "F" }).success).toBe(false);
  });

  it("rejects a portfolio link over 300 characters", () => {
    expect(schema.safeParse({ ...valid, portfolio: "x".repeat(301) }).success).toBe(false);
  });
});
