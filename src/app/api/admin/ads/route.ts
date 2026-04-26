import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const adminToken = cookieStore.get('admin_token')?.value

    if (!adminToken) {
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
