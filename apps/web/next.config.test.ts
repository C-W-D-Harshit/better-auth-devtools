import { describe, expect, it } from "vitest"

import nextConfig from "./next.config.mjs"

describe("Next.js response headers", () => {
  it("varies the negotiated HTML page by Accept", async () => {
    const headers = nextConfig.headers
    expect(headers).toBeTypeOf("function")
    if (!headers) throw new Error("Expected Next.js headers configuration")

    const routes = await headers()

    expect(routes).toContainEqual({
      source: "/",
      headers: [
        {
          key: "Vary",
          value:
            "Accept, RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch",
        },
      ],
    })
  })
})
