import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import Database from "better-sqlite3";
import {
  createDevtoolsIntegration,
  defineDevtoolsConfig,
} from "better-auth-devtools/plugin";

const currentDir = dirname(fileURLToPath(import.meta.url));

export const dbFile = join(currentDir, "..", "demo.db");
export const db = new Database(dbFile);

export const devtoolsConfig = defineDevtoolsConfig({
  templates: {
    admin: {
      label: "Admin",
      emailPattern: "admin+{{n}}@test.local",
      meta: { role: "admin" },
    },
    editor: {
      label: "Editor",
      emailPattern: "editor+{{n}}@test.local",
      meta: { role: "editor" },
    },
    viewer: {
      label: "Viewer",
      emailPattern: "viewer+{{n}}@test.local",
      meta: { role: "viewer" },
    },
  },
  editableFields: [
    {
      key: "role",
      label: "Role",
      type: "select",
      options: ["admin", "editor", "viewer"],
    },
  ],
  createManagedUser: async (args) => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const role = args.template.meta?.role ?? "viewer";

    db.prepare(
      `INSERT INTO user (id, name, email, role, emailVerified, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(id, args.template.label, args.email, role, 1, now, now);

    return {
      userId: id,
      email: args.email,
      label: `${args.template.label} (${role})`,
    };
  },
  getSessionView: async (args) => {
    const user = db
      .prepare("SELECT id, name, email, role FROM user WHERE id = ?")
      .get(args.userId);

    return {
      userId: args.userId,
      email: user?.email,
      label: user?.name,
      fields: {
        userId: args.userId,
        email: user?.email ?? "",
        name: user?.name ?? "",
        role: user?.role ?? "viewer",
        sessionId: args.sessionId,
      },
      editableFields: ["role"],
    };
  },
  patchSession: async (args) => {
    if ("role" in args.patch) {
      db.prepare("UPDATE user SET role = ?, updatedAt = ? WHERE id = ?").run(
        args.patch.role,
        new Date().toISOString(),
        args.userId
      );
    }

    const user = db
      .prepare("SELECT id, name, email, role FROM user WHERE id = ?")
      .get(args.userId);

    return {
      userId: args.userId,
      email: user?.email,
      label: user?.name,
      fields: {
        userId: args.userId,
        email: user?.email ?? "",
        name: user?.name ?? "",
        role: user?.role ?? "viewer",
        sessionId: args.sessionId,
      },
      editableFields: ["role"],
    };
  },
});

export const devtools = createDevtoolsIntegration(devtoolsConfig, {
  position: "bottom-right",
  triggerLabel: "Auth DevTools",
});

export const authOptions = {
  database: db,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: /** @type {"string"} */ ("string"),
        defaultValue: "viewer",
      },
    },
  },
  plugins: [devtools.serverPlugin],
};
