import { prisma } from './prisma'

export interface LocationFaq { q: string; a: string }

export interface ResolvedLocationContent {
  heading: string | null
  intro: string | null
  body: string | null
  faqs: LocationFaq[]
  hasAny: boolean
}

// Fetch admin-edited content for /call-girls/[city] (areaSlug="") or
// /call-girls/[city]/[area]. Returns null if no row exists.
export async function getLocationContent(
  citySlug: string,
  areaSlug: string = ''
): Promise<ResolvedLocationContent | null> {
  try {
    const row = await prisma.locationContent.findUnique({
      where: { citySlug_areaSlug: { citySlug, areaSlug } },
    })
    if (!row) return null

    let faqs: LocationFaq[] = []
    if (row.faqs) {
      try {
        const parsed = JSON.parse(row.faqs)
        if (Array.isArray(parsed)) {
          faqs = parsed
            .map((f) => ({ q: String(f?.q || '').trim(), a: String(f?.a || '').trim() }))
            .filter((f) => f.q && f.a)
        }
      } catch {
        /* ignore malformed JSON */
      }
    }

    const hasAny = Boolean(row.heading || row.intro || row.body || faqs.length > 0)
    return { heading: row.heading, intro: row.intro, body: row.body, faqs, hasAny }
  } catch {
    // DB miss should never crash the page — fall back to no override.
    return null
  }
}
