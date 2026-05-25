import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export async function createUser(email: string, password: string, name?: string) {
  const hashedPassword = await bcrypt.hash(password, 10)
  return prisma.user.create({
    data: { email: email.toLowerCase(), password: hashedPassword, name: name || null },
  })
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase() } })
}

export async function verifyUserCredentials(email: string, password: string) {
  const user = await findUserByEmail(email)
  if (!user) return null

  const isValid = await bcrypt.compare(password, user.password)
  return isValid ? user : null
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
