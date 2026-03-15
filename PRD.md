# Product Requirements Document

## Product

**Better Auth DevTools**

## Author

Harshit

## Status

Draft

---

# 1. Summary

Better Auth DevTools is a development-only utility for Better Auth applications. It reduces the friction of testing authentication, role-based access control, and session-driven UX by giving developers a local DevTools panel to create managed test users, switch into those test users, inspect the current session, and patch approved session metadata without repeatedly logging in and out.

The product is intentionally scoped for local development and trusted internal environments only. It is not an admin dashboard, not a production impersonation system, and not a replacement for Better Auth's normal auth or admin capabilities. v1 is centered on devtools-managed test personas created by the utility itself, not arbitrary existing application users.

The v1 product consists of:

1. A **Better Auth plugin** that exposes development-only endpoints through the Better Auth plugin model.
2. A **React DevTools panel** that talks to those endpoints and provides the local developer workflow.
3. Shared **core contracts and utilities** used by the plugin and UI packages.
4. A **Next.js demo app** inside the monorepo for end-to-end validation and documentation.

This PRD defines a build-ready v1 spec for a Turborepo monorepo.

---

# 2. Problem

Developers working on authenticated applications routinely lose time on repetitive auth setup while testing:

- Logging out and back in to validate different roles or organizations
- Re-entering credentials to test permission boundaries
- Manually creating disposable test accounts
- Manually modifying local data to simulate session states
- Struggling to inspect the active session payload during debugging

Typical workflow today:

1. Create or find a test account
2. Enter credentials for that account
3. Login
4. Navigate back to the state being tested
5. Repeat for each role or scenario

This is especially slow for:

- RBAC validation
- organization switching
- feature flag testing
- debugging session-derived UI
- QA checks across multiple personas

---

# 3. Goals

## Primary Goals

- Enable instant login as a managed test user without credentials
- Allow developers to create managed test users from approved templates or presets
- Expose the current auth session in a developer-facing panel
- Allow patching an approved subset of session metadata for local testing
- Integrate cleanly with Better Auth's plugin system
- Require minimal host-app setup while remaining predictable across auth setups

## Secondary Goals

- Keep the product safe by default in development-only contexts
- Preserve a clean path for future framework support beyond React
- Provide a demo app that acts as both reference integration and validation target
- Fit naturally into a Turborepo monorepo structure

---

# 4. Non-Goals

The following are explicitly out of scope for v1:

- Production impersonation
- Production auth management
- A full user management dashboard
- Authorization rule or policy editing
- Direct database introspection across arbitrary adapters
- Automatic discovery or switching of arbitrary existing users from unknown schemas or adapters
- Multi-framework UI support beyond React
- Arbitrary full-session JSON editing

---

# 5. Target Users

## Primary Users

- Full-stack developers building Better Auth applications
- Backend engineers validating auth and permission behavior
- Product engineers testing role- and org-based UX

## Secondary Users

- QA engineers working in local or trusted internal development environments

---

# 6. Product Scope

## 6.1 Core Workflows

v1 must support these workflows:

1. Open the DevTools panel during development
2. View a list of managed test users available for instant login
3. Create a managed test user from an allowed template or preset
4. Switch into one of those managed test users without entering credentials
5. Inspect the active session
6. Patch approved session metadata fields
7. See success and failure states clearly in the UI
8. Return to the app and verify behavior immediately

## 6.2 Out-of-Scope Workflows

v1 does not need to support:

- Creating arbitrary real users outside the devtools-managed flow
- Editing passwords
- Managing authorization policies
- Viewing raw cookies
- Editing arbitrary JWT payloads
- Cross-device or remote-session debugging

---

# 7. Monorepo Architecture

The repository uses a Turborepo structure:

```text
better-auth-devtools/

apps/
  demo-app/

packages/
  plugin/
  react/
  core/
  shared/

docs/

package.json
pnpm-workspace.yaml
turbo.json
README.md
```

## 7.1 Package Responsibilities

### `apps/demo-app`

Reference **Next.js** Better Auth application used to validate the plugin and React panel end to end. It serves as:

- a local manual testing target
- a usage example for documentation
- an integration safety net during development
- the canonical v1 integration environment for validating session and cookie behavior

### `packages/plugin`

Server-side Better Auth plugin package. Responsibilities:

