import type { BlogPost, BlogPostInput } from './blogTypes'
import { isValidSlug, isValidTag } from './slugify'
import { query, quote, request } from '@/lib/backendless'

/**
 * Backendless `Blog` table. Tags are stored as ",tag-one,tag-two," so a LIKE '%,tag,%'
 * filter matches whole tags only. `published` hides drafts from the public list.
 */
export const PAGE_SIZE = 12
const LIST_PROPS = 'objectId,title,slug,excerpt,authorName,tags,created,ownerId'

interface BlogRow {
  objectId: string
  title?: string | null
  slug?: string | null
  excerpt?: string | null
  content?: string | null
  tags?: string | null
  authorName?: string | null
  created?: number | null
  ownerId?: string | null
}

function toPost(row: BlogRow): BlogPost {
  return {
    objectId: row.objectId,
    title: (row.title ?? '').trim(),
    slug: (row.slug ?? '').trim(),
    excerpt: (row.excerpt ?? '').trim(),
    content: row.content ?? '',
    tags: (row.tags ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    authorName: (row.authorName ?? '').trim() || 'Suitmedia',
    created: row.created ?? 0,
    ownerId: row.ownerId ?? null,
  }
}

export interface FetchPostsOptions {
  tag?: string
  offset?: number
  signal?: AbortSignal
}

/** Newest first; `content` is left out to keep the list light. */
export async function fetchPosts({ tag, offset = 0, signal }: FetchPostsOptions = {}): Promise<BlogPost[]> {
  // The tag comes from the URL: anything outside the tag alphabet (which has no LIKE
  // wildcards and no quotes) cannot match a real tag, so answer without a request.
  if (tag !== undefined && !isValidTag(tag)) return []
  const where = tag
    ? `published=true AND tags LIKE ${quote(`%,${tag},%`)}`
    : 'published=true'
  const rows = await request<BlogRow[]>(
    `/data/Blog${query({ where, sortBy: 'created desc', pageSize: PAGE_SIZE, offset, props: LIST_PROPS })}`,
    { signal, withAuth: false },
  )
  return rows.filter((row) => row.slug && row.title).map(toPost)
}

export async function fetchPostBySlug(slug: string, signal?: AbortSignal): Promise<BlogPost | null> {
  // The slug comes from the URL; the app never creates one outside SLUG_PATTERN.
  if (!isValidSlug(slug)) return null
  const rows = await request<BlogRow[]>(
    `/data/Blog${query({ where: `published=true AND slug=${quote(slug)}`, pageSize: 1 })}`,
    { signal, withAuth: false },
  )
  return rows[0] ? toPost(rows[0]) : null
}

/** Slugs of every published post (used by the build to prerender article pages). */
export async function fetchPublishedSlugs(signal?: AbortSignal): Promise<string[]> {
  const rows = await request<BlogRow[]>(
    `/data/Blog${query({ where: 'published=true', props: 'slug', pageSize: 100 })}`,
    { signal, withAuth: false },
  )
  return rows.map((row) => row.slug ?? '').filter(Boolean)
}

async function slugExists(slug: string): Promise<boolean> {
  const count = await request<number>(
    `/data/Blog/count${query({ where: `slug=${quote(slug)}` })}`,
    { withAuth: false },
  )
  return count > 0
}

/** Appends -2, -3, ... until the slug is free (the Unique constraint is the last guard). */
export async function uniqueSlug(base: string): Promise<string> {
  if (!(await slugExists(base))) return base
  for (let n = 2; n <= 20; n++) {
    const candidate = `${base}-${n}`
    if (!(await slugExists(candidate))) return candidate
  }
  return `${base}-${Date.now().toString(36)}`
}

/** POST /data/Blog with the user token so Backendless sets ownerId. */
export async function createPost(input: BlogPostInput): Promise<BlogPost> {
  const row = await request<BlogRow>('/data/Blog', {
    method: 'POST',
    body: {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      tags: input.tags.length > 0 ? `,${input.tags.join(',')},` : '',
      authorName: input.authorName,
      published: true,
    },
  })
  return toPost(row)
}

export function postCacheKey(slug: string): string {
  return `cp:post:${slug}`
}

export function postsCacheKey(tag?: string): string {
  return tag ? `cp:posts:tag:${tag}` : 'cp:posts:all'
}
