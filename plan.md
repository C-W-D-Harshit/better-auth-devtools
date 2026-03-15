# Better Auth DevTools v1 Implementation Plan

## Summary

Build a Turborepo monorepo with a Next.js App Router demo app and four packages: `plugin`, `react`, `core`, and `shared`.

The implementation should follow Better Auth's documented plugin model:

- server plugin object satisfies `BetterAuthPlugin`
- custom API routes use `createAuthEndpoint` from `better-auth/api`
- mutating routes use `POST`
- endpoint paths use kebab-case
- plugin-owned persistence is added through plugin schema and Better Auth migration flow
- session switching uses Better Auth internal session APIs such as `internalAdapter.createSession(userId)` rather than direct session-table writes
- a matching client plugin satisfies `BetterAuthClientPlugin` and uses `$InferServerPlugin` plus `pathMethods` for typed client calls

This plan assumes the product model already locked in the PRD:

- managed test users only
- static config templates
- host callbacks for session view and session patching
- Next.js App Router demo app

Important spec correction:

- use a kebab-case route prefix such as `/better-auth-devtools` instead of `/__better-auth-dev`

## Implementation Changes

### Monorepo foundation

- Create root workspace files:
  - `package.json`
  - `pnpm-workspace.yaml`
  - `turbo.json`
  - base `tsconfig` and any shared lint/test config needed
- Follow Turborepo task rules:
  - each package owns its real scripts in its own `package.json`
  - root scripts only delegate with `turbo run ...`
  - register at least `build`, `dev`, `lint`, `typecheck`, and `test` in `turbo.json`
- Package dependency boundaries:
  - `packages/core`: no framework dependency
  - `packages/shared`: internal helpers only
  - `packages/plugin`: depends on `core` and `shared`
  - `packages/react`: depends on `core`, `shared`, and Better Auth client/react APIs
  - `apps/demo-app`: depends on `plugin` and `react`

### `packages/core`

- Define shared contracts:
  - `DevtoolsTemplateKey`
  - `ManagedTestUserRecord`
  - `ManagedTestUserTemplate`
  - `DevtoolsSessionView`
  - `DevtoolsSessionPatch`
  - endpoint constants and route helpers
- Define server config interfaces:
  - `templates: Record<string, ManagedTestUserTemplate>`
  - `createManagedUser(args) => Promise<{ userId; email?; label; extra? }>`
  - `getSessionView(args) => Promise<DevtoolsSessionView>`
  - `patchSession(args) => Promise<DevtoolsSessionView>`
- Define request and response payload types for:
  - `GET /better-auth-devtools/users`
  - `POST /better-auth-devtools/users`
  - `POST /better-auth-devtools/login`
  - `GET /better-auth-devtools/session`
  - `POST /better-auth-devtools/update-session`
- Keep session patching host-driven:
  - plugin validates allowed keys
  - host callback performs schema-specific data reads and writes
  - plugin does not assume app-specific session columns exist

### `packages/plugin`

- Export `devtoolsPlugin(options)` from `better-auth-devtools/plugin`
- Implement the server plugin as a `BetterAuthPlugin` with:
  - `id: "better-auth-devtools"`
  - `schema` for plugin-owned persistence
  - `endpoints` built with `createAuthEndpoint`
- Add a plugin-owned table, recommended name `devtoolsUsers`, with fields:
  - `id`
  - `userId`
  - `templateKey`
  - `label`
  - `email`
  - `createdAt`
  - `updatedAt`
- Use `userId` as the proof that a user is devtools-managed
- Do not mutate the host app's user schema to track ownership in v1
- Use Better Auth's schema and migration flow:
  - define the plugin schema in the plugin
  - document migration generation after plugin registration in the demo app
  - do not disable migration for this table
- Implement endpoint behavior:
  - `GET /better-auth-devtools/users`
    - return rows from `devtoolsUsers`
  - `POST /better-auth-devtools/users`
    - validate the template key
    - call host `createManagedUser`
    - persist the managed-user record in `devtoolsUsers`
    - return normalized user data
  - `POST /better-auth-devtools/login`
    - validate the user exists in `devtoolsUsers`
    - create or swap session with Better Auth internal APIs
    - return `getSessionView(...)`
  - `GET /better-auth-devtools/session`
    - resolve current session using Better Auth context
    - map result through host `getSessionView`
  - `POST /better-auth-devtools/update-session`
    - validate patch keys against allowed editable fields
    - call host `patchSession`
    - return updated session view
