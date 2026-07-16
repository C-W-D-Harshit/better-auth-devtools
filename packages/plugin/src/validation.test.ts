import { describe, expect, it } from "vitest";
import { filterAllowedPatchKeys, isValidTemplateKey } from "./validation.js";

describe("validation", () => {
  it("accepts only own template keys", () => {
    const templates = { user: { label: "Test User" } };

    expect(isValidTemplateKey("user", templates)).toBe(true);
    expect(isValidTemplateKey("constructor", templates)).toBe(false);
    expect(isValidTemplateKey("toString", templates)).toBe(false);
    expect(isValidTemplateKey("__proto__", templates)).toBe(false);
  });

  it("separates allowed and disallowed patch keys", () => {
    expect(
      filterAllowedPatchKeys(
        { role: "admin", token: "secret" },
        [{ key: "role", label: "Role" }]
      )
    ).toEqual({ allowed: { role: "admin" }, disallowed: ["token"] });
  });
});
