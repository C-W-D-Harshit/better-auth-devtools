import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const envFile = join(root, "apps/demo-app/.env.local");
const port = 3100;

if (!existsSync(envFile) && !process.env.BETTER_AUTH_SECRET) {
  writeFileSync(
    envFile,
    `BETTER_AUTH_SECRET=${randomBytes(32).toString("hex")}\nBETTER_AUTH_URL=http://localhost:${port}\n`,
    { mode: 0o600, flag: "wx" },
  );
  console.log("Created apps/demo-app/.env.local with a random development secret.");
} else if (existsSync(envFile)) {
  const file = readFileSync(envFile, "utf8");
  if (!process.env.BETTER_AUTH_SECRET && !/^BETTER_AUTH_SECRET=(.{32,})$/m.test(file)) {
    throw new Error("The existing apps/demo-app/.env.local needs a BETTER_AUTH_SECRET of at least 32 characters. It was not changed.");
  }
}

function run(args, environment = process.env) {
  const result = spawnSync("pnpm", args, {
    cwd: root,
    env: environment,
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run(["--filter", "better-auth-devtools", "build"]);
run(["--filter", "demo-app", "db:init"]);
console.log(`Starting demo at http://localhost:${port}`);
run(["--dir", "apps/demo-app", "exec", "next", "dev", "--hostname", "127.0.0.1", "--port", String(port)], {
  ...process.env,
  BETTER_AUTH_URL: `http://localhost:${port}`,
});
