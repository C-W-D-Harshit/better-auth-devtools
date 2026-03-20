# Better Auth DevTools

> [!WARNING]
> Unofficial, alpha, development-only tooling for Better Auth. Do not enable it in production.

`better-auth-devtools` is a Better Auth devtool for local auth scenario testing. It gives you managed test users, instant session switching, session inspection, and a React panel for approved session-field edits.

## Installation

```bash
pnpm add better-auth-devtools
```

Peer requirements:

```bash
pnpm add better-auth react react-dom
```

Use these subpath exports:

```ts
import {
  createDevtoolsIntegration,
  defineDevtoolsConfig,
} from "better-auth-devtools/plugin";
import { BetterAuthDevtools } from "better-auth-devtools/react";
```

Required environment guard:

```bash
DEV_AUTH_ENABLED=true
```

The devtools run only when DEV_AUTH_ENABLED=true and the app is not running in production.

## How it works

1. The package stores managed test-user records in its own model.
2. Each managed test-user record points to a real Better Auth user in your app.
3. Switching users creates a Better Auth session for that real user.
4. The panel only shows and edits fields your app exposes through `getSessionView` and `patchSession`.

## Quick Start

Define your templates and host-app callbacks once. In Next.js App Router, keep database-backed devtools code on the server and pass panel props into a client wrapper from a server layout.

```ts
import {
  createDevtoolsIntegration,
  defineDevtoolsConfig,
} from "better-auth-devtools/plugin";

export const devtoolsConfig = defineDevtoolsConfig({
    templates: {
      admin: { label: "Admin", meta: { role: "admin" } },
      viewer: { label: "Viewer", meta: { role: "viewer" } },
    },
    editableFields: [
      {
        key: "role",
        label: "Role",
        type: "select",
        options: ["admin", "viewer"],
      },
    ],
    async createManagedUser(args) {
      const user = await db.user.create({
        data: {
          email: args.email,
          name: args.template.label,
          role: String(args.template.meta?.role ?? "viewer"),
        },
      });

      return {
        userId: user.id,
        email: user.email,
        label: args.template.label,
      };
    },
    async getSessionView(args) {
      const user = await db.user.findUnique({ where: { id: args.userId } });

      return {
        userId: args.userId,
        email: user?.email,
        label: user?.name,
        fields: {
          sessionId: args.sessionId,
          role: user?.role ?? "viewer",
        },
        editableFields: ["role"],
      };
    },
    async patchSession(args) {
      await db.user.update({
        where: { id: args.userId },
        data: { role: String(args.patch.role ?? "viewer") },
      });

      const user = await db.user.findUnique({ where: { id: args.userId } });

      return {
        userId: args.userId,
        email: user?.email,
        label: user?.name,
        fields: {
          sessionId: args.sessionId,
          role: user?.role ?? "viewer",
        },
        editableFields: ["role"],
      };
    },
});

export const devtools = createDevtoolsIntegration(devtoolsConfig, {
  position: "bottom-right",
  triggerLabel: "Auth DevTools",
});
```

`createManagedUser` must create a real Better Auth user in your app database and return that real user ID.

Server auth:

```ts
import { betterAuth } from "better-auth";
import { devtools } from "./devtools";

export const auth = betterAuth({
  database,
  plugins: [devtools.serverPlugin],
});
```

Client auth:

```ts
import { createAuthClient } from "better-auth/react";
import { devtoolsClientPluginFor } from "better-auth-devtools/plugin";
import type { DevtoolsConfig } from "@/lib/devtools-types";

export const authClient = createAuthClient({
  plugins: [devtoolsClientPluginFor<DevtoolsConfig>()],
});
```

## Prisma / ORM storage requirements

The plugin stores its managed test-user records in your auth database. If you use Prisma, add this model:

```prisma
model DevtoolsUser {
  id          String   @id @default(cuid())
  userId      String   @unique
  templateKey String
  label       String
  email       String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Then run:

```bash
pnpm prisma generate
pnpm prisma db push
```

Migration alternative:

```bash
pnpm prisma migrate dev
```

If you use Drizzle or another ORM adapter, add the equivalent storage for the `DevtoolsUser` model before testing the panel.

## Next.js App Router pattern

Keep the devtools config on the server:

```ts
import {
  createDevtoolsIntegration,
  defineDevtoolsConfig,
} from "better-auth-devtools/plugin";

export const devtoolsConfig = defineDevtoolsConfig({
    templates: {
      admin: { label: "Admin", meta: { role: "admin" } },
      viewer: { label: "Viewer", meta: { role: "viewer" } },
    },
    editableFields: [
      {
        key: "role",
        label: "Role",
        type: "select",
        options: ["admin", "viewer"],
      },
    ],
    async createManagedUser(args) {
      const user = await db.user.create({
        data: {
          email: args.email,
          name: args.template.label,
          role: String(args.template.meta?.role ?? "viewer"),
        },
      });

      return {
        userId: user.id,
        email: user.email,
        label: args.template.label,
      };
    },
    async getSessionView(args) {
      const user = await db.user.findUnique({ where: { id: args.userId } });

      return {
        userId: args.userId,
        email: user?.email,
        label: user?.name,
        fields: {
          sessionId: args.sessionId,
          role: user?.role ?? "viewer",
        },
        editableFields: ["role"],
      };
    },
    async patchSession(args) {
      await db.user.update({
        where: { id: args.userId },
        data: { role: String(args.patch.role ?? "viewer") },
      });

      const user = await db.user.findUnique({ where: { id: args.userId } });

      return {
        userId: args.userId,
        email: user?.email,
        label: user?.name,
        fields: {
          sessionId: args.sessionId,
          role: user?.role ?? "viewer",
        },
        editableFields: ["role"],
      };
    },
});

