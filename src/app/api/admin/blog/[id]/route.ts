import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isBlogAuthor } from '@/lib/owner'

// Update a post (edit content, publish/unpublish)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isBlogAuthor())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, content, excerpt, coverImage, status } = await req.json()

    const existing = await prisma.post.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const publish = status === 'published'

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        ...(title?.trim() ? { title: title.trim() } : {}),
        ...(content?.trim() ? { content: content.trim() } : {}),
        excerpt: excerpt?.trim() || null,
        coverImage: coverImage?.trim() || null,
        status: publish ? 'published' : 'draft',
        // set publishedAt the first time it goes live; keep it afterwards
        publishedAt: publish ? existing.publishedAt ?? new Date() : null,
      },
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Update post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Delete a post
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isBlogAuthor())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.post.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