- register development-only endpoints using Better Auth's plugin model
- enforce runtime guards
- create and manage devtools-owned test users
- create or swap sessions through Better Auth-compatible server flow
- patch allowed session metadata

### `packages/react`

React-only UI package for v1. Responsibilities:

- render the floating DevTools trigger and panel
- fetch managed test users and current session from the plugin
- submit managed user creation, login, and session patch actions
- display loading, empty, disabled, and error states

### `packages/core`

Shared public contracts and runtime helpers. Responsibilities:

- TypeScript types for config and API payloads
- endpoint path constants
- shared validation helpers and guards
- UI-agnostic logic intended to remain reusable if non-React clients are added later

### `packages/shared`

Internal shared utilities used only when needed to avoid duplication or cyclic dependencies. It should not become a dumping ground. If a utility is part of the public API, it belongs in `core`, not `shared`.

## 7.2 Turborepo Rules

The monorepo must follow these task conventions:

- package tasks live in each package's `package.json`
- `turbo.json` registers task orchestration
- the root `package.json` only delegates using `turbo run <task>`
- root-level scripts must not contain the real build, test, or lint logic

---

# 8. Public Package Surface

The v1 public exports are:

```text
better-auth-devtools/plugin
better-auth-devtools/react
```

`packages/core` exists as a shared package for public types and contracts, but it is not required to be a public npm entrypoint in v1 unless implementation requires that. If exposed later, its exports must remain aligned with the types already used by `plugin` and `react`.

---

# 9. Better Auth Integration Model

The plugin must align with Better Auth's plugin architecture as documented in the Better Auth plugin concepts documentation.

v1 assumes the following implementation approach:

- custom development endpoints are registered through the Better Auth plugin system, using Better Auth's endpoint creation primitives
- session creation or swapping uses Better Auth-compatible internal APIs rather than raw database writes
- managed test users are created and tracked through plugin-controlled flows rather than generic user discovery
- host applications install the plugin through the normal Better Auth plugin registration flow

The PRD intentionally does not require implementation against undocumented Better Auth internals beyond what is needed for plugin endpoints and session operations.

---

# 10. Configuration Model

v1 uses a **managed test user** model rather than automatic database discovery.

## 10.1 Required Runtime Guards

The DevTools feature must only be active when all of the following are true:

- `DEV_AUTH_ENABLED=true`
- runtime environment is not production

If either check fails:

- plugin endpoints are not usable
- the React UI is hidden or inert
- the package must not provide a working auth bypass path

## 10.2 Host App Configuration

The host app must provide configuration that allows the plugin to create and manage test users safely. The config should define:

- which test user templates or persona presets may be created
- what identifying and display fields should be shown in the UI
- which session metadata fields are editable in DevTools
- how editable fields are validated or normalized

Editable fields are opt-in and validated by the plugin before patching.

## 10.3 Configuration Requirements

The config contract must make these items explicit:

- how managed test users are identified for switch requests
- what template or persona metadata is required to create them
- what label or metadata should be shown in the UI for each test user
- what marker identifies a user as devtools-managed
- what session fields are editable
- how editable fields are validated or normalized

v1 must not assume:

- a specific database adapter
- a specific Better Auth session schema beyond the minimum required current-session shape
- that all Better Auth applications expose existing users in a uniform way

---

# 11. v1 Features

## 11.1 React DevTools Panel

The React package renders a development-only floating trigger that opens a local DevTools panel.

The panel must include:

- a managed test user list
- a way to create test users from host-defined templates or presets
- a current session inspector
- a session patch editor for allowed fields
- visible loading, success, and error states

If the number of users is large enough to make scanning difficult, the panel should support search or filtering.

## 11.2 Managed Test User Switching

Developers can create and switch into a managed test user without entering credentials.

Expected behavior:

1. Developer creates or selects a managed test user
2. UI sends a create or login request to the plugin
3. Plugin validates environment guards
4. Plugin validates that the requested persona or test user is allowed by configuration
5. Plugin creates the managed test user if needed
6. Plugin creates or swaps the session using a Better Auth-compatible flow
7. Client auth state refreshes
8. UI reflects the new active session

## 11.3 Session Inspector

The panel must show the active session returned by the plugin in a developer-readable format.

