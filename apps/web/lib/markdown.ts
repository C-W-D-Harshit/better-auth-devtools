import { HOME_PAGE, SITE } from "./site-content"

const MARKDOWN_MEDIA_TYPE = "text/markdown"

function splitHeaderValues(value: string): string[] {
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

    if (character === "," && !quoted) {
      values.push(value.slice(start, index))
      start = index + 1
    }
  }

  values.push(value.slice(start))
  return values
}

function qualityForMediaRange(value: string): number {
  const parts = value.split(";")
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

export function renderHomePageMarkdown(sourceUrl: string): string {
  const featureSections = HOME_PAGE.features.items
    .map((feature) => `### ${feature.title}\n\n${feature.description}`)
    .join("\n\n")

  return `# ${HOME_PAGE.title}

${HOME_PAGE.description}

Source: ${sourceUrl}

- Package: [better-auth-devtools](${SITE.npmUrl})
- Repository: [GitHub](${SITE.githubUrl})

## ${HOME_PAGE.headlineLines.join(" ")}

${HOME_PAGE.releaseLabel}.

## ${HOME_PAGE.features.title}

${HOME_PAGE.features.description}

${featureSections}

## ${HOME_PAGE.integration.title}

${HOME_PAGE.integration.description}

Install:

\`\`\`bash
${HOME_PAGE.installCommand}
\`\`\`

### 1. ${HOME_PAGE.integration.server.label}

\`\`\`ts
${HOME_PAGE.integration.server.code}
\`\`\`

### 2. ${HOME_PAGE.integration.client.label}

\`\`\`tsx
${HOME_PAGE.integration.client.code}
\`\`\`

${HOME_PAGE.integration.note.lead} ${HOME_PAGE.integration.note.safety} ${HOME_PAGE.integration.note.migrationPrefix} \`${HOME_PAGE.integration.note.migrationCommand}\` ${HOME_PAGE.integration.note.migrationSuffix}

## ${HOME_PAGE.callToAction.title}

${HOME_PAGE.callToAction.description}
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

## Important content

- [Website overview](${websiteMarkdownUrl}): Product features, installation, integration examples, and production safety.
- [Project documentation](${SITE.githubUrl}#readme): Full setup, security model, API options, and troubleshooting.
- [npm package](${SITE.npmUrl}): Published package and version information.

Pages support explicit content negotiation with \`Accept: text/markdown\`.
The website overview is also available directly at \`${websiteMarkdownUrl}\`.
`
}
