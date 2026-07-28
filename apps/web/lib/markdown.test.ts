import { describe, expect, it } from "vitest"

import {
  acceptsMarkdown,
  buildAbsoluteUrl,
  markdownResponse,
  renderHomePageMarkdown,
  renderLlmsText,
} from "./markdown"

describe("acceptsMarkdown", () => {
  it.each([
    "text/markdown",
    "text/markdown, text/plain;q=0.9, */*;q=0.8",
    "TEXT/MARKDOWN; charset=utf-8; q=0.5",
    'text/markdown; profile="agent,compact"; q=0.7',
    'text/markdown; profile="agent;q=0"',
  ])("accepts an explicit positive Markdown range: %s", (accept) => {
    expect(
      acceptsMarkdown(
        new Request("https://example.test/about", {
          headers: { accept },
        })
      )
    ).toBe(true)
  })

  it.each([
    undefined,
    "*/*",
    "text/html,application/xhtml+xml,*/*;q=0.8",
    "text/markdown;q=0",
    "text/markdown;q=2",
    "text/plain",
  ])("keeps HTML for non-explicit or rejected ranges: %s", (accept) => {
    const headers = accept ? { accept } : undefined
    expect(
      acceptsMarkdown(new Request("https://example.test/about", { headers }))
    ).toBe(false)
  })
})

describe("Markdown responses", () => {
  it("sets the Markdown content type while preserving existing Vary values", () => {
    const response = markdownResponse("# Hello", {
      headers: { Vary: "Cookie" },
    })

    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8"
    )
    expect(response.headers.get("vary")).toBe("Cookie, Accept")
  })

  it("builds absolute URLs from the request origin", () => {
    expect(
      buildAbsoluteUrl(
        "/guide",
        new Request("http://localhost:3000/internal?path=/")
      )
    ).toBe("http://localhost:3000/guide")
  })
})

describe("Markdown serializers", () => {
  it("renders meaningful shared page data without HTML layout noise", () => {
    const markdown = renderHomePageMarkdown(
      "https://www.better-auth-devtools.com/"
    )

    expect(markdown).toContain("# Better Auth DevTools")
    expect(markdown).toContain("## Everything you need to test auth")
    expect(markdown).toContain("```ts")
    expect(markdown).toContain("Source: https://www.better-auth-devtools.com/")
    expect(markdown).not.toMatch(
      /<nav|<footer|<script|__next|webpack|cookie banner/i
    )
  })

  it("advertises the canonical Markdown URL in llms.txt", () => {
    const llmsText = renderLlmsText()

    expect(llmsText).toContain("https://www.better-auth-devtools.com/index.md")
    expect(llmsText).toContain("Accept: text/markdown")
  })
})
