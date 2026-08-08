import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories'
import { CITIES } from '@/lib/cities'
import AdCard from '@/components/AdCard'
import SearchBar from '@/components/SearchBar'
import { MapPin } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = { params: { slug: string } }

// Nationwide counterpart to /[city]/[category] — same category, no city filter.
// Exists so the homepage category chips can link to a real path instead of
// the old /?category= query string.
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug)
  if (!category) return { title: 'Category not found' }

  const url = `https://letmepleasure.com/category/${category.slug}`
  const title = `${category.name} in India | Verified Listings | Letme Pleasure`
  const description = `Browse verified ${category.name.toLowerCase()} across 38+ Indian metro cities. Real profiles, direct contact, no registration. Post free on Letme Pleasure.`

  return {
    title,
    description,
    keywords: [
      `${category.name.toLowerCase()} in India`,
      `${category.name.toLowerCase()} near me`,
      `verified ${category.name.toLowerCase()}`,
      `book ${category.name.toLowerCase()}`,
      `${category.name.toLowerCase()} classifieds`,
    ].join(', '),
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' },
  }
}

export default async function CategoryPage({ params }: Props) {
  const category = getCategoryBySlug(params.slug)
  if (!category) notFound()

  let ads: Awaited<ReturnType<typeof prisma.ad.findMany>> = []
  try {
    ads = await prisma.ad.findMany({
      where: { category: category.slug, isActive: true, status: 'approved' },
      orderBy: { createdAt: 'desc' },
      take: 48,
    })
  } catch {
    /* database unavailable — render the page with an empty list */
  }

  return (
    <div className="min-h-screen bg-[#FFF1F7]">
      {/* Hero */}
      <div className="hero-navy py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-pink-500/10 text-pink-400 border border-pink-500/20 px-4 py-1.5 rounded-full text-xs font-bold mb-5">
            <MapPin size={12} /> All India · 38 Metro Cities
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4">
            {category.icon} <span className="text-brand-gradient">{category.name}</span> in India
          </h1>
          <p className="text-pink-300 text-base max-w-xl mx-auto mb-8">
            Verified {category.name.toLowerCase()} listings across every major Indian city. Real profiles, direct contact, completely free.
          </p>
          <SearchBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Sibling categories */}
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                cat.slug === category.slug
                  ? 'bg-[#2A0618] text-white shadow-lg'
                  : 'bg-white border border-pink-100 text-slate-600 hover:border-pink-300 hover:text-pink-600'
              }`}
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>

        {/* Listings */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#2A0618]">Latest {category.name}</h2>
              <p className="text-slate-500 text-sm mt-1">{ads.length} ads found</p>
            </div>
            <Link
              href="/post-ad"
              className="flex items-center gap-2 bg-[#2A0618] hover:bg-[#4A0B2F] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              + Post Free Ad
            </Link>
          </div>

          {ads.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-pink-100">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-black text-slate-700 mb-2">No {category.name.toLowerCase()} listed yet</h3>
              <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">Be the first to post here. It&apos;s 100% free!</p>
              <Link
                href="/post-ad"
                className="inline-flex items-center gap-2 bg-pink-500 text-[#2A0618] px-6 py-3 rounded-xl font-black shadow-lg hover:bg-pink-400 transition-colors"
              >
                Post Free Ad
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {ads.map((ad) => <AdCard key={ad.id} ad={ad} />)}
            </div>
          )}
        </section>

        {/* City links — funnels to the stronger /[city]/[category] pages */}
        <section>
          <h2 className="text-xl font-black text-[#2A0618] mb-5 text-center">
            {category.name} by City
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}/${category.slug}`}
                className="text-sm bg-white border border-pink-100 text-slate-600 hover:border-pink-300 hover:text-pink-600 px-3.5 py-2 rounded-xl font-semibold transition-all"
              >
                {category.name} in {city.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
