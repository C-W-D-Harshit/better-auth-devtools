import { fileURLToPath } from "node:url"

const monorepoRoot = fileURLToPath(new URL("../..", import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: monorepoRoot,
  turbopack: { root: monorepoRoot },
}

export default nextConfig
