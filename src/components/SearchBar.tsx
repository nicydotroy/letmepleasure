'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import { CITIES } from '@/lib/cities'
import { CATEGORIES } from '@/lib/categories'

export default function SearchBar({ large = false }: { large?: boolean }) {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (city && !query) {
      router.push(`/call-girls/${city}`)
    } else {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (city) params.set('city', city)
      router.push(`/?${params.toString()}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
      {/* Search bar */}
      <div className={`flex flex-col sm:flex-row bg-white ${large ? 'rounded-2xl p-2 shadow-2xl shadow-black/30' : 'rounded-xl p-1.5 shadow-lg'}`}>
        {/* Query input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 pointer-events-none" size={18} />
          <input
            type="search"
            placeholder="Search escorts, massage, services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full pl-11 pr-4 ${large ? 'py-3.5 text-base' : 'py-2.5 text-sm'} rounded-xl border-0 text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent font-medium`}
          />
        </div>

        <div className="hidden sm:block w-px bg-slate-100 self-stretch my-1" />

        {/* City picker */}
        <div className="relative sm:w-44">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-600 pointer-events-none" size={15} />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`w-full pl-8 pr-3 ${large ? 'py-3.5 text-sm' : 'py-2.5 text-sm'} rounded-xl border-0 bg-transparent text-slate-700 focus:outline-none font-semibold appearance-none cursor-pointer`}
          >
            <option value="">All Cities</option>
            {CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`flex items-center justify-center gap-2 bg-[#2A0618] hover:bg-[#4A0B2F] text-white ${large ? 'px-8 py-3.5 text-base' : 'px-5 py-2.5 text-sm'} rounded-xl font-bold transition-all shrink-0 shadow-lg`}
        >
          <Search size={16} />
          Search
        </button>
      </div>

      {/* Quick category tags */}
      {large && (
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => router.push(`/?category=${cat.slug}`)}
              className="text-xs px-3.5 py-1.5 bg-white/15 backdrop-blur text-white/90 rounded-full hover:bg-pink-500 hover:text-[#2A0618] transition-all font-semibold border border-white/20"
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}

