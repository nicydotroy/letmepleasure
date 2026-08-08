import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default policy: allow everything except the API and the admin panel.
      // No crawl-delay (Google ignores it; Bing/Yandex slow down with it set).
      // No /*?*sort= / /*?*page= rules — the site doesn't expose those today
      // and the patterns can backfire by blocking legitimate parameterised URLs.
      {
        userAgent: '*',
        allow: ['/', '/uploads/ads/originals/'],
        // /api & /admin are internal; /dashboard, /login, /signup are private
        // or auth-only utility pages with no search value.
        disallow: ['/api/', '/admin/', '/dashboard', '/login', '/signup'],
      },
      // Modern AI crawlers — explicitly allowed so the brand surfaces in
      // ChatGPT, Perplexity, Claude, Gemini, Apple Intelligence, Common Crawl.
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
    sitemap: 'https://letmepleasure.com/sitemap.xml',
  }
}
