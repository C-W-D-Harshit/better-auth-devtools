import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { acceptsMarkdown, appendVary } from "./lib/markdown"

function canonicalPathForMarkdownRequest(request: NextRequest): string | null {
  const { pathname } = request.nextUrl

  if (pathname === "/index.md") return "/"
  if (pathname.endsWith(".md")) return pathname.slice(0, -3) || "/"
  if (acceptsMarkdown(request)) return pathname

  return null
}

export function proxy(request: NextRequest) {
  const canonicalPath = canonicalPathForMarkdownRequest(request)

  if (canonicalPath !== null) {
    const destination = request.nextUrl.clone()
    destination.pathname = "/agent-markdown"
    destination.search = ""
    destination.searchParams.set("path", canonicalPath)

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-markdown-canonical-path", canonicalPath)

    const response = NextResponse.rewrite(destination, {
      request: {
        headers: requestHeaders,
      },
    })
    appendVary(response.headers, "Accept")
    return response
  }

  const response = NextResponse.next()
  appendVary(response.headers, "Accept")
  return response
}

export const config = {
  matcher: [
    "/((?!api(?:/|$)|_next(?:/|$)|agent-markdown(?:/|$)|favicon\\.ico$|icon\\.svg$|og\\.png$|llms\\.txt$|robots\\.txt$|sitemap\\.xml$).*)",
  ],
}
