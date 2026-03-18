import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["better-auth-devtools", "@better-auth-devtools/react"],
};

export default nextConfig;
