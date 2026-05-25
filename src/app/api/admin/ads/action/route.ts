import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { pingIndexNow } from '@/lib/indexnow'
import { isAdminOrOwner } from '@/lib/owner'

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdminOrOwner())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { adId, action } = await req.json()

    if (!adId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const updateData = action === 'approve'
      ? { status: 'approved', approvedAt: new Date() }
      : { status: 'rejected', approvedAt: new Date() }

    const ad = await prisma.ad.update({
      where: { id: adId },
      data: updateData,
    })

    // On approval, ping IndexNow so Bing/Yandex/etc index the new ad page,
    // its city page and area page within minutes instead of waiting for the
    // next crawl. Fire-and-forget — failures must not block the admin action.
    if (action === 'approve') {
      void pingIndexNow([
        `https://listvoo.com/ads/${ad.id}`,
        `https://listvoo.com/call-girls/${ad.citySlug}`,
        `https://listvoo.com/call-girls/${ad.citySlug}/${ad.areaSlug}`,
      ])
    }

    return NextResponse.json({ success: true, ad })
  } catch (error) {
    console.error('Ad action error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
