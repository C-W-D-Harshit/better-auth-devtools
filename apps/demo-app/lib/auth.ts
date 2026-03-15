import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { devtoolsPlugin } from "@better-auth-devtools/plugin";
import type {
  CreateManagedUserArgs,
  GetSessionViewArgs,
  PatchSessionArgs,
  DevtoolsSessionView,
} from "@better-auth-devtools/core";

const db = new Database("./demo.db");

export const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "viewer",
      },
    },
  },
  plugins: [
    devtoolsPlugin({
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

      createManagedUser: async (args: CreateManagedUserArgs) => {
        // Create a real Better Auth user using the database directly
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const role = (args.template.meta?.role as string) ?? "viewer";

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

      getSessionView: async (
        args: GetSessionViewArgs
      ): Promise<DevtoolsSessionView> => {
        const user = db
          .prepare("SELECT id, name, email, role FROM user WHERE id = ?")
          .get(args.userId) as
          | { id: string; name: string; email: string; role: string }
          | undefined;

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

      patchSession: async (
        args: PatchSessionArgs
      ): Promise<DevtoolsSessionView> => {
        // Update user fields based on patch
        if ("role" in args.patch) {
          db.prepare("UPDATE user SET role = ?, updatedAt = ? WHERE id = ?").run(
            args.patch.role as string,
            new Date().toISOString(),
            args.userId
          );
        }

        // Return updated session view
        const user = db
          .prepare("SELECT id, name, email, role FROM user WHERE id = ?")
          .get(args.userId) as
          | { id: string; name: string; email: string; role: string }
          | undefined;

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
    }),
  ],
});
