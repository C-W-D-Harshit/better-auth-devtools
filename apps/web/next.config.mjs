import { fileURLToPath } from "node:url"

const monorepoRoot = fileURLToPath(new URL("../..", import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: monorepoRoot,
  turbopack: { root: monorepoRoot },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Vary",
            // Preserve App Router navigation variants alongside Markdown negotiation.
            value:
              "Accept, RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch",
          },
        ],
      },
    ]
  },
}

export default nextConfig
