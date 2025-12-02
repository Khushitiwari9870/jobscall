/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'picsum.photos', 'i.pravatar.cc'],
    unoptimized: false,
  },
  // Disable API routes since we're using Django for the backend
  experimental: {
    // Enable the new React compiler if needed
    // reactCompiler: true,
  },
  // Server mode (Next.js will run with `next start`)
  transpilePackages: ['framer-motion'],
  webpack: (config, { isServer }) => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };

    // Important: return the modified config
    return config;
  },
  output: 'standalone',
  
  // SEO Configuration
  async headers() {
    return [
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
    ];
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/job-search',
        destination: '/jobs',
        permanent: true,
      },
    ];
  },
};

// Remove this if you're not using Turbopack
process.env.TURBOPACK = '0';

module.exports = nextConfig;
