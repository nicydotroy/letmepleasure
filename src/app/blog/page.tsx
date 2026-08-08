import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { CalendarDays } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // refresh published list every 5 min

export const metadata: Metadata = {
  title: 'Blog — Letme Pleasure | Tips, Guides & Updates',
  description: 'Read the latest articles, tips and guides from Letme Pleasure on classifieds, safety and getting the most out of your ads.',
  alternates: { canonical: 'https://letmepleasure.com/blog' },
}

export default async function BlogIndexPage() {
  let posts: Awaited<ReturnType<typeof prisma.post.findMany>> = []
  try {
    posts = await prisma.post.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      take: 100,
    })
  } catch {
    // DB unreachable — render empty state rather than crashing
  }

  return (
    <div className="min-h-screen bg-[#FFF1F7]">
      <div className="hero-navy py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Letme Pleasure Blog</h1>
          <p className="text-pink-300 text-sm">Tips, guides and updates from the Letme Pleasure team</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border-2 border-dashed border-pink-200">
            <p className="text-slate-500 font-semibold">No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-pink-50 hover:shadow-md transition-shadow"
              >
                {post.coverImage && (
                  <div className="relative w-full h-48">
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-black text-[#2A0618] mb-2">{post.title}</h2>
                  {post.excerpt && <p className="text-slate-600 text-sm mb-3 line-clamp-3">{post.excerpt}</p>}
                  <p className="flex items-center gap-1.5 text-xs text-slate-400">
                    <CalendarDays size={13} />
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
