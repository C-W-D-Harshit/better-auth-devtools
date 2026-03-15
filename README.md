# Better Auth DevTools

> [!WARNING]
> Development-only auth tooling. Keep it disabled in production.

> [!NOTE]
> This is an alpha release.

> [!IMPORTANT]
> This project is unofficial. It is not affiliated with, endorsed by, or maintained by the Better Auth team.

`better-auth-devtools` is an unofficial Better Auth devtool for local auth scenario testing. It gives you managed test users, instant session switching, session inspection, and a React panel for approved session-field edits.

## Installation

```bash
pnpm add better-auth-devtools
```

Use these subpath exports:

```ts
import { devtoolsPlugin, devtoolsClientPlugin } from "better-auth-devtools/plugin";
import { BetterAuthDevtools } from "better-auth-devtools/react";
```

Required environment guard:

```bash
DEV_AUTH_ENABLED=true
NODE_ENV=development
```

## AI Agent Prompt

```text
Install and integrate better-auth-devtools as an unofficial development-only Better Auth utility. Use better-auth-devtools/plugin for the Better Auth server/client plugin setup and better-auth-devtools/react for the floating panel. Keep it disabled in production, require DEV_AUTH_ENABLED=true, use managed test users only, and do not implement arbitrary user impersonation.
```

## Minimal Usage

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

## Demo

```bash
pnpm install
pnpm --dir apps/demo-app db:init
pnpm dev
```

The demo app in [`apps/demo-app`](/Users/harshit/Documents/Developer/better-auth-devtools/apps/demo-app) is the reference integration.

## Notes

- Managed test users only. This is not arbitrary user impersonation.
- Intended for local and trusted development environments.
- Current public API:
  - `better-auth-devtools/plugin`
  - `better-auth-devtools/react`
