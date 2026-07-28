import {
  buildAbsoluteUrl,
  markdownResponse,
  renderHomePageMarkdown,
} from "../../lib/markdown"

const MARKDOWN_CACHE_CONTROL =
  "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"

export function GET(request: Request): Response {
  const canonicalPath = request.headers.get("x-markdown-canonical-path")

  if (canonicalPath !== "/") {
    return markdownResponse(
      "# Not Found\n\nThe requested Markdown page does not exist.\n",
      {
        status: 404,
        headers: {
          "Cache-Control": "public, max-age=0, s-maxage=60",
        },
      }
    )
  }

  return markdownResponse(
    renderHomePageMarkdown(buildAbsoluteUrl(canonicalPath, request)),
    {
      headers: {
        "Cache-Control": MARKDOWN_CACHE_CONTROL,
      },
    }
  )
}
