import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CITIES, getCityBySlug } from '@/lib/cities'
import AdCard from '@/components/AdCard'
import SearchBar from '@/components/SearchBar'
import { Search } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

// Path-based search so results never need a ?q= query string.
//   /search/full-body-massage           → query only
//   /search/full-body-massage/mumbai    → query scoped to a city
type Props = { params: { terms: string[] } }

// The query arrives slugified ("full-body-massage"); turn it back into
// something we can match against ad titles and descriptions.
function unslugify(slug: string): string {
  return decodeURIComponent(slug).replace(/-+/g, ' ').trim()
}

function parse(terms: string[]) {
  const query = unslugify(terms[0] || '')
  const city = terms[1] ? getCityBySlug(terms[1]) : undefined
  return { query, city, citySlug: terms[1] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { query, city } = parse(params.terms)
  if (!query) return { title: 'Search | Letme Pleasure' }

  const scope = city ? ` in ${city.name}` : ' in India'
  const title = `${query}${scope} | Letme Pleasure`
  const url = `https://letmepleasure.com/search/${params.terms.join('/')}`

  return {
    title,
    description: `Search results for "${query}"${scope}. Verified classified listings with real photos and direct contact on Letme Pleasure.`,
    alternates: { canonical: url },
    openGraph: { title, url, type: 'website' },
  }
}

export default async function SearchPage({ params }: Props) {
  const { query, city, citySlug } = parse(params.terms)

  // A second segment that isn't a real city is a bad URL, not an empty search.
  if (!query || (citySlug && !city)) notFound()

  const where: Record<string, unknown> = { isActive: true, status: 'approved' }
  if (city) where.citySlug = city.slug
  where.OR = [
    { title: { contains: query, mode: 'insensitive' } },
    { description: { contains: query, mode: 'insensitive' } },
  ]

  let ads: Awaited<ReturnType<typeof prisma.ad.findMany>> = []
  try {
    ads = await prisma.ad.findMany({ where, orderBy: { createdAt: 'desc' }, take: 48 })
  } catch {
    /* database unavailable — render the page with an empty list */
  }

  return (
    <div className="min-h-screen bg-[#FFF1F7]">
      <div className="hero-navy py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-pink-500/10 text-pink-400 border border-pink-500/20 px-4 py-1.5 rounded-full text-xs font-bold mb-5">
            <Search size={12} /> Search Results
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white mb-4">
            <span className="text-brand-gradient">{query}</span>
            {city ? ` in ${city.name}` : ''}
          </h1>
          <p className="text-pink-300 text-sm mb-8">
            {ads.length} {ads.length === 1 ? 'result' : 'results'} found
          </p>
          <SearchBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {ads.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-pink-100">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-black text-slate-700 mb-2">No results for &ldquo;{query}&rdquo;</h3>
            <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">
              Try a different term, or browse by city below.
            </p>
            <Link
              href="/call-girls"
              className="inline-flex items-center gap-2 bg-pink-500 text-[#2A0618] px-6 py-3 rounded-xl font-black shadow-lg hover:bg-pink-400 transition-colors"
            >
              Browse All Cities
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {ads.map((ad) => <AdCard key={ad.id} ad={ad} />)}
          </div>
        )}

        {/* Narrow the same search to a city, still without a query string */}
        {!city && (
          <section>
            <h2 className="text-lg font-black text-[#2A0618] mb-4 text-center">Narrow by City</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {CITIES.slice(0, 12).map((c) => (
                <Link
                  key={c.slug}
                  href={`/search/${params.terms[0]}/${c.slug}`}
                  className="text-sm bg-white border border-pink-100 text-slate-600 hover:border-pink-300 hover:text-pink-600 px-3.5 py-2 rounded-xl font-semibold transition-all"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
