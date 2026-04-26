import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { CITIES } from '@/lib/cities'

const cityEmojis: Record<string, string> = {
  mumbai: '🌊', delhi: '🏛️', bangalore: '🌿', hyderabad: '💎',
  chennai: '🏖️', kolkata: '🎭', pune: '🎓', ahmedabad: '🦁',
  jaipur: '🏰', surat: '💍', lucknow: '🌹', kochi: '🌴',
}

export default function CityGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {CITIES.map((city) => (
        <Link
          key={city.slug}
          href={`/location/${city.slug}`}
          className="group relative bg-white rounded-2xl p-5 border-2 border-transparent shadow-sm hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 text-center overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">
              {cityEmojis[city.slug] || '🏙️'}
            </div>
            <h3 className="font-black text-sm text-[#060B27] group-hover:text-indigo-700 transition-colors leading-tight">
              {city.name}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{city.state}</p>
            <div className="flex items-center justify-center gap-1 mt-2 text-[11px] text-indigo-400 font-semibold">
              <MapPin size={10} /> {city.areas.length} areas
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

