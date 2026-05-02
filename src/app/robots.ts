import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default policy: allow everything except the API, admin panel, and
      // user-content staging areas. Listings, images and the sitemap are open.
      {
        userAgent: '*',
        allow: ['/', '/uploads/ads/originals/'],
        disallow: [
          '/api/',
          '/admin/',
          '/post-ad/preview',
          '/uploads/temp/',
          '/uploads/ads/temp/',
          '/*.json$',
          '/*?*sort=',
          '/*?*page=',
        ],
        crawlDelay: 1,
      },
      // Hand-curated AI crawlers — explicitly allowed so the brand surfaces
      // in ChatGPT, Perplexity, Claude, etc. (LLMs also read /llms.txt.)
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Perplexity-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-User', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      // Aggressive SEO-scraping bots that drive load without sending traffic.
      { userAgent: 'AhrefsBot', disallow: '/' },
      { userAgent: 'SemrushBot', disallow: '/' },
      { userAgent: 'DotBot', disallow: '/' },
      { userAgent: 'MJ12bot', disallow: '/' },
      { userAgent: 'BLEXBot', disallow: '/' },
      { userAgent: 'PetalBot', disallow: '/' },
      { userAgent: 'SeekportBot', disallow: '/' },
    ],
    sitemap: 'https://listvoo.com/sitemap.xml',
    host: 'https://listvoo.com',
  }
}
