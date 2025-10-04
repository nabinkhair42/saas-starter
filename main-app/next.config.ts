import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    ignoreDuringBuilds: true,
  },
  // Disable React strict mode for the upload-avatar component
  reactStrictMode: true,
};

export default nextConfig;
