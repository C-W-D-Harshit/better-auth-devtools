import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const packageDirectory = join(root, "packages", "plugin");
const temporaryDirectory = mkdtempSync(join(tmpdir(), "better-auth-devtools-"));
const betterAuthVersion = process.env.BETTER_AUTH_SMOKE_VERSION ?? "^1.6.23";

try {
  execFileSync(
    "pnpm",
    ["pack", "--pack-destination", temporaryDirectory],
    { cwd: packageDirectory, stdio: "inherit" }
  );

  const tarballName = readdirSync(temporaryDirectory).find((file) =>
    file.endsWith(".tgz")
  );
  assert.ok(tarballName, "pnpm pack did not create a tarball");
  const tarball = join(temporaryDirectory, tarballName);
  writeFileSync(
    join(temporaryDirectory, "package.json"),
    JSON.stringify({ name: "packed-package-smoke", private: true, type: "module" })
  );
  execFileSync(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      tarball,
      `better-auth@${betterAuthVersion}`,
      "react@18",
      "react-dom@18",
    ],
    { cwd: temporaryDirectory, stdio: "inherit" }
  );

  const smokeTest = `
    import assert from "node:assert/strict";
    import React from "react";
    import { renderToString } from "react-dom/server";
    import { devtools } from "better-auth-devtools";
    import { devtoolsClientPlugin } from "better-auth-devtools/plugin";
    import { BetterAuthDevtools } from "better-auth-devtools/react";

    assert.equal(devtools().id, "better-auth-devtools");
    assert.equal(devtoolsClientPlugin().id, "better-auth-devtools");
    assert.equal(typeof BetterAuthDevtools, "function");
    assert.equal(
      renderToString(React.createElement(BetterAuthDevtools, { enabled: false })),
      ""
    );
  `;
  execFileSync("node", ["--input-type=module", "--eval", smokeTest], {
    cwd: temporaryDirectory,
    stdio: "inherit",
  });

  assert.ok(tarball.endsWith(".tgz"));
  console.log(`Packed package smoke test passed with Better Auth ${betterAuthVersion}.`);
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
