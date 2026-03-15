# Better Auth DevTools

> [!WARNING]
> Development-only auth tooling. This project is designed for local and trusted development environments only. It must stay disabled in production.

> [!NOTE]
> This is an alpha release. Expect API changes, rough edges, incomplete compatibility coverage, and breaking changes before a stable `1.0`.

DevTools for [Better Auth](https://www.better-auth.com/) that let you create managed test users, switch sessions instantly, inspect auth state, and patch approved session fields without rebuilding your app around fake login flows.

This repo is a Turborepo monorepo with a Next.js demo app and a split package architecture for the Better Auth plugin, React panel, core contracts, and shared utilities.

## Why This Exists

Most auth-heavy apps waste time on the same loop:

- create a fake account
- sign out
- sign in as another role
- click back to the same screen
- repeat until you stop trusting the result

Better Auth DevTools cuts that loop down to a floating panel:

- create a managed `admin`, `editor`, or `viewer`
- switch into that user immediately
- inspect the current session
- patch allowed fields like `role`
- watch the app update against a real Better Auth session

This is not an admin console.
This is not production impersonation.
This is auth scenario tooling for development.

## What’s In The Repo

```text
better-auth-devtools/
├── apps/
│   └── demo-app/          # Next.js App Router demo
├── packages/
│   ├── core/              # Shared types, payloads, endpoint constants
│   ├── plugin/            # Better Auth server + client plugin
│   ├── react/             # Floating React DevTools panel
│   └── shared/            # Internal guards and error helpers
├── docs/
├── PRD.md
├── plan.md
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Current Status

> [!NOTE]
> This repo is in alpha. The demo app works, the package flow is real, and npm release plumbing is in place, but the APIs and integration details are still expected to change.

Working today:

- Better Auth plugin with custom devtools endpoints
- managed test user creation
- login restricted to devtools-managed users
- session inspection
- patching of approved fields
- React DevTools panel
- Next.js demo app with role-based UI changes
- reproducible SQLite bootstrap via `db:init`

Not done yet:

- package publishing
- broader framework examples
- production-safe distribution story
- full integration test coverage in the demo app

## Features

- Managed test personas instead of arbitrary user impersonation
- Better Auth plugin endpoints built on Better Auth's plugin model
- React panel that works against real Better Auth sessions
- Host-controlled session patching so app-specific schemas stay app-specific
- Config-first templates for repeatable auth scenarios
- Next.js demo app showing role-driven UI changes in real time

## Quick Start

### Run The Demo

```bash
pnpm install
pnpm --dir apps/demo-app db:init
pnpm dev
```

Then open the demo app in your browser and make sure the demo env enables the feature:

```bash
DEV_AUTH_ENABLED=true
NODE_ENV=development
```

The demo app mounts a floating `Auth DevTools` button. From there you can:

1. Create `admin`, `editor`, or `viewer` test users.
2. Switch into one of those users.
3. Inspect the active session.
4. Patch the allowed `role` field and watch the dashboard update.

### Useful Workspace Commands

```bash
pnpm build
pnpm typecheck
pnpm test
pnpm --dir apps/demo-app build
```

## How It Works

The product model is intentionally narrow:

- the host app defines templates
- the plugin creates real Better Auth users through a host callback
- the plugin tracks which users are devtools-managed
- only those managed users can be switched into
- the host app decides what session fields are editable and how patches are applied

That gives you a much cleaner security and compatibility story than “log in as any user in the database.”

## Package

Install one package:

- `better-auth-devtools`

Use it through subpath exports:

- `better-auth-devtools/plugin`
- `better-auth-devtools/react`

`better-auth-devtools/plugin` exposes the Better Auth server plugin, client plugin, shared types, endpoint constants, and validation helpers.

`better-auth-devtools/react` exposes the floating React panel for managed user creation, switching, session inspection, and approved field editing.

Internal workspace packages still exist in this repo for development, but they are not intended to be installed directly.

## API Surface

The plugin exposes these routes under Better Auth's auth base path:

- `GET /better-auth-devtools/users`
- `POST /better-auth-devtools/users`
- `POST /better-auth-devtools/login`
- `GET /better-auth-devtools/session`
- `POST /better-auth-devtools/update-session`

In the demo app, the effective URLs are:

- `GET /api/auth/better-auth-devtools/users`
- `POST /api/auth/better-auth-devtools/users`
- `POST /api/auth/better-auth-devtools/login`
- `GET /api/auth/better-auth-devtools/session`
- `POST /api/auth/better-auth-devtools/update-session`

## Example Integration

### Server Plugin

```ts
import { betterAuth } from "better-auth";
import { devtoolsPlugin } from "better-auth-devtools/plugin";

export const auth = betterAuth({
  database,
  plugins: [
    devtoolsPlugin({
      templates: {
        admin: {
          label: "Admin",
          emailPattern: "admin+{{n}}@test.local",
          meta: { role: "admin" },
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
          options: ["admin", "viewer"],
        },
      ],
      async createManagedUser(args) {
        // Create the real Better Auth user in your app's schema.
        return {
          userId: "new-user-id",
          email: args.email,
          label: args.template.label,
        };
      },
      async getSessionView(args) {
        return {
          userId: args.userId,
          email: "viewer@test.local",
          label: "Viewer",
          fields: {
            role: "viewer",
            sessionId: args.sessionId,
          },
          editableFields: ["role"],
        };
      },
      async patchSession(args) {
        // Apply allowed field updates in app-specific storage.
        return {
          userId: args.userId,
          email: "viewer@test.local",
          label: "Viewer",
          fields: {
            role: String(args.patch.role ?? "viewer"),
            sessionId: args.sessionId,
          },
          editableFields: ["role"],
        };
      },
    }),
  ],
});
```

### Client Plugin

```ts
import { createAuthClient } from "better-auth/react";
import { devtoolsClientPlugin } from "better-auth-devtools/plugin";

export const authClient = createAuthClient({
  plugins: [devtoolsClientPlugin()],
});
```

### React Panel

```tsx
"use client";

import { BetterAuthDevtools } from "better-auth-devtools/react";

export function Devtools() {
  return (
    <BetterAuthDevtools
      enabled={process.env.NODE_ENV !== "production"}
      basePath="/api/auth"
      templates={["admin", "editor", "viewer"]}
      editableFields={[
        {
          key: "role",
          label: "Role",
          type: "select",
          options: ["admin", "editor", "viewer"],
        },
      ]}
      position="bottom-right"
      triggerLabel="Auth DevTools"
    />
  );
}
```

## Demo App

The canonical v1 integration target is the Next.js demo app in [`apps/demo-app`](/Users/harshit/Documents/Developer/better-auth-devtools/apps/demo-app).

It includes:

- Better Auth wired with `devtoolsPlugin(...)`
- a typed Better Auth client with `devtoolsClientPlugin()`
- static persona templates for `admin`, `editor`, and `viewer`
- a role-based dashboard that visibly changes with the current session
- a DB bootstrap script at [`apps/demo-app/scripts/bootstrap-db.mjs`](/Users/harshit/Documents/Developer/better-auth-devtools/apps/demo-app/scripts/bootstrap-db.mjs)

## Safety Model

> [!WARNING]
> This tool should only be enabled when both of these are true:
>
> - `DEV_AUTH_ENABLED=true`
> - `NODE_ENV !== "production"`

Additional guardrails in this repo:

- the panel can be explicitly disabled from the server-rendered app shell
- endpoints perform runtime checks
- login is restricted to devtools-managed users only
- session patching is restricted to approved fields
- app-specific user creation and patch behavior stays inside host callbacks

## Development Notes

- The workspace uses Turborepo. Root scripts delegate to `turbo run ...`.
- Package-level scripts own their actual tasks.
- SQLite artifacts are ignored in Git.
- The demo app uses a local SQLite database at `apps/demo-app/demo.db`.

## Read Before Shipping

- Do not treat this as impersonation tooling for real users.
- Do not expose it on staging or production just because the package is installed.
- Do not assume one app's session schema matches another app's session schema.
- Keep the host callbacks explicit and narrow.

## Roadmap

- publishable package boundaries
- stronger demo-app integration tests
- richer editable field types
- seeded scenario presets
- support for more Better Auth integration shapes after the Next.js path is hardened

## Release

This repo is configured for Changesets-based npm publishing.

It is currently in prerelease mode with the `alpha` tag, so published versions are expected to look like:

- `better-auth-devtools@0.1.1-alpha.0`

Typical flow:

```bash
pnpm changeset
pnpm version-packages
pnpm build
pnpm release
```

Useful prerelease commands:

```bash
pnpm pre:enter:alpha
pnpm pre:exit
```

Automated publishing is wired through [`release.yml`](/Users/harshit/Documents/Developer/better-auth-devtools/.github/workflows/release.yml). On pushes to `main`, Changesets will either open a version PR or publish packages when pending changesets are present and `NPM_TOKEN` is configured in GitHub Actions.

Published package:

- `better-auth-devtools`

## License

MIT
