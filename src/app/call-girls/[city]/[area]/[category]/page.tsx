import { notFound } from 'next/navigation'
import { getCategoryBySlug } from '@/lib/categories'
import AreaPage, { generateMetadata as areaMetadata } from '../page'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

// Path form of the area page's category filter, replacing
// /call-girls/[city]/[area]?category=[slug].
type Props = { params: { city: string; area: string; category: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.category)
  if (!category) return { title: 'Category not found' }

  const base = await areaMetadata({
    params: { city: params.city, area: params.area },
    searchParams: { category: params.category },
  })
  const url = `https://letmepleasure.com/call-girls/${params.city}/${params.area}/${params.category}`

  return {
    ...base,
    title: `${category.name} — ${base.title ?? ''}`,
    alternates: { canonical: url },
  }
}

export default function AreaCategoryPage({ params }: Props) {
  if (!getCategoryBySlug(params.category)) notFound()

  return AreaPage({
    params: { city: params.city, area: params.area },
    searchParams: { category: params.category },
  })
}
