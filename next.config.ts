import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The e2e suite loads the dev server through 127.0.0.1; Next blocks
  // cross-origin dev resources (HMR, chunks) unless the host is allowed.
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    // A parent folder has its own lockfile; pin the workspace root here.
    root: process.cwd(),
  },
};

export default nextConfig;
