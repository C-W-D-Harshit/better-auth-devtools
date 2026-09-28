# Install Better Auth DevTools in an existing app

This guide is for a coding agent working inside the consumer application's repository. The package is an unofficial development-only Better Auth plugin and a React panel. It creates managed test users and switches to their sessions. It does not impersonate arbitrary users. Production endpoints remain disabled.

## Inspect first

1. Read applicable `AGENTS.md` and repository instructions.
2. Identify the app workspace, package manager, Node/Better Auth/React versions, framework, auth route, existing server auth configuration, client setup, adapter, schema migration command, database target, and auth base path. The package requires Node 20+, Better Auth `>=1.6.11 <2`, React/React DOM 18+.
3. Read the existing user model, required custom fields, plugins, callbacks, session options, and route handlers. Look for a development-only mount point and existing test practices.
4. Inspect the current diff. Preserve unrelated changes.

## Integrate

1. In the app workspace, add only `better-auth-devtools` using the existing package manager. Keep compatible Better Auth and React peer versions; do not upgrade them just for this install.
2. In the existing server-only `betterAuth({ ... })` configuration, import `devtools` from `better-auth-devtools` and append `devtools({ enabled: true })` to its plugin list. Retain all existing plugins, callbacks, user fields, session options, database adapter, and auth routes. Do not make a replacement auth instance. If the app already controls development enablement with `DEV_AUTH_ENABLED`, respect that choice.
3. If a persona needs a required custom user field with no database default, supply it in every relevant `templates.*.user`. A role column in an ORM schema is insufficient if Better Auth does not know that field. When a `role` field is configured as a Better Auth additional field, keep `input: false` so ordinary signup/update cannot select a privileged role. DevTools' configured persona creation uses the internal adapter intentionally. Do not add role fields to apps that do not need them.
4. Apply the plugin schema using the application's existing adapter workflow and target environment. For the built-in Kysely adapter, run the Better Auth CLI `migrate` command. For Prisma or Drizzle, run Better Auth CLI `generate`, review the generated changes, and then use the project's ORM migration workflow. Use an existing compatible `auth` CLI or run a version matching the installed Better Auth version through the package manager. Run from the app workspace; add `--config path/to/auth.ts` if CLI discovery misses the actual file. Preserve existing schema and data. Do not reset a database or replace an ORM schema.
5. In React, mount `<BetterAuthDevtools />` once at the app root. For Next.js App Router, put the import from `better-auth-devtools/react` in a `"use client"` component and render it from the existing `app/layout.tsx`. Keep server-only auth and database modules out of client imports. If Better Auth serves under a custom base path, pass that path through `basePath`. The recommended panel needs no client plugin, provider, shared config module, or server-generated props.

Do not weaken authentication, origin checks, or production guards. Ask the developer only if the database target, migration policy, framework mount point, or another material choice cannot be inferred safely.

## Verify behavior

1. Run the app's relevant lint, typecheck, build, and existing tests.
2. Start a development instance against the approved development database. Confirm the actual panel appears and creates a managed test user. Switch to that user.
3. Confirm the **host application's normal Better Auth session** sees the selected user's ID/email after the switch. Use an existing authenticated screen or `auth.api.getSession`, not only the DevTools session endpoint. Check an existing protected action if the app has one.
4. For role personas, verify the app's server authorization for allowed and denied roles. Confirm ordinary signup/update cannot set a privileged role.
5. Where a production-mode check is available, confirm DevTools endpoints are disabled with `NODE_ENV=production`.

Report changed files, exact checks completed, adapter/framework actually exercised, and any remaining steps or failures. Do not call installation successful based only on dependency installation or compilation. Do not work around a package defect by duplicating session-switching behavior in the application.
