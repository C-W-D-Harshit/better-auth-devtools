# Contributing to Better Auth DevTools

Thank you for your interest in contributing to Better Auth DevTools! This guide will help you get started.

## Prerequisites

- [Node.js](https://nodejs.org/) v20 or later
- [pnpm](https://pnpm.io/) v10.24.0 or later (this project enforces a specific `packageManager`)
- A basic understanding of [Better Auth](https://www.better-auth.com/), React, and TypeScript

## Getting Started

1. **Fork and clone** the repository:

   ```bash
   git clone https://github.com/<your-username>/better-auth-devtools.git
   cd better-auth-devtools
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Run the demo app** (useful for manual testing):

   ```bash
   cp apps/demo-app/.env.example apps/demo-app/.env.local
   pnpm --dir apps/demo-app db:init
   pnpm dev
   ```

## Project Structure

This is a [Turborepo](https://turbo.build/repo) monorepo with the following layout:

```
packages/
  plugin/     # Published server, client, and React package
apps/
  demo-app/   # Reference integration / playground
  web/        # Documentation site
```

## Development Workflow

### Branching

- Create a feature branch from `main`:

  ```bash
  git checkout -b feat/your-feature main
  ```

- Use descriptive branch prefixes: `feat/`, `fix/`, `docs/`, `refactor/`, `test/`.

### Common Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start all packages and apps in dev mode |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run tests across all packages |
| `pnpm package:check` | Validate and install the packed npm artifact |
| `pnpm package:audit` | Audit the packed production dependency graph |
| `pnpm schema:check` | Generate and validate Prisma and Drizzle plugin schemas |
| `pnpm check` | Run every required release gate |

### Making Changes

1. Make your changes in the relevant package(s) under `packages/` or `apps/`.
2. Run `pnpm typecheck` and `pnpm lint` to catch issues early.
3. Run `pnpm test` to make sure existing tests pass.
4. Add or update tests for any new functionality.

### Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and changelogs.

If your change affects the published package, add a changeset before opening your PR:

```bash
pnpm changeset
```

Follow the prompts to describe the change and select the appropriate semver bump. Commit the generated changeset file along with your code.

## Pull Requests

1. Keep PRs focused — one feature or fix per PR.
2. Write a clear title and description explaining **what** changed and **why**.
3. Run `pnpm check` and ensure all CI checks pass.
4. Link any related issues using `Closes #123` in the PR description.
5. Be responsive to review feedback.

## Code Style

- Write TypeScript. Avoid `any` types where possible.
- Follow the existing code conventions in the repository.
- Keep exports minimal — only expose what is part of the public API.
- Do not add runtime dependencies without discussion.

## Reporting Issues

- Search existing issues before opening a new one.
- Include steps to reproduce, expected behavior, and actual behavior.
- Specify your Node.js version, pnpm version, and OS.

## Security

This project is **development-only tooling** and must never be enabled in production. Follow [SECURITY.md](./SECURITY.md) for private vulnerability reporting.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
