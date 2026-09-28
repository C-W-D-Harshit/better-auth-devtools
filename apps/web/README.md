# Better Auth DevTools website

This Next.js app explains installation and links to the runnable demo. Run it from the repository root with `pnpm --dir apps/web exec next dev --port 3000`. The demo uses port 3100 through `pnpm demo`.

The homepage keeps its HTML and Markdown representations in `lib/site-content.ts` and `lib/markdown.ts`. The install snippets in `lib/install-snippets.ts` come from the root README. The public `/install-agent.md` file comes from the root agent guide. Run `pnpm docs:sync` after editing either source and `pnpm docs:check` to detect drift.

The hero illustration is a simulation. The linked demo app mounts the actual published panel component against a local development database.
