/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'listvoo.com', 'www.listvoo.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'listvoo.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.listvoo.com',
        pathname: '/uploads/**',
      },
    ],
    // Image optimization settings for better performance
    minimumCacheTTL: 60 * 60 * 24 * 365, // Cache for 1 year
    formats: ['image/avif', 'image/webp'],
  },
  // Enable compression for better performance
  compress: true,
  // Generate ETags for caching
  generateEtags: true,
  // Production source maps
  productionBrowserSourceMaps: false,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
  // Redirect trailing slashes to maintain SEO
  trailingSlash: false,
  // Enable React strict mode for development
  reactStrictMode: true,
}

module.exports = nextConfig
