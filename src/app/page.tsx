import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import SearchBar from '@/components/SearchBar'
import CityGrid from '@/components/CityGrid'
import AdCard from '@/components/AdCard'
import { CATEGORIES } from '@/lib/categories'
import { ArrowRight, MapPin, Shield, Zap } from 'lucide-react'
import type { Metadata } from 'next'

interface SearchParams { q?: string; city?: string; category?: string }

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  if (searchParams.q) {
    return {
      title: `"${searchParams.q}" — Classified Ads India | Listvoo`,
      description: `Search results for "${searchParams.q}" on Listvoo.`,
    }
  }
  return {
    title: 'Listvoo — Free Classified Ads India | Post Ads in Your City',
    description: 'Post free classified ads in India. Find escorts, massage services, and more in Mumbai, Delhi, Bangalore & all major cities. 100% Free.',
    alternates: { canonical: 'https://listvoo.com' },
  }
}

async function getAds(sp: SearchParams) {
  const where: Record<string, unknown> = { isActive: true, status: 'approved' }
  if (sp.city) where.citySlug = sp.city
  if (sp.category) where.category = sp.category
  if (sp.q) where.OR = [{ title: { contains: sp.q } }, { description: { contains: sp.q } }]
  return prisma.ad.findMany({ where, orderBy: { createdAt: 'desc' }, take: 24 })
}

async function getStats() {
  const [totalAds, cityCount] = await Promise.all([
    prisma.ad.count({ where: { isActive: true, status: 'approved' } }),
    prisma.ad.groupBy({ by: ['citySlug'], where: { isActive: true } }).then((r) => r.length),
  ])
  return { totalAds, cityCount }
}

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const [ads, stats] = await Promise.all([getAds(searchParams), getStats()])
  const isFiltered = !!(searchParams.q || searchParams.city || searchParams.category)
  const activeCategory = CATEGORIES.find((c) => c.slug === searchParams.category)

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden hero-navy">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl float pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="text-center max-w-4xl mx-auto">

            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white/90 px-4 py-1.5 rounded-full text-xs font-bold mb-8 tracking-wide uppercase backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              India&apos;s #1 Free Adult Classifieds Platform
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] mb-6">
              Find &amp; Post
              <br />
              <span className="text-gold">Premium Services</span>
            </h1>

            <p className="text-blue-200 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Browse verified escorts, massage services &amp; more across all major Indian cities.
              <span className="text-amber-300 font-bold"> 100% Free · No Registration.</span>
            </p>

            {/* Search bar */}
            <SearchBar large />

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-14">
              {[
                { value: stats.totalAds > 0 ? stats.totalAds.toLocaleString('en-IN') : '500+', label: 'Active Listings' },
                { value: `${stats.cityCount || 12}`, label: 'Cities Covered' },
                { value: '100%', label: 'Free to Post' },
                { value: '24/7', label: 'Always Live' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-black text-amber-400">{s.value}</div>
                  <div className="text-xs text-blue-300 font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 50L360 30C720 10 1080 10 1440 30V50H0Z" fill="#EEF2FF"/>
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* ── CATEGORIES ── */}
        {!isFiltered && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-[#060B27]">Browse by Category</h2>
                <p className="text-slate-500 text-sm mt-1">Choose from our curated services</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/?category=${cat.slug}`}
                  className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border-2 border-transparent shadow-sm hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-3xl transition-colors">
                    {cat.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700 transition-colors text-center leading-tight">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── CITIES ── */}
        {!isFiltered && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-[#060B27]">Top Metro Cities</h2>
                <p className="text-slate-500 text-sm mt-1">Hyper-local listings near you</p>
              </div>
              <Link
                href="/location"
                className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors"
              >
                All Cities <ArrowRight size={14} />
              </Link>
            </div>
            <CityGrid />
          </section>
        )}

        {/* ── ADS LISTING ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#060B27]">
                {isFiltered
                  ? searchParams.q
                    ? `Results for "${searchParams.q}"`
                    : activeCategory
                    ? `${activeCategory.icon} ${activeCategory.name}`
                    : 'Filtered Ads'
                  : 'Latest Listings'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">{ads.length} ads found</p>
            </div>
            <Link
              href="/post-ad"
              className="flex items-center gap-2 bg-[#060B27] hover:bg-[#0B1354] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              + Post Free Ad
            </Link>
          </div>

          {ads.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-indigo-100">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-black text-slate-700 mb-2">No ads found</h3>
              <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">Be the first to post here. It&apos;s 100% free!</p>
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

        {/* ── WHY US ── */}
        {!isFiltered && (
          <section className="relative overflow-hidden rounded-3xl bg-[#060B27] p-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
            <div className="relative text-center mb-10">
              <h2 className="text-3xl font-black text-white mb-2">Why Choose <span className="text-gold">Listvoo</span>?</h2>
              <p className="text-blue-300">India&apos;s safest and most discreet platform</p>
            </div>
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { emoji: '⚡', title: 'Post in 60 Seconds', desc: 'Simple form, instant publish. No sign-up or email verification required.', color: 'bg-amber-400/20 text-amber-300' },
                { emoji: '📍', title: 'Hyper-Local Reach', desc: 'Target clients in your specific area across 120+ neighbourhoods in India.', color: 'bg-indigo-500/20 text-indigo-300' },
                { emoji: '🔒', title: '100% Discreet', desc: 'Your privacy is our priority. Direct WhatsApp contact, no platform middlemen.', color: 'bg-green-500/20 text-green-300' },
              ].map((f) => (
                <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors">
                  <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center text-2xl mb-4`}>
                    {f.emoji}
                  </div>
                  <h3 className="font-black text-white text-lg mb-2">{f.title}</h3>
                  <p className="text-blue-300 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── SEO BLOCK ── */}
        {!isFiltered && (
          <section className="bg-white rounded-3xl p-8 border border-indigo-50 shadow-sm">
            <h2 className="text-xl font-black text-[#060B27] mb-4">Free Classified Ads in India — Listvoo</h2>
            <div className="text-slate-500 text-sm leading-relaxed columns-1 md:columns-2 gap-8 space-y-3">
              <p>Listvoo is India's premier free adult classifieds platform. Find verified escorts, massage services, call girls, and more in Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune, and all major cities.</p>
              <p>Browse listings in <Link href="/location/mumbai" className="text-indigo-600 font-semibold hover:underline">Mumbai</Link>, <Link href="/location/delhi" className="text-indigo-600 font-semibold hover:underline">Delhi</Link>, <Link href="/location/bangalore" className="text-indigo-600 font-semibold hover:underline">Bangalore</Link>, <Link href="/location/hyderabad" className="text-indigo-600 font-semibold hover:underline">Hyderabad</Link>, <Link href="/location/chennai" className="text-indigo-600 font-semibold hover:underline">Chennai</Link>, and <Link href="/location" className="text-indigo-600 font-semibold hover:underline">12+ more cities</Link>. Post your ad free — no registration, no fees, live instantly.</p>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