export const devtools = createDevtoolsIntegration(devtoolsConfig);
```

Create a client-safe type bridge:

```ts
export type DevtoolsConfig = typeof import("./devtools").devtoolsConfig;
```

Create your auth client with `devtoolsClientPluginFor<...>()`:

```ts
import { createAuthClient } from "better-auth/react";
import { devtoolsClientPluginFor } from "better-auth-devtools/plugin";
import type { DevtoolsConfig } from "@/lib/devtools-types";

export const authClient = createAuthClient({
  plugins: [devtoolsClientPluginFor<DevtoolsConfig>()],
});
```

If you want strongly typed client actions, pass your devtools config type to `devtoolsClientPluginFor<...>()`. In Next.js App Router, use a type-only import or a shared type alias instead of importing a DB-backed runtime module into client code.

Pass `panelProps` from a server layout:

```tsx
import { devtools } from "@/lib/devtools";
import { DevtoolsWrapper } from "./devtools-wrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <DevtoolsWrapper panelProps={devtools.panelProps} />
      </body>
    </html>
  );
}
```

Render the panel in a client wrapper:

```tsx
"use client";

import { BetterAuthDevtools } from "better-auth-devtools/react";
import type { BetterAuthDevtoolsProps } from "better-auth-devtools/react";

export function DevtoolsWrapper({
  panelProps,
}: {
  panelProps: BetterAuthDevtoolsProps;
}) {
  return <BetterAuthDevtools {...panelProps} />;
}
```

Do not import a DB-backed devtools config module directly into a client component.

## AI Agent Prompt

```text
Install and integrate better-auth-devtools as an unofficial development-only Better Auth utility. Use better-auth-devtools/plugin for the Better Auth server/client plugin setup and better-auth-devtools/react for the floating panel. Keep it disabled in production, require DEV_AUTH_ENABLED=true, use managed test users only, create real host-app users in createManagedUser, add the DevtoolsUser storage model, and for Next.js App Router keep DB-backed devtools config on the server while passing panelProps into a client wrapper.
```

## Lower-Level API

```ts
import { betterAuth } from "better-auth";
import { createAuthClient } from "better-auth/react";
import { devtoolsClientPlugin, devtoolsPlugin } from "better-auth-devtools/plugin";

export const auth = betterAuth({
  database,
  plugins: [
    devtoolsPlugin({
      templates: {
        admin: { label: "Admin", meta: { role: "admin" } },
        viewer: { label: "Viewer", meta: { role: "viewer" } },
      },
      editableFields: [
        {
          key: "role",
          label: "Role",
          type: "select",
          options: ["admin", "viewer"],
        },
      ],
      async createManagedUser(args) {
        const user = await db.user.create({
          data: {
            email: args.email,
            name: args.template.label,
            role: String(args.template.meta?.role ?? "viewer"),
          },
        });

        return {
          userId: user.id,
          email: user.email,
          label: args.template.label,
        };
      },
      async getSessionView(args) {
        const user = await db.user.findUnique({ where: { id: args.userId } });

        return {
          userId: args.userId,
          email: user?.email,
          label: user?.name,
          fields: {
            sessionId: args.sessionId,
            role: user?.role ?? "viewer",
          },
          editableFields: ["role"],
        };
      },
      async patchSession(args) {
        await db.user.update({
          where: { id: args.userId },
          data: { role: String(args.patch.role ?? "viewer") },
        });

        const user = await db.user.findUnique({ where: { id: args.userId } });

        return {
          userId: args.userId,
          email: user?.email,
          label: user?.name,
          fields: {
            sessionId: args.sessionId,
            role: user?.role ?? "viewer",
          },
          editableFields: ["role"],
        };
      },
    }),
  ],
});

export const authClient = createAuthClient({
  plugins: [devtoolsClientPlugin()],
});
```

```tsx
"use client";

import { BetterAuthDevtools } from "better-auth-devtools/react";

export function Devtools() {
  return (
    <BetterAuthDevtools
      enabled={true}
      basePath="/api/auth"
      templates={["admin", "viewer"]}
      editableFields={[
        { key: "role", label: "Role", type: "select", options: ["admin", "viewer"] },
      ]}
    />
  );
}
```

Use the lower-level API if you need to wire the Better Auth server plugin separately from your panel props. In Next.js App Router, keep the plugin config on the server and pass panel props into a client wrapper.

## Troubleshooting

### Devtools endpoints return disabled or the panel does not show controls

Cause:
- `DEV_AUTH_ENABLED=true` is missing
- app is running in production

Fix:
- set `DEV_AUTH_ENABLED=true`
- verify you are not in production

### Switching into a managed user fails because the user is not found

Cause:
- `createManagedUser` returned an ID for a user that was never actually created

Fix:
- create a real host-app user and return that real ID

### Adapter or model errors appear when listing or creating managed users

Cause:
- plugin storage model is missing from the ORM schema

Fix:
- add the `DevtoolsUser` model and run ORM generation/migration commands

### Next.js client code fails when mounting the panel

Cause:
- a DB-backed or server-only module is being imported into a client component

Fix:
- pass `panelProps` from a server layout into a client wrapper

## Demo

```bash
pnpm install
pnpm --dir apps/demo-app db:init
pnpm dev
```

The repo includes a local demo app in [`apps/demo-app`](https://github.com/C-W-D-Harshit/better-auth-devtools/tree/main/apps/demo-app), but the README examples above are the public integration pattern to follow.

## Notes

- Managed test users only. This is not arbitrary user impersonation.
- Intended for local and trusted development environments.
- Current public API:
  - `better-auth-devtools/plugin`
  - `better-auth-devtools/react`
