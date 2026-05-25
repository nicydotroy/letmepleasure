import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/slug'
import { isBlogAuthor } from '@/lib/owner'

// List all posts (drafts + published) for the admin
export async function GET() {
  if (!(await isBlogAuthor())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  return NextResponse.json({ posts })
}

// Create a new post (draft or published)
export async function POST(req: NextRequest) {
  if (!(await isBlogAuthor())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, content, excerpt, coverImage, status } = await req.json()

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const publish = status === 'published'

    // Build a unique slug from the title
    const base = slugify(title) || 'post'
    let slug = base
    let n = 1
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${base}-${n++}`
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        slug,
        content: content.trim(),
        excerpt: excerpt?.trim() || null,
        coverImage: coverImage?.trim() || null,
        status: publish ? 'published' : 'draft',
        publishedAt: publish ? new Date() : null,
      },
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
