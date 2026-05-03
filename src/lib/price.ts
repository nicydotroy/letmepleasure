/**
 * Render a price coming out of the DB. Historically the field has been a
 * free-form string ("₹5000 - ₹15000/hour", "5000", "Negotiable", …) so we
 * cannot just `Number()` it — that produced "₹NaN" across the listing
 * cards and the detail page.
 *
 * Rules:
 * - Pure numeric strings get the Indian number-system formatter and a ₹.
 * - Strings that already include ₹ or any non-numeric character render as-is.
 * - Empty / null falls back to "Price on Request".
 */
export function formatPrice(raw: string | null | undefined): string {
  if (!raw) return 'Price on Request'
  const trimmed = raw.trim()
  if (!trimmed) return 'Price on Request'

  // Already includes a currency mark or any non-digit (range, words, slash) —
  // trust the existing string and leave it alone.
  if (/[^0-9]/.test(trimmed)) return trimmed

  const n = Number(trimmed)
  if (!Number.isFinite(n)) return trimmed
  return `₹${n.toLocaleString('en-IN')}`
}
