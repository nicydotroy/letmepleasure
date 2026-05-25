import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCityBySlug, getAreaBySlug } from '@/lib/cities'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const citySlug = searchParams.get('city')
  const areaSlug = searchParams.get('area')
  const category = searchParams.get('category')
  const q = searchParams.get('q')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = { isActive: true, status: 'approved' }
  if (citySlug) where.citySlug = citySlug
  if (areaSlug) where.areaSlug = areaSlug
  if (category) where.category = category
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
    ]
  }

  const [ads, total] = await Promise.all([
    prisma.ad.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.ad.count({ where }),
  ])

  return NextResponse.json({ ads, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const title = (formData.get('title') as string)?.trim()
    const description = (formData.get('description') as string)?.trim()
    const category = formData.get('category') as string
    const price = (formData.get('price') as string)?.trim() || null
    const citySlug = formData.get('citySlug') as string
    const areaSlug = formData.get('areaSlug') as string
    const phone = (formData.get('phone') as string)?.trim()
    const whatsapp = (formData.get('whatsapp') as string)?.trim() || null

    // Validate required fields
    if (!title || !description || !category || !citySlug || !areaSlug || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate phone (10 digits)
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    if (whatsapp && !/^[6-9]\d{9}$/.test(whatsapp)) {
      return NextResponse.json({ error: 'Invalid WhatsApp number' }, { status: 400 })
    }

    // Resolve city/area names
    const city = getCityBySlug(citySlug)
    const area = getAreaBySlug(citySlug, areaSlug)

    if (!city || !area) {
      return NextResponse.json({ error: 'Invalid city or area' }, { status: 400 })
    }

    // Associate the ad with the logged-in user, if any (anonymous posting still allowed)
    let userId: string | null = null
    const userToken = request.cookies.get('user_token')?.value
    if (userToken) {
      const user = await prisma.user.findUnique({ where: { id: userToken }, select: { id: true } })
      if (user) userId = user.id
    }

    // Handle image uploads
    const imageFiles = formData.getAll('images') as File[]
    const imagePaths: string[] = []

    if (imageFiles && imageFiles.length > 0) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadDir, { recursive: true })

      for (const file of imageFiles.slice(0, 5)) {
        if (file && file.size > 0) {
          if (file.size > 5 * 1024 * 1024) continue // skip files > 5MB
          const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
          if (!allowedTypes.includes(file.type)) continue

          const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
          const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
          const buffer = Buffer.from(await file.arrayBuffer())
          await writeFile(path.join(uploadDir, safeName), buffer)
          imagePaths.push(`/uploads/${safeName}`)
        }
      }
    }

    const ad = await prisma.ad.create({
      data: {
        title,
        description,
        category,
        price,
        city: city.name,
        citySlug,
        area: area.name,
        areaSlug,
        phone,
        whatsapp,
        images: JSON.stringify(imagePaths),
        status: 'pending', // New ads start as pending
        userId,
      },
    })

    return NextResponse.json({
      ad,
      message: 'Ad posted successfully! Awaiting admin approval.',
    }, { status: 201 })
  } catch (err) {
    console.error('POST /api/ads error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
