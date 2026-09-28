// Generated from README.md by pnpm docs:sync.
export const INSTALL_SNIPPETS = {
  "authDiff": " import { betterAuth } from \"better-auth\";\n+import { devtools } from \"better-auth-devtools\";\n\n export const auth = betterAuth({\n   // Keep your existing database, user fields, session options, callbacks, and routes.\n-  plugins: [/* existing plugins */],\n+  plugins: [/* existing plugins */, devtools({ enabled: true })],\n });",
  "panel": "\"use client\";\n\nimport { BetterAuthDevtools } from \"better-auth-devtools/react\";\n\nexport function Devtools() {\n  return <BetterAuthDevtools />;\n}",
  "layout": "import type { ReactNode } from \"react\";\nimport { Devtools } from \"./devtools\";\n\nexport default function RootLayout({ children }: { children: ReactNode }) {\n  return (\n    <html lang=\"en\">\n      <body>\n        {children}\n        <Devtools />\n      </body>\n    </html>\n  );\n}",
  "agentPrompt": "Install Better Auth DevTools in this app and verify a session switch. Follow https://www.better-auth-devtools.com/install-agent.md. Read the repo instructions and existing Better Auth setup first. Keep the current auth behavior, package manager, migration workflow, and auth base path. Mount the panel once. After switching to a test user, confirm the app's normal session sees that user. Report the files changed, checks run, and any unfinished steps."
} as const;
