import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const temporaryDirectory = mkdtempSync(join(tmpdir(), "better-auth-onboarding-"));
const environment = {
  ...process.env,
  NODE_ENV: "development",
  BETTER_AUTH_URL: "http://localhost:4100",
  BETTER_AUTH_SECRET: "isolated-consumer-verification-secret-32-characters",
};

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, env: environment, stdio: "inherit" });
}

try {
  run("pnpm", ["pack", "--pack-destination", temporaryDirectory], join(root, "packages/plugin"));
  const tarballName = readdirSync(temporaryDirectory).find((file) => file.endsWith(".tgz"));
  assert.ok(tarballName, "pnpm pack did not create a tarball");

  writeFileSync(join(temporaryDirectory, "package.json"), JSON.stringify({ name: "onboarding-consumer", private: true, type: "module" }));
  run("npm", ["install", "--no-audit", "--no-fund", join(temporaryDirectory, tarballName), "better-auth@1.6.23", "auth@1.6.23", "better-sqlite3@^12", "react@19", "react-dom@19"], temporaryDirectory);

  writeFileSync(join(temporaryDirectory, "auth.mjs"), `
import Database from "better-sqlite3";
import { betterAuth } from "better-auth";
import { devtools } from "better-auth-devtools";

export const auth = betterAuth({
  database: new Database("./consumer.db"),
  emailAndPassword: { enabled: true },
  user: { additionalFields: { role: { type: "string", defaultValue: "viewer", input: false } } },
  plugins: [devtools({
    enabled: true,
    templates: {
      viewer: { label: "Viewer", user: { role: "viewer" } },
      admin: { label: "Admin", user: { role: "admin" } },
    },
  })],
});
`);

  run("npm", ["exec", "--", "auth", "migrate", "--config", "auth.mjs", "--yes"], temporaryDirectory);
  writeFileSync(join(temporaryDirectory, "verify.mjs"), `
import assert from "node:assert/strict";
import { auth } from "./auth.mjs";

const origin = "http://localhost:4100";
let cookie = "";
async function request(path, body, withCookie = true) {
  const response = await auth.handler(new Request(origin + "/api/auth/" + path, {
    method: body ? "POST" : "GET",
    headers: { "sec-fetch-site": "same-origin", ...(body ? { "content-type": "application/json", origin } : {}), ...(withCookie && cookie ? { cookie } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  }));
  const setCookies = response.headers.getSetCookie();
  if (setCookies.length) cookie = setCookies.map((entry) => entry.split(";")[0]).join("; ");
  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : null };
}

const created = {};
for (const template of ["viewer", "admin"]) {
  const result = await request("better-auth-devtools/users", { template });
  assert.equal(result.status, 200, JSON.stringify(result.body));
  created[template] = result.body.user;
}

for (const template of ["viewer", "admin"]) {
  const switched = await request("better-auth-devtools/login", { userId: created[template].userId });
  assert.equal(switched.status, 200, JSON.stringify(switched.body));
  const normal = await request("get-session");
  assert.equal(normal.status, 200);
  assert.equal(normal.body.user.id, created[template].userId);
  assert.equal(normal.body.user.email, created[template].email);
  assert.equal(normal.body.user.role, template);
}

cookie = "";
const signup = await request("sign-up/email", { name: "Ordinary", email: "ordinary@example.test", password: "test-password-123", role: "admin" }, false);
assert.equal(signup.status, 200, JSON.stringify(signup.body));
assert.equal(signup.body.user.role, "viewer");

process.env.NODE_ENV = "production";
const disabled = await request("better-auth-devtools/config");
assert.equal(disabled.status, 403);
console.log("Packed consumer: CLI migration, persona creation and switching, normal session, signup role, and production guard passed.");
`);
  run("node", ["verify.mjs"], temporaryDirectory);
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
