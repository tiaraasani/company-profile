import { useSyncExternalStore } from 'react'
import type { AuthUser } from './authApi'

export const AUTH_STORAGE_KEY = 'cp:auth'

/** What survives a reload: the token plus the few user fields the header shows. Never the password. */
export interface StoredSession {
  token: string
  user: AuthUser
  savedAt: number
}

/* External store so prerendered pages hydrate with "no session" (the server snapshot)
   and switch to the stored session right after, without a hydration mismatch. */

let cached: StoredSession | null | undefined
const listeners = new Set<() => void>()

function readStorage(): StoredSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StoredSession>
    if (parsed && typeof parsed.token === 'string' && parsed.user?.objectId) {
      return parsed as StoredSession
    }
    return null
  } catch {
    return null
  }
}

function getSnapshot(): StoredSession | null {
  if (cached === undefined) cached = readStorage()
  return cached
}

const getServerSnapshot = (): StoredSession | null => null

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function notify() {
  listeners.forEach((listener) => listener())
}

export function saveSession(session: StoredSession) {
  cached = session
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
  } catch {
    // Storage unavailable: the session still works until the tab is closed.
  }
  notify()
}

export function clearSession() {
  cached = null
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    // ignore
  }
  notify()
}

/** Token for the request layer (null when signed out or on the server). */
export function getStoredToken(): string | null {
  return getSnapshot()?.token ?? null
}

export function useStoredSession(): StoredSession | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
