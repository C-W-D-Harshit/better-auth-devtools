import { afterAll, describe, expect, it } from "vitest";
import { authOptions, db, devtoolsPlugin } from "./auth-options.mjs";

afterAll(() => db.close());

describe("demo auth options", () => {
  it("explicitly enables the DevTools plugin with its schema", () => {
    expect(devtoolsPlugin.id).toBe("better-auth-devtools");
    expect(devtoolsPlugin.schema).toHaveProperty("devtoolsUser");
    expect(authOptions.plugins).toContain(devtoolsPlugin);
  });
});
