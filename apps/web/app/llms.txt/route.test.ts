import { describe, expect, it } from "vitest"

import { GET } from "./route"

describe("llms.txt route", () => {
  it("returns concise discovery content as plain text", async () => {
    const response = GET()
    const body = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toBe(
      "text/plain; charset=utf-8"
    )
    expect(body).toContain("# Better Auth DevTools")
    expect(body).toContain("/index.md")
    expect(body).toContain("Accept: text/markdown")
  })
})
