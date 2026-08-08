import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CITIES } from '@/lib/cities'
import { CATEGORIES } from '@/lib/categories'
import AdCard from '@/components/AdCard'
import CustomLocationContent from '@/components/CustomLocationContent'
import { getPageContent } from '@/lib/page-content'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = {
  params: {
    city: string
    category: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = CITIES.find((c) => c.slug === params.city)
  const category = CATEGORIES.find((c) => c.slug === params.category)

  if (!city || !category) return notFound() as any

  const keywordMaps: Record<string, string> = {
    'female-escorts': 'Escorts',
    'call-girls': 'Call Girls',
    'female-massage': 'Female Massage Parlor',
    'male-escorts': 'Male Escorts',
    'male-massage': 'Male Massage',
  }

  const displayKeyword = keywordMaps[category.slug] || category.name
  const keywords = [
    `${displayKeyword.toLowerCase()} in ${city.name}`,
    `${city.name} ${displayKeyword.toLowerCase()}`,
    `${displayKeyword} services ${city.name}`,
    `book ${displayKeyword.toLowerCase()} ${city.name}`,
    `${displayKeyword} ${city.name} independent`,
    `verified ${displayKeyword.toLowerCase()} ${city.name}`,
    `discreet ${displayKeyword.toLowerCase()} ${city.name}`,
    `safe ${displayKeyword.toLowerCase()} ${city.name}`,
  ]

  return {
    title: `${displayKeyword} in ${city.name} | Verified & Discreet | Letme Pleasure`,
    description: `Browse verified ${displayKeyword.toLowerCase()} in ${city.name}. Safe, discreet, and authentic listings. 100% verified profiles. Post or browse free on Letme Pleasure.`,
    keywords,
    alternates: {
      canonical: `https://letmepleasure.com/${city.slug}/${category.slug}`,
    },
    openGraph: {
      title: `${displayKeyword} in ${city.name} | Letme Pleasure`,
      description: `Find verified ${displayKeyword.toLowerCase()} in ${city.name}. Browse, verify, and book safely on Letme Pleasure - India's trusted classifieds platform.`,
      type: 'website',
      url: `https://letmepleasure.com/${city.slug}/${category.slug}`,
      images: [
        {
          url: 'https://letmepleasure.com/og-image.png',
          width: 1200,
          height: 630,
          alt: `${displayKeyword} in ${city.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayKeyword} in ${city.name} | Letme Pleasure`,
      description: `Browse verified ${displayKeyword.toLowerCase()} in ${city.name}. Safe and discreet listings.`,
    },
  }
}

export default async function CityCategory({ params }: Props) {
  const city = CITIES.find((c) => c.slug === params.city)
  const category = CATEGORIES.find((c) => c.slug === params.category)

  if (!city || !category) {
    notFound()
  }

  // Fetch ads server-side
  let ads: any[] = []
  try {
    ads = await prisma.ad.findMany({
      where: {
        citySlug: city.slug,
        category: category.slug,
        isActive: true,
        status: 'approved',
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('Error fetching ads:', error)
    ads = []
  }

  const keywordMaps: Record<string, string> = {
    'female-escorts': 'Escorts',
    'call-girls': 'Call Girls',
    'female-massage': 'Female Massage Parlor',
    'male-escorts': 'Male Escorts',
    'male-massage': 'Male Massage',
  }

  const displayKeyword = keywordMaps[category.slug] || category.name

  const customContent = await getPageContent(`/${city.slug}/${category.slug}`)

  return (
    <main className="min-h-screen bg-[#2A0618]">
      {/* Breadcrumb */}
      <div className="bg-[#4A0B2F] border-b border-white/10 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-pink-300">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href={`/${city.slug}`} className="hover:text-white transition-colors">
              {city.name}
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">{displayKeyword}</span>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-b from-[#4A0B2F] to-[#2A0618] pt-8 pb-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">
                {displayKeyword} in {city.name}
              </h1>
              <p className="text-pink-200 text-lg">
                Verified & Discreet • Updated Daily • Safe Listings
              </p>
            </div>
          </div>

          {/* Stats badges */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-sm border border-pink-500/30 rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="text-pink-500 font-bold">{ads.length}+</span>
              <span className="text-pink-200 text-sm">{displayKeyword}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-green-400/30 rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="text-green-400 font-bold">✓</span>
              <span className="text-pink-200 text-sm">Verified & Safe</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-pink-400/30 rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="text-pink-400 font-bold">24/7</span>
              <span className="text-pink-200 text-sm">Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {ads.length > 0 ? (
          <div>
            <p className="text-pink-200 mb-8 text-center">
              Found {ads.length} verified {displayKeyword.toLowerCase()} listings in {city.name}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-pink-300 text-lg mb-4">
              No listings found for {displayKeyword.toLowerCase()} in {city.name}
            </p>
            <Link
              href="/post-ad"
              className="inline-block bg-pink-500 hover:bg-pink-400 text-[#2A0618] px-8 py-3 rounded-xl font-bold transition-all"
            >
              Be the First to Post
            </Link>
          </div>
        )}
      </div>

      {/* SEO Content Section */}
      <div className="bg-[#4A0B2F] border-t border-white/10 mt-12 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            Why Choose {displayKeyword} on Letme Pleasure in {city.name}?
          </h2>
          <div className="space-y-3 text-pink-200 leading-relaxed">
            <p>
              Letme Pleasure provides the most trusted platform to find verified {displayKeyword.toLowerCase()} in {city.name}.
              Every listing is carefully reviewed to ensure your safety and privacy.
            </p>
            <p>
              ✓ <span className="font-semibold">100% Verified Listings</span> - All profiles are authenticated
            </p>
            <p>
              ✓ <span className="font-semibold">Complete Discretion</span> - Your privacy is our priority
            </p>
            <p>
              ✓ <span className="font-semibold">24/7 Availability</span> - Browse anytime, anywhere
            </p>
            <p>
              ✓ <span className="font-semibold">Easy to Post</span> - List your services in 60 seconds
            </p>
            <p className="pt-4">
              Looking to expand your reach? Post your {displayKeyword.toLowerCase()} service on Letme Pleasure completely FREE.
              Reach thousands of customers in {city.name} and across India.
            </p>
          </div>
          <Link
            href="/post-ad"
            className="inline-block mt-6 bg-pink-500 hover:bg-pink-400 text-[#2A0618] px-8 py-3 rounded-xl font-bold transition-all"
          >
            Post Free Listing Now
          </Link>
        </div>

        {/* Admin-edited content & FAQs for this page, if any */}
        {customContent?.hasAny && (
          <div className="mt-10">
            <CustomLocationContent content={customContent} />
          </div>
        )}
      </div>
    </main>
  )
}
