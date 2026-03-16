import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
      'motion/react': require.resolve('framer-motion'),
      'motion': require.resolve('framer-motion'),
    };
    return config;
  },
};

export default nextConfig;
