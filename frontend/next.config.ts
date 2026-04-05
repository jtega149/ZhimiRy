import type { NextConfig } from "next";

/**
 * Next.js 14 resolves `next.config.mjs` at runtime. Keep this file in sync with `next.config.mjs`
 * for TypeScript checking and the documented repo layout.
 */
const nextConfig: NextConfig = {
  transpilePackages: ["@zhimiry/shared"],
};

export default nextConfig;
