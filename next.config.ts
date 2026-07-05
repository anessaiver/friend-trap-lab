import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lint runs via `npm run lint`; builds stay deterministic.
  eslint: { ignoreDuringBuilds: true },
  poweredByHeader: false,
};

export default nextConfig;
