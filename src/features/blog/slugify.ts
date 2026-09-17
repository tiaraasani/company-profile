/** Static segments under /blog that a post slug must never collide with. */
const RESERVED = new Set(['new', 'edit'])

export function slugify(input: string): string {
  const slug = input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '')
  return RESERVED.has(slug) || slug.length === 0 ? `${slug || 'post'}-article` : slug
}

/** Turns "React, Vite ,ux" into ["react", "vite", "ux"]. */
export function parseTags(raw: string): string[] {
  return [...new Set(raw.split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean))]
}
