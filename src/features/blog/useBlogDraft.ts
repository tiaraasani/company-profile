import { useEffect, useSyncExternalStore } from 'react'
import type { UseFormWatch } from 'react-hook-form'
import type { BlogFormInput } from './blogSchema'

export const BLOG_DRAFT_KEY = 'cp:blog-draft'
const SAVE_DELAY_MS = 500
const DRAFT_FIELDS = ['title', 'excerpt', 'content', 'tags'] as const

export interface BlogDraft {
  values: BlogFormInput
  savedAt: number
}

/* External store for the restored draft (hydration-safe: the server snapshot is null). */
let cached: BlogDraft | null | undefined
const listeners = new Set<() => void>()

function readDraft(): BlogDraft | null {
  try {
    const raw = localStorage.getItem(BLOG_DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<BlogDraft>
    if (!parsed?.values || typeof parsed.values !== 'object') return null
    return { values: parsed.values, savedAt: parsed.savedAt ?? Date.now() }
  } catch {
    return null
  }
}

function getSnapshot(): BlogDraft | null {
  if (cached === undefined) cached = readDraft()
  return cached
}

const getServerSnapshot = (): BlogDraft | null => null

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useStoredBlogDraft(): BlogDraft | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function clearBlogDraft() {
  try {
    localStorage.removeItem(BLOG_DRAFT_KEY)
  } catch {
    // ignore
  }
  if (cached !== null) {
    cached = null
    listeners.forEach((listener) => listener())
  }
}

function hasContent(values: Partial<BlogFormInput>): boolean {
  return DRAFT_FIELDS.some((key) => (values[key] ?? '').trim().length > 0)
}

/** Saves the editor fields to localStorage (debounced) so a reload never loses a post in progress. */
export function useBlogDraftAutosave(watch: UseFormWatch<BlogFormInput>) {
  useEffect(() => {
    let timer: number | undefined

    const subscription = watch((values) => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        const draft: BlogFormInput = {
          title: values.title ?? '',
          excerpt: values.excerpt ?? '',
          content: values.content ?? '',
          tags: values.tags ?? '',
        }
        try {
          if (hasContent(draft)) {
            localStorage.setItem(
              BLOG_DRAFT_KEY,
              JSON.stringify({ values: draft, savedAt: Date.now() } satisfies BlogDraft),
            )
          } else {
            localStorage.removeItem(BLOG_DRAFT_KEY)
          }
        } catch {
          // Ignore storage failures.
        }
      }, SAVE_DELAY_MS)
    })

    return () => {
      window.clearTimeout(timer)
      subscription.unsubscribe()
    }
  }, [watch])
}
