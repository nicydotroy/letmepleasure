import { MetadataRoute } from 'next'
import { CITIES } from '@/lib/cities'
import { CATEGORIES } from '@/lib/categories'
import { prisma } from '@/lib/prisma'

const BASE_URL = 'https://letmepleasure.com'

// Sitemap is regenerated on each request but cached for an hour by Next.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // 1. Static, top-of-funnel pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/post-ad`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/call-girls`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ]

  // 2. /[city]/[category] — primary SEO pages ("escorts in mumbai", etc.)
  const cityCategoryRoutes: MetadataRoute.Sitemap = CITIES.flatMap((city) =>
    CATEGORIES.map((category) => ({
      url: `${BASE_URL}/${city.slug}/${category.slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))
  )

  // 3. /call-girls/[city] and /call-girls/[city]/[area]
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

  // 4. Individual approved ad detail pages, with their primary image attached
  let adRoutes: MetadataRoute.Sitemap = []
  try {
    const ads = await prisma.ad.findMany({
      where: { isActive: true, status: 'approved' },
      select: { id: true, updatedAt: true, createdAt: true, images: true },
      orderBy: { updatedAt: 'desc' },
      take: 45000, // sitemap.xml hard limit is 50k URLs
    })

    adRoutes = ads.map((ad) => {
      let firstImage: string | undefined
      try {
        const parsed: string[] = JSON.parse(ad.images || '[]')
        if (parsed.length > 0) firstImage = `${BASE_URL}${parsed[0]}`
      } catch {
        // ignore malformed image json
      }
      return {
        url: `${BASE_URL}/ads/${ad.id}`,
        lastModified: ad.updatedAt ?? ad.createdAt ?? now,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
        ...(firstImage ? { images: [firstImage] } : {}),
      }
    })
  } catch {
    // If DB is unreachable during build, fall back to the static routes only.
  }

  // 5. Published blog posts
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'published' },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: 'desc' },
      take: 1000,
    })
    blogRoutes = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt ?? post.publishedAt ?? now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch {
    // ignore if DB unreachable
  }

  return [...staticRoutes, ...cityCategoryRoutes, ...cityRoutes, ...adRoutes, ...blogRoutes]
}
