import { describe, expect, it } from "vitest";
import { filterAllowedPatchKeys, isValidTemplateKey } from "./validation.js";

describe("core validation helpers", () => {
  it("checks template keys against the template map", () => {
    expect(
      isValidTemplateKey("admin", {
        admin: { label: "Admin" },
      })
    ).toBe(true);
    expect(
      isValidTemplateKey("viewer", {
        admin: { label: "Admin" },
      })
    ).toBe(false);
  });

  it("splits allowed and disallowed patch keys", () => {
    expect(
      filterAllowedPatchKeys(
        {
          role: "admin",
          orgId: "org_1",
        },
        [{ key: "role", label: "Role" }]
      )
    ).toEqual({
      allowed: { role: "admin" },
      disallowed: ["orgId"],
    });
  });
});
