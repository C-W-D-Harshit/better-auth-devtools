import type { ChildProcessWithoutNullStreams } from "node:child_process"
import { spawn } from "node:child_process"
import { createServer } from "node:net"
import { resolve } from "node:path"
import { setTimeout as delay } from "node:timers/promises"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { SITE } from "../lib/site-content"

let nextServer: ChildProcessWithoutNullStreams | undefined
let origin = ""
let serverOutput = ""

function varyTokens(response: Response): string[] {
  return (response.headers.get("vary") ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
}

async function findAvailablePort(): Promise<number> {
  const server = createServer()

  return new Promise((resolvePort, reject) => {
    server.once("error", reject)
    server.listen(0, "127.0.0.1", () => {
      const address = server.address()
      if (!address || typeof address === "string") {
        server.close()
        reject(new Error("Could not allocate a test port"))
        return
      }

      server.close((error) => {
        if (error) reject(error)
        else resolvePort(address.port)
      })
    })
  })
}

async function waitForServer(): Promise<void> {
  const deadline = Date.now() + 45_000

  while (Date.now() < deadline) {
    if (nextServer?.exitCode !== null) {
      throw new Error(`Next.js exited before startup:\n${serverOutput}`)
    }

    try {
      const response = await fetch(origin)
      if (response.ok) return
    } catch {
      // The development server has not bound its port yet.
    }

    await delay(100)
  }

  throw new Error(`Timed out waiting for Next.js:\n${serverOutput}`)
}

async function buildProductionApplication(nextBin: string): Promise<void> {
  const build = spawn(process.execPath, [nextBin, "build"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: "1",
    },
    stdio: "pipe",
  })

  const collectBuildOutput = (chunk: Buffer) => {
    serverOutput = `${serverOutput}${chunk.toString()}`.slice(-20_000)
  }
  build.stdout.on("data", collectBuildOutput)
  build.stderr.on("data", collectBuildOutput)

  const exitCode = await new Promise<number | null>((resolveExit) => {
    build.once("exit", resolveExit)
  })

  if (exitCode !== 0) {
    throw new Error(`Next.js production build failed:\n${serverOutput}`)
  }
}

beforeAll(async () => {
  const port = await findAvailablePort()
  origin = `http://localhost:${port}`
  const nextBin = resolve(process.cwd(), "node_modules/next/dist/bin/next")

  await buildProductionApplication(nextBin)

  const spawnedServer = spawn(
    process.execPath,
    [nextBin, "start", "--port", String(port)],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: "pipe",
    }
  )
  nextServer = spawnedServer

  const collectOutput = (chunk: Buffer) => {
    serverOutput = `${serverOutput}${chunk.toString()}`.slice(-20_000)
  }
  spawnedServer.stdout.on("data", collectOutput)
  spawnedServer.stderr.on("data", collectOutput)

  await waitForServer()
}, 80_000)

afterAll(async () => {
  if (!nextServer || nextServer.exitCode !== null) return

  nextServer.kill("SIGTERM")
  await Promise.race([
    new Promise<void>((resolveExit) => {
      nextServer?.once("exit", () => resolveExit())
    }),
    delay(5_000).then(() => {
      nextServer?.kill("SIGKILL")
    }),
  ])
})

describe.sequential("Markdown representation over HTTP", () => {
  it("keeps browser requests as HTML with a Markdown alternate", async () => {
    const response = await fetch(origin, {
      headers: {
        accept: "text/html,application/xhtml+xml,*/*;q=0.8",
      },
    })
    const body = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toContain("text/html")
    expect(body).toContain("<!DOCTYPE html>")
    expect(body).toContain('type="text/markdown"')
    expect(body).toContain("/index.md")
  })

  it("negotiates clean Markdown with the required headers", async () => {
    const response = await fetch(origin, {
      headers: {
        accept: "text/markdown, text/plain;q=0.9, */*;q=0.8",
      },
    })
    const body = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8"
    )
    expect(varyTokens(response)).toContain("accept")
    expect(body).toContain("# Better Auth DevTools")
    expect(body).toContain(`Source: ${origin}/`)
    expect(body).not.toMatch(
      /<nav|<footer|<script|__next|webpack|cookie banner|react hydration/i
    )
  })

  it("serves the same Markdown from the .md URL with query parameters", async () => {
    const negotiated = await fetch(origin, {
      headers: { accept: "text/markdown" },
    })
    const direct = await fetch(`${origin}/index.md?utm_source=agent`)

    expect(direct.status).toBe(200)
    expect(direct.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8"
    )
    expect(await direct.text()).toBe(await negotiated.text())
  })

  it("does not mix cached HTML and Markdown representations", async () => {
    const markdownResponse = await fetch(origin, {
      headers: { accept: "text/markdown" },
    })
    const htmlResponse = await fetch(origin, {
      headers: { accept: "text/html" },
    })
    const markdownAgain = await fetch(origin, {
      headers: { accept: "text/markdown" },
    })

    expect(markdownResponse.headers.get("content-type")).toContain(
      "text/markdown"
    )
    expect(htmlResponse.headers.get("content-type")).toContain("text/html")
    expect(markdownAgain.headers.get("content-type")).toContain("text/markdown")
  })

  it("returns 404 for missing and unsupported dashboard Markdown pages", async () => {
    const responses = await Promise.all([
      fetch(`${origin}/missing-page.md`),
      fetch(`${origin}/dashboard.md`),
      fetch(`${origin}/missing-page`, {
        headers: { accept: "text/markdown" },
      }),
    ])

    expect(responses.map((response) => response.status)).toEqual([
      404, 404, 404,
    ])
    for (const response of responses) {
      expect(response.headers.get("content-type")).toContain("text/markdown")
    }
  })

  it("preserves existing discovery routes and exposes llms.txt", async () => {
    const [robots, sitemap, llms] = await Promise.all([
      fetch(`${origin}/robots.txt`),
      fetch(`${origin}/sitemap.xml`),
      fetch(`${origin}/llms.txt`),
    ])

    expect(robots.status).toBe(200)
    expect(sitemap.status).toBe(200)
    expect(llms.status).toBe(200)
    expect(llms.headers.get("content-type")).toContain("text/plain")
    expect(await llms.text()).toContain(SITE.url)
  })
})
