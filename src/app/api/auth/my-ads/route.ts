import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_token')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ads = await prisma.ad.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        category: true,
        city: true,
        area: true,
        price: true,
        status: true,
        rejectionReason: true,
        createdAt: true,
      },
    })

    const stats = {
      total: ads.length,
      pending: ads.filter((a) => a.status === 'pending').length,
      approved: ads.filter((a) => a.status === 'approved').length,
      rejected: ads.filter((a) => a.status === 'rejected').length,
    }

    return NextResponse.json({ user, ads, stats })
  } catch (error) {
    console.error('my-ads error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