The inspector should include at minimum:

- user identifier
- email or display label if available
- key session metadata fields
- expiration or other useful session timing details if available

The UI should present this data clearly, but the exact visual treatment is not mandated by this PRD.

## 11.4 Session Patch Editor

v1 supports patching an approved subset of session metadata fields only.

Requirements:

- patching is partial, not full replacement
- only host-configured editable fields are accepted
- unknown or disallowed keys are rejected
- validated changes are reflected in the active session response

This editor may be implemented as:

- a structured form for named fields
- a JSON-like key-value editor limited to allowed fields

v1 does not support arbitrary editing of the entire session object.

---

# 12. API Contracts

All endpoints below are development-only and must enforce the runtime guards described in this document.

Base route prefix:

```text
/__better-auth-dev
```

## 12.1 `GET /__better-auth-dev/users`

### Purpose

Return the list of managed test users available for development login.

### Guards

- feature enabled
- non-production runtime
- valid plugin configuration

### Success Response

Returns an array of managed test user records. Each record must include:

- stable identifier used by the login endpoint
- display information needed by the UI
- a marker showing that the user is devtools-managed

Example:

```json
[
  {
    "id": "user_admin_1",
    "email": "admin+1@test.local",
    "label": "Admin",
    "devtoolsManaged": true
  },
  {
    "id": "user_editor_1",
    "email": "editor+1@test.local",
    "label": "Editor",
    "devtoolsManaged": true
  }
]
```

### Failure Cases

- feature disabled
- production environment
- missing or invalid test user configuration
- unexpected managed-user lookup failure

## 12.2 `POST /__better-auth-dev/users`

### Purpose

Create a managed test user from an allowed persona or template.

### Request Body

```json
{
  "template": "admin"
}
```

### Guards

- feature enabled
- non-production runtime
- valid plugin configuration
- requested template is allowed

### Success Response

Returns the created managed test user record.

Example:

```json
{
  "user": {
    "id": "user_admin_1",
    "email": "admin+1@test.local",
    "label": "Admin",
    "devtoolsManaged": true
  }
}
```

### Failure Cases

- feature disabled
- production environment
- template missing
- template not allowed
- managed test user creation failed

## 12.3 `POST /__better-auth-dev/login`

### Purpose

Switch the active local session into a managed test user without credentials.

### Request Body

```json
{
  "userId": "user_admin_1"
}
```

### Guards

- feature enabled
- non-production runtime
- valid plugin configuration
- requested managed test user exists and is devtools-managed

### Success Response

Returns the resulting current session payload after login completes.

Example:

```json
{
  "session": {
    "userId": "user_admin_1",
    "email": "admin+1@test.local",
    "role": "admin",
    "orgId": "org_1"
  }
}
```

### Failure Cases

- feature disabled
- production environment
- user identifier missing
- requested user not found
- requested user is not devtools-managed
- Better Auth session creation failed
- current auth setup is incompatible with the plugin's session-switch flow

## 12.4 `GET /__better-auth-dev/session`

### Purpose

Return the current active session in a UI-consumable format.

### Guards

- feature enabled
- non-production runtime

### Success Response

Returns the current session payload or an empty-state response when no active session exists.

Example:

```json
{
  "session": {
    "userId": "user_admin_1",
    "email": "admin+1@test.local",
    "role": "admin",
    "orgId": "org_1"
  }
}
```

### Failure Cases

- feature disabled
- production environment
- current auth setup cannot expose session data in the expected shape

## 12.5 `POST /__better-auth-dev/update-session`

### Purpose

Patch the current session using only host-approved editable fields.

### Request Body

```json
{
  "patch": {
    "role": "admin",
    "orgId": "org_2"
  }
}
```

### Guards

- feature enabled
- non-production runtime
- valid editable-field configuration
- active session exists

### Success Response

Returns the updated session payload.

Example:

```json
{
  "session": {
    "userId": "user_admin_1",
    "email": "admin+1@test.local",
    "role": "admin",
    "orgId": "org_2"
  }
}
```

### Failure Cases

- feature disabled
- production environment
- no active session
- patch contains disallowed keys
- patch value fails validation
- session update operation fails

---

# 13. Unsupported and Failure Behavior

The product must fail clearly and safely.

Unsupported or invalid conditions include:

