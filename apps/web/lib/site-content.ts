import { INSTALL_SNIPPETS } from "./install-snippets"

export const SITE = {
  name: "Better Auth DevTools",
  url: "https://www.better-auth-devtools.com",
  description:
    "Better Auth DevTools — unofficial, development-only tooling for Better Auth. Create test users, switch sessions, inspect auth state, and patch approved fields from a React panel.",
  githubUrl: "https://github.com/C-W-D-Harshit/better-auth-devtools",
  agentGuideUrl: "https://www.better-auth-devtools.com/install-agent.md",
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
  headlineLines: ["Test your auth roles.", "Switch in one click."],
  description:
    "Create managed test users and switch the Better Auth session from a development-only React panel. Check the result in your own app.",
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
        title: "Managed session switching",
        description:
          "Switch to a DevTools-managed user. The panel reloads the page after a successful switch by default.",
      },
      {
        title: "Session inspection",
        description:
          "Inspect the current Better Auth user and session, with the raw token and secret-like fields hidden.",
      },
      {
        title: "Field patching",
        description:
          "Edit only fields you configure. The panel reloads after a successful edit by default.",
      },
      {
        title: "Repeatable personas",
        description:
          "Configure personas for the roles your app actually uses. The demo includes Viewer and Admin.",
      },
      {
        title: "Dev-only by design",
        description:
          "On in development, off in production, with an explicit kill switch you control.",
      },
    ],
  },
  integration: {
    title: "Install in the existing app",
    description:
      "Add one server plugin, apply its schema, and mount the real React panel once. No client plugin or server-to-client wiring is required.",
    server: {
      label: "Extend your auth config",
      filename: "src/lib/auth.ts (merge these lines)",
      code: INSTALL_SNIPPETS.authDiff,
    },
    client: {
      label: "Create the client component",
      filename: "src/app/devtools.tsx",
      code: INSTALL_SNIPPETS.panel,
    },
    layout: {
      label: "Render it in the root layout",
      filename: "src/app/layout.tsx",
      code: INSTALL_SNIPPETS.layout,
    },
    agentPrompt: INSTALL_SNIPPETS.agentPrompt,
  },
  callToAction: {
    title: "Stop logging out to test as someone else",
    description:
      "Install the package, add the plugin, and switch between managed test users in one click.",
  },
} as const
