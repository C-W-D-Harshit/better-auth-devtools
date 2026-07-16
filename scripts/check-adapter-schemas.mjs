import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const temporaryDirectory = mkdtempSync(
  join(tmpdir(), "better-auth-devtools-schema-")
);
const config = join(root, "apps", "demo-app", "lib", "auth.ts");
const env = {
  ...process.env,
  BETTER_AUTH_SECRET: "adapter-schema-test-secret-that-is-long-enough",
  BETTER_AUTH_URL: "http://localhost:3000",
};

function generate(adapter, output) {
  execFileSync(
    "pnpm",
    [
      "exec",
      "auth",
      "generate",
      "--config",
      config,
      "--adapter",
      adapter,
      "--dialect",
      "sqlite",
      "--output",
      output,
      "--yes",
    ],
    { cwd: root, env, stdio: "inherit" }
  );
}

try {
  const prismaOutput = join(temporaryDirectory, "schema.prisma");
  const drizzleOutput = join(temporaryDirectory, "schema.ts");
  generate("prisma", prismaOutput);
  generate("drizzle", drizzleOutput);

  const prisma = readFileSync(prismaOutput, "utf8");
  const drizzle = readFileSync(drizzleOutput, "utf8");
  assert.match(prisma, /model DevtoolsUser \{/);
  assert.match(prisma, /@@map\("devtoolsUser"\)/);
  assert.match(drizzle, /sqliteTable\("devtools_user"/);
  assert.match(drizzle, /export const devtoolsUserRelations/);
  console.log("Prisma and Drizzle plugin schema generation passed.");
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