- feature disabled by configuration
- production runtime
- host app did not provide valid managed test user configuration
- host app did not define editable fields but the UI attempts to patch
- requested user identifier cannot be resolved
- requested user exists but is not devtools-managed
- Better Auth integration cannot create or update the session using supported APIs
- current session shape is missing fields required by the UI contract

Expected behavior in these cases:

- endpoints return clear error responses
- UI shows actionable developer-facing errors
- no fallback behavior attempts raw database mutation or insecure bypasses

---

# 14. UX Requirements

The UI should be lightweight, developer-focused, and clearly non-production in tone.

## 14.1 Entry Point

- a floating trigger is visible only when the feature is active
- the trigger opens and closes the panel without disrupting the host app

## 14.2 User List

- list managed test users with enough context to distinguish them
- allow creation of managed test users from allowed templates or presets
- support loading and empty states
- support search or filtering when user counts are large enough to affect usability

## 14.3 Session View

- show the active session in a readable format
- clearly label editable versus non-editable fields

## 14.4 Session Patch UX

- editing is limited to approved fields
- save action communicates success or failure clearly
- disallowed fields are not silently ignored

## 14.5 Error States

The UI must clearly communicate:

- feature disabled
- unsupported runtime
- configuration errors
- managed test user creation failures
- session update failures

---

# 15. Security Requirements

This product intentionally introduces a high-power development capability. v1 must be conservative.

Required safeguards:

- explicit opt-in with `DEV_AUTH_ENABLED=true`
- non-production runtime requirement
- clear documentation that the tool is for local or trusted internal development environments only
- no supported path for enabling the tool in production
- no implicit user discovery from unknown databases or adapters
- user switching limited to devtools-managed test users
- managed test users must be clearly distinguishable from real application users

Additional guidance:

- documentation should warn that exposing these endpoints outside trusted development environments is unsafe
- implementation should prefer using Better Auth primitives instead of custom auth bypass logic
- implementation should mark managed test users clearly enough to prevent confusion with real users

---

# 16. Success Criteria

v1 is successful when all of the following are true:

- a developer can create and switch to a managed test user without entering credentials
- the React panel shows the current active session after the switch
- approved session metadata changes are reflected in the active session
- attempts to modify disallowed fields are rejected clearly
- attempts to switch into a non-devtools-managed user are rejected clearly
- the package is inert when disabled
- the package is inert in production
- `apps/demo-app` demonstrates the end-to-end workflow

---

# 17. Test Plan

## 17.1 Manual Validation in `apps/demo-app`

The Next.js demo app must cover these scenarios:

1. start the app with the feature enabled
2. create at least three managed test users from allowed templates
3. switch across those managed test users
4. inspect the current session after each switch
5. patch an allowed metadata field and verify the app reflects the change
6. attempt to patch a disallowed field and verify rejection
7. attempt to switch into a non-devtools-managed user and verify rejection
8. start the app with the feature disabled and verify the UI and endpoints are inactive
9. simulate production runtime and verify the plugin and UI remain inert

## 17.2 Package-Level Test Expectations

### `packages/plugin`

- endpoint contract tests for success and failure cases
- runtime guard tests
- managed test user config validation tests
- managed test user creation tests
- session patch validation tests

### `packages/react`

- component tests for user list rendering
- component tests for managed test user creation flow
- component tests for session rendering
- interaction tests for login and patch submission flows
- error-state tests

### `packages/core`

- type and config validation tests
- endpoint constant and shared helper coverage where applicable

### Integration

- end-to-end validation through `apps/demo-app`

---

# 18. Future Enhancements

Possible follow-on work after v1:

- framework support beyond React
- a public `core` package export if ecosystem demand requires it
- richer session inspection
- JWT or token inspection when supported safely
- feature flag toggles
- organization and role presets
- reset or reseed flows for managed test users
- CLI helpers

These are explicitly not required for v1.

---

# 19. Assumptions

- Better Auth provides sufficient documented or stable plugin primitives for custom endpoints and session creation or update flows.
- Host applications can provide managed test user templates or persona definitions reliably enough for v1.
- Applications may have custom session schemas, so editable fields must remain opt-in.
- React is the only official UI target in v1.
- The current week-by-week timeline from the original draft is intentionally removed because it implies precision that this document does not yet justify.
