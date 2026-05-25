import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminOrOwner } from '@/lib/owner'

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdminOrOwner())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'pending'

    const ads = await prisma.ad.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({ ads })
  } catch (error) {
    console.error('Fetch ads error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
