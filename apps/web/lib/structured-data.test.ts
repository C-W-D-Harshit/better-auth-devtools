import { describe, expect, it } from "vitest"

import { HOME_PAGE } from "./site-content"
import { buildStructuredData, serializeJsonLd } from "./structured-data"

function nodeOfType(type: string) {
  return buildStructuredData()["@graph"].find((node) =>
    [node["@type"]].flat().includes(type)
  )
}

describe("structured data", () => {
  it("describes the package, install steps, and FAQ", () => {
    expect(nodeOfType("SoftwareApplication")).toMatchObject({
      alternateName: "better-auth-devtools",
      isAccessibleForFree: true,
    })
    expect(nodeOfType("HowTo")?.step).toHaveLength(
      HOME_PAGE.install.steps.length
    )
    expect(nodeOfType("FAQPage")?.mainEntity).toHaveLength(
      HOME_PAGE.faq.items.length
    )
  })

  it("strips inline-code markers from answers", () => {
    const answers = JSON.stringify(nodeOfType("FAQPage")?.mainEntity)
    expect(answers).not.toContain("`")
  })

  it("escapes angle brackets so the script tag cannot be closed early", () => {
    expect(serializeJsonLd({ text: "</script><BetterAuthDevtools />" })).toBe(
      '{"text":"\\u003c/script>\\u003cBetterAuthDevtools />"}'
    )
  })
})
