import { NextRequest } from "next/server"
import {
  getRewrittenUrl,
  isRewrite,
  unstable_doesMiddlewareMatch,
} from "next/experimental/testing/server"
import { describe, expect, it } from "vitest"

import { config, proxy } from "./proxy"

describe("Markdown proxy", () => {
  it("leaves normal page requests on the HTML route", () => {
    const response = proxy(
      new NextRequest("https://example.test/", {
        headers: {
          accept: "text/html,application/xhtml+xml,*/*;q=0.8",
        },
      })
    )

    expect(isRewrite(response)).toBe(false)
    expect(response.headers.get("vary")).toBe("Accept")
  })

  it("rewrites negotiated Markdown without losing the canonical path", () => {
    const response = proxy(
      new NextRequest("https://example.test/?campaign=docs", {
        headers: {
          accept: "text/markdown, text/plain;q=0.9, */*;q=0.8",
        },
      })
    )

    expect(isRewrite(response)).toBe(true)
    expect(getRewrittenUrl(response)).toBe(
      "https://example.test/agent-markdown?path=%2F"
    )
    expect(response.headers.get("vary")).toBe("Accept")
  })

  it("maps .md URLs and preserves missing paths for a proper 404", () => {
    const homeResponse = proxy(
      new NextRequest("https://example.test/index.md?campaign=docs")
    )
    const missingResponse = proxy(
      new NextRequest("https://example.test/missing.md")
    )

    expect(getRewrittenUrl(homeResponse)).toBe(
      "https://example.test/agent-markdown?path=%2F"
    )
    expect(getRewrittenUrl(missingResponse)).toBe(
      "https://example.test/agent-markdown?path=%2Fmissing"
    )
  })

  it("does not run for APIs, framework assets, or discovery files", () => {
    for (const path of [
      "/api/auth/session",
      "/_next/static/chunk.js",
      "/llms.txt",
      "/robots.txt",
      "/sitemap.xml",
    ]) {
      expect(
        unstable_doesMiddlewareMatch({
          config,
          nextConfig: {},
          url: `https://example.test${path}`,
        })
      ).toBe(false)
    }
  })
})
