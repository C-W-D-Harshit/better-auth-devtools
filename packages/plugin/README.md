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
NODE_ENV=development
```

## Quick Start

Configure everything once and reuse it for the Better Auth plugin, the Better Auth client plugin, and the floating panel.

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
    return { userId: "new-user-id", email: args.email, label: args.template.label };
  },
  async getSessionView(args) {
    return {
      userId: args.userId,
      fields: { sessionId: args.sessionId, role: "viewer" },
      editableFields: ["role"],
    };
  },
  async patchSession(args) {
    return {
      userId: args.userId,
      fields: { sessionId: args.sessionId, role: String(args.patch.role ?? "viewer") },
      editableFields: ["role"],
    };
  },
});

export const devtools = createDevtoolsIntegration(devtoolsConfig, {
  position: "bottom-right",
  triggerLabel: "Auth DevTools",
});
```

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
import { devtoolsClientPlugin } from "better-auth-devtools/plugin";

export const authClient = createAuthClient({
  plugins: [devtoolsClientPlugin()],
});
```

React panel:

```tsx
"use client";

import { BetterAuthDevtools } from "better-auth-devtools/react";
import { devtools } from "./devtools";

export function Devtools() {
  return <BetterAuthDevtools {...devtools.panelProps} />;
}
```

## AI Agent Prompt

```text
Install and integrate better-auth-devtools as an unofficial development-only Better Auth utility. Use better-auth-devtools/plugin for the Better Auth server/client plugin setup and better-auth-devtools/react for the floating panel. Keep it disabled in production, require DEV_AUTH_ENABLED=true, use managed test users only, and do not implement arbitrary user impersonation.
```

## Lower-Level API

```ts
import { betterAuth } from "better-auth";
import { createAuthClient } from "better-auth/react";
import { devtoolsPlugin, devtoolsClientPlugin } from "better-auth-devtools/plugin";

export const auth = betterAuth({
  database,
  plugins: [
    devtoolsPlugin({
      templates: {
        admin: { label: "Admin", meta: { role: "admin" } },
        viewer: { label: "Viewer", meta: { role: "viewer" } },
      },
      async createManagedUser(args) {
        return { userId: "new-user-id", email: args.email, label: args.template.label };
      },
      async getSessionView(args) {
        return {
          userId: args.userId,
          fields: { sessionId: args.sessionId, role: "viewer" },
          editableFields: ["role"],
        };
      },
      async patchSession(args) {
        return {
          userId: args.userId,
          fields: { sessionId: args.sessionId, role: String(args.patch.role ?? "viewer") },
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
      enabled={process.env.NODE_ENV !== "production"}
      basePath="/api/auth"
      templates={["admin", "viewer"]}
      editableFields={[
        { key: "role", label: "Role", type: "select", options: ["admin", "viewer"] },
      ]}
    />
  );
}
```

Use the lower-level API if you need to customize the panel props separately from the server config. For most apps, `createDevtoolsIntegration(...)` is the simpler path for server wiring and panel props, while client auth should still use `devtoolsClientPlugin()` directly.

## Demo

```bash
pnpm install
pnpm --dir apps/demo-app db:init
pnpm dev
```

The demo app in [`apps/demo-app`](https://github.com/C-W-D-Harshit/better-auth-devtools/tree/main/apps/demo-app) is the reference integration.

## Notes

- Managed test users only. This is not arbitrary user impersonation.
- Intended for local and trusted development environments.
- Current public API:
  - `better-auth-devtools/plugin`
  - `better-auth-devtools/react`