- Put runtime guards inside each endpoint handler:
  - `process.env.DEV_AUTH_ENABLED === "true"`
  - `NODE_ENV !== "production"`
  - config is present and valid
- Do not depend on Better Auth middleware for core protection, because middleware only applies to client API requests, not direct endpoint invocation
- Standardize error responses for:
  - feature disabled
  - invalid template
  - unmanaged user
  - missing active session
  - invalid patch
  - unsupported host behavior

### Client plugin and `packages/react`

- Export a matching Better Auth client plugin from `better-auth-devtools/plugin`
- Implement the client plugin as `BetterAuthClientPlugin` with:
  - `$InferServerPlugin: {} as ReturnType<typeof devtoolsPlugin>`
  - typed `getActions($fetch)` wrappers for create/list/login/update-session
  - `pathMethods` entries for mutating routes
- In `packages/react`, require a host-configured Better Auth client that includes the devtools client plugin
- Recommended public React API:
  - `<BetterAuthDevtools authClient={authClient} />`
  - optional props for placement, default-open state, and label overrides
- UI behavior:
  - panel is client-only
  - panel is hidden unless `DEV_AUTH_ENABLED=true` and runtime is non-production
  - fetch managed users and session on open
  - allow creating users from a template picker
  - allow switching to an existing managed test user
  - show session fields from `DevtoolsSessionView`
  - render only editable fields for patching
  - show explicit disabled, configuration, and request error states
- Prefer simple local state and typed fetch helpers over a heavier state-management dependency

### `apps/demo-app`

- Build the demo app as a Next.js App Router app
- Configure Better Auth server with `devtoolsPlugin(...)`
- Configure Better Auth client with the matching devtools client plugin
- Provide three static templates:
  - `admin`
  - `editor`
  - `viewer`
- Implement host callbacks:
  - `createManagedUser`
  - `getSessionView`
  - `patchSession`
- `createManagedUser` should create a real Better Auth user for the demo app, then return normalized metadata for the plugin-owned tracking table
- Mount `<BetterAuthDevtools />` in the app shell
- Include at least one protected page whose UI changes by role or org so switching and patching are immediately visible

### Public API surface

- Public npm entrypoints:
  - `better-auth-devtools/plugin`
  - `better-auth-devtools/react`
- `better-auth-devtools/plugin` should export:
  - `devtoolsPlugin`
  - `devtoolsClientPlugin`
  - public config and payload types re-exported from `core`
- Do not expose a public `core` package entrypoint in v1 unless implementation pressure requires it

## Test Plan

### Task wiring

- Register `build`, `lint`, `typecheck`, and `test` in `turbo.json`
- Keep real scripts in package `package.json` files
- Keep root scripts as `turbo run ...` delegates only

### `packages/core`

- type-level tests for request, response, and config contracts
- runtime validation tests for template keys and allowed patch-key filtering

### `packages/plugin`

- endpoint contract tests for all five routes
- guard tests for disabled feature and production mode
- managed-user persistence tests for the plugin table
- login rejection test for non-managed users
- update-session rejection test for disallowed keys

### `packages/react`

- component tests for panel closed and open states
- managed test user creation flow tests
- managed test user switching flow tests
- session rendering tests
- editable-field rendering tests
- error-state rendering tests

### `apps/demo-app`

- manual acceptance checks:
  - create at least three managed test users from templates
  - switch across them
  - inspect session after each switch
  - patch an allowed field and verify visible app changes
  - attempt to patch a disallowed field and verify rejection
  - attempt to switch to a non-managed user and verify rejection
  - verify feature is inert when disabled
  - verify feature is inert in production mode
- add one integration check that:
  - creates a managed user
  - logs in as that user
  - patches a field
  - confirms the page output updates accordingly

### Migration validation

- confirm the plugin schema can be generated and migrated through Better Auth's documented migration flow once the plugin is registered in the demo app

## Assumptions

- Better Auth's documented plugin APIs remain sufficient for:
  - `createAuthEndpoint`
  - plugin schema registration
  - typed client plugin inference
  - session creation with internal adapter helpers
- Host applications own managed-user creation details because user schema differs across apps
- Host applications own session patching logic because session metadata differs across apps
- Next.js App Router is the only official demo target in v1
- The route prefix is corrected to kebab-case to align with Better Auth plugin guidance
