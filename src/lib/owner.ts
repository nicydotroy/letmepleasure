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

// True when the current request has admin powers (approve ads, author blog):
// either a logged-in admin (admin_token) or an owner/super-admin user (user_token).
export async function isAdminOrOwner(): Promise<boolean> {
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

// Backwards-compatible alias used by the blog routes.
export const isBlogAuthor = isAdminOrOwner
