import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'tiles.openfreemap.org', pathname: '/**' },
      { protocol: 'https', hostname: '*.openstreetmap.org', pathname: '/**' },
    ],
  },
  webpack: (config) => {
    // Fix pour MapLibre GL + Next.js
    config.resolve.alias = {
      ...config.resolve.alias,
      'maplibre-gl$': 'maplibre-gl/dist/maplibre-gl.js',
    };
    return config;
  },
};

export default nextConfig;