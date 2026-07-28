export const SITE = {
  name: "Better Auth DevTools",
  url: "https://www.better-auth-devtools.com",
  description:
    "Better Auth DevTools — unofficial, development-only tooling for Better Auth. Create test users, switch sessions, inspect auth state, and patch approved fields from a React panel.",
  githubUrl: "https://github.com/C-W-D-Harshit/better-auth-devtools",
  npmUrl: "https://www.npmjs.com/package/better-auth-devtools",
  author: {
    name: "Harshit",
    url: "https://github.com/C-W-D-Harshit",
  },
} as const

export const HOME_PAGE = {
  path: "/",
  markdownPath: "/index.md",
  title: "Better Auth DevTools",
  headlineLines: ["Test any user, any role.", "One click."],
  description:
    "Stop logging in and out to test roles and permissions. A development-only panel for Better Auth that spawns managed test users and switches sessions instantly, right inside your app.",
  releaseLabel: "Stable release ready for Better Auth",
  installCommand: "pnpm add better-auth-devtools",
  features: {
    title: "Everything you need to test auth",
    description:
      "Built for the inner loop — the fast, repeatable checks you run dozens of times a day while building auth-gated features.",
    items: [
      {
        title: "Managed test users",
        description:
          "Spin up test accounts from templates you define. Keep real users out of your everyday auth checks.",
      },
      {
        title: "Instant session switching",
        description:
          "Jump into any managed user in one click. The app reloads against the new Better Auth session.",
      },
      {
        title: "Session inspection",
        description:
          "Read the exact session your app exposes — user fields plus approved metadata.",
      },
      {
        title: "Field patching",
        description:
          "Edit only the fields you explicitly allow, then refresh with the updated auth state.",
      },
      {
        title: "Repeatable personas",
        description:
          "Stable roles like Admin, Editor, and Viewer make auth-gated UI easy to verify — every time.",
      },
      {
        title: "Dev-only by design",
        description:
          "On in development, off in production, with an explicit kill switch you control.",
      },
    ],
  },
  integration: {
    title: "Two integration points",
    description:
      "One server plugin and one zero-prop React component. No client plugin, no server-to-client wiring.",
    server: {
      label: "Add the plugin",
      filename: "auth.ts",
      code: `import { betterAuth } from "better-auth";
import { devtools } from "better-auth-devtools";

export const auth = betterAuth({
  database,
  plugins: [devtools({ enabled: true })],
});`,
    },
    client: {
      label: "Mount the panel",
      filename: "providers.tsx",
      code: `"use client";

import { BetterAuthDevtools } from "better-auth-devtools/react";

export function DevtoolsWrapper() {
  return <BetterAuthDevtools />;
}`,
    },
    note: {
      lead: "Explicitly enabled for development.",
      safety: "Production stays disabled.",
      migrationPrefix: "After adding it, run",
      migrationCommand: "npx auth@latest migrate",
      migrationSuffix: "to apply the schema.",
    },
  },
  callToAction: {
    title: "Stop logging out to test as someone else",
    description:
      "Install the package, add the plugin, and switch between managed test users in one click.",
  },
} as const
