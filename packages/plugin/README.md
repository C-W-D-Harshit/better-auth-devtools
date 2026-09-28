# Better Auth DevTools

Better Auth DevTools adds a floating React panel to your app. Use it to create test users, switch the browser to their sessions, and inspect the current session. You can also choose which user fields the panel may edit. This is an unofficial development tool; its server endpoints are disabled when `NODE_ENV=production`.

The panel can switch only to users it created and recorded.

## Manual quick start

Start with an existing Better Auth app and a persistent database. You need Node.js 20+, Better Auth `>=1.6.11 <2`, and React and React DOM 18+. The package is ESM-only.

### 1. Install in the app workspace

From your app workspace, run:

```bash
pnpm add better-auth-devtools
```

Use the equivalent command for npm, Yarn, or Bun. Better Auth, React, and React DOM are peer dependencies. Keep your installed versions if they meet the requirements above.

### 2. Extend the existing Better Auth instance

Add `devtools` to your existing server auth configuration. In a Next.js App Router app, this might be `src/lib/auth.ts`:

```diff
 import { betterAuth } from "better-auth";
+import { devtools } from "better-auth-devtools";

 export const auth = betterAuth({
   // Keep your existing database, user fields, session options, callbacks, and routes.
-  plugins: [/* existing plugins */],
+  plugins: [/* existing plugins */, devtools({ enabled: true })],
 });
```

If you have no `plugins` array, add `plugins: [devtools({ enabled: true })]` to the existing options. Keep your current auth instance and configuration. Database and auth imports stay on the server; the panel is a separate client component. `enabled: true` enables DevTools outside production, and `DEV_AUTH_ENABLED=false` disables it through the environment.

### 3. Apply the plugin schema

DevTools stores a record for each test user it creates. Run the schema command from your app workspace, using the app's auth configuration and target database:

| Your existing adapter | Schema workflow |
| --- | --- |
| Built-in Kysely | `pnpm exec auth migrate` applies the schema change. |
| Prisma | Run `pnpm exec auth generate`, review the model changes, then run your Prisma migration. |
| Drizzle | Run `pnpm exec auth generate`, review the schema changes, then run your Drizzle migration. |

These commands assume `auth` is installed in the app. Otherwise, run a CLI version that matches your Better Auth version. For Better Auth 1.6.23, use `pnpm dlx auth@1.6.23 migrate` or `pnpm dlx auth@1.6.23 generate`. Other package managers have equivalents of `exec` and `dlx`. Add `--config path/to/your/auth.ts` if the CLI cannot find your auth config. Check the target database before migrating. Keep existing tables and data, and repeat this step when the plugin schema changes.

If a required user field has no database default, give it a value in every relevant DevTools template. An ORM column alone does not register the field with Better Auth. The role example below shows how to configure one.

### 4. Mount the panel once

For Next.js App Router, create `src/app/devtools.tsx`:

```tsx
"use client";

import { BetterAuthDevtools } from "better-auth-devtools/react";

export function Devtools() {
  return <BetterAuthDevtools />;
}
```

Render it once in `src/app/layout.tsx`:

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

Add `<Devtools />` to your existing layout without replacing its providers, metadata, or markup. Keep server auth and database modules out of `devtools.tsx`. The panel loads templates from the server; it needs no client plugin or extra props.

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

Render your existing app as `App`'s children. Check your framework's Better Auth route setup separately.

If Better Auth serves endpoints at a custom path, pass it to the panel: `<BetterAuthDevtools basePath="/auth" />`. Omit the trailing slash. The server `basePath`, route handler, and client `baseURL` must agree.

### 5. Check the first switch

