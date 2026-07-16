# better-auth-devtools

## 1.0.1

### Patch Changes

- Document the complete plug-and-play role setup for Better Auth additional fields and Admin-plugin roles.

## 1.0.0

### Minor Changes

- 8b475f1: Introduce the streamlined `devtools()` server plugin, automatic panel configuration discovery, default managed-user creation and session inspection, optional declarative personas and editing, hardened endpoints, managed-user deletion, consolidated package sources, real Better Auth integration tests, packed-consumer validation, and release quality gates.

### Patch Changes

- Harden the stable release with explicit development opt-in, origin enforcement, independent rate limiting, session-token redaction, authoritative session edits, secondary-storage cleanup, safer template validation, accessible panel behavior, adapter schema checks, packed dependency auditing, and synchronized public documentation.

## 0.2.0-beta.0

### Minor Changes

- Make Better Auth DevTools beta-ready with a zero-config `devtools()` server plugin, automatic panel configuration discovery, default managed-user creation and session inspection, optional declarative personas and editing, hardened endpoints, managed-user deletion, consolidated package sources, real Better Auth integration tests, packed-consumer validation, and release quality gates.

## 0.1.1

### Patch Changes

- 3b2bd28: Collapse the public npm surface to a single `better-auth-devtools` package with `./plugin` and `./react` subpath exports.
- 03a82af: Include the package README in the published tarball so the npm page renders the project documentation and unofficial Better Auth disclaimer.
- c3095d8: Update the published package README so npm shows the current unofficial Better Auth devtool positioning, installation flow, AI agent prompt, and minimal usage examples.
- 74af11d: Reduce integration setup by adding `defineDevtoolsConfig`, `createDevtoolsPanelProps`, and `createDevtoolsIntegration`, so apps can configure server, client, and panel wiring from one shared source of truth.
- b523d3b: Improve the public TypeScript API, document Next.js App Router integration more clearly, and refresh the landing-page content and responsiveness.
- 3fa64ee: Split browser-safe setup helpers away from server integration wiring to avoid dragging server code into client bundles, and add concrete response types to the shipped client plugin actions.
- d995b58: Fold the public API into a single installable package so users consume `better-auth-devtools/plugin` and `better-auth-devtools/react` from one dependency.

## 0.1.1-alpha.9

### Patch Changes

- Refresh the public docs to follow a more official Better Auth plugin structure with clearer installation, configuration, usage, schema, and migration guidance.

## 0.1.1-alpha.8

### Patch Changes

- Improve the public TypeScript API, document Next.js App Router integration more clearly, and refresh the landing-page content and responsiveness.

## 0.1.1-alpha.7

### Patch Changes

- Split browser-safe setup helpers away from server integration wiring to avoid dragging server code into client bundles, and add concrete response types to the shipped client plugin actions.

## 0.1.1-alpha.6

### Patch Changes

- Reduce integration setup by adding `defineDevtoolsConfig`, `createDevtoolsPanelProps`, and `createDevtoolsIntegration`, so apps can configure server, client, and panel wiring from one shared source of truth.

## 0.1.1-alpha.3

### Patch Changes

- Update the published package README so npm shows the current unofficial Better Auth devtool positioning, installation flow, AI agent prompt, and minimal usage examples.

## 0.1.1-alpha.2

### Patch Changes

- Include the package README in the published tarball so the npm page renders the project documentation and unofficial Better Auth disclaimer.

## 0.1.1-alpha.1

### Patch Changes

- d995b58: Fold the public API into a single installable package so users consume `better-auth-devtools/plugin` and `better-auth-devtools/react` from one dependency.

## 0.1.1-alpha.0

### Patch Changes

- Prepare the Better Auth DevTools packages for npm publishing with Changesets, package metadata, package READMEs, and a GitHub Actions release workflow.
- Updated dependencies
  - @better-auth-devtools/core@0.1.1-alpha.0
  - @better-auth-devtools/shared@0.1.1-alpha.0
