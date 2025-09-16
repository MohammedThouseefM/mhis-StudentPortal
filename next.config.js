/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Fix for Fast Refresh issues
  webpack: (config, { isServer }) => {
    // Optimize webpack configuration for better hot module replacement
    if (!isServer) {
      config.optimization.runtimeChunk = 'single';
    }
    return config;
  },
};

export default nextConfig;
