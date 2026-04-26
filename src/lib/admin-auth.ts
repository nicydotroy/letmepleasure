import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export async function createAdminUser(username: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10)
  return prisma.admin.create({
    data: { username, email, password: hashedPassword },
  })
}

export async function verifyAdminCredentials(username: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { username } })
  if (!admin) return null

  const isValid = await bcrypt.compare(password, admin.password)
  return isValid ? admin : null
}

export function setAdminSession(token: string) {
  // Session will be set in cookies by the API route
  return token
}
