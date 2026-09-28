import Database from "better-sqlite3";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
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
      enabled: true,
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
  init: RequestInit & { cookie?: string; omitOrigin?: boolean } = {},
) {
  const headers = new Headers(init.headers);
  if (!init.omitOrigin && !headers.has("origin")) headers.set("origin", origin);
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
    new Request(`${origin}${basePath}${path}`, { ...init, headers }),
  );
}

beforeAll(async () => {
  const migrations = await getMigrations(auth.options);
  await migrations.runMigrations();
});

afterAll(() => database.close());
afterEach(() => vi.unstubAllEnvs());

describe("devtools server plugin", () => {
  it("keeps host and panel sessions current with a cookie cache", async () => {
    const cachedDatabase = new Database(":memory:");
    const cachedAuth = betterAuth({
      baseURL: `${origin}${basePath}`,
      secret: "cookie-cache-reproduction-secret-long-enough",
      database: cachedDatabase,
      trustedOrigins: [origin],
      session: { cookieCache: { enabled: true } },
      user: {
        additionalFields: { role: { type: "string", defaultValue: "viewer" } },
      },
      plugins: [
        devtools({
          enabled: true,
          templates: { admin: { label: "Admin", user: { role: "admin" } } },
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
    await (await getMigrations(cachedAuth.options)).runMigrations();
    const cookies = new Map<string, string>();
    const request = async (path: string, body?: unknown) => {
      const response = await cachedAuth.handler(
        new Request(`${origin}${basePath}${path}`, {
          method: body === undefined ? "GET" : "POST",
          headers: {
            origin,
            "sec-fetch-site": "same-origin",
            ...(body === undefined
              ? {}
              : { "content-type": "application/json" }),
            cookie: [...cookies]
              .map(([key, value]) => `${key}=${value}`)
              .join("; "),
          },
          body: body === undefined ? undefined : JSON.stringify(body),
        }),
      );
      for (const header of response.headers.getSetCookie()) {
        const [pair] = header.split(";");
        const separator = pair.indexOf("=");
        const name = pair.slice(0, separator);
        const value = pair.slice(separator + 1);
        if (/max-age=0/i.test(header)) cookies.delete(name);
        else cookies.set(name, value);
      }
      return response;
    };
    try {
      const created = (await (
        await request(ENDPOINTS.CREATE_USER, { template: "admin" })
      ).json()) as { user: { userId: string } };
      await request(ENDPOINTS.LOGIN, { userId: created.user.userId });
      const firstHostSession = (await (
        await request("/get-session")
      ).json()) as { session: { id: string }; user: { role: string } };
      expect(firstHostSession.user.role).toBe("admin");
      await request(ENDPOINTS.LOGIN, { userId: created.user.userId });
      await expect(
        (await request("/get-session")).json(),
      ).resolves.toMatchObject({
        session: { id: firstHostSession.session.id },
      });
      await request(ENDPOINTS.UPDATE_SESSION, { patch: { role: "viewer" } });
      await expect(
        (await request("/get-session")).json(),
      ).resolves.toMatchObject({ user: { role: "viewer" } });
      await expect(
        (await request(ENDPOINTS.SESSION)).json(),
      ).resolves.toMatchObject({ session: { fields: { role: "viewer" } } });
      await request(ENDPOINTS.DELETE_USER, { userId: created.user.userId });
      expect(await (await request("/get-session")).json()).toBeNull();
      await expect((await request(ENDPOINTS.SESSION)).json()).resolves.toEqual({
        session: null,
      });
      expect([...cookies.keys()].some((name) => name.includes("session"))).toBe(
        false,
      );
    } finally {
      cachedDatabase.close();
    }
  });
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
    const loginPayload = (await loginResponse.json()) as {
      session: { fields: { role: string; session: Record<string, unknown> } };
    };
    expect(loginPayload).toMatchObject({
      session: { fields: { role: "admin" } },
    });
    expect(loginPayload.session.fields.session).not.toHaveProperty("token");

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

    for (const template of ["constructor", "toString", "__proto__"]) {
      const inheritedTemplate = await call(ENDPOINTS.CREATE_USER, {
        method: "POST",
        body: JSON.stringify({ template }),
      });
      expect(inheritedTemplate.status).toBe(400);
    }

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

  it("rejects writes without a browser origin", async () => {
    const response = await call(ENDPOINTS.CREATE_USER, {
      method: "POST",
      omitOrigin: true,
      headers: { "sec-fetch-site": "none" },
      body: JSON.stringify({ template: "admin" }),
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      code: "UNTRUSTED_ORIGIN",
    });
  });

  it("cannot be enabled in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("DEV_AUTH_ENABLED", "true");

    const response = await call(ENDPOINTS.CONFIG);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      code: "FEATURE_DISABLED",
    });
  });

  it("enforces its own development rate limit", async () => {
    const limitedDatabase = new Database(":memory:");
    const limitedAuth = betterAuth({
      baseURL: `${origin}${basePath}`,
      secret: "rate-limit-test-secret-that-is-long-enough",
      database: limitedDatabase,
      trustedOrigins: [origin],
      plugins: [devtools({ enabled: true, rateLimit: { max: 2, window: 60 } })],
    });
    const migrations = await getMigrations(limitedAuth.options);
    await migrations.runMigrations();

    const request = () =>
      limitedAuth.handler(
        new Request(`${origin}${basePath}${ENDPOINTS.CONFIG}`, {
          headers: { origin, "sec-fetch-site": "same-origin" },
        }),
      );

    expect((await request()).status).toBe(200);
    expect((await request()).status).toBe(200);
    const limited = await request();
    expect(limited.status).toBe(429);
    expect(Number(limited.headers.get("retry-after"))).toBeGreaterThan(0);
    await expect(limited.json()).resolves.toMatchObject({
      code: "RATE_LIMITED",
      retryAfter: 60,
    });
    limitedDatabase.close();
  });

  it("removes secondary-storage sessions when deleting a managed user", async () => {
    const secondaryDatabase = new Database(":memory:");
    const storage = new Map<string, string>();
    const secondaryAuth = betterAuth({
      baseURL: `${origin}${basePath}`,
      secret: "secondary-storage-test-secret-that-is-long-enough",
      database: secondaryDatabase,
      trustedOrigins: [origin],
      secondaryStorage: {
        get: async (key) => storage.get(key) ?? null,
        set: async (key, value) => {
          storage.set(key, value);
        },
        delete: async (key) => {
          storage.delete(key);
        },
      },
      plugins: [devtools({ enabled: true })],
    });
    const migrations = await getMigrations(secondaryAuth.options);
    await migrations.runMigrations();
    const secondaryCall = async (
      path: string,
      init: RequestInit & { cookie?: string } = {},
    ) => {
      const headers = new Headers(init.headers);
      headers.set("origin", origin);
      headers.set("sec-fetch-site", "same-origin");
      if (init.body) headers.set("content-type", "application/json");
      if (init.cookie) headers.set("cookie", init.cookie);
      return secondaryAuth.handler(
        new Request(`${origin}${basePath}${path}`, { ...init, headers }),
      );
    };

    const created = (await (
      await secondaryCall(ENDPOINTS.CREATE_USER, {
        method: "POST",
        body: JSON.stringify({ template: "user" }),
      })
    ).json()) as { user: { userId: string } };
    const login = await secondaryCall(ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify({ userId: created.user.userId }),
    });
    const cookie = login.headers.get("set-cookie") ?? undefined;
    expect(storage.size).toBeGreaterThan(0);

    const deleted = await secondaryCall(ENDPOINTS.DELETE_USER, {
      method: "POST",
      body: JSON.stringify({ userId: created.user.userId }),
    });
    expect(deleted.status).toBe(200);

    const session = await secondaryCall(ENDPOINTS.SESSION, { cookie });
    await expect(session.json()).resolves.toEqual({ session: null });
    secondaryDatabase.close();
  });

  it("honors explicit unverified template values while protecting generated identity", async () => {
    const templateDatabase = new Database(":memory:");
    const templateAuth = betterAuth({
      baseURL: `${origin}${basePath}`,
      secret: "unverified-template-test-secret-long-enough",
      database: templateDatabase,
      trustedOrigins: [origin],
      plugins: [
        devtools({
          enabled: true,
          templates: {
            unverified: {
              label: "Unverified",
              user: {
                emailVerified: false,
                email: "spoof@example.com",
                id: "spoof-id",
                name: "Explicit name",
              },
            },
            ordinary: { label: "Ordinary" },
          },
        }),
      ],
    });
    await (await getMigrations(templateAuth.options)).runMigrations();
    const request = (path: string, body?: unknown, cookie?: string) =>
      templateAuth.handler(
        new Request(`${origin}${basePath}${path}`, {
          method: body === undefined ? "GET" : "POST",
          headers: {
            origin,
            "sec-fetch-site": "same-origin",
            ...(body === undefined
              ? {}
              : { "content-type": "application/json" }),
            ...(cookie ? { cookie } : {}),
          },
          body: body === undefined ? undefined : JSON.stringify(body),
        }),
      );
    try {
      const created = (await (
        await request(ENDPOINTS.CREATE_USER, { template: "unverified" })
      ).json()) as { user: { userId: string; email: string } };
      expect(created.user.userId).not.toBe("spoof-id");
      expect(created.user.email).toMatch(/^unverified\+.+@test\.local$/);
      const login = await request(ENDPOINTS.LOGIN, {
        userId: created.user.userId,
      });
      await expect(login.json()).resolves.toMatchObject({
        session: { fields: { emailVerified: false, name: "Explicit name" } },
      });
      const ordinary = (await (
        await request(ENDPOINTS.CREATE_USER, { template: "ordinary" })
      ).json()) as { user: { userId: string } };
      const ordinaryLogin = await request(ENDPOINTS.LOGIN, {
        userId: ordinary.user.userId,
      });
      await expect(ordinaryLogin.json()).resolves.toMatchObject({
        session: { fields: { emailVerified: true } },
      });
    } finally {
      templateDatabase.close();
    }
  });

  it("paginates and searches managed users beyond the legacy 100-user list", async () => {
    const pagingDatabase = new Database(":memory:");
    const pagingAuth = betterAuth({
      baseURL: `${origin}${basePath}`,
      secret: "pagination-test-secret-long-enough-yes",
      database: pagingDatabase,
      trustedOrigins: [origin],
      plugins: [devtools({ enabled: true, rateLimit: false })],
    });
    await (await getMigrations(pagingAuth.options)).runMigrations();
    const request = (path: string, body?: unknown) =>
      pagingAuth.handler(
        new Request(`${origin}${basePath}${path}`, {
          method: body === undefined ? "GET" : "POST",
          headers: {
            origin,
            "sec-fetch-site": "same-origin",
            ...(body === undefined
              ? {}
              : { "content-type": "application/json" }),
          },
          body: body === undefined ? undefined : JSON.stringify(body),
        }),
      );
    try {
      const created: Array<{ userId: string; email: string }> = [];
      for (let index = 0; index < 105; index++) {
        const result = (await (
          await request(ENDPOINTS.CREATE_USER, { template: "user" })
        ).json()) as { user: { userId: string; email: string } };
        created.push(result.user);
      }
      const legacy = (await (
        await request(ENDPOINTS.LIST_USERS)
      ).json()) as Array<{ userId: string }>;
      expect(Array.isArray(legacy)).toBe(true);
      expect(legacy).toHaveLength(100);
      const found: string[] = [];
      let cursor: string | null = null;
      do {
        const response = await request(
          `${ENDPOINTS.SEARCH_USERS}?limit=25${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
        );
        expect(response.status).toBe(200);
        const page = (await response.json()) as {
          users: Array<{ userId: string }>;
          hasMore: boolean;
          nextCursor: string | null;
        };
        expect(page.users.length).toBeLessThanOrEqual(25);
        found.push(...page.users.map((user) => user.userId));
        cursor = page.hasMore ? page.nextCursor : null;
      } while (cursor);
      expect(found).toHaveLength(105);
      expect(new Set(found).size).toBe(105);
      expect(found).toContain(created[0].userId);
      const search = await request(
        `${ENDPOINTS.SEARCH_USERS}?query=${encodeURIComponent(created[0].email.toUpperCase())}&limit=10`,
      );
      await expect(search.json()).resolves.toMatchObject({
        users: [{ userId: created[0].userId }],
        hasMore: false,
      });
      const matching: string[] = [];
      cursor = null;
      do {
        const response = await request(
          `${ENDPOINTS.SEARCH_USERS}?query=USER&limit=17${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
        );
        expect(response.status).toBe(200);
        const page = (await response.json()) as {
          users: Array<{ userId: string }>;
          hasMore: boolean;
          nextCursor: string | null;
        };
        matching.push(...page.users.map((user) => user.userId));
        cursor = page.hasMore ? page.nextCursor : null;
      } while (cursor);
      expect(matching).toEqual(found);
      const invalid = await request(`${ENDPOINTS.SEARCH_USERS}?limit=5000`);
      expect(invalid.status).toBe(400);
    } finally {
      pagingDatabase.close();
    }
  });

  it("preserves the not-found code when a user disappears during an edit", async () => {
    const created = (await (
      await call(ENDPOINTS.CREATE_USER, {
        method: "POST",
        body: JSON.stringify({ template: "admin" }),
      })
    ).json()) as { user: { userId: string } };
    const login = await call(ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify({ userId: created.user.userId }),
    });
    const cookie = login.headers.get("set-cookie") ?? undefined;
    const updateUser = vi
      .spyOn((await auth.$context).internalAdapter, "updateUser")
      .mockResolvedValueOnce(null);
    try {
      const response = await call(ENDPOINTS.UPDATE_SESSION, {
        method: "POST",
        body: JSON.stringify({ patch: { role: "viewer" } }),
        cookie,
      });
      expect(response.status).toBe(404);
      await expect(response.json()).resolves.toMatchObject({
        code: "USER_NOT_FOUND",
      });
    } finally {
      updateUser.mockRestore();
    }
  });

  it("edits and deletes active versus inactive users with cached secondary-storage sessions", async () => {
    const secondaryDatabase = new Database(":memory:");
    const storage = new Map<string, string>();
    const secondaryAuth = betterAuth({
      baseURL: `${origin}${basePath}`,
      secret: "secondary-cached-session-secret-long-enough",
      database: secondaryDatabase,
      trustedOrigins: [origin],
      session: { cookieCache: { enabled: true } },
      secondaryStorage: {
        get: async (key) => storage.get(key) ?? null,
        set: async (key, value) => {
          storage.set(key, value);
        },
        delete: async (key) => {
          storage.delete(key);
        },
      },
      user: {
        additionalFields: { role: { type: "string", defaultValue: "viewer" } },
      },
      plugins: [
        devtools({
          enabled: true,
          templates: { admin: { label: "Admin", user: { role: "admin" } } },
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
    await (await getMigrations(secondaryAuth.options)).runMigrations();
    const cookies = new Map<string, string>();
    const request = async (path: string, body?: unknown) => {
      const response = await secondaryAuth.handler(
        new Request(`${origin}${basePath}${path}`, {
          method: body === undefined ? "GET" : "POST",
          headers: {
            origin,
            "sec-fetch-site": "same-origin",
            ...(body === undefined
              ? {}
              : { "content-type": "application/json" }),
            cookie: [...cookies]
              .map(([key, value]) => `${key}=${value}`)
              .join("; "),
          },
          body: body === undefined ? undefined : JSON.stringify(body),
        }),
      );
      for (const header of response.headers.getSetCookie()) {
        const [pair] = header.split(";");
        const separator = pair.indexOf("=");
        const name = pair.slice(0, separator);
        if (/max-age=0/i.test(header)) cookies.delete(name);
        else cookies.set(name, pair.slice(separator + 1));
      }
      return response;
    };
    try {
      const first = (await (
        await request(ENDPOINTS.CREATE_USER, { template: "admin" })
      ).json()) as { user: { userId: string } };
      const second = (await (
        await request(ENDPOINTS.CREATE_USER, { template: "admin" })
      ).json()) as { user: { userId: string } };
      await request(ENDPOINTS.LOGIN, { userId: first.user.userId });
      const before = (await (await request("/get-session")).json()) as {
        session: { id: string };
      };
      await request(ENDPOINTS.UPDATE_SESSION, { patch: { role: "viewer" } });
      await expect(
        (await request("/get-session")).json(),
      ).resolves.toMatchObject({ user: { role: "viewer" } });
      await request(ENDPOINTS.DELETE_USER, { userId: second.user.userId });
      await expect(
        (await request("/get-session")).json(),
      ).resolves.toMatchObject({
        session: { id: before.session.id },
        user: { id: first.user.userId, role: "viewer" },
      });
      await request(ENDPOINTS.DELETE_USER, { userId: first.user.userId });
      expect(await (await request("/get-session")).json()).toBeNull();
      expect([...cookies.keys()].some((name) => name.includes("session"))).toBe(
        false,
      );
    } finally {
      secondaryDatabase.close();
    }
  });

  it("reports a missing migration with a structured code", async () => {
    const missingDatabase = new Database(":memory:");
    const missingAuth = betterAuth({
      baseURL: `${origin}${basePath}`,
      secret: "missing-migration-secret-long-enough",
      database: missingDatabase,
      plugins: [devtools({ enabled: true })],
    });
    try {
      const response = await missingAuth.handler(
        new Request(`${origin}${basePath}${ENDPOINTS.CONFIG}`),
      );
      expect(response.status).toBe(500);
      await expect(response.json()).resolves.toMatchObject({
        code: "MIGRATION_REQUIRED",
      });
    } finally {
      missingDatabase.close();
    }
  });

  it("keeps custom application-data hooks and per-session edit restrictions", async () => {
    const customDatabase = new Database(":memory:");
    const profile = new Map<string, string>();
    let editable = true;
    const customAuth = betterAuth({
      baseURL: `${origin}${basePath}`,
      secret: "custom-edit-hook-test-secret-long-enough",
      database: customDatabase,
      trustedOrigins: [origin],
      plugins: [
        devtools({
          enabled: true,
          editableFields: [
            { key: "profileNote", label: "Profile note", type: "string" },
          ],
          async getSessionView({ userId }) {
            return {
              userId,
              fields: { profileNote: profile.get(userId) ?? "" },
              editableFields: editable ? ["profileNote"] : [],
            };
          },
          async patchSession({ userId, patch }) {
            profile.set(userId, String(patch.profileNote));
            return {
              userId,
              fields: { profileNote: profile.get(userId) },
              editableFields: ["profileNote"],
            };
          },
        }),
      ],
    });
    await (await getMigrations(customAuth.options)).runMigrations();
    const request = (path: string, body?: unknown, cookie?: string) =>
      customAuth.handler(
        new Request(`${origin}${basePath}${path}`, {
          method: body === undefined ? "GET" : "POST",
          headers: {
            origin,
            "sec-fetch-site": "same-origin",
            ...(body === undefined
              ? {}
              : { "content-type": "application/json" }),
            ...(cookie ? { cookie } : {}),
          },
          body: body === undefined ? undefined : JSON.stringify(body),
        }),
      );
    try {
      const created = (await (
        await request(ENDPOINTS.CREATE_USER, { template: "user" })
      ).json()) as { user: { userId: string } };
      const login = await request(ENDPOINTS.LOGIN, {
        userId: created.user.userId,
      });
      const cookie = login.headers.get("set-cookie") ?? undefined;
      const config = (await (await request(ENDPOINTS.CONFIG)).json()) as {
        capabilities: { editTarget: string };
      };
      expect(config.capabilities.editTarget).toBe("custom");
      const patch = await request(
        ENDPOINTS.UPDATE_SESSION,
        { patch: { profileNote: "Lives in app storage" } },
        cookie,
      );
      expect(patch.status).toBe(200);
      expect(profile.get(created.user.userId)).toBe("Lives in app storage");
      const host = (await (
        await request("/get-session", undefined, cookie)
      ).json()) as { user: Record<string, unknown> };
      expect(host.user).not.toHaveProperty("profileNote");
      editable = false;
      const denied = await request(
        ENDPOINTS.UPDATE_SESSION,
        { patch: { profileNote: "Should not write" } },
        cookie,
      );
      expect(denied.status).toBe(400);
      await expect(denied.json()).resolves.toMatchObject({
        code: "INVALID_PATCH",
      });
      expect(profile.get(created.user.userId)).toBe("Lives in app storage");
    } finally {
      customDatabase.close();
    }
  });
});
