# @better-auth-devtools/plugin

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
