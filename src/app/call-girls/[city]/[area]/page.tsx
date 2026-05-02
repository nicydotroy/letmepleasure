import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { getCityBySlug, getAreaBySlug } from '@/lib/cities'
import { prisma } from '@/lib/prisma'
import AdListItem from '@/components/AdListItem'
import { CATEGORIES } from '@/lib/categories'
import type { Metadata } from 'next'

interface Props {
  params: { city: string; area: string }
  searchParams: { category?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCityBySlug(params.city)
  const area = getAreaBySlug(params.city, params.area)
  if (!city || !area) return { title: 'Area not found' }
  return {
    title: `Call Girls in ${area.name}, ${city.name} | Escorts Service | Verified & Safe`,
    description: `Find call girls and escorts in ${area.name}, ${city.name}. Verified profiles, professional companions, discreet services. Browse real profiles instantly.`,
    keywords: `call girls in ${area.name}, escorts in ${area.name}, ${city.name} call girls, ${area.name} escorts, companion services ${area.name}`,
    alternates: { canonical: `https://listvoo.com/call-girls/${params.city}/${params.area}` },
  }
}

export default async function AreaPage({ params, searchParams }: Props) {
  const city = getCityBySlug(params.city)
  const area = getAreaBySlug(params.city, params.area)
  if (!city || !area) notFound()

  const where: Record<string, unknown> = {
    citySlug: params.city,
    areaSlug: params.area,
    isActive: true,
  }
  if (searchParams.category) where.category = searchParams.category

  const [ads, total] = await Promise.all([
    prisma.ad.findMany({ where: { ...where, status: 'approved' }, orderBy: { createdAt: 'desc' }, take: 40 }),
    prisma.ad.count({ where: { citySlug: params.city, areaSlug: params.area, isActive: true } }),
  ])

  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      {/* Hero */}
      <div className="bg-[#060B27] py-12 px-4 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-blue-400 mb-5 flex-wrap">
            <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
            <ChevronRight size={11} />
            <Link href="/call-girls" className="hover:text-blue-500 transition-colors">Cities</Link>
            <ChevronRight size={11} />
            <Link href={`/call-girls/${params.city}`} className="hover:text-blue-500 transition-colors">{city.name}</Link>
            <ChevronRight size={11} />
            <span className="text-white font-semibold">{area.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <p className="text-blue-300 text-sm mb-1.5 flex items-center gap-1.5">
                <MapPin size={13} className="text-blue-500" /> {area.name}, {city.name} · {city.state}
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
                Call Girls in <span className="text-blue-500">{area.name}</span>, {city.name}
              </h1>
              <p className="text-blue-200 text-sm mb-4 max-w-2xl">
                Find verified escorts and call girls in {area.name}. Professional companion services, discreet meetings, verified profiles.
              </p>
              <span className="inline-flex items-center gap-2 text-xs bg-white/10 text-blue-200 px-3 py-1 rounded-full border border-white/10">
                {total} total ads
              </span>
            </div>
            <Link
              href="/post-ad"
              className="shrink-0 flex items-center gap-2 bg-blue-500 text-[#060B27] px-5 py-3 rounded-xl font-black text-sm hover:bg-blue-400 transition-all shadow-lg"
            >
              + Post Free Ad
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Category filters */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">
            <SlidersHorizontal size={13} /> Filter by Category
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/call-girls/${params.city}/${params.area}`}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${!searchParams.category ? 'bg-[#060B27] text-white shadow-lg' : 'bg-white border border-indigo-100 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`}
            >
              All Ads
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/call-girls/${params.city}/${params.area}?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${searchParams.category === cat.slug ? 'bg-blue-500 text-[#060B27] shadow-lg' : 'bg-white border border-indigo-100 text-slate-600 hover:border-blue-400 hover:text-blue-700'}`}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Ads */}
        {ads.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-indigo-200">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-black text-slate-700 mb-2">No ads in {area.name} yet</h3>
            <p className="text-slate-400 text-sm mb-8">Be the first to post here — it&apos;s 100% free!</p>
            <Link href="/post-ad" className="inline-flex items-center gap-2 bg-blue-500 text-[#060B27] px-6 py-3 rounded-xl font-black shadow-lg hover:bg-blue-400 transition-all">
              Post Free Ad
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {ads.map((ad) => <AdListItem key={ad.id} ad={ad} />)}
          </div>
        )}
      </div>
    </div>
  )
}


