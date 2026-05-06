import { createRequire } from 'node:module';
import type { NextConfig } from 'next';

const moduleRequire = createRequire(import.meta.url);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    turbo: {
      resolveAlias: {
        'motion/react': 'framer-motion',
      },
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'motion/react': moduleRequire.resolve('framer-motion'),
      motion: moduleRequire.resolve('framer-motion'),
    };
    return config;
  },
};

export default nextConfig;
