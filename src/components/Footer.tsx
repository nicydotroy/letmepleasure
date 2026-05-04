import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react'
import { CITIES } from '@/lib/cities'
import { CATEGORIES } from '@/lib/categories'

export default function Footer() {
  const topCities = CITIES.slice(0, 8)

  return (
    <footer className="bg-[#060B27] text-blue-200 mt-16">
      {/* CTA Banner */}
      <div className="bg-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-[#060B27] font-black text-2xl mb-1">Ready to post your ad?</h3>
            <p className="text-[#060B27]/70 text-sm">Go live in 60 seconds — no registration, 100% free.</p>
          </div>
          <Link
            href="/post-ad"
            className="shrink-0 flex items-center gap-2 bg-[#060B27] text-blue-500 px-6 py-3 rounded-2xl font-black text-sm hover:bg-[#0B1354] transition-colors shadow-xl"
          >
            Post Free Ad <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="bg-white inline-flex rounded-xl px-3 py-2.5 mb-5 shadow-md">
              <Image
                src="/logos/logo.png"
                alt="Listvoo logo"
                width={1280}
                height={540}
                className="h-10 sm:h-12 w-auto"
              />
            </div>
            <p className="text-sm text-blue-300 leading-relaxed mb-5">
              India&apos;s premier free classifieds platform. Post ads in every Indian metro city — completely free, forever.
            </p>
            <div className="flex gap-3">
              {['📘', '📸', '🐦', '▶️'].map((icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-blue-500 hover:text-[#060B27] flex items-center justify-center text-base transition-colors">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Cities */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Top Cities</h3>
            <ul className="space-y-2">
              {topCities.map((city) => (
                <li key={city.slug}>
                  <Link href={`/call-girls/${city.slug}`} className="flex items-center gap-2 text-sm text-blue-300 hover:text-blue-500 transition-colors group">
                    <MapPin size={11} className="text-blue-400/50 group-hover:text-blue-500 transition-colors" />
                    {city.name}
                    <span className="text-blue-400/30 text-xs ml-auto">{city.state}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/call-girls" className="text-sm text-blue-500 hover:text-blue-400 font-semibold flex items-center gap-1">
                  View all cities <ArrowRight size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Services</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/?category=${cat.slug}`} className="text-sm text-blue-300 hover:text-blue-500 transition-colors flex items-center gap-2">
                    <span>{cat.icon}</span> {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Contact Us</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2.5 text-sm text-blue-300">
                <Mail size={14} className="text-blue-500 shrink-0" />
                support@listvoo.com
              </li>
              <li className="flex items-center gap-2.5 text-sm text-blue-300">
                <Phone size={14} className="text-blue-500 shrink-0" />
                +91 98765 43210
              </li>
            </ul>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-xs text-blue-300 leading-relaxed">
                🇮🇳 Proudly serving classified ads across all Indian metro cities.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-400/60">
          <p>© {new Date().getFullYear()} Listvoo. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-blue-200 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-blue-200 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-blue-200 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
