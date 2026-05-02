import { MetadataRoute } from 'next'
import { CITIES } from '@/lib/cities'
import { CATEGORIES } from '@/lib/categories'

const BASE_URL = 'https://listvoo.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/post-ad`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/call-girls`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ]

  // City + Category combination routes for SEO ranking (city-first URL structure)
  // These are the main pages for targeting keywords like "Escorts in Mumbai", "Call Girls in Delhi"
  const cityCategoryRoutes: MetadataRoute.Sitemap = CITIES.flatMap((city) =>
    CATEGORIES.map((category) => ({
      url: `${BASE_URL}/${city.slug}/${category.slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))
  )

  const cityRoutes: MetadataRoute.Sitemap = CITIES.flatMap((city) => [
    {
      url: `${BASE_URL}/call-girls/${city.slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    ...city.areas.map((area) => ({
      url: `${BASE_URL}/call-girls/${city.slug}/${area.slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
  ])

  return [...staticRoutes, ...cityCategoryRoutes, ...cityRoutes]
}
