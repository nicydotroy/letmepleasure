import Link from 'next/link'
import { MapPin, ArrowRight, Building2 } from 'lucide-react'
import { CITIES } from '@/lib/cities'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Call Girls in India - Find Escorts in Mumbai, Delhi, Bangalore & More | Listvoo',
  description: 'Call girls and escorts across India. Find verified escorts in Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata and 12+ metro cities. Professional, discreet, verified profiles.',
  alternates: { canonical: 'https://listvoo.com/call-girls' },
}

const cityEmojis: Record<string, string> = {
  mumbai: '🌊', delhi: '🏛️', bangalore: '🌿', hyderabad: '💎',
  chennai: '🏖️', kolkata: '🎭', pune: '🎓', ahmedabad: '🦁',
  jaipur: '🏰', surat: '💍', lucknow: '🌹', kochi: '🌴',
}

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      {/* Hero */}
      <div className="bg-[#060B27] py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-300 border border-amber-400/20 px-4 py-1.5 rounded-full text-xs font-bold mb-5">
            <MapPin size={12} /> 12 Metro Cities · 120+ Areas
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4">
            Call Girls & Escorts in <span className="text-amber-400">India</span>
          </h1>
          <p className="text-blue-300 text-base max-w-xl mx-auto">
            Find verified call girls and escorts across 12+ Indian metro cities. Professional companions, discreet services, real profiles. Browse by location instantly.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-lg mx-auto text-center">
          {[
            { label: 'Cities', value: '12' },
            { label: 'Areas', value: '120+' },
            { label: 'Daily Ads', value: '500+' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm">
              <div className="text-2xl font-black text-[#060B27]">{s.value}</div>
              <div className="text-xs text-slate-400 font-semibold mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-black text-[#060B27] mb-6 text-center">Choose Your City</h2>

        {/* City grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {CITIES.map((city) => {
            const emoji = cityEmojis[city.slug] || '🏙️'
            return (
              <Link
                key={city.slug}
                href={`/call-girls/${city.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-transparent hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60 transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{emoji}</div>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all mt-1" />
                  </div>
                  <h2 className="font-black text-lg text-[#060B27] group-hover:text-indigo-700 transition-colors">{city.name}</h2>
                  <p className="text-slate-400 text-xs mt-0.5">{city.state}</p>
                  <div className="flex items-center gap-1 mt-3 text-slate-400 text-xs">
                    <Building2 size={11} className="text-indigo-400" /> {city.areas.length} areas
                  </div>
                  {/* Area chips */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {city.areas.slice(0, 3).map((area) => (
                      <span key={area.slug} className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full font-medium">
                        {area.name}
                      </span>
                    ))}
                    {city.areas.length > 3 && (
                      <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">+{city.areas.length - 3}</span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* SEO block */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-indigo-50 shadow-sm">
          <h2 className="text-lg font-black text-[#060B27] mb-3">Free Classified Ads Across India</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            ListNexa covers all major Indian metro cities with hyper-local adult classified ads. Whether you&apos;re in South Mumbai&apos;s Colaba, Delhi&apos;s Connaught Place, Bangalore&apos;s Koramangala, or Hyderabad&apos;s Banjara Hills — find local listings right in your neighbourhood. Post your ad free, browse by city, filter by area, and connect directly via phone or WhatsApp.
          </p>
        </div>
      </div>
    </div>
  )
}

