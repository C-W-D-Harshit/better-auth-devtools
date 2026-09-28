import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (path) => readFileSync(join(root, path), "utf8");
const readme = read("README.md");
const agentGuide = read("AGENT_INSTALL.md");

function codeAfter(heading, language) {
  const section = readme.split(heading)[1];
  if (!section) throw new Error(`Missing README section: ${heading}`);
  const code = section.match(new RegExp("```" + language + "\\n([\\s\\S]*?)\\n```"))?.[1];
  if (!code) throw new Error(`Missing ${language} snippet after ${heading}`);
  return code;
}

const snippets = {
  authDiff: codeAfter("### 2. Extend the existing Better Auth instance", "diff"),
  panel: codeAfter("### 4. Mount the panel once", "tsx"),
  layout: readme.split("### 4. Mount the panel once")[1]?.match(/```tsx\n[\s\S]*?```[\s\S]*?```tsx\n([\s\S]*?)\n```/)?.[1],
  agentPrompt: codeAfter("## Install with your coding agent", "text"),
};
if (!snippets.layout) throw new Error("Missing Next.js layout snippet");
if (read("apps/demo-app/app/devtools.tsx").trim() !== snippets.panel.trim()) {
  throw new Error("The README panel snippet must match the typechecked demo component.");
}
const demoLayout = read("apps/demo-app/app/layout.tsx");
if (!demoLayout.includes('import { Devtools } from "./devtools";') || !demoLayout.includes("<Devtools />")) {
  throw new Error("The demo root layout must mount the README panel component.");
}

const outputs = new Map([
  ["packages/plugin/README.md", readme],
  ["packages/plugin/AGENT_INSTALL.md", agentGuide],
  ["apps/web/public/install-agent.md", agentGuide],
  ["apps/web/lib/install-snippets.ts", `// Generated from README.md by pnpm docs:sync.\nexport const INSTALL_SNIPPETS = ${JSON.stringify(snippets, null, 2)} as const;\n`],
]);

const mode = process.argv[2];
if (mode !== "--write" && mode !== "--check") throw new Error("Use --write or --check");

for (const [path, expected] of outputs) {
  if (mode === "--write") {
    writeFileSync(join(root, path), expected);
  } else if (read(path) !== expected) {
    throw new Error(`${path} is out of sync. Run pnpm docs:sync.`);
  }
}
console.log(mode === "--write" ? "Documentation copies updated." : "Documentation copies are in sync.");
