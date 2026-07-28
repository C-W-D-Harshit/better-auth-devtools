import { renderLlmsText } from "../../lib/markdown"

export function GET(): Response {
  return new Response(renderLlmsText(), {
    headers: {
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
