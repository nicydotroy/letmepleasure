import Link from 'next/link'
import { MapPin, ChevronRight, ArrowRight, Building2 } from 'lucide-react'
import { getCategoryBySlug } from '@/lib/categories'
import { CITIES } from '@/lib/cities'
import { prisma } from '@/lib/prisma'
import AdCard from '@/components/AdCard'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props { params: { slug: string; city: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug)
  const city = CITIES.find((c) => c.slug === params.city)
  
  if (!category || !city) return { title: 'Not found' }
  
  const keywordMaps: Record<string, string> = {
    'female-escorts': 'Escorts',
    'call-girls': 'Call Girls',
    'female-massage': 'Female Massage Parlor',
    'male-escorts': 'Male Escorts',
    'male-massage': 'Male Massage',
  }
  
  const keyword = keywordMaps[params.slug] || category.name
  const title = `${keyword} in ${city.name} | Verified & Discreet | Listvoo`
  const description = `Find verified ${keyword.toLowerCase()} in ${city.name}. Browse trusted service providers with detailed profiles. 100% Safe & Confidential. Direct contact available.`

  return {
    title,
    description,
    keywords: [
      `${keyword.toLowerCase()} in ${city.name}`,
      `${city.name} ${keyword.toLowerCase()}`,
      `verified ${keyword.toLowerCase()} ${city.name}`,
      `best ${keyword.toLowerCase()} ${city.name}`,
      `${keyword.toLowerCase()} services ${city.name}`,
    ].join(', '),
    alternates: { canonical: `https://listvoo.com/category/${params.slug}/${params.city}` },
    openGraph: {
      title,
      description,
      url: `https://listvoo.com/category/${params.slug}/${params.city}`,
      type: 'website',
    },
  }
}

export async function generateStaticParams() {
  const params: { slug: string; city: string }[] = []
  const categories = ['female-escorts', 'call-girls', 'female-massage', 'male-escorts', 'male-massage']
  
  for (const city of CITIES) {
    for (const slug of categories) {
      params.push({ slug, city: city.slug })
    }
  }
  
  return params
}

export default async function CategoryCityPage({ params }: Props) {
  const category = getCategoryBySlug(params.slug)
  const city = CITIES.find((c) => c.slug === params.city)
  
  if (!category || !city) notFound()

  const [ads, totalCount] = await Promise.all([
    prisma.ad.findMany({
      where: {
        citySlug: params.city,
        category: category.slug,
        isActive: true,
        status: 'approved',
      },
      orderBy: { createdAt: 'desc' },
      take: 24,
    }),
    prisma.ad.count({
      where: {
        citySlug: params.city,
        category: category.slug,
        isActive: true,
        status: 'approved',
      },
    }),
  ])

  const keywordMaps: Record<string, string> = {
    'female-escorts': 'Escorts',
    'call-girls': 'Call Girls',
    'female-massage': 'Female Massage Parlor',
    'male-escorts': 'Male Escorts',
    'male-massage': 'Male Massage',
  }

  const keyword = keywordMaps[params.slug] || category.name

  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      {/* Hero banner */}
      <div className="bg-[#060B27] py-12 px-4 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-blue-400 mb-5 flex-wrap">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/category" className="hover:text-amber-400 transition-colors">Categories</Link>
            <ChevronRight size={12} />
            <Link href={`/category/${params.slug}`} className="hover:text-amber-400 transition-colors">{category.name}</Link>
            <ChevronRight size={12} />
            <span className="text-white font-semibold">{city.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <p className="text-blue-300 text-sm mb-1.5 flex items-center gap-1.5">
                <MapPin size={13} className="text-amber-400" /> {city.state}
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
                {keyword} in <span className="text-amber-400">{city.name}</span>
              </h1>
              <div className="flex flex-wrap gap-3">
                <span className="text-xs bg-white/10 text-blue-200 px-3 py-1 rounded-full border border-white/10">
                  {totalCount}+ {keyword.toLowerCase()}
                </span>
                <span className="text-xs bg-white/10 text-blue-200 px-3 py-1 rounded-full border border-white/10">
                  Verified & Safe
                </span>
              </div>
            </div>
            <Link
              href="/post-ad"
              className="shrink-0 flex items-center gap-2 bg-amber-400 text-[#060B27] px-5 py-3 rounded-xl font-black text-sm hover:bg-amber-300 transition-all shadow-lg"
            >
              + Post Free Ad
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Ads listing */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#060B27]">Verified {keyword}</h2>
              <p className="text-slate-500 text-sm mt-1">{totalCount} service providers available</p>
            </div>
          </div>

          {ads.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-indigo-100">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-black text-slate-700 mb-2">No listings yet</h3>
              <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">Be the first to post verified {keyword.toLowerCase()} in {city.name}!</p>
              <Link
                href="/post-ad"
                className="inline-flex items-center gap-2 bg-amber-400 text-[#060B27] px-6 py-3 rounded-xl font-black shadow-lg hover:bg-amber-300 transition-colors"
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

        {/* SEO Content */}
        <section className="bg-white rounded-3xl p-8 border border-indigo-50 shadow-sm">
          <h2 className="text-xl font-black text-[#060B27] mb-4">About {keyword} in {city.name}</h2>
          <div className="text-slate-600 text-sm leading-relaxed space-y-3">
            <p>
              Listvoo is the most trusted platform to find verified {keyword.toLowerCase()} in {city.name}. Our extensive directory features professional and experienced service providers across {city.name} who are verified and screened for your safety and discretion.
            </p>
            <p>
              Browse through detailed profiles of {keyword.toLowerCase()}, read reviews from verified clients, and connect directly with service providers. All communications are completely confidential and secure. Whether you're looking for {keyword.toLowerCase()} in the city center or residential areas of {city.name}, Listvoo makes it easy and safe.
            </p>
            <p>
              Post your service for free and reach thousands of potential clients in {city.name}. It takes just 60 seconds to create your profile and start receiving inquiries. No hidden charges, no registration hassles - just a simple, transparent platform for {keyword.toLowerCase()} services.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
