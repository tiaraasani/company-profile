import { LIST_PROPS, PAGE_SIZE, toPost, type BlogRow } from './blogRow'
import type { BlogPost, BlogPostInput } from './blogTypes'
import { isValidSlug, isValidTag } from './slugify'
import { BackendlessError, NetworkError, query, quote, request } from '@/lib/backendless'

/* Backendless `Blog` table. `published` hides drafts from the public list; the row shape and
   mapper live in blogRow.ts so the build script can use the same ones. */

export interface FetchPostsOptions {
  tag?: string
  signal?: AbortSignal
}

/** Newest first, first page only; `content` is left out to keep the list light. */
export async function fetchPosts({ tag, signal }: FetchPostsOptions = {}): Promise<BlogPost[]> {
  // The tag comes from the URL: anything outside the tag alphabet (which has no LIKE
  // wildcards and no quotes) cannot match a real tag, so answer without a request.
  if (tag !== undefined && !isValidTag(tag)) return []
  const where = tag
    ? `published=true AND tags LIKE ${quote(`%,${tag},%`)}`
    : 'published=true'
  const rows = await request<BlogRow[]>(
    `/data/Blog${query({ where, sortBy: 'created desc', pageSize: PAGE_SIZE, props: LIST_PROPS })}`,
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

/** Visitor-facing text for a failed createPost(); server messages are never shown as-is. */
export function messageForPublishError(error: unknown): string {
  if (error instanceof NetworkError) {
    return "We couldn't reach the server. Your draft is kept; check your connection and try again."
  }
  if (error instanceof BackendlessError) {
    if (error.status === 413) {
      return 'The post is longer than the Blog table currently allows. In the Backendless console, change the `content` column type to TEXT (Data > Blog > Schema), then try again.'
    }
    if (error.status === 401 || error.status === 403) {
      return 'You are not allowed to publish. Sign in again and retry.'
    }
  }
  // The draft is kept so nothing is lost.
  return 'Publishing failed. Please try again.'
}

export function postCacheKey(slug: string): string {
  return `cp:post:${slug}`
}

export function postsCacheKey(tag?: string): string {
  return tag ? `cp:posts:tag:${tag}` : 'cp:posts:all'
}
