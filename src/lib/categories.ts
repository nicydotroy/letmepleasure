export interface Category {
  name: string
  slug: string
  icon: string
  color: string
}

export const CATEGORIES: Category[] = [
  { name: 'Female Escorts', slug: 'female-escorts', icon: '👩', color: 'bg-pink-100 text-pink-700' },
  { name: 'Male Escorts', slug: 'male-escorts', icon: '👨', color: 'bg-pink-100 text-pink-700' },
  { name: 'Call Girls', slug: 'call-girls', icon: '📞', color: 'bg-rose-100 text-rose-700' },
  { name: 'Female Massage', slug: 'female-massage', icon: '💆‍♀️', color: 'bg-purple-100 text-purple-700' },
  { name: 'Male Massage', slug: 'male-massage', icon: '💆‍♂️', color: 'bg-pink-100 text-pink-700' },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}
