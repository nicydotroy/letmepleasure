import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminOrOwner } from '@/lib/owner'

interface FaqInput {
  q?: unknown
  a?: unknown
}

// GET ?city=X&area=Y — fetch current content for the given location.
export async function GET(req: NextRequest) {
  if (!(await isAdminOrOwner())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const citySlug = searchParams.get('city') || ''
  const areaSlug = searchParams.get('area') || ''
  if (!citySlug) {
    return NextResponse.json({ error: 'city is required' }, { status: 400 })
  }
  const row = await prisma.locationContent.findUnique({
    where: { citySlug_areaSlug: { citySlug, areaSlug } },
  })
  return NextResponse.json({ content: row })
}

// PUT — upsert content for a given (city, area).
export async function PUT(req: NextRequest) {
  if (!(await isAdminOrOwner())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { citySlug, areaSlug = '', heading, intro, body, faqs } = await req.json()
    if (!citySlug || typeof citySlug !== 'string') {
      return NextResponse.json({ error: 'citySlug is required' }, { status: 400 })
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

    const row = await prisma.locationContent.upsert({
      where: { citySlug_areaSlug: { citySlug, areaSlug } },
      update: data,
      create: { citySlug, areaSlug, ...data },
    })
    return NextResponse.json({ content: row })
  } catch (err) {
    console.error('PUT /api/admin/locations error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
