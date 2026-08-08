import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { getCityBySlug, getAreaBySlug } from '@/lib/cities'
import { prisma } from '@/lib/prisma'
import AdListItem from '@/components/AdListItem'
import CustomLocationContent from '@/components/CustomLocationContent'
import { getLocationContent } from '@/lib/location-content'
import { CATEGORIES } from '@/lib/categories'
import {
  BreadcrumbSchema,
  AggregateOfferSchema,
  ItemListSchema,
  CollectionPageSchema,
} from '@/components/SchemaMarkupComponents'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  params: { city: string; area: string }
  searchParams: { category?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCityBySlug(params.city)
  const area = getAreaBySlug(params.city, params.area)
  if (!city || !area) return { title: 'Area not found' }

  let adCount = 0
  try {
    adCount = await prisma.ad.count({
      where: { citySlug: params.city, areaSlug: params.area, isActive: true, status: 'approved' },
    })
  } catch { /* fall back to a static description */ }

  const adCountText = adCount > 0 ? `${adCount}+ verified` : 'verified'

  return {
    title: `Call Girls in ${area.name}, ${city.name} | ${adCount > 0 ? `${adCount}+ Verified ` : 'Verified '}Escorts in ${area.name}`,
    description: `${adCountText} call girls and escorts in ${area.name}, ${city.name}. Real photos, direct WhatsApp & phone, no registration. Listvoo lists ${area.name} ${city.name} escort services with hyper-local profiles updated daily.`,
    keywords: [
      `call girls in ${area.name}`,
      `escorts in ${area.name}`,
      `${city.name} call girls`,
      `${area.name} escorts`,
      `companion services ${area.name}`,
      `${area.name} ${city.name} escorts`,
      `escort service in ${area.name}`,
      `verified escorts ${area.name}`,
    ].join(', '),
    alternates: { canonical: `https://listvoo.com/call-girls/${params.city}/${params.area}` },
    openGraph: {
      title: `Call Girls in ${area.name}, ${city.name}${adCount > 0 ? ` · ${adCount}+ Verified Escorts` : ''}`,
      description: `Find verified call girls and escorts in ${area.name}, ${city.name}. Real photos, direct contact, no registration.`,
      url: `https://listvoo.com/call-girls/${params.city}/${params.area}`,
      type: 'website',
    },
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

  const [ads, total, customContent] = await Promise.all([
    prisma.ad.findMany({ where: { ...where, status: 'approved' }, orderBy: { createdAt: 'desc' }, take: 40 }),
    prisma.ad.count({ where: { citySlug: params.city, areaSlug: params.area, isActive: true } }),
    getLocationContent(params.city, params.area),
  ])

  const areaUrl = `https://listvoo.com/call-girls/${params.city}/${params.area}`

  return (
    <div className="min-h-screen bg-[#FFF1F7]">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://listvoo.com' },
          { name: 'Cities', url: 'https://listvoo.com/call-girls' },
          { name: city.name, url: `https://listvoo.com/call-girls/${params.city}` },
          { name: area.name, url: areaUrl },
        ]}
      />
      <CollectionPageSchema
        name={`Call Girls in ${area.name}, ${city.name}`}
        description={`Verified call girls and escorts in ${area.name}, ${city.name}.`}
        url={areaUrl}
        itemCount={total}
      />
      <AggregateOfferSchema
        itemCount={total}
        description={`${total} verified escort listings in ${area.name}, ${city.name} on Listvoo.`}
      />
      <ItemListSchema
        listName={`Call Girls in ${area.name}, ${city.name}`}
        items={ads.slice(0, 40).map((ad) => {
          let img: string | undefined
          try {
            const arr: string[] = JSON.parse(ad.images || '[]')
            if (arr[0]) img = `https://listvoo.com${arr[0]}`
          } catch {/* ignore */}
          return {
            name: ad.title,
            url: `https://listvoo.com/ads/${ad.id}`,
            image: img,
            description: ad.description.slice(0, 160),
          }
        })}
      />
      {/* Hero */}
      <div className="bg-[#2A0618] py-12 px-4 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-pink-400 mb-5 flex-wrap">
            <Link href="/" className="hover:text-pink-500 transition-colors">Home</Link>
            <ChevronRight size={11} />
            <Link href="/call-girls" className="hover:text-pink-500 transition-colors">Cities</Link>
            <ChevronRight size={11} />
            <Link href={`/call-girls/${params.city}`} className="hover:text-pink-500 transition-colors">{city.name}</Link>
            <ChevronRight size={11} />
            <span className="text-white font-semibold">{area.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <p className="text-pink-300 text-sm mb-1.5 flex items-center gap-1.5">
                <MapPin size={13} className="text-pink-500" /> {area.name}, {city.name} · {city.state}
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
                Call Girls in <span className="text-pink-500">{area.name}</span>, {city.name}
              </h1>
              <p className="text-pink-200 text-sm mb-4 max-w-2xl">
                Find verified escorts and call girls in {area.name}. Professional companion services, discreet meetings, verified profiles.
              </p>
              <span className="inline-flex items-center gap-2 text-xs bg-white/10 text-pink-200 px-3 py-1 rounded-full border border-white/10">
                {total} total ads
              </span>
            </div>
            <Link
              href="/post-ad"
              className="shrink-0 flex items-center gap-2 bg-pink-500 text-[#2A0618] px-5 py-3 rounded-xl font-black text-sm hover:bg-pink-400 transition-all shadow-lg"
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
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${!searchParams.category ? 'bg-[#2A0618] text-white shadow-lg' : 'bg-white border border-pink-100 text-slate-600 hover:border-pink-300 hover:text-pink-600'}`}
            >
              All Ads
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/call-girls/${params.city}/${params.area}?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${searchParams.category === cat.slug ? 'bg-pink-500 text-[#2A0618] shadow-lg' : 'bg-white border border-pink-100 text-slate-600 hover:border-pink-400 hover:text-pink-700'}`}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Ads */}
        {ads.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-pink-200">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-black text-slate-700 mb-2">No ads in {area.name} yet</h3>
            <p className="text-slate-400 text-sm mb-8">Be the first to post here — it&apos;s 100% free!</p>
            <Link href="/post-ad" className="inline-flex items-center gap-2 bg-pink-500 text-[#2A0618] px-6 py-3 rounded-xl font-black shadow-lg hover:bg-pink-400 transition-all">
              Post Free Ad
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {ads.map((ad) => <AdListItem key={ad.id} ad={ad} />)}
          </div>
        )}

        {/* Admin-edited content & FAQs for this area, if any */}
        {customContent?.hasAny && <CustomLocationContent content={customContent} />}
      </div>
    </div>
  )
}

