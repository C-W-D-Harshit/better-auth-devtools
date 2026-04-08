# Better Auth DevTools

> [!WARNING]
> Unofficial, alpha, development-only tooling for Better Auth. Do not enable it in production.

`better-auth-devtools` is a community Better Auth plugin for local auth scenario testing. It gives you managed test users, instant session switching, session inspection, and a React panel for approved session-field edits.

## Overview

1. The plugin stores managed test-user records in its own Better Auth model.
2. Each managed test-user record points to a real Better Auth user in your app.
3. Switching users creates a Better Auth session for that real user.
4. The panel only shows and edits fields your app exposes through `getSessionView` and `patchSession`.

## Installation

AI agent prompt:

```text
Install and integrate better-auth-devtools as an unofficial development-only Better Auth utility. Use better-auth-devtools/plugin for the Better Auth server/client plugin setup and better-auth-devtools/react for the floating panel. Keep it disabled in production, require DEV_AUTH_ENABLED=true, use managed test users only, create real host-app users in createManagedUser, let the plugin provide its Better Auth schema, rerun the Better Auth CLI after adding it, and for Next.js App Router keep DB-backed devtools config on the server while passing panelProps into a client wrapper.
```
```bash
pnpm add better-auth-devtools
```

Peer requirements:

```bash
pnpm add better-auth react react-dom
```

### Define the plugin config

Define your templates and host-app callbacks once. In Next.js App Router, keep database-backed devtools code on the server and pass panel props into a client wrapper from a server layout.

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

### Add the plugin to your auth config

```ts
import { betterAuth } from "better-auth";
import { devtools } from "./devtools";

export const auth = betterAuth({
  database,
  plugins: [devtools.serverPlugin],
});
```

### Migrate or generate the database schema

The server plugin already declares its storage model through Better Auth's plugin `schema`, including the `devtoolsUser` table used for managed test-user records. You do not need to hand-write a `DevtoolsUser` model just to use this package.

After adding the plugin to your Better Auth config, rerun the Better Auth CLI so the plugin schema is picked up:

```bash
npx auth@latest migrate
```

If you use Prisma, Drizzle, or another ORM adapter, generate the schema from your Better Auth config and then apply it with your normal ORM workflow:

```bash
npx auth@latest generate
```

Rerun the CLI whenever you add the plugin or change plugin-managed schema.

### Add the client plugin

```ts
import { createAuthClient } from "better-auth/react";
import { devtoolsClientPluginFor } from "better-auth-devtools/plugin";
import type { DevtoolsConfig } from "@/lib/devtools-types";

export const authClient = createAuthClient({
  plugins: [devtoolsClientPluginFor<DevtoolsConfig>()],
});
```

If you want strongly typed client actions, pass your devtools config type to `devtoolsClientPluginFor<...>()`. In Next.js App Router, use a type-only import or a shared type alias instead of importing a DB-backed runtime module into client code.

## Configuration

`defineDevtoolsConfig(...)` takes the server-side callbacks and template metadata that drive the plugin:

- `templates`: map of stable test personas. Each template needs a `label` and can optionally include `emailPattern` and `meta`.
- `editableFields`: optional list of fields the panel may edit. Supported field types are `string`, `number`, `boolean`, and `select`.
- `createManagedUser`: must create a real user in your app database and return its real `userId`. You can also override `email` and `label`.
- `getSessionView`: returns the session data the panel should display for the active user.
- `patchSession`: applies an allowed patch and returns the refreshed session view.

`createDevtoolsIntegration(config, panel)` bundles the server plugin, client plugin, and panel props. The optional `panel` config supports:

- `enabled`
- `basePath`
- `defaultOpen`
- `position`
- `triggerLabel`

## Usage

### Next.js App Router

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

### Lower-Level API

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

## Schema

Table name: `devtoolsUser`

| Field | Type | Key | Description |
| --- | --- | --- | --- |
| `id` | `string` | PK | Better Auth generated row identifier for the managed test-user record |
| `userId` | `string` | - | Real Better Auth user ID that the managed test user points to |
| `templateKey` | `string` | - | Template key used when the managed test user was created |
| `label` | `string` | - | Display label shown in the panel |
| `email` | `string` | - | Email shown for the managed test user record |
| `createdAt` | `date` | - | Creation timestamp for the record |
| `updatedAt` | `date` | - | Last update timestamp for the record |

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
- plugin schema has not been generated or applied for your adapter yet

Fix:
- rerun the Better Auth CLI so the plugin schema is generated or migrated for your setup

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
