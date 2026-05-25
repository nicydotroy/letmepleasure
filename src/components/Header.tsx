'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, MapPin, PlusCircle, ChevronDown, Phone, User as UserIcon, LogOut, LogIn } from 'lucide-react'
import { CITIES } from '@/lib/cities'

type AuthUser = { id: string; email: string; name: string | null }

export default function Header() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [citiesOpen, setCitiesOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setMenuOpen(false)
    router.refresh()
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#060B27]/95 backdrop-blur-md shadow-lg shadow-black/30'
          : 'bg-[#060B27]'
      }`}
    >
      {/* Top announcement bar */}
      <div className="bg-blue-500 text-[#060B27] text-xs py-1.5 text-center font-bold tracking-wide">
        🌟 Post FREE Ads — No Registration · No Hidden Charges · Live in 60 Seconds
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0" aria-label="Listvoo home">
            <div className="bg-white rounded-lg sm:rounded-xl px-2 py-1.5 sm:px-2.5 sm:py-2 shadow-md group-hover:shadow-lg transition-shadow">
              <Image
                src="/logos/logo.png"
                alt="Listvoo logo"
                width={1280}
                height={540}
                priority
                className="h-8 sm:h-10 w-auto"
              />
            </div>
            <div className="hidden md:block">
              <div className="text-[10px] font-semibold text-blue-300 tracking-widest uppercase leading-none">
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
                <MapPin size={14} className="text-blue-500" />
                Cities
                <ChevronDown size={13} className={`transition-transform text-blue-300 ${citiesOpen ? 'rotate-180' : ''}`} />
              </button>
              {citiesOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-[#0B1354] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-3 grid grid-cols-2 gap-1">
                  {CITIES.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/call-girls/${c.slug}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-500/10 text-blue-200 hover:text-blue-500 transition-all text-sm"
                    >
                      <MapPin size={11} className="text-blue-500/60" />
                      {c.name}
                    </Link>
                  ))}
                  <Link
                    href="/call-girls"
                    className="col-span-2 text-center text-xs text-blue-500 hover:text-blue-400 font-bold mt-1 py-1.5 border-t border-white/10"
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
              href="/call-girls"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-all"
            >
              All Locations
            </Link>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+919229604907"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-blue-200 hover:text-white border border-white/10 hover:border-white/30 text-sm transition-all"
            >
              <Phone size={14} className="text-blue-500" />
              Help
            </a>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-blue-100 hover:text-white hover:bg-white/10 text-sm font-semibold max-w-[160px] truncate transition-all"
                >
                  <UserIcon size={14} className="text-blue-500 shrink-0" />
                  <span className="truncate">{user.name || user.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-blue-200 hover:text-white border border-white/10 hover:border-white/30 text-sm transition-all"
                >
                  <LogOut size={14} className="text-blue-500" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-blue-200 hover:text-white border border-white/10 hover:border-white/30 text-sm font-semibold transition-all"
                >
                  <LogIn size={14} className="text-blue-500" />
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-blue-200 hover:text-white border border-white/10 hover:border-white/30 text-sm font-semibold transition-all"
                >
                  <UserIcon size={14} className="text-blue-500" />
                  Sign Up
                </Link>
              </div>
            )}

            <Link
              href="/post-ad"
              className="hidden sm:flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-[#060B27] px-5 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
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
            href="/call-girls"
            className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-blue-200 font-semibold hover:bg-white/10 hover:text-white transition-all"
            onClick={() => setMenuOpen(false)}
          >
            <MapPin size={17} className="text-blue-500" /> All Cities
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-blue-200 font-semibold hover:bg-white/10 hover:text-white transition-all"
            onClick={() => setMenuOpen(false)}
          >
            Browse Ads
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-blue-100 font-semibold hover:bg-white/10 hover:text-white transition-all"
                onClick={() => setMenuOpen(false)}
              >
                <UserIcon size={17} className="text-blue-500" />
                <span className="truncate">My Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-blue-200 font-semibold hover:bg-white/10 hover:text-white transition-all"
              >
                <LogOut size={17} className="text-blue-500" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-blue-200 font-semibold hover:bg-white/10 hover:text-white transition-all"
                onClick={() => setMenuOpen(false)}
              >
                <LogIn size={17} className="text-blue-500" /> Sign In
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-blue-200 font-semibold hover:bg-white/10 hover:text-white transition-all"
                onClick={() => setMenuOpen(false)}
              >
                <UserIcon size={17} className="text-blue-500" /> Sign Up
              </Link>
            </>
          )}
          <div className="pt-2">
            <Link
              href="/post-ad"
              className="flex items-center justify-center gap-2 bg-blue-500 text-[#060B27] py-3.5 rounded-xl font-black text-sm shadow-lg"
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
