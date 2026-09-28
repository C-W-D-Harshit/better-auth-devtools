# Contributing to Better Auth DevTools

Use Node.js 20 or newer and pnpm 10.24.0. This repository has a package, a Next.js demo, and a Next.js website. The demo imports the public package exports used by consumers.

## Local setup

```bash
pnpm install
pnpm demo
```

`pnpm demo` builds the package, creates `apps/demo-app/.env.local` with a random development secret if the file is absent, applies missing Better Auth migrations to the local demo database, and starts the demo at <http://localhost:3100>. Repeat runs keep existing environment files and database data. If an existing `.env.local` lacks a valid secret, the command stops and asks you to fix that file rather than overwriting it.

Open the real panel, create Viewer and Admin users, then switch between them. The dashboard shows the app's own Better Auth session. Its server action denies Viewer and allows Admin. The website can run separately on port 3000 with `pnpm --dir apps/web exec next dev --port 3000`. The workspace `pnpm dev` scripts also use separate ports.

Consumer installation instructions live in [README.md](README.md). The coding-agent guide is [AGENT_INSTALL.md](AGENT_INSTALL.md). Keep those separate from contributor setup.

## Checks

```bash
pnpm docs:sync   # after editing the root README or agent guide
pnpm docs:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm package:check
pnpm schema:check
pnpm package:audit
```

`pnpm docs:sync` copies the root README into the published package, copies the agent guide to the website, and extracts website install snippets. `pnpm docs:check` checks all three copies in CI. The website's Markdown representation uses the same snippet data as its HTML page.

The demo database and `.env.local` are ignored by Git. For an isolated run, set `DEMO_DB_FILE` to an absolute path in a temporary directory. Do not point the demo at a shared or production database.

If a package change affects the published release, add a Changeset with `pnpm changeset`. Keep pull requests focused and report which checks and browser flows you ran.

Security issues should follow [SECURITY.md](SECURITY.md). Contributions are licensed under [MIT](LICENSE).
