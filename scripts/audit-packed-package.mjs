import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const packageDirectory = join(root, "packages", "plugin");
const temporaryDirectory = mkdtempSync(
  join(tmpdir(), "better-auth-devtools-audit-")
);

try {
  execFileSync(
    "pnpm",
    ["pack", "--pack-destination", temporaryDirectory],
    { cwd: packageDirectory, stdio: "inherit" }
  );
  const tarballName = readdirSync(temporaryDirectory).find((file) =>
    file.endsWith(".tgz")
  );
  if (!tarballName) throw new Error("pnpm pack did not create a tarball");

  writeFileSync(
    join(temporaryDirectory, "package.json"),
    JSON.stringify({ name: "packed-package-audit", private: true })
  );
  execFileSync(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--no-fund",
      `./${tarballName}`,
      "better-auth@^1.6.23",
      "react@18",
      "react-dom@18",
    ],
    { cwd: temporaryDirectory, stdio: "inherit" }
  );
  execFileSync("npm", ["audit", "--omit=dev", "--audit-level=high"], {
    cwd: temporaryDirectory,
    stdio: "inherit",
  });
  console.log("Packed production dependency audit passed.");
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
