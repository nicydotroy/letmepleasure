/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'letmepleasure.com', 'www.letmepleasure.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'letmepleasure.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.letmepleasure.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
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
  // 301-redirect legacy /location/<city>[/area] URLs to the new /call-girls/
  // route so links Google still has indexed (and external backlinks) keep
  // their SEO weight instead of dropping to a soft-404 page.
  async redirects() {
    return [
      {
        source: '/location',
        destination: '/call-girls',
        permanent: true,
      },
      {
        source: '/location/:city',
        destination: '/call-girls/:city',
        permanent: true,
      },
      {
        source: '/location/:city/:area',
        destination: '/call-girls/:city/:area',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
