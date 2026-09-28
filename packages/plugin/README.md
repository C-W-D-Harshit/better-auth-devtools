# Better Auth DevTools

Unofficial, development-only tools for Better Auth. A floating React panel creates managed test users, switches the browser session to one of them, and shows the current session. You can opt in to editing specific user fields. The server endpoints stay disabled when `NODE_ENV=production`.

The panel switches only to users it created and recorded. It does not impersonate arbitrary application users.

## Manual quick start

You need an existing Better Auth application with a persistent database, Node.js 20 or newer, Better Auth `>=1.6.11 <2`, React 18 or newer, and React DOM 18 or newer. Keep your existing auth routes and database adapter. The package is ESM-only.

### 1. Install in the app workspace

Run the command from the workspace that owns your Better Auth app, using its package manager:

```bash
pnpm add better-auth-devtools
```

For npm, Yarn, or Bun, use the equivalent `install`/`add` command. Better Auth, React, and React DOM are peers; leave their existing installed versions alone if they meet the ranges above.

### 2. Extend the existing Better Auth instance

In your existing server-only auth configuration, such as `src/lib/auth.ts` in a Next.js App Router app, import `devtools` and append it to the existing `plugins` array:

```diff
 import { betterAuth } from "better-auth";
+import { devtools } from "better-auth-devtools";

 export const auth = betterAuth({
   // Keep your existing database, user fields, session options, callbacks, and routes.
-  plugins: [/* existing plugins */],
+  plugins: [/* existing plugins */, devtools({ enabled: true })],
 });
```

If there is no plugin array, add `plugins: [devtools({ enabled: true })]` to the existing options. Do not create a second auth instance. Keep database and auth configuration imports on the server; the panel is a separate client component. `enabled: true` opts in outside production. `DEV_AUTH_ENABLED=false` is an environment kill switch.

### 3. Apply the plugin schema

DevTools stores a record for each managed user. From the **app workspace**, run Better Auth's schema command against the same auth configuration and target database that the app uses:

| Your existing adapter | Schema workflow |
| --- | --- |
| Built-in Kysely adapter | `pnpm exec auth migrate` applies the Better Auth schema change. |
| Prisma | `pnpm exec auth generate`, review the generated Prisma model changes, then run your project's Prisma migration workflow. |
| Drizzle | `pnpm exec auth generate`, review the generated Drizzle schema changes, then run your project's Drizzle migration workflow. |

These commands assume the app already has the `auth` CLI installed. If it does not, run a CLI version that matches your installed Better Auth version through the package manager. For Better Auth 1.6.23, use `pnpm dlx auth@1.6.23 migrate` or `pnpm dlx auth@1.6.23 generate` instead. Do not upgrade the app's Better Auth peer just to run the CLI. For other package managers, use their equivalent of `exec` or `dlx`. If the auth config is outside Better Auth CLI's discovery paths, add `--config path/to/your/auth.ts`. Confirm the target environment before applying migrations. Preserve existing tables, models, and data. Re-run generation/migration when plugin schema changes.

A custom required user field with no database default must have a value in every DevTools template that creates a user. See the role example below. An ORM column alone does not register the field with Better Auth.

### 4. Mount the panel once

For Next.js App Router, create `src/app/devtools.tsx`:

```tsx
"use client";

import { BetterAuthDevtools } from "better-auth-devtools/react";

export function Devtools() {
  return <BetterAuthDevtools />;
}
```

Render it once in `src/app/layout.tsx`, alongside your existing providers and children:

```tsx
import type { ReactNode } from "react";
import { Devtools } from "./devtools";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Devtools />
      </body>
    </html>
  );
}
```

Merge the `<Devtools />` line into your actual root layout. Keep its existing metadata, providers, and markup. No server-only auth or database module belongs in `devtools.tsx`. The panel discovers templates from the server. It needs no client plugin, provider, shared config module, or server-generated props.

In another React app that already uses Better Auth, mount the same component once at its application root:

```tsx
import type { ReactNode } from "react";
import { BetterAuthDevtools } from "better-auth-devtools/react";

export function App({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <BetterAuthDevtools />
    </>
  );
}
```

Render your existing app as `App`'s children. This is a React mounting pattern, not a claim that every framework's Better Auth route setup is supported here.

If your Better Auth route uses a custom base path, pass the same path to the panel, for example `<BetterAuthDevtools basePath="/auth" />`. Use the path where Better Auth serves its endpoints, with no trailing slash. Keep the server's `basePath`, route handler, and client `baseURL` aligned.

### 5. Check the first switch

Start the app. Open the panel, choose **Create Test User**, then choose **Switch** on the new managed user. The app should reload and its normal Better Auth session should show that test user's email. Check the same session through an existing authenticated screen or `auth.api.getSession`; the DevTools session display alone is not proof that the host app sees the switch. If you need a role-based check, use the small [demo](https://github.com/C-W-D-Harshit/better-auth-devtools/tree/main/apps/demo-app) after [local setup](https://github.com/C-W-D-Harshit/better-auth-devtools/blob/main/CONTRIBUTING.md).

