import { MetadataRoute } from 'next'
import { CITIES } from '@/lib/cities'
import { CATEGORIES } from '@/lib/categories'

const BASE_URL = 'https://listvoo.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/post-ad`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/location`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/?category=${cat.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const cityRoutes: MetadataRoute.Sitemap = CITIES.flatMap((city) => [
    {
      url: `${BASE_URL}/location/${city.slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    ...city.areas.map((area) => ({
      url: `${BASE_URL}/location/${city.slug}/${area.slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
  ])

  return [...staticRoutes, ...categoryRoutes, ...cityRoutes]
}
