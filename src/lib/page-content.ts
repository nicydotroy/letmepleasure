import { prisma } from './prisma'
import { CITIES } from './cities'
import { CATEGORIES } from './categories'
import type { LocationFaq, ResolvedLocationContent } from './location-content'

export type PageFaq = LocationFaq
export type ResolvedPageContent = ResolvedLocationContent

// City and area pages already store their content in LocationContent. Rather
// than migrate that data, route those paths back to it so every page has
// exactly one source of content and the older location editor stays valid.
const CITY_PATH = /^\/call-girls\/([^/]+)$/
const AREA_PATH = /^\/call-girls\/([^/]+)\/([^/]+)$/

export function normalizePath(input: string): string {
  const trimmed = (input || '').trim().split('?')[0].split('#')[0]
  if (!trimmed || trimmed === '/') return '/'
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash
}

// Which table backs a given path, and under what key.
export function resolveStore(path: string):
  | { store: 'location'; citySlug: string; areaSlug: string }
  | { store: 'page'; path: string } {
  const p = normalizePath(path)
  const area = p.match(AREA_PATH)
  if (area) return { store: 'location', citySlug: area[1], areaSlug: area[2] }
  const city = p.match(CITY_PATH)
  if (city) return { store: 'location', citySlug: city[1], areaSlug: '' }
  return { store: 'page', path: p }
}

export function parseFaqs(raw: string | null | undefined): PageFaq[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((f) => ({ q: String(f?.q || '').trim(), a: String(f?.a || '').trim() }))
      .filter((f) => f.q && f.a)
  } catch {
    return []
  }
}

function resolve(row: {
  heading: string | null
  intro: string | null
  body: string | null
  faqs: string | null
} | null): ResolvedPageContent | null {
  if (!row) return null
  const faqs = parseFaqs(row.faqs)
  return {
    heading: row.heading,
    intro: row.intro,
    body: row.body,
    faqs,
    hasAny: Boolean(row.heading || row.intro || row.body || faqs.length > 0),
  }
}

// Fetch admin-edited content for any page. Never throws — a database miss
// falls back to no override so the page still renders.
export async function getPageContent(path: string): Promise<ResolvedPageContent | null> {
  const target = resolveStore(path)
  try {
    if (target.store === 'location') {
      const row = await prisma.locationContent.findUnique({
        where: { citySlug_areaSlug: { citySlug: target.citySlug, areaSlug: target.areaSlug } },
      })
      return resolve(row)
    }
    const row = await prisma.pageContent.findUnique({ where: { path: target.path } })
    return resolve(row)
  } catch {
    return null
  }
}

export interface EditablePage {
  path: string
  label: string
}

export interface EditablePageGroup {
  key: string
  label: string
  pages: EditablePage[]
}

// Every page the admin content editor can target, grouped for the picker.
export function editablePageGroups(): EditablePageGroup[] {
  return [
    {
      key: 'static',
      label: 'Main pages',
      pages: [
        { path: '/', label: 'Homepage' },
        { path: '/call-girls', label: 'All Cities index' },
        { path: '/blog', label: 'Blog index' },
      ],
    },
    {
      key: 'category',
      label: 'Category hubs',
      pages: CATEGORIES.map((c) => ({
        path: `/category/${c.slug}`,
        label: `${c.name} (India-wide)`,
      })),
    },
    {
      key: 'city',
      label: 'City pages',
      pages: CITIES.map((c) => ({
        path: `/call-girls/${c.slug}`,
        label: `${c.name}, ${c.state}`,
      })),
    },
    {
      key: 'area',
      label: 'Area pages',
      pages: CITIES.flatMap((c) =>
        c.areas.map((a) => ({
          path: `/call-girls/${c.slug}/${a.slug}`,
          label: `${a.name} — ${c.name}`,
        }))
      ),
    },
    {
      key: 'city-category',
      label: 'City + category pages',
      pages: CITIES.flatMap((c) =>
        CATEGORIES.map((cat) => ({
          path: `/${c.slug}/${cat.slug}`,
          label: `${cat.name} in ${c.name}`,
        }))
      ),
    },
  ]
}

export function isEditablePath(path: string): boolean {
  const p = normalizePath(path)
  return editablePageGroups().some((g) => g.pages.some((page) => page.path === p))
}
