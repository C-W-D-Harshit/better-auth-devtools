# Better Auth DevTools

> Unofficial, development-only tooling for Better Auth. The server endpoints are always disabled when `NODE_ENV=production`.

Create managed test users, switch sessions, inspect live auth state, and optionally edit approved user fields from a floating React panel.

## Install

```bash
pnpm add better-auth-devtools
```

Peer requirements:

```bash
pnpm add better-auth react react-dom
```

## Quick start

Add the plugin to Better Auth:

```ts
import { betterAuth } from "better-auth";
import { devtools } from "better-auth-devtools";

export const auth = betterAuth({
  database,
  plugins: [devtools({ enabled: true })],
});
```

Mount the panel anywhere in your React application:

```tsx
"use client";

import { BetterAuthDevtools } from "better-auth-devtools/react";

export function Devtools() {
  return <BetterAuthDevtools />;
}
```

That is the complete runtime setup. `enabled: true` is an explicit development opt-in and can never override the production guard. You can use `DEV_AUTH_ENABLED=true` instead. The panel discovers its templates and capabilities from the server; it does not require a client plugin, shared config, or server-generated props.

### Create the plugin table

The plugin stores the IDs of users it creates so arbitrary application users cannot be impersonated. Apply its Better Auth schema after installation.

Built-in Kysely adapter:

```bash
npx auth@latest migrate
```

Prisma, Drizzle, and other ORM adapters:

```bash
npx auth@latest generate
```

Then apply the generated change with your normal ORM migration workflow. Re-run the command after plugin schema changes.

## Secure defaults

`devtools()`:

- Requires `enabled: true` or `DEV_AUTH_ENABLED=true` outside production.
- Provides a default **Test User** template.
- Creates a verified Better Auth user with a generated `@test.local` address.
- Only permits switching to users recorded as DevTools-managed.
- Shows the current Better Auth user and session.
- Limits managed-user listing to the newest 100 records.
- Protects write endpoints with Better Auth origin and CSRF middleware.
- Enforces an in-memory rate limit across all DevTools endpoints, independently of Better Auth's global development setting.
- Redacts the raw session token and secret-like user fields from the default session view.
- Supports deleting managed users and their sessions/accounts through Better Auth.

Set `DEV_AUTH_ENABLED=false` for an environment-level kill switch. Setting it to `true` never enables the plugin in production. Browser writes must include a trusted origin; origin-less and cross-origin writes are rejected.

## Personas and editable fields

Most applications only need declarative templates:

```ts
import { devtools } from "better-auth-devtools";

export const authDevtools = devtools({
  templates: {
    admin: {
      label: "Admin",
      user: { role: "admin" },
    },
    editor: {
      label: "Editor",
      user: { role: "editor" },
    },
    viewer: {
      label: "Viewer",
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
```

Template `user` values are passed to Better Auth's internal user adapter. This works with Better Auth additional fields and adapter mappings. Required custom fields without database defaults must be included in the template.

Supported editable field types are `string`, `number`, `boolean`, and `select`. Without a custom callback, approved edits update the Better Auth user model.

## Advanced hooks

Use callbacks only when your application stores persona or session data outside the Better Auth user model:

```ts
const authDevtools = devtools({
  templates: {
    teamAdmin: { label: "Team Admin", user: { role: "admin" } },
  },

  async createManagedUser({ template, email }) {
    const user = await createApplicationUser({
      name: template.label,
      email,
      role: String(template.user?.role ?? "member"),
    });

    return { userId: user.id, email: user.email, label: user.name };
  },

  async beforeDeleteManagedUser({ userId }) {
    await deleteApplicationProfile(userId);
  },

  async getSessionView({ userId, sessionId }) {
    const profile = await loadProfile(userId);

    return {
      userId,
      label: profile.name,
      email: profile.email,
      fields: { role: profile.role, sessionId },
      editableFields: ["role"],
    };
  },

  async patchSession({ userId, sessionId, patch }) {
    const profile = await updateProfile(userId, patch);

    return {
      userId,
      label: profile.name,
      email: profile.email,
      fields: { role: profile.role, sessionId },
      editableFields: ["role"],
    };
  },
});
```

## Optional typed client actions

The React panel calls the DevTools endpoints directly. If application code also needs typed actions, add the optional Better Auth client plugin:

```ts
import { createAuthClient } from "better-auth/react";
import { devtoolsClientPlugin } from "better-auth-devtools/plugin";

export const authClient = createAuthClient({
  plugins: [devtoolsClientPlugin()],
});
```

## Panel options

```tsx
<BetterAuthDevtools
  basePath="/api/auth"
  defaultOpen={false}
  position="bottom-right"
  triggerLabel="Auth DevTools"
  reloadOnSessionChange
/>
```

The panel hides itself if the server reports that DevTools is disabled or unavailable.

## Security model

This package can create users, issue sessions, update approved fields, and delete managed users. Treat it like a privileged local development tool.

- Production is always disabled.
- Development requires an explicit code or environment opt-in.
- Session switching and deletion require a DevTools-managed user record.
- Request bodies are runtime validated.
- Writes require a trusted browser origin and use Better Auth CSRF protection.
- An internal limiter protects DevTools endpoints even when Better Auth's development limiter is disabled.
- The default session view never returns the Better Auth session token.
- Raw server errors are logged server-side and are not exposed to the browser.
- Do not expose a development server containing sensitive data to an untrusted network.

## Requirements

- Better Auth `>=1.6.11 <2`
- React `>=18`
- React DOM `>=18`
- Node.js `>=20`

The package is ESM-only.

## Development

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm package:check
pnpm package:audit
```

The demo app imports the public `better-auth-devtools` and `better-auth-devtools/react` exports, so it exercises the same code shipped to npm.

## Troubleshooting

- Panel not visible: confirm `enabled: true` or `DEV_AUTH_ENABLED=true`, then verify the plugin table migration was applied.
- `403 UNTRUSTED_ORIGIN`: call the browser panel from an origin included in Better Auth's `trustedOrigins`.
- `429 RATE_LIMITED`: wait for the 60-second window or configure `rateLimit: { max, window }` for your development workflow.
- ORM schema missing: re-run `npx auth@latest generate` after adding or updating the plugin, then apply the generated migration.

## License

MIT
