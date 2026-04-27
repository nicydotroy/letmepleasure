import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES } from '@/lib/categories'
import { CITIES } from '@/lib/cities'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse All Categories | Listvoo',
  description: 'Browse all classified ad categories on Listvoo. Find Female Escorts, Call Girls, Male Escorts, Massage Services & more in India.',
  alternates: { canonical: 'https://listvoo.com/category' },
}

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      {/* Hero */}
      <div className="bg-[#060B27] py-12 px-4 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Browse <span className="text-amber-400">All Categories</span>
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Explore verified service providers across all categories in your city.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Categories Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group bg-white rounded-2xl p-8 border-2 border-transparent shadow-md hover:border-amber-400 hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-4">{cat.icon}</div>
                <h2 className="text-2xl font-black text-[#060B27] mb-2 group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </h2>
                <p className="text-slate-600 text-sm mb-4">
                  Find verified {cat.name.toLowerCase()} across all major Indian cities
                </p>
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm group-hover:gap-3 transition-all">
                  Browse <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
