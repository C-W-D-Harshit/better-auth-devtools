import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import Database from "better-sqlite3";
import { devtools } from "better-auth-devtools";

const currentDir = dirname(fileURLToPath(import.meta.url));

export const dbFile = join(currentDir, "..", "demo.db");
export const db = new Database(dbFile);

export const devtoolsPlugin = devtools({
  templates: {
    admin: {
      label: "Admin",
      emailPattern: "admin+{{n}}@test.local",
      user: { role: "admin" },
    },
    editor: {
      label: "Editor",
      emailPattern: "editor+{{n}}@test.local",
      user: { role: "editor" },
    },
    viewer: {
      label: "Viewer",
      emailPattern: "viewer+{{n}}@test.local",
      user: { role: "viewer" },
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
  plugins: [devtoolsPlugin],
};
