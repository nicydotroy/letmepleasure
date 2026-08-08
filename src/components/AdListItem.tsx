import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Phone, MessageCircle, BadgeCheck, ChevronRight } from 'lucide-react'
import { getCategoryBySlug } from '@/lib/categories'
import { formatPrice } from '@/lib/price'

interface Ad {
  id: string
  title: string
  description: string
  category: string
  price: string | null
  city: string
  area: string
  phone: string
  whatsapp: string | null
  images: string
  createdAt: Date | string
}

function timeAgo(date: Date | string): string {
  const now = new Date()
  const then = new Date(date)
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function AdListItem({ ad }: { ad: Ad }) {
  const images: string[] = (() => {
    try { return JSON.parse(ad.images || '[]') } catch { return [] }
  })()
  const mainImage = images[0] || null
  const thumbnails = images.slice(1, 4)
  const category = getCategoryBySlug(ad.category)

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all duration-200 border border-indigo-50">
      <div className="flex flex-col md:flex-row">

        {/* LEFT: Main image */}
        <Link
          href={`/ads/${ad.id}`}
          className="relative shrink-0 w-full md:w-64 lg:w-72 h-64 md:h-auto md:min-h-[260px] bg-gradient-to-br from-indigo-50 to-blue-100 overflow-hidden"
        >
          {mainImage ? (
            <Image
              src={mainImage}
              alt={ad.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 288px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl opacity-30">
              {category?.icon || '📦'}
            </div>
          )}
          {/* Category + verified badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            {category && (
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-bold bg-blue-500 text-[#060B27] shadow">
                {category.icon} {category.name}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full font-bold bg-green-500/95 text-white shadow">
              <BadgeCheck size={11} /> Verified
            </span>
          </div>
        </Link>

        {/* MIDDLE: Thumbnails (visible md+) */}
        {thumbnails.length > 0 && (
          <div className="hidden md:flex flex-col gap-1.5 p-2 bg-slate-50/60">
            {thumbnails.map((img, i) => (
              <Link
                key={i}
                href={`/ads/${ad.id}`}
                className="relative w-20 lg:w-24 h-20 lg:h-24 rounded-lg overflow-hidden ring-1 ring-indigo-100 hover:ring-2 hover:ring-blue-500 transition-all shrink-0"
              >
                <Image
                  src={img}
                  alt={`${ad.title} photo ${i + 2}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </Link>
            ))}
          </div>
        )}

        {/* RIGHT: Content */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col">
          <Link href={`/ads/${ad.id}`} className="block group/title">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 group-hover/title:text-indigo-700 transition-colors leading-snug mb-1.5">
              {ad.title}
            </h3>
          </Link>

          <div className="flex items-center gap-3 flex-wrap text-xs text-slate-500 mb-3">
            <span className="inline-flex items-center gap-1 font-medium">
              <MapPin size={12} className="text-indigo-400" />
              <Link href={`/call-girls`} className="hover:text-indigo-600 transition-colors">
                {ad.area}, {ad.city}
              </Link>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={11} className="text-slate-400" />
              {timeAgo(ad.createdAt)}
            </span>
            {ad.price && (
              <span className="inline-flex items-center font-bold text-blue-600">
                {formatPrice(ad.price)}
              </span>
            )}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4 flex-1">
            {ad.description}
          </p>

          {/* Mobile thumbnails (md:hidden) */}
          {thumbnails.length > 0 && (
            <div className="flex md:hidden gap-1.5 mb-4">
              {thumbnails.map((img, i) => (
                <Link
                  key={i}
                  href={`/ads/${ad.id}`}
                  className="relative w-16 h-16 rounded-lg overflow-hidden ring-1 ring-indigo-100 shrink-0"
                >
                  <Image
                    src={img}
                    alt={`${ad.title} photo ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </Link>
              ))}
            </div>
          )}

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-3 border-t border-slate-100">
            <Link
              href={`/ads/${ad.id}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#060B27] text-white py-2.5 px-4 rounded-xl font-bold text-sm hover:bg-[#0B1354] transition-colors"
            >
              See more & contact <ChevronRight size={14} />
            </Link>
            <a
              href={`tel:+91${ad.phone.replace(/\D/g, '').slice(-10)}`}
              className="inline-flex items-center justify-center gap-1.5 bg-blue-500 text-[#060B27] py-2.5 px-4 rounded-xl font-bold text-sm hover:bg-blue-400 transition-colors"
            >
              <Phone size={13} /> Call
            </a>
            {ad.whatsapp && (
              <a
                href={`https://wa.me/91${ad.whatsapp.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(`Hi, I saw your ad "${ad.title}" on letmepleasure.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-green-500 text-white py-2.5 px-4 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
