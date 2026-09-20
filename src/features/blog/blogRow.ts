import type { BlogPost } from './blogTypes'

/*
 * Shape of a `Blog` table row as the Backendless REST API returns it, and the mapper to
 * the app's BlogPost. Shared by the app (blogApi.ts) and the build (scripts/prerender.mjs,
 * which Node loads directly), so there is one definition to keep in sync.
 * This module must stay free of runtime imports: Node resolves the file itself.
 */

/** Posts per list page; also how many posts the prerendered /blog embeds. */
export const PAGE_SIZE = 12

/** Columns fetched for the list; `content` is left out to keep the list light. */
export const LIST_PROPS = 'objectId,title,slug,excerpt,authorName,tags,created,ownerId'

export interface BlogRow {
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

/** Tags are stored as ",tag-one,tag-two," so a LIKE '%,tag,%' filter matches whole tags only. */
export function toPost(row: BlogRow): BlogPost {
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
