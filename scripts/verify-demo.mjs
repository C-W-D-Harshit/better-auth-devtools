import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const demo = join(root, "apps/demo-app");
const temp = mkdtempSync(join(tmpdir(), "better-auth-demo-http-"));
const port = 32000 + Math.floor(Math.random() * 10000);
const origin = `http://127.0.0.1:${port}`;
const environment = {
  ...process.env,
  NODE_ENV: "development",
  DEMO_DB_FILE: join(temp, "demo.db"),
  BETTER_AUTH_SECRET: "isolated-demo-http-verification-secret-32-chars",
  BETTER_AUTH_URL: origin,
};
let server;

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Demo server exited with ${server.exitCode}`);
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch { /* Server is still starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Demo server did not become ready");
}

let cookie = "";
async function request(path, body, withCookie = true) {
  const response = await fetch(`${origin}${path}`, {
    method: "POST",
    headers: {
      origin,
      "sec-fetch-site": "same-origin",
      "content-type": "application/json",
      ...(withCookie && cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
  });
  const setCookies = response.headers.getSetCookie();
  if (setCookies.length) cookie = setCookies.map((entry) => entry.split(";")[0]).join("; ");
  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : null };
}

try {
  for (let run = 0; run < 2; run += 1) {
    execFileSync("pnpm", ["--filter", "demo-app", "db:init"], { cwd: root, env: environment, stdio: "inherit" });
  }
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: demo,
    env: environment,
    stdio: "ignore",
  });
  await waitForServer();

  const records = {};
  for (const template of ["viewer", "admin"]) {
    const created = await request("/api/auth/better-auth-devtools/users", { template });
    assert.equal(created.status, 200, JSON.stringify(created.body));
    records[template] = created.body.user;
  }

  for (const template of ["viewer", "admin"]) {
    const switched = await request("/api/auth/better-auth-devtools/login", { userId: records[template].userId });
    assert.equal(switched.status, 200, JSON.stringify(switched.body));
    const sessionResponse = await fetch(`${origin}/api/auth/get-session`, { headers: { cookie } });
    const session = await sessionResponse.json();
    assert.equal(session.user.id, records[template].userId);
    assert.equal(session.user.role, template);

    const access = await request("/api/admin-check", {});
    assert.equal(access.status, template === "admin" ? 200 : 403, JSON.stringify(access.body));
  }

  cookie = "";
  const signup = await request("/api/auth/sign-up/email", { name: "Ordinary", email: "ordinary@example.test", password: "test-password-123", role: "admin" }, false);
  assert.equal(signup.status, 200, JSON.stringify(signup.body));
  assert.equal(signup.body.user.role, "viewer");
  console.log("Demo HTTP check passed: repeat migration, host sessions, protected route, and signup role.");
} finally {
  server?.kill("SIGTERM");
  rmSync(temp, { recursive: true, force: true });
}
