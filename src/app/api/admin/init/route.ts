import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createAdminUser } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst()

    if (existingAdmin) {
      return NextResponse.json({
        message: 'Admin user already exists',
        admin: { username: existingAdmin.username },
      })
    }

    // Create default admin
    const admin = await createAdminUser(
      'admin',
      'admin@letmepleasure.local',
      'admin123'
    )

    return NextResponse.json({
      message: 'Default admin user created successfully',
      admin: { username: admin.username, email: admin.email },
      credentials: {
        username: 'admin',
        password: 'admin123',
      },
    })
  } catch (error) {
    console.error('Init error:', error)
    return NextResponse.json(
      { error: 'Initialization failed' },
      { status: 500 }
    )
  }
}
