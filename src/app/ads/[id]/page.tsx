import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { getCategoryBySlug } from '@/lib/categories'
import AdCard from '@/components/AdCard'
import { BreadcrumbSchema, ServiceSchema } from '@/components/SchemaMarkupComponents'
import {
  MapPin, Phone, MessageCircle, Clock, ChevronRight,
  Tag, Share2, BadgeCheck, ArrowLeft,
} from 'lucide-react'
import type { Metadata } from 'next'

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ad = await prisma.ad.findUnique({ where: { id: params.id } })
  if (!ad) return { title: 'Ad not found' }
  
  const images: string[] = JSON.parse(ad.images || '[]')
  const ogImage = images.length > 0 ? `https://listvoo.com${images[0]}` : 'https://listvoo.com/og-image.png'
  const keywords = [
    ad.title,
    `${ad.area} ${ad.category}`,
    `${ad.city} ${ad.category}`,
    ad.area,
    ad.city,
  ]
  
  return {
    title: `${ad.title} in ${ad.area}, ${ad.city} | Listvoo`,
    description: ad.description.slice(0, 160),
    keywords,
    authors: [{ name: 'Listvoo User' }],
    creator: 'Listvoo',
    alternates: { canonical: `https://listvoo.com/ads/${params.id}` },
    openGraph: {
      title: ad.title,
      description: ad.description.slice(0, 160),
      type: 'article',
      url: `https://listvoo.com/ads/${params.id}`,
      images: images.map((img, i) => ({
        url: `https://listvoo.com${img}`,
        width: 1200,
        height: 900,
        alt: `${ad.title} - Photo ${i + 1}`,
        type: 'image/jpeg',
      })),
      publishedTime: new Date(ad.createdAt).toISOString(),
      modifiedTime: new Date(ad.updatedAt || ad.createdAt).toISOString(),
      section: 'Classifieds',
    },
    twitter: {
      card: 'summary_large_image',
      title: ad.title,
      description: ad.description.slice(0, 160),
      images: images.length > 0 ? [`https://listvoo.com${images[0]}`] : ['https://listvoo.com/og-image.png'],
    },
  }
}

