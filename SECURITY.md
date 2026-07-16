# Security Policy

## Supported versions

Security fixes are applied to the latest `1.x` stable release. Alpha and beta releases older than the latest stable version are unsupported.

## Reporting a vulnerability

Do not open a public issue for a vulnerability that could enable user creation, session impersonation, unauthorized field updates, or production activation.

Report vulnerabilities through GitHub private vulnerability reporting for this repository. Include the affected version, environment, reproduction steps, impact, and any suggested mitigation.

## Security boundary

Better Auth DevTools is privileged development tooling. It creates users, issues sessions, updates explicitly approved fields, and deletes users that it manages.

- The plugin is disabled whenever `NODE_ENV=production`.
- Development requires `enabled: true` or `DEV_AUTH_ENABLED=true`.
- Origin-less and cross-origin browser writes are rejected.
- DevTools endpoints have an independent in-memory rate limit.
- The default session view redacts the Better Auth session token.
- Keep development databases free of sensitive production data.
- Do not expose a DevTools-enabled server to an untrusted network.
- Keep Better Auth and this package on supported, patched versions.