## Install with your coding agent

Give your agent this prompt in the app repository:

```text
Integrate Better Auth DevTools into this existing application and verify a working session switch. Follow https://www.better-auth-devtools.com/install-agent.md. Read the repository instructions and current Better Auth code first. Preserve existing auth behavior and use the app's package manager, adapter migration workflow, and auth base path. Mount the real panel once. Verify that the application's normal session sees a DevTools-managed user after switching. Report changed files, checks, and any steps you could not complete.
```

The [agent installation guide](https://www.better-auth-devtools.com/install-agent.md) is served as Markdown by this project's website. Its publication at that URL must be checked after deployment; until then use [AGENT_INSTALL.md](AGENT_INSTALL.md) in this repository.

## Role-based personas

Add role fields only when your app uses them. If `role` is a Better Auth additional user field, make ordinary signup and update input non-writable. In your **existing** `betterAuth({ ... })` options, merge these entries with the current `user` and `plugins` options:

```ts
user: {
  additionalFields: {
    role: {
      type: ["admin", "viewer"],
      defaultValue: "viewer",
      input: false,
    },
  },
},
plugins: [
  // Keep all existing plugins here.
  devtools({
    enabled: true,
    templates: {
      admin: { label: "Admin", user: { role: "admin" } },
      viewer: { label: "Viewer", user: { role: "viewer" } },
    },
  }),
],
```

This fragment belongs in the existing server config, with `import { devtools } from "better-auth-devtools";`. The `input: false` boundary prevents ordinary user input from selecting a privileged role. DevTools deliberately creates the configured persona through Better Auth's internal adapter. If Better Auth's Admin plugin already owns `role`, retain it and use that field instead of declaring a duplicate. Required custom fields without database defaults must be supplied by each template. If a role lives in a separate application table, use the callbacks below.

To allow editing a field in the panel, explicitly add `editableFields` to the same `devtools({ enabled: true, ... })` call. Supported types are `string`, `number`, `boolean`, and `select`; without a callback, approved edits update the Better Auth user model.

## Advanced configuration

The default template creates a verified `@test.local` user. The panel can list the newest 100 managed users, inspect the current Better Auth user and session, and delete managed users. It redacts raw session tokens and secret-like fields from the default view. Writes require a trusted browser origin and Better Auth's origin and CSRF checks. An internal in-memory rate limit also applies.

For application data outside the Better Auth user model, use callbacks in the same `devtools({ enabled: true, ... })` configuration:

| Callback | Use |
| --- | --- |
| `createManagedUser({ templateKey, template, email })` | Create the user and required application records. Return `{ userId, email?, label? }`. |
| `beforeDeleteManagedUser({ userId, managedUser })` | Clean up application records before the managed Better Auth user is deleted. |
| `getSessionView({ userId, sessionId })` | Return `{ userId, email?, label?, fields, editableFields? }` for application-owned session data. |
| `patchSession({ userId, sessionId, patch })` | Validate allowed edits, update application data, and return the updated session view. |

Use these with your existing application services. A custom `patchSession` should enforce the same allowlist as `editableFields`. See the exported TypeScript types for callback argument and return types. Keep authorization in application server routes.

### Optional typed client actions

The panel does not need a client plugin. If your own client code needs typed DevTools actions, use:

```ts
import { createAuthClient } from "better-auth/react";
import { devtoolsClientPlugin } from "better-auth-devtools/plugin";

export const authClient = createAuthClient({
  plugins: [devtoolsClientPlugin()],
});
```

Merge that plugin with any existing client plugins instead of replacing your client configuration.

### Panel options

```tsx
"use client";

import { BetterAuthDevtools } from "better-auth-devtools/react";

export function Devtools() {
  return (
    <BetterAuthDevtools
      basePath="/api/auth"
      defaultOpen={false}
      position="bottom-right"
      triggerLabel="Auth DevTools"
      reloadOnSessionChange
    />
  );
}
```

The panel hides itself when the server reports DevTools as disabled or unavailable. `reloadOnSessionChange` is the default and reloads the page after a successful switch or edit. It does not promise immediate consistency for every application cache.

## Troubleshooting

- Panel missing: confirm the development opt-in, the auth base path, the panel mount, and the schema migration. Check the server response to the DevTools config endpoint.
- `403 UNTRUSTED_ORIGIN`: use an origin in Better Auth's `trustedOrigins`.
- `429 RATE_LIMITED`: wait for the current 60-second window or adjust the development `rateLimit` option.
- ORM model missing: generate again from the correct auth config, then apply the ORM migration.
- Host session unchanged after Switch: check the auth base path, cookies, and the application's normal Better Auth session read. Report this as a package integration failure if the panel reports success but the session remains unchanged.

## Development

Contributors should use [CONTRIBUTING.md](https://github.com/C-W-D-Harshit/better-auth-devtools/blob/main/CONTRIBUTING.md). The demo imports the public `better-auth-devtools` and `better-auth-devtools/react` exports.

## License

MIT
