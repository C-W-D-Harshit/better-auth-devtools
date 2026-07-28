import { describe, expect, it } from "vitest"

import { GET } from "./route"

describe("Markdown route", () => {
  it("returns the homepage Markdown with the request origin", async () => {
    const response = GET(
      new Request("http://localhost:4321/agent-markdown?path=%2F", {
        headers: {
          "x-markdown-canonical-path": "/",
        },
      })
    )

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8"
    )
    expect(response.headers.get("vary")).toBe("Accept")
    expect(await response.text()).toContain("Source: http://localhost:4321/")
  })

  it("returns a Markdown 404 for any page not explicitly supported", async () => {
    const response = GET(
      new Request("http://localhost:4321/agent-markdown?path=%2Fdashboard", {
        headers: {
          "x-markdown-canonical-path": "/dashboard",
        },
      })
    )

    expect(response.status).toBe(404)
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8"
    )
    expect(await response.text()).toContain("# Not Found")
  })
})
