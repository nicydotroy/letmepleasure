'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, MapPin, PlusCircle, ChevronDown, Phone } from 'lucide-react'
import { CITIES } from '@/lib/cities'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [citiesOpen, setCitiesOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#060B27]/95 backdrop-blur-md shadow-lg shadow-black/30'
          : 'bg-[#060B27]'
      }`}
    >
      {/* Top announcement bar */}
      <div className="bg-amber-400 text-[#060B27] text-xs py-1.5 text-center font-bold tracking-wide">
        🌟 Post FREE Ads — No Registration · No Hidden Charges · Live in 60 Seconds
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center font-black text-xl text-[#060B27] shadow-lg group-hover:bg-amber-300 transition-colors">
              L
            </div>
            <div>
              <span className="text-lg font-black text-white leading-none">
                List<span className="text-amber-400">voo</span>
              </span>
              <div className="text-[9px] font-semibold text-blue-300 tracking-widest uppercase leading-none">
                Free Classifieds India
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
            {/* Cities dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCitiesOpen(true)}
              onMouseLeave={() => setCitiesOpen(false)}
            >
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-all">
                <MapPin size={14} className="text-amber-400" />
                Cities
                <ChevronDown size={13} className={`transition-transform text-blue-300 ${citiesOpen ? 'rotate-180' : ''}`} />
              </button>
              {citiesOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-[#0B1354] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-3 grid grid-cols-2 gap-1">
                  {CITIES.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/location/${c.slug}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-400/10 text-blue-200 hover:text-amber-400 transition-all text-sm"
                    >
                      <MapPin size={11} className="text-amber-400/60" />
                      {c.name}
                    </Link>
                  ))}
                  <Link
                    href="/location"
                    className="col-span-2 text-center text-xs text-amber-400 hover:text-amber-300 font-bold mt-1 py-1.5 border-t border-white/10"
                  >
                    View All Cities →
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-all"
            >
              Browse Ads
            </Link>

            <Link
              href="/location"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-all"
            >
              All Locations
            </Link>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+919876543210"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-blue-200 hover:text-white border border-white/10 hover:border-white/30 text-sm transition-all"
            >
              <Phone size={14} className="text-amber-400" />
              Help
            </a>
            <Link
              href="/post-ad"
              className="hidden sm:flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#060B27] px-5 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg shadow-amber-400/25 hover:shadow-amber-400/40"
            >
              <PlusCircle size={15} />
              Post Free Ad
            </Link>
            <button
              className="md:hidden w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0B1354] border-t border-white/10 px-4 pb-5 pt-3 space-y-1">
          <Link
            href="/location"
            className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-blue-200 font-semibold hover:bg-white/10 hover:text-white transition-all"
            onClick={() => setMenuOpen(false)}
          >
            <MapPin size={17} className="text-amber-400" /> All Cities
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-blue-200 font-semibold hover:bg-white/10 hover:text-white transition-all"
            onClick={() => setMenuOpen(false)}
          >
            Browse Ads
          </Link>
          <div className="pt-2">
            <Link
              href="/post-ad"
              className="flex items-center justify-center gap-2 bg-amber-400 text-[#060B27] py-3.5 rounded-xl font-black text-sm shadow-lg"
              onClick={() => setMenuOpen(false)}
            >
              <PlusCircle size={16} /> Post FREE Ad Now
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
