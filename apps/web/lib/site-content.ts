import pluginPackage from "../../../packages/plugin/package.json"
import { INSTALL_SNIPPETS } from "./install-snippets"

function minimumVersion(range: string): string {
  return range.match(/>=\s*([\d.]+)/)?.[1] ?? range
}

const PEERS = pluginPackage.peerDependencies
const MIN_BETTER_AUTH = minimumVersion(PEERS["better-auth"])
const MIN_REACT = minimumVersion(PEERS.react).replace(/\.0\.0$/, "")
const MIN_NODE = minimumVersion(pluginPackage.engines.node)

const GITHUB_URL = "https://github.com/C-W-D-Harshit/better-auth-devtools"

export const SITE = {
  name: "Better Auth DevTools",
  url: "https://www.better-auth-devtools.com",
  title: "Better Auth DevTools: The Devtools Panel for Better Auth",
  description:
    "Better Auth DevTools is a development-only panel for Better Auth apps. Create test users from templates, switch sessions in one click, inspect the live session, and edit roles without logging out.",
  packageName: pluginPackage.name,
  version: pluginPackage.version,
  license: pluginPackage.license,
  githubUrl: GITHUB_URL,
  docsUrl: `${GITHUB_URL}#readme`,
  agentGuideUrl: "https://www.better-auth-devtools.com/install-agent.md",
  changelogUrl: `${GITHUB_URL}/blob/main/packages/plugin/CHANGELOG.md`,
  issuesUrl: `${GITHUB_URL}/issues`,
  npmUrl: "https://www.npmjs.com/package/better-auth-devtools",
  betterAuthUrl: "https://www.better-auth.com",
  author: {
    name: "Harshit",
    url: "https://github.com/C-W-D-Harshit",
    xUrl: "https://x.com/cwd_harshit",
  },
} as const

export const REQUIREMENTS = {
  betterAuth: `Better Auth ${MIN_BETTER_AUTH} or newer, below 2.0`,
  react: `React and React DOM ${MIN_REACT} or newer`,
  node: `Node.js ${MIN_NODE} or newer`,
} as const

const INSTALL_COMMANDS = [
  { manager: "pnpm", command: "pnpm add better-auth-devtools" },
  { manager: "npm", command: "npm install better-auth-devtools" },
  { manager: "yarn", command: "yarn add better-auth-devtools" },
  { manager: "bun", command: "bun add better-auth-devtools" },
] as const

const ROLES_CODE = `export const auth = betterAuth({
  database,
  user: {
    additionalFields: {
      role: { type: ["admin", "editor", "viewer"], defaultValue: "viewer", input: false },
    },
  },
  plugins: [
    devtools({
      enabled: true,
      templates: {
        admin: { label: "Admin", user: { role: "admin" } },
        editor: { label: "Editor", user: { role: "editor" } },
        viewer: { label: "Viewer", user: { role: "viewer" } },
      },
      editableFields: [
        { key: "role", label: "Role", type: "select", options: ["admin", "editor", "viewer"] },
      ],
    }),
  ],
});`

