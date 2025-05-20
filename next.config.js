/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Change from 'standalone' to default for Vercel deployment
  // output: 'standalone',
  
  // Remove trailing slashes for better compatibility with Vercel
  trailingSlash: false,
  
  // Explicitly define the source directory
  distDir: '.next',
  
  // Ensure images are properly optimized
  images: {
    domains: ['vercel.com'],
    unoptimized: false,
  },
};

module.exports = nextConfig;
