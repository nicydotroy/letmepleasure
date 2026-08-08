import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminOrOwner } from '@/lib/owner'
import { isEditablePath, normalizePath, resolveStore } from '@/lib/page-content'

export const dynamic = 'force-dynamic'

interface FaqInput {
  q?: unknown
  a?: unknown
}

// GET ?path=/category/female-escorts — current content for one page.
export async function GET(req: NextRequest) {
  if (!(await isAdminOrOwner())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const path = normalizePath(new URL(req.url).searchParams.get('path') || '')
  if (!isEditablePath(path)) {
    return NextResponse.json({ error: 'Unknown page' }, { status: 400 })
  }

  const target = resolveStore(path)
  const row =
    target.store === 'location'
      ? await prisma.locationContent.findUnique({
          where: { citySlug_areaSlug: { citySlug: target.citySlug, areaSlug: target.areaSlug } },
        })
      : await prisma.pageContent.findUnique({ where: { path: target.path } })

  return NextResponse.json({ content: row, store: target.store })
}

// PUT — upsert content for one page, into whichever table backs that path.
export async function PUT(req: NextRequest) {
  if (!(await isAdminOrOwner())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { path: rawPath, heading, intro, body, faqs } = await req.json()
    const path = normalizePath(typeof rawPath === 'string' ? rawPath : '')
    if (!isEditablePath(path)) {
      return NextResponse.json({ error: 'Unknown page' }, { status: 400 })
    }

    // Normalise + filter FAQs: must be non-empty {q, a} strings.
    let faqsJson: string | null = null
    if (Array.isArray(faqs)) {
      const cleaned = (faqs as FaqInput[])
        .map((f) => ({ q: String(f?.q || '').trim(), a: String(f?.a || '').trim() }))
        .filter((f) => f.q && f.a)
      faqsJson = cleaned.length > 0 ? JSON.stringify(cleaned) : null
    }

    const data = {
      heading: heading?.toString().trim() || null,
      intro: intro?.toString().trim() || null,
      body: body?.toString().trim() || null,
      faqs: faqsJson,
    }

    const target = resolveStore(path)
    const row =
      target.store === 'location'
        ? await prisma.locationContent.upsert({
            where: {
              citySlug_areaSlug: { citySlug: target.citySlug, areaSlug: target.areaSlug },
            },
            update: data,
            create: { citySlug: target.citySlug, areaSlug: target.areaSlug, ...data },
          })
        : await prisma.pageContent.upsert({
            where: { path: target.path },
            update: data,
            create: { path: target.path, ...data },
          })

    return NextResponse.json({ content: row, store: target.store })
  } catch (err) {
    console.error('PUT /api/admin/page-content error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE ?path=... — clear a page's content entirely.
export async function DELETE(req: NextRequest) {
  if (!(await isAdminOrOwner())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const path = normalizePath(new URL(req.url).searchParams.get('path') || '')
  if (!isEditablePath(path)) {
    return NextResponse.json({ error: 'Unknown page' }, { status: 400 })
  }

  const target = resolveStore(path)
  try {
    if (target.store === 'location') {
      await prisma.locationContent.delete({
        where: { citySlug_areaSlug: { citySlug: target.citySlug, areaSlug: target.areaSlug } },
      })
    } else {
      await prisma.pageContent.delete({ where: { path: target.path } })
    }
  } catch {
    // Already absent — deleting nothing is the intended end state.
  }
  return NextResponse.json({ ok: true })
}
