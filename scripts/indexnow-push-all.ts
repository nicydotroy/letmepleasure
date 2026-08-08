/**
 * One-shot script to push every public URL on Letme Pleasure to IndexNow.
 * Run after a big content change (e.g. seeding) or whenever Bing/Yandex
 * appear behind on indexing. Safe to run multiple times.
 */
import { CITIES } from '@/lib/cities'
import { CATEGORIES } from '@/lib/categories'
import { prisma } from '@/lib/prisma'
import { pingIndexNow } from '@/lib/indexnow'

const BASE = 'https://letmepleasure.com'

async function main() {
  const urls: string[] = [
    BASE,
    `${BASE}/call-girls`,
    `${BASE}/post-ad`,
  ]

  for (const city of CITIES) {
    urls.push(`${BASE}/call-girls/${city.slug}`)
    for (const area of city.areas) {
      urls.push(`${BASE}/call-girls/${city.slug}/${area.slug}`)
    }
    for (const cat of CATEGORIES) {
      urls.push(`${BASE}/${city.slug}/${cat.slug}`)
    }
  }

  const ads = await prisma.ad.findMany({
    where: { isActive: true, status: 'approved' },
    select: { id: true },
  })
  for (const ad of ads) urls.push(`${BASE}/ads/${ad.id}`)

  console.log(`Submitting ${urls.length} URLs to IndexNow…`)
  await pingIndexNow(urls)
  console.log('✅ Done. Bing/Yandex/Naver/Seznam/Yep should start crawling within minutes.')
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
