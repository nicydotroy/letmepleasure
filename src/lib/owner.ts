import { prisma } from './prisma'
import { cookies } from 'next/headers'

// Email(s) allowed to author blog posts from their normal user account.
// Configurable via the BLOG_OWNER_EMAILS env var (comma-separated).
export const OWNER_EMAILS = (process.env.BLOG_OWNER_EMAILS || 'trusted7061@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export function isOwnerEmail(email?: string | null): boolean {
  return !!email && OWNER_EMAILS.includes(email.toLowerCase())
}

// True when the current request may author blog posts:
// either a logged-in admin (admin_token) or an owner user (user_token).
export async function isBlogAuthor(): Promise<boolean> {
  const store = await cookies()
  if (store.get('admin_token')?.value) return true

  const userId = store.get('user_token')?.value
  if (!userId) return false

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  })
  return isOwnerEmail(user?.email)
}