/** Strips the `code` markers used in content strings. */
export function plainText(text: string): string {
  return text.replace(/`([^`]+)`/g, "$1")
}

export const HOME_PAGE = {
  path: "/",
  markdownPath: "/index.md",
  title: "Better Auth DevTools",
  headline: "The missing devtools for Better Auth",
  summary:
    "Create test users, switch sessions, and edit roles from a panel inside your app.",
  releaseLabel: `v${pluginPackage.version} on npm`,
  installCommand: INSTALL_COMMANDS[0].command,
  installCommands: INSTALL_COMMANDS,
  facts: [
    { label: "Works with", value: `Better Auth ${MIN_BETTER_AUTH}+` },
    { label: "Panel", value: `React ${MIN_REACT}+` },
    { label: "License", value: `${pluginPackage.license}, free` },
    { label: "In production", value: "Always off" },
  ],
  features: {
    title: "What you can do from the panel",
    description:
      "Testing an admin screen usually means signing out, signing in as another account, and loading the page again. DevTools turns that into one click from a small panel in the corner of your app.",
    items: [
      {
        title: "Create test users",
        description:
          "Pick a template, like Admin or Viewer, and the plugin creates a verified Better Auth user for it. Real accounts stay out of your testing.",
      },
      {
        title: "Switch sessions in one click",
        description:
          "Click Switch next to any test user. The plugin issues a real Better Auth session for them and reloads the page.",
      },
      {
        title: "Inspect the current session",
        description:
          "See the user and session your app receives. The session token and secret-looking fields are redacted.",
      },
      {
        title: "Edit approved fields",
        description:
          "Change a role, plan, or flag on the signed-in user. Only fields you list in `editableFields` can be edited.",
      },
      {
        title: "Share personas with your team",
        description:
          "Templates live in your auth config, so every developer gets the same Admin, Editor, and Viewer users.",
      },
      {
        title: "Off in production",
        description:
          "The endpoints refuse to run when `NODE_ENV` is `production`. Development needs an explicit opt-in.",
      },
    ],
  },
  install: {
    title: "Set up in four steps",
    subtitle: "No client plugin, no props.",
    description:
      "One server plugin and one React component. The panel reads its templates and settings from the server.",
    agentPrompt: INSTALL_SNIPPETS.agentPrompt,
    steps: [
      {
        title: "Install the package",
        description:
          "Add it to the app that runs Better Auth. It also needs `better-auth`, `react`, and `react-dom`, which you most likely have already.",
        kind: "install",
      },
      {
        title: "Add the plugin to your auth config",
        description:
          "Add the plugin to your existing auth config. Keep its database, user fields, sessions, callbacks, routes, and other plugins. `enabled: true` opts in during development. Production stays off.",
        kind: "code",
        filename: "auth.ts (merge these lines)",
        language: "diff",
        code: INSTALL_SNIPPETS.authDiff,
      },
      {
        title: "Create the plugin table",
        description:
          "Use a CLI version matching your app's Better Auth version. With the built-in Kysely adapter, run `pnpm exec auth migrate`. With Prisma or Drizzle, run `pnpm exec auth generate`, then review and apply your ORM migration. Pass `--config` if your auth file is elsewhere.",
        kind: "code",
        filename: "Terminal",
        language: "bash",
        code: "pnpm exec auth migrate",
      },
      {
        title: "Mount the panel",
        description:
          "Render this client component once in your React tree, such as the root layout. It hides itself whenever DevTools is disabled on the server. Start the app and confirm a managed user switch in your normal Better Auth session.",
        kind: "code",
        filename: "devtools.tsx",
        language: "tsx",
        code: INSTALL_SNIPPETS.panel,
      },
    ],
    roles: {
      title: "Testing roles and permissions?",
      description:
        "Declare `role` on the Better Auth user model, then map each template to a role. Add `editableFields` if you want to change the role of the signed-in user from the panel. If the Better Auth admin plugin already adds `role`, skip `additionalFields`.",
      filename: "auth.ts",
      language: "ts",
      code: ROLES_CODE,
    },
  },
  security: {
    title: "Safe by default",
    description:
      "The plugin can create users and issue sessions, so it ships locked down like any privileged dev tool.",
    items: [
      "Disabled whenever `NODE_ENV` is `production`. No option turns it back on.",
      "Needs `enabled: true` or `DEV_AUTH_ENABLED=true` in development.",
      "Only switches to users the plugin created. Your real users cannot be impersonated.",
      "Write requests need a trusted origin and pass Better Auth's CSRF checks.",
      "Rate limited to 60 requests a minute, even when Better Auth's own limiter is off.",
      "Never sends the raw session token to the browser.",
    ],
  },
  faq: {
    title: "Questions and answers",
    items: [
      {
        question: "What is Better Auth DevTools?",
        answer:
          "Better Auth DevTools is an open-source npm package, `better-auth-devtools`, for apps that use Better Auth. It adds a server plugin and a React panel that let you create test users, switch between their sessions, and edit fields such as role during development.",
      },
      {
        question: "How do I install Better Auth DevTools?",
        answer:
          "Run `pnpm add better-auth-devtools`, add `devtools({ enabled: true })` to your existing Better Auth config, create the plugin table with a CLI version matching your app, and render `<BetterAuthDevtools />` once in your React app.",
      },
      {
        question: "Is it safe to ship the code to production?",
        answer:
          "Yes. The endpoints are always disabled when `NODE_ENV` is `production`, even if `enabled` is `true` or `DEV_AUTH_ENABLED` is set. The panel hides itself when the server reports that DevTools is off.",
      },
      {
        question: "Can I test different roles and permissions?",
        answer:
          "Yes. Define templates such as Admin, Editor, and Viewer that set a role on the user, then switch between them from the panel. Add `role` to `editableFields` to change it on the signed-in user without creating a new one.",
      },
      {
        question:
          "Does it work with Prisma, Drizzle, or other database adapters?",
        answer:
          "Yes. The plugin goes through Better Auth's own adapter. With the built-in Kysely adapter, run `pnpm exec auth migrate`. With Prisma, Drizzle, or another ORM, run `pnpm exec auth generate` and apply the migration with your usual tooling. Match the CLI version to your app's Better Auth version.",
      },
      {
        question: "Which frameworks does it support?",
        answer: `Any setup where Better Auth runs on the server and React ${MIN_REACT} or newer renders the page, such as Next.js, React Router, TanStack Start, or a Vite app. The panel calls the plugin endpoints under your Better Auth base path, which is \`/api/auth\` by default.`,
      },
      {
        question: "Do I need the Better Auth client plugin?",
        answer:
          "No. The panel calls the endpoints directly. The client plugin from `better-auth-devtools/plugin` is optional and only adds typed actions if your own code needs them.",
      },
      {
        question: "What are the requirements?",
        answer: `${REQUIREMENTS.betterAuth}, ${REQUIREMENTS.react}, and ${REQUIREMENTS.node}. The package is ESM-only.`,
      },
      {
        question: "Is this an official Better Auth project?",
        answer: `No. It is an unofficial, community-built tool released under the ${pluginPackage.license} license. It is not affiliated with the Better Auth team.`,
      },
    ],
  },
  callToAction: {
    title: "Stop signing out to test another role",
    description:
      "Install the package, add the plugin, and switch users from the corner of your app.",
  },
} as const
