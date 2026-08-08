import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CalendarDays, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 300

async function getPost(slug: string) {
  try {
    return await prisma.post.findFirst({ where: { slug, status: 'published' } })
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return { title: 'Article not found — Letme Pleasure' }

  const description = post.excerpt || post.content.slice(0, 155)
  const url = `https://letmepleasure.com/blog/${post.slug}`

  return {
    title: `${post.title} — Letme Pleasure Blog`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url,
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
      publishedTime: post.publishedAt?.toISOString(),
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  const paragraphs = post.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  const publishedLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <div className="min-h-screen bg-[#FFF1F7]">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-pink-600 hover:text-pink-700 font-semibold text-sm mb-6">
          <ArrowLeft size={15} /> All articles
        </Link>

        <h1 className="text-3xl sm:text-4xl font-black text-[#2A0618] mb-3 leading-tight">{post.title}</h1>
        <p className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
          <CalendarDays size={13} /> {publishedLabel}
        </p>

        {post.coverImage && (
          <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-8 shadow-sm">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-pink-50">
          {post.excerpt && (
            <p className="text-lg text-slate-700 font-semibold mb-6 border-l-4 border-pink-500 pl-4">{post.excerpt}</p>
          )}
          <div className="space-y-4 text-slate-700 leading-relaxed">
            {paragraphs.map((p, i) => (
              <p key={i} className="whitespace-pre-wrap">{p}</p>
            ))}
          </div>
        </div>

        {/* Article schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              datePublished: post.publishedAt?.toISOString(),
              dateModified: post.updatedAt.toISOString(),
              ...(post.excerpt ? { description: post.excerpt } : {}),
              ...(post.coverImage ? { image: `https://letmepleasure.com${post.coverImage}` } : {}),
              mainEntityOfPage: `https://letmepleasure.com/blog/${post.slug}`,
              author: { '@type': 'Organization', name: 'Letme Pleasure' },
              publisher: { '@type': 'Organization', name: 'Letme Pleasure', logo: { '@type': 'ImageObject', url: 'https://letmepleasure.com/og-image.png' } },
            }),
          }}
        />
      </article>
    </div>
  )
}
