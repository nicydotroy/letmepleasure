import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Phone, MessageCircle } from 'lucide-react'
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

export default function AdCard({ ad }: { ad: Ad }) {
  const images: string[] = JSON.parse(ad.images || '[]')
  const mainImage = images[0] || null
  const category = getCategoryBySlug(ad.category)

  return (
    <Link href={`/ads/${ad.id}`} className="group block">
      <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-pink-100 hover:-translate-y-1.5 transition-all duration-200 border border-pink-50">

        {/* Image */}
        <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-pink-50 to-pink-100">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={ad.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-30">{category?.icon || '📦'}</span>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A0618]/60 via-transparent to-transparent" />

          {/* Category badge */}
          {category && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-bold bg-pink-500 text-[#2A0618] shadow-sm">
                {category.icon} {category.name}
              </span>
            </div>
          )}

          {/* WhatsApp */}
          {ad.whatsapp && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 text-[11px] bg-green-500 text-white px-2.5 py-1 rounded-full font-bold shadow-sm">
                <MessageCircle size={10} /> WhatsApp
              </span>
            </div>
          )}

          {/* Price on image bottom */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            {ad.price ? (
              <span className="text-white font-black text-lg leading-none drop-shadow-md">
                {formatPrice(ad.price)}
              </span>
            ) : (
              <span className="text-white/80 text-xs font-semibold">Price on Request</span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] bg-black/50 text-white px-2 py-1 rounded-full backdrop-blur-sm">
              <Clock size={9} /> {timeAgo(ad.createdAt)}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-pink-700 transition-colors mb-1.5">
            {ad.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {ad.description}
          </p>

          {/* Footer row */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <MapPin size={11} className="text-pink-400" />
              {ad.area}, {ad.city}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Phone size={11} className="text-slate-300" />
              {ad.phone.slice(0, 5)}·····
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

