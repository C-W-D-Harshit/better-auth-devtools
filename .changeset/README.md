# Changesets

This repo uses Changesets for versioning and publishing npm packages from the monorepo.

Typical release flow:

```bash
pnpm changeset
pnpm version-packages
pnpm build
pnpm release
```
