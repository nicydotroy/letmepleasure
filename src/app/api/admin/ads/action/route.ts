import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const adminToken = cookieStore.get('admin_token')?.value

    if (!adminToken) {
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

    return NextResponse.json({ success: true, ad })
  } catch (error) {
    console.error('Ad action error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
