import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@better-auth-devtools/plugin",
    "@better-auth-devtools/react",
    "@better-auth-devtools/core",
    "@better-auth-devtools/shared",
  ],
};

export default nextConfig;
