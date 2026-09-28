import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";

const temp = mkdtempSync(join(tmpdir(), "better-auth-demo-options-"));
const previousDbFile = process.env.DEMO_DB_FILE;
process.env.DEMO_DB_FILE = join(temp, "demo.db");

const { authOptions, db, devtoolsPlugin } = await import("./auth-options.mjs");

afterAll(() => {
  db.close();
  if (previousDbFile === undefined) delete process.env.DEMO_DB_FILE;
  else process.env.DEMO_DB_FILE = previousDbFile;
  rmSync(temp, { recursive: true, force: true });
});

describe("demo auth options", () => {
  it("explicitly enables the DevTools plugin with its schema", () => {
    expect(devtoolsPlugin.id).toBe("better-auth-devtools");
    expect(devtoolsPlugin.schema).toHaveProperty("devtoolsUser");
    expect(authOptions.plugins).toContain(devtoolsPlugin);
  });
});
