export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // drop non-alphanumerics
    .replace(/\s+/g, '-') // spaces to hyphens
    .replace(/-+/g, '-') // collapse repeats
    .replace(/^-|-$/g, '') // trim hyphens
    .slice(0, 80)
}
