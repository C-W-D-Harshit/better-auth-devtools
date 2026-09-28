import { HOME_PAGE, REQUIREMENTS, SITE } from "./site-content"

const MARKDOWN_MEDIA_TYPE = "text/markdown"

function splitHeaderValues(value: string, delimiter = ","): string[] {
  const values: string[] = []
  let start = 0
  let quoted = false
  let escaped = false

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index]

    if (escaped) {
      escaped = false
      continue
    }

    if (quoted && character === "\\") {
      escaped = true
      continue
    }

    if (character === '"') {
      quoted = !quoted
      continue
    }

    if (character === delimiter && !quoted) {
      values.push(value.slice(start, index))
      start = index + 1
    }
  }

  values.push(value.slice(start))
  return values
}

function qualityForMediaRange(value: string): number {
  const parts = splitHeaderValues(value, ";")
  let quality = 1

  for (const parameter of parts.slice(1)) {
    const separator = parameter.indexOf("=")
    if (separator === -1) continue

    const name = parameter.slice(0, separator).trim().toLowerCase()
    if (name !== "q") continue

    const rawQuality = parameter
      .slice(separator + 1)
      .trim()
      .replace(/^"|"$/g, "")
    const parsedQuality = Number(rawQuality)

    if (
      !Number.isFinite(parsedQuality) ||
      parsedQuality < 0 ||
      parsedQuality > 1
    ) {
      return 0
    }

    quality = parsedQuality
  }

  return quality
}

export function acceptsMarkdown(request: Request): boolean {
  const accept = request.headers.get("accept")
  if (!accept) return false

  return splitHeaderValues(accept).some((value) => {
    const mediaType = value.split(";", 1)[0]?.trim().toLowerCase()
    return mediaType === MARKDOWN_MEDIA_TYPE && qualityForMediaRange(value) > 0
  })
}

export function appendVary(headers: Headers, value: string): void {
  const existingValues = (headers.get("vary") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)

  if (
    !existingValues.some(
      (existingValue) => existingValue.toLowerCase() === value.toLowerCase()
    )
  ) {
    existingValues.push(value)
  }

  headers.set("Vary", existingValues.join(", "))
}

export function markdownResponse(
  markdown: string,
  init: ResponseInit = {}
): Response {
  const headers = new Headers(init.headers)
  headers.set("Content-Type", "text/markdown; charset=utf-8")
  appendVary(headers, "Accept")

  return new Response(markdown, {
    ...init,
    headers,
  })
}

export function buildAbsoluteUrl(path: string, request: Request): string {
  return new URL(path, request.url).toString()
}

function fence(language: string, code: string): string {
  return `\`\`\`${language}\n${code}\n\`\`\``
}

export function renderHomePageMarkdown(sourceUrl: string): string {
  const { install } = HOME_PAGE

  const facts = HOME_PAGE.facts
    .map((fact) => `- ${fact.label}: ${fact.value}`)
    .join("\n")

  const features = HOME_PAGE.features.items
    .map((feature) => `### ${feature.title}\n\n${feature.description}`)
    .join("\n\n")

  const steps = install.steps
    .map((step, index) => {
      const snippet =
        step.kind === "install"
          ? HOME_PAGE.installCommands
              .map((item) => `- ${item.manager}: \`${item.command}\``)
              .join("\n")
          : fence(step.language, step.code)
      return `### ${index + 1}. ${step.title}\n\n${step.description}\n\n${snippet}`
    })
    .join("\n\n")

  const security = HOME_PAGE.security.items
    .map((item) => `- ${item}`)
    .join("\n")

  const faq = HOME_PAGE.faq.items
    .map((item) => `### ${item.question}\n\n${item.answer}`)
    .join("\n\n")

  return `# ${HOME_PAGE.title}

> ${HOME_PAGE.headline}.

${HOME_PAGE.summary}

${SITE.description}

Source: ${sourceUrl}

- Package: [${SITE.packageName}](${SITE.npmUrl}) (v${SITE.version})
- Repository: [GitHub](${SITE.githubUrl})
- Documentation: [README](${SITE.docsUrl})
- Agent installation guide: [Install with a coding agent](${SITE.agentGuideUrl})

${facts}

## ${HOME_PAGE.features.title}

${HOME_PAGE.features.description}

${features}

## ${install.title}

${install.subtitle} ${install.description}

${steps}

### ${install.roles.title}

${install.roles.description}

${fence(install.roles.language, install.roles.code)}

## Install with a coding agent

Guide: ${SITE.agentGuideUrl}

${fence("text", install.agentPrompt)}

## ${HOME_PAGE.security.title}

${HOME_PAGE.security.description}

${security}

## ${HOME_PAGE.faq.title}

${faq}

## Requirements

${Object.values(REQUIREMENTS)
  .map((item) => `- ${item}`)
  .join("\n")}
`
}

export function renderLlmsText(): string {
  const websiteMarkdownUrl = new URL(
    HOME_PAGE.markdownPath,
    SITE.url
  ).toString()

  return `# ${SITE.name}

> ${SITE.description}

Canonical website: ${SITE.url}

## Quick start

1. Install: \`${HOME_PAGE.installCommand}\`
2. Add \`devtools({ enabled: true })\` from \`better-auth-devtools\` to the \`plugins\` array of \`betterAuth()\`.
3. Create the plugin table with a CLI version matching your app's Better Auth version: \`pnpm exec auth migrate\` (or \`pnpm exec auth generate\` for Prisma and Drizzle, followed by your ORM migration).
4. Render \`<BetterAuthDevtools />\` from \`better-auth-devtools/react\` in a client component.

Keep the existing auth config and verify a managed user switch in the app's normal Better Auth session. Agent setup guide: ${SITE.agentGuideUrl}.

The endpoints are always disabled when \`NODE_ENV=production\`.

## Important content

- [Website overview](${websiteMarkdownUrl}): What the package does, the four setup steps, role testing, security model, and FAQ.
- [Project documentation](${SITE.githubUrl}#readme): Full setup, security model, API options, and troubleshooting.
- [Agent installation guide](${SITE.agentGuideUrl}): Setup and session verification in an existing app.
- [npm package](${SITE.npmUrl}): Published package and version information.

Pages support explicit content negotiation with \`Accept: text/markdown\`.
The website overview is also available directly at \`${websiteMarkdownUrl}\`.
`
}
