import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // TODO: Remove after fixing TypeScript errors
    ignoreBuildErrors: true,
  },

  // Image optimization with Vercel Blob storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  // Experimental optimizations
  experimental: {
    // Optimize large package imports for faster builds
    optimizePackageImports: [
      'recharts',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      'date-fns',
    ],
  },

  // Security: disable X-Powered-By header
  poweredByHeader: false,

  // React 19 strict mode
  reactStrictMode: true,

  // Enable response compression
  compress: true,
};

export default nextConfig;
