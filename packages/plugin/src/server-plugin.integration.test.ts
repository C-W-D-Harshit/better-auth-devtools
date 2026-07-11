import Database from "better-sqlite3";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import { devtools } from "./server-plugin.js";
import { ENDPOINTS } from "./endpoints.js";

const origin = "http://localhost:3000";
const basePath = "/api/auth";
const database = new Database(":memory:");
const auth = betterAuth({
  baseURL: `${origin}${basePath}`,
  secret: "beta-readiness-test-secret-that-is-long-enough",
  database,
  trustedOrigins: [origin],
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "viewer" },
    },
  },
  plugins: [
    devtools({
      templates: {
        admin: {
          label: "Admin",
          emailPattern: "admin@test.local",
          user: { role: "admin" },
        },
      },
      editableFields: [
        {
          key: "role",
          label: "Role",
          type: "select",
          options: ["admin", "viewer"],
        },
      ],
    }),
  ],
});

async function call(
  path: string,
  init: RequestInit & { cookie?: string } = {}
) {
  const headers = new Headers(init.headers);
  if (!headers.has("origin")) headers.set("origin", origin);
  if (!headers.has("sec-fetch-site")) {
    headers.set("sec-fetch-site", "same-origin");
  }
  if (init.body) {
    headers.set("content-type", "application/json");
  }
  if (init.cookie) {
    headers.set("cookie", init.cookie);
  }

  return auth.handler(
    new Request(`${origin}${basePath}${path}`, { ...init, headers })
  );
}

beforeAll(async () => {
  const migrations = await getMigrations(auth.options);
  await migrations.runMigrations();
});

afterAll(() => database.close());

describe("devtools server plugin", () => {
  it("discovers configuration without client-side setup", async () => {
    const response = await call(ENDPOINTS.CONFIG);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      enabled: true,
      templates: [{ key: "admin", label: "Admin" }],
      editableFields: [{ key: "role", type: "select" }],
      capabilities: { createUsers: true, deleteUsers: true, editSession: true },
    });
  });

  it("creates, switches to, edits, and deletes a managed user", async () => {
    const createResponse = await call(ENDPOINTS.CREATE_USER, {
      method: "POST",
      body: JSON.stringify({ template: "admin" }),
    });
    expect(createResponse.status).toBe(200);
    const created = (await createResponse.json()) as {
      user: { userId: string; email: string };
    };
    expect(created.user.email).toMatch(/^admin\+.+@test\.local$/);

    const listResponse = await call(ENDPOINTS.LIST_USERS);
    await expect(listResponse.json()).resolves.toMatchObject([
      { userId: created.user.userId, templateKey: "admin" },
    ]);

    const loginResponse = await call(ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify({ userId: created.user.userId }),
    });
    expect(loginResponse.status).toBe(200);
    const cookie = loginResponse.headers.get("set-cookie");
    expect(cookie).toContain("better-auth.session_token");
    await expect(loginResponse.json()).resolves.toMatchObject({
      session: { fields: { role: "admin" } },
    });

    const updateResponse = await call(ENDPOINTS.UPDATE_SESSION, {
      method: "POST",
      cookie: cookie ?? undefined,
      body: JSON.stringify({ patch: { role: "viewer" } }),
    });
    expect(updateResponse.status).toBe(200);
    await expect(updateResponse.json()).resolves.toMatchObject({
      session: { fields: { role: "viewer" } },
    });

    const sessionResponse = await call(ENDPOINTS.SESSION, {
      cookie: cookie ?? undefined,
    });
    await expect(sessionResponse.json()).resolves.toMatchObject({
      session: { fields: { role: "viewer" } },
    });

    const deleteResponse = await call(ENDPOINTS.DELETE_USER, {
      method: "POST",
      body: JSON.stringify({ userId: created.user.userId }),
    });
    expect(deleteResponse.status).toBe(200);
    await expect(deleteResponse.json()).resolves.toEqual({ success: true });

    const emptyList = await call(ENDPOINTS.LIST_USERS);
    await expect(emptyList.json()).resolves.toEqual([]);
  });

  it("rejects invalid templates and unmanaged session switching", async () => {
    const invalidTemplate = await call(ENDPOINTS.CREATE_USER, {
      method: "POST",
      body: JSON.stringify({ template: "owner" }),
    });
    expect(invalidTemplate.status).toBe(400);
    await expect(invalidTemplate.json()).resolves.toMatchObject({
      code: "INVALID_TEMPLATE",
    });

    const unmanagedLogin = await call(ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify({ userId: "not-managed" }),
    });
    expect(unmanagedLogin.status).toBe(403);
  });

  it("rejects wrong field types before they reach the adapter", async () => {
    const response = await call(ENDPOINTS.UPDATE_SESSION, {
      method: "POST",
      body: JSON.stringify({ patch: { role: 123 } }),
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      code: "INVALID_PATCH",
    });
  });

  it("rejects cross-origin writes", async () => {
    const response = await call(ENDPOINTS.CREATE_USER, {
      method: "POST",
      headers: {
        origin: "https://attacker.example",
        "sec-fetch-site": "cross-site",
      },
      body: JSON.stringify({ template: "admin" }),
    });

    expect(response.status).toBe(403);
  });
});