function timeAgo(date: Date | string): string {
  const now = new Date()
  const then = new Date(date)
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  const days = Math.floor(diff / 86400)
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} days ago`
  return then.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdDetailPage({ params }: Props) {
  const ad = await prisma.ad.findUnique({ where: { id: params.id } })
  
  if (!ad || ad.status !== 'approved' || !ad.isActive) {
    notFound()
  }

  const images: string[] = JSON.parse(ad.images || '[]')
  const category = getCategoryBySlug(ad.category)

  const relatedAds = await prisma.ad.findMany({
    where: { citySlug: ad.citySlug, isActive: true, status: 'approved', NOT: { id: ad.id } },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })

  const adUrl = `https://listvoo.com/ads/${ad.id}`
  const heroImage = images[0] ? `https://listvoo.com${images[0]}` : undefined

  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://listvoo.com' },
          { name: ad.city, url: `https://listvoo.com/call-girls/${ad.citySlug}` },
          { name: ad.area, url: `https://listvoo.com/call-girls/${ad.citySlug}/${ad.areaSlug}` },
          { name: ad.title, url: adUrl },
        ]}
      />
      <ServiceSchema
        name={`${ad.title} — ${ad.area}, ${ad.city}`}
        description={ad.description}
        image={heroImage}
        city={ad.city}
        area={ad.area}
        url={adUrl}
        phone={ad.phone}
        publishedISO={new Date(ad.createdAt).toISOString()}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight size={11} />
          <Link href={`/call-girls/${ad.citySlug}`} className="hover:text-indigo-600 transition-colors">{ad.city}</Link>
          <ChevronRight size={11} />
          <Link href={`/call-girls/${ad.citySlug}/${ad.areaSlug}`} className="hover:text-indigo-600 transition-colors">{ad.area}</Link>
          <ChevronRight size={11} />
          <span className="text-slate-700 font-semibold truncate max-w-[160px]">{ad.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT — main content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Image gallery */}
            <div className="bg-white rounded-2xl shadow-sm border border-indigo-50 overflow-hidden">
              {images.length > 0 ? (
                <div className="p-3 space-y-2.5">
                  <div className="relative w-full h-72 sm:h-[420px] rounded-xl overflow-hidden bg-slate-100">
                    <Image src={images[0]} alt={ad.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 66vw" />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      {category && (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold backdrop-blur-sm shadow-sm ${category.color}`}>
                          {category.icon} {category.name}
                        </span>
                      )}
                    </div>
                  </div>
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {images.map((img, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 ring-2 ring-indigo-100 hover:ring-blue-500 transition-all">
                          <Image src={img} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="80px" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-52 bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center text-7xl">
                  {category?.icon || '📦'}
                </div>
              )}
            </div>

            {/* Ad Info card */}
            <div className="bg-white rounded-2xl shadow-sm border border-indigo-50 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                  <Clock size={11} /> Posted {timeAgo(ad.createdAt)}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full font-semibold">
                  <BadgeCheck size={11} /> Verified Ad
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#060B27] mb-4 leading-tight">{ad.title}</h1>

              {ad.price ? (
                <div className="text-3xl font-black text-blue-600 mb-5">
                  ₹{Number(ad.price).toLocaleString('en-IN')}
                </div>
              ) : (
                <div className="text-sm font-semibold text-slate-400 mb-5 uppercase tracking-wide">Price on Request</div>
              )}

              <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm px-4 py-2.5 rounded-xl mb-6 w-fit">
                <MapPin size={14} />
                <Link href={`/call-girls/${ad.citySlug}/${ad.areaSlug}`} className="font-semibold hover:underline">
                  {ad.area}, {ad.city}
                </Link>
              </div>

              {/* Description */}
              <div className="border-t border-indigo-50 pt-5">
                <h2 className="font-bold text-slate-700 mb-3 flex items-center gap-2 text-sm">
                  <Tag size={14} className="text-blue-500" /> Description
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{ad.description}</p>
              </div>
            </div>
          </div>

          {/* RIGHT — sticky contact */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-indigo-50 p-6 lg:sticky lg:top-24">
              <h3 className="font-black text-[#060B27] text-lg mb-5">Contact Now</h3>

              <a
                href={`tel:+91${ad.phone}`}
                className="flex items-center justify-center gap-2.5 w-full bg-[#060B27] text-white py-4 rounded-xl font-black text-sm hover:bg-[#0B1354] transition-all shadow-lg mb-3"
              >
                <Phone size={17} />
                Call: +91 {ad.phone.replace(/(\d{5})(\d{5})/, '$1 $2')}
              </a>

              {ad.whatsapp && (
                <a
                  href={`https://wa.me/91${ad.whatsapp}?text=${encodeURIComponent(`Hi, I saw your ad "${ad.title}" on ListNexa. Is it still available?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full bg-green-500 text-white py-4 rounded-xl font-black text-sm hover:bg-green-600 transition-all shadow-lg shadow-green-100 mb-3"
                >
                  <MessageCircle size={17} />
                  WhatsApp: +91 {ad.whatsapp.replace(/(\d{5})(\d{5})/, '$1 $2')}
                </a>
              )}

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-center mt-4">
                <p className="text-xs text-blue-800 leading-relaxed">⚠️ Never pay in advance. Meet in a safe place. ListNexa is not responsible for any transactions.</p>
              </div>
            </div>

            {/* Share */}
            <div className="bg-white rounded-2xl border border-indigo-50 shadow-sm p-5">
              <div className="flex items-center gap-2 text-slate-600 text-sm font-bold mb-3">
                <Share2 size={14} /> Share this Ad
              </div>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check this out: ${ad.title} - https://listnexa.in/ads/${ad.id}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center text-xs bg-green-100 text-green-700 py-2.5 rounded-xl font-bold hover:bg-green-200 transition-colors"
                >
                  📱 WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://listnexa.in/ads/${ad.id}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center text-xs bg-blue-100 text-blue-700 py-2.5 rounded-xl font-bold hover:bg-blue-200 transition-colors"
                >
                  📘 Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related ads */}
        {relatedAds.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-black text-[#060B27] mb-5">More Ads in {ad.city}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {relatedAds.map((rel) => <AdCard key={rel.id} ad={rel} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

