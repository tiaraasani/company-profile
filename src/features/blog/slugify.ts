/** Static segments under /blog that a post slug must never collide with. */
const RESERVED = new Set(['new', 'edit'])

/** Shape of a slug the app produces and accepts: lowercase words joined by single dashes. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const SLUG_MAX_LENGTH = 80

/** Shape of a tag: lowercase letters, digits and dashes, 2 to 20 characters. */
export const TAG_PATTERN = /^[a-z0-9-]{2,20}$/

export function isValidSlug(value: string): boolean {
  return value.length <= SLUG_MAX_LENGTH && SLUG_PATTERN.test(value)
}

export function isValidTag(value: string): boolean {
  return TAG_PATTERN.test(value)
}

export function slugify(input: string): string {
  const slug = input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/-+$/g, '')
  return RESERVED.has(slug) || slug.length === 0 ? `${slug || 'post'}-article` : slug
}

/** Turns "React, Vite ,ux" into ["react", "vite", "ux"]. */
export function parseTags(raw: string): string[] {
  return [...new Set(raw.split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean))]
}
