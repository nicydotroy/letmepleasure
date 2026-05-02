import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, ChevronRight, ArrowRight, Building2, Zap } from 'lucide-react'
import { getCityBySlug } from '@/lib/cities'
import { CATEGORIES } from '@/lib/categories'
import { prisma } from '@/lib/prisma'
import AdListItem from '@/components/AdListItem'
import LocationContent from '@/components/LocationContent'
import type { Metadata } from 'next'

interface Props { params: { city: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCityBySlug(params.city)
  if (!city) return { title: 'City not found' }
  return {
    title: `Call Girls in ${city.name} | Escorts Service in ${city.name} | Verified & Safe | Listvoo`,
    description: `Call Girls in ${city.name} - Find verified escorts and companions. Discreet, safe escort services across all ${city.areas.length}+ areas. Real profiles, instant booking.`,
    keywords: `call girls in ${city.name}, escorts in ${city.name}, ${city.name} escorts, ${city.name} call girls, escort service in ${city.name}, verified escorts ${city.name}, independent escorts ${city.name}`,
    alternates: { canonical: `https://listvoo.com/call-girls/${params.city}` },
    openGraph: {
      title: `Call Girls in ${city.name} | Escorts Service | Verified & Safe`,
      description: `Find verified call girls and escorts in ${city.name}. Safe, discreet, professional escort services.`,
    },
  }
}

export default async function CityPage({ params }: Props) {
  const city = getCityBySlug(params.city)
  if (!city) notFound()

  const [ads, areaStats] = await Promise.all([
    prisma.ad.findMany({
      where: { citySlug: params.city, isActive: true, status: 'approved' },
      orderBy: { createdAt: 'desc' },
      take: 24,
    }),
    prisma.ad.groupBy({
      by: ['areaSlug', 'area'],
      where: { citySlug: params.city, isActive: true },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    }),
  ])

  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      {/* Hero banner */}
      <div className="bg-[#060B27] py-12 px-4 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-blue-400 mb-5">
            <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/call-girls" className="hover:text-blue-500 transition-colors">Cities</Link>
            <ChevronRight size={12} />
            <span className="text-white font-semibold">{city.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <p className="text-blue-300 text-sm mb-1.5 flex items-center gap-1.5">
                <MapPin size={13} className="text-blue-500" /> {city.state}
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
                Call Girls in <span className="text-blue-500">{city.name}</span> | Escorts Service
              </h1>
              <p className="text-blue-200 text-sm mb-4 max-w-2xl">
                Find verified and discreet escorts in {city.name}. Professional call girls, companions & escort services available across all areas.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="text-xs bg-white/10 text-blue-200 px-3 py-1 rounded-full border border-white/10">
                  {ads.length} active ads
                </span>
                <span className="text-xs bg-white/10 text-blue-200 px-3 py-1 rounded-full border border-white/10">
                  {city.areas.length} areas
                </span>
              </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Areas grid */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-[#060B27] flex items-center gap-2">
              <Building2 size={18} className="text-indigo-500" /> Browse by Area
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {city.areas.map((area) => {
              const stat = areaStats.find((s) => s.areaSlug === area.slug)
              return (
                <Link
                  key={area.slug}
                  href={`/call-girls/${params.city}/${area.slug}`}
                  className="group bg-white border border-transparent rounded-2xl p-4 text-center hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/60 hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center mx-auto mb-2.5 transition-colors">
                    <MapPin size={15} className="text-indigo-500" />
                  </div>
                  <div className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors leading-tight">
                    {area.name}
                  </div>
                  {stat ? (
                    <div className="text-xs text-blue-600 font-semibold mt-1">{stat._count.id} ads</div>
                  ) : (
                    <div className="text-xs text-slate-300 mt-1">Post first</div>
                  )}
                </Link>
              )
            })}
          </div>
        </section>

        {/* Categories grid */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-[#060B27] flex items-center gap-2">
              <Zap size={18} className="text-blue-600" /> Browse by Service
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/${params.city}/${category.slug}`}
                className={`group ${category.color} rounded-2xl p-6 text-center hover:shadow-lg hover:shadow-blue-100/60 hover:-translate-y-1 transition-all duration-200 border border-transparent hover:border-blue-200`}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <div className="text-sm font-bold group-hover:underline">
                  {category.name}
                </div>
                <div className="text-xs opacity-70 mt-1">in {city.name}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* All ads */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-[#060B27]">All Ads in {city.name}</h2>
          </div>

          {ads.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-indigo-200">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-black text-slate-700 mb-2">No ads in {city.name} yet</h3>
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
        </section>

        {/* Location Content Section */}
        <LocationContent cityName={city.name} />
      </div>
    </div>
  )
}