Start the app. In the panel, choose **Create Test User**, then **Switch** on that user. The app should reload with the test user's email in its normal Better Auth session. Check an existing authenticated screen or call `auth.api.getSession`; the panel's own session display does not confirm that your app sees the switch. For a role check, run the [demo](https://github.com/C-W-D-Harshit/better-auth-devtools/tree/main/apps/demo-app) using the [local setup guide](https://github.com/C-W-D-Harshit/better-auth-devtools/blob/main/CONTRIBUTING.md).

## Install with your coding agent

In your app repository, give your agent this prompt:

```text
Install Better Auth DevTools in this app and verify a session switch. Follow https://www.better-auth-devtools.com/install-agent.md. Read the repo instructions and existing Better Auth setup first. Keep the current auth behavior, package manager, migration workflow, and auth base path. Mount the panel once. After switching to a test user, confirm the app's normal session sees that user. Report the files changed, checks run, and any unfinished steps.
```

The website is set up to serve the [agent installation guide](https://www.better-auth-devtools.com/install-agent.md) as Markdown. Check the live URL after deployment. Until then, use [AGENT_INSTALL.md](AGENT_INSTALL.md) in this repository.

## Role-based personas

If your app uses roles, add them to the existing `betterAuth({ ... })` options. For a Better Auth additional field, set `input: false` so ordinary signup and update requests cannot choose a role:

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

Import `devtools` from `better-auth-devtools` in the same server config. DevTools creates these configured users through Better Auth's internal adapter. If the Admin plugin already owns `role`, keep it and skip the duplicate field declaration. Give each template values for required fields without database defaults. If roles live in an application table, use the callbacks below.

To edit a field in the panel, add it to `editableFields` in the same `devtools()` call. Supported types are `string`, `number`, `boolean`, and `select`. Without a callback, edits update the Better Auth user model.

## Advanced configuration

The default template creates a verified user with a `@test.local` email address. The panel lists up to 100 recent managed users, shows the current Better Auth user and session, and can delete managed users. The default session view hides raw tokens and secret-like fields. Writes require a trusted browser origin and pass through Better Auth's origin and CSRF checks. DevTools also limits request rates in memory.

If user or session data lives outside Better Auth's user model, add callbacks to the same `devtools()` configuration:

| Callback | Use |
| --- | --- |
| `createManagedUser({ templateKey, template, email })` | Create the user and required application records. Return `{ userId, email?, label? }`. |
| `beforeDeleteManagedUser({ userId, managedUser })` | Clean up application records before the managed Better Auth user is deleted. |
| `getSessionView({ userId, sessionId })` | Return `{ userId, email?, label?, fields, editableFields? }` for application-owned session data. |
| `patchSession({ userId, sessionId, patch })` | Validate allowed edits, update application data, and return the updated session view. |

Call your existing application services from these callbacks. In `patchSession`, enforce the `editableFields` allowlist. The exported TypeScript types define callback arguments and return values. Keep authorization checks in your server routes.

### Optional typed client actions

The panel does not need a client plugin. If your app code needs typed DevTools actions, add one:

```ts
import { createAuthClient } from "better-auth/react";
import { devtoolsClientPlugin } from "better-auth-devtools/plugin";

export const authClient = createAuthClient({
  plugins: [devtoolsClientPlugin()],
});
```

Keep any existing client plugins.

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

The panel hides when DevTools is disabled or unavailable on the server. `reloadOnSessionChange` defaults to `true` and reloads the page after a switch or edit. Application caches may still need their own refresh.

## Troubleshooting

- Panel missing: check the development opt-in, auth base path, panel mount, and schema migration. Inspect the response from the DevTools config endpoint.
- `403 UNTRUSTED_ORIGIN`: use an origin in Better Auth's `trustedOrigins`.
- `429 RATE_LIMITED`: wait for the current 60-second window or adjust the development `rateLimit` option.
- ORM model missing: generate again from the correct auth config, then apply the ORM migration.
- Host session unchanged after Switch: check the auth base path, cookies, and the app's normal Better Auth session read. If the panel reports success while the session stays unchanged, report a package integration failure.

## Development

See [CONTRIBUTING.md](https://github.com/C-W-D-Harshit/better-auth-devtools/blob/main/CONTRIBUTING.md) to work on this package. The demo uses the same `better-auth-devtools` and `better-auth-devtools/react` exports published to npm.

## License

MIT
