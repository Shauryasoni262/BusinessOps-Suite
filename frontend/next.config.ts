import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  // Ensure proper port binding for Render
  env: {
    PORT: process.env.PORT || '3000',
  },
};

export default nextConfig;