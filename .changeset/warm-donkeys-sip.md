---
"@better-auth-devtools/plugin": patch
"@better-auth-devtools/react": patch
---

Collapse the public npm surface to two packages by moving shared contracts into `@better-auth-devtools/plugin` and making `@better-auth-devtools/core` and `@better-auth-devtools/shared` internal-only workspace packages.
