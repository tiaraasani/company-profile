import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

/**
 * Small async-resource store used by the data pages (team, blog).
 * - Entries live in memory and, optionally, in sessionStorage so navigating back is instant.
 * - Reads go through useSyncExternalStore. The server snapshot is "loading" unless the
 *   resource was primed (build-time prerender embeds the data as JSON, and main.tsx primes
 *   it again before hydrating), so server and client always render the same markup.
 * - Fetching happens in an effect and writes back into the store (no setState in effects).
 */
export type ResourceStatus = 'loading' | 'success' | 'error'

export interface ResourceEntry<T> {
  status: ResourceStatus
  data: T | null
  error: string | null
}

const LOADING: ResourceEntry<never> = { status: 'loading', data: null, error: null }

const entries = new Map<string, ResourceEntry<unknown>>()
const primed = new Map<string, ResourceEntry<unknown>>()
const listeners = new Map<string, Set<() => void>>()

/** Seeds resources with data that was fetched at build time. */
export function primeResources(resources: Record<string, unknown>) {
  for (const [key, data] of Object.entries(resources)) {
    const entry: ResourceEntry<unknown> = { status: 'success', data, error: null }
    primed.set(key, entry)
    entries.set(key, entry)
  }
}

/** Server only: forget everything between two prerendered pages. */
export function resetResources() {
  primed.clear()
  entries.clear()
}

function readSession<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeSession(key: string, data: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data))
  } catch {
    // Storage full or unavailable: the in-memory copy still works for this page.
  }
}

function getEntry<T>(key: string, cache: boolean): ResourceEntry<T> {
  let entry = entries.get(key) as ResourceEntry<T> | undefined
  if (!entry) {
    const cached = cache ? readSession<T>(key) : null
    entry = cached
      ? { status: 'success', data: cached, error: null }
      : (LOADING as ResourceEntry<T>)
    entries.set(key, entry)
  }
  return entry
}

function setEntry<T>(key: string, entry: ResourceEntry<T>, cache: boolean) {
  entries.set(key, entry)
  primed.delete(key)
  if (cache && entry.status === 'success') writeSession(key, entry.data)
  listeners.get(key)?.forEach((listener) => listener())
}

function subscribeTo(key: string, listener: () => void) {
  if (!listeners.has(key)) listeners.set(key, new Set())
  listeners.get(key)!.add(listener)
  return () => {
    listeners.get(key)?.delete(listener)
  }
}

export interface UseResourceOptions {
  /** Persist successful results in sessionStorage under the key. */
  cache?: boolean
  /**
   * Re-fetch on every mount, keeping the current data (build-time or from an earlier visit)
   * on screen meanwhile, so posts published since then show up without a full reload.
   */
  revalidate?: boolean
}

export interface Resource<T> extends ResourceEntry<T> {
  /** Clear the entry and fetch again (used by "Try again" buttons). */
  reload: () => void
}

/**
 * `key` identifies the resource (also the sessionStorage key); `fetcher` must be stable
 * for a given key (module-level function or useMemo'd per key).
 */
export function useResource<T>(
  key: string,
  fetcher: (signal: AbortSignal) => Promise<T>,
  { cache = false, revalidate = false }: UseResourceOptions = {},
): Resource<T> {
  const [attempt, setAttempt] = useState(0)

  const subscribe = useCallback((listener: () => void) => subscribeTo(key, listener), [key])
  const entry = useSyncExternalStore(
    subscribe,
    () => getEntry<T>(key, cache),
    () => (primed.get(key) as ResourceEntry<T> | undefined) ?? (LOADING as ResourceEntry<T>),
  )

  useEffect(() => {
    const current = getEntry<T>(key, cache)
    const stale = revalidate && current.status === 'success'
    if (current.status !== 'loading' && !stale) return

    const controller = new AbortController()
    fetcher(controller.signal)
      .then((data) => setEntry<T>(key, { status: 'success', data, error: null }, cache))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        // A failed revalidation keeps the build-time data on screen.
        if (stale) return
        const message = error instanceof Error ? error.message : 'Request failed'
        setEntry<T>(key, { status: 'error', data: null, error: message }, cache)
      })
    return () => controller.abort()
  }, [key, fetcher, cache, revalidate, attempt])

  const reload = useCallback(() => {
    try {
      sessionStorage.removeItem(key)
    } catch {
      // ignore
    }
    setEntry<T>(key, LOADING as ResourceEntry<T>, false)
    setAttempt((value) => value + 1)
  }, [key])

  return { ...entry, reload }
}
