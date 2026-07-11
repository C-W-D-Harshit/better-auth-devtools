import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const monorepoRoot = fileURLToPath(new URL("../..", import.meta.url));

const nextConfig: NextConfig = {
  transpilePackages: ["better-auth-devtools"],
  outputFileTracingRoot: monorepoRoot,
};

export default nextConfig;
