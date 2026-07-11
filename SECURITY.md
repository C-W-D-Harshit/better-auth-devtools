# Security Policy

## Supported versions

Security fixes are applied to the latest beta release. Alpha releases are unsupported.

## Reporting a vulnerability

Do not open a public issue for a vulnerability that could enable user creation, session impersonation, unauthorized field updates, or production activation.

Report vulnerabilities through GitHub private vulnerability reporting for this repository. Include the affected version, environment, reproduction steps, impact, and any suggested mitigation.

## Security boundary

Better Auth DevTools is privileged development tooling. It creates users, issues sessions, updates explicitly approved fields, and deletes users that it manages.

- The plugin is disabled whenever `NODE_ENV=production`.
- Keep development databases free of sensitive production data.
- Do not expose a DevTools-enabled server to an untrusted network.
- Keep Better Auth and this package on supported, patched versions.
