import { describe, expect, it } from "vitest";
import { changedFields } from "./edit-fields.js";

const session = {
  userId: "user-1",
  fields: { name: "Alex", credits: 3, active: false, role: "viewer" },
};
const fields = [
  { key: "name", label: "Name", type: "string" as const },
  { key: "credits", label: "Credits", type: "number" as const },
  { key: "active", label: "Active", type: "boolean" as const },
  {
    key: "role",
    label: "Role",
    type: "select" as const,
    options: ["viewer", "admin"],
  },
];

describe("changedFields", () => {
  it("sends only dirty fields with their real types, including false and empty text", () => {
    expect(
      changedFields(session, fields, {
        name: "",
        credits: "3",
        active: true,
        role: "viewer",
      }),
    ).toEqual({ patch: { name: "", active: true }, errors: {} });
    expect(
      changedFields(
        { ...session, fields: { ...session.fields, active: true } },
        fields,
        { active: false, credits: "0", role: "admin" },
      ),
    ).toEqual({
      patch: { active: false, credits: 0, role: "admin" },
      errors: {},
    });
  });

  it("rejects unsupported clearing and malformed numbers or select values", () => {
    const result = changedFields(session, fields, {
      credits: "",
      role: "",
      name: "Alex",
    });
    expect(result.patch).toEqual({});
    expect(result.errors.credits).toMatch(
      /Clearing this field is not supported/,
    );
    expect(result.errors.role).toMatch(/Clearing this field is not supported/);
    expect(
      changedFields(session, fields, { credits: "Infinity", role: "owner" })
        .errors,
    ).toHaveProperty("credits");
    expect(
      changedFields(session, fields, { credits: "Infinity", role: "owner" })
        .errors,
    ).toHaveProperty("role");
  });
});
