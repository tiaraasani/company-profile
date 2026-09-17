import { createContext, useContext, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

/** localStorage key; also read by the pre-paint script in index.html. */
export const THEME_STORAGE_KEY = 'cp:theme'

/** The company site is designed light-first; dark is an explicit user choice. */
export const DEFAULT_THEME: Theme = 'light'

const THEME_COLOR: Record<Theme, string> = {
  light: '#f8fafc',
  dark: '#0b1220',
}

export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used inside <ThemeProvider>')
  }
  return context
}

/* External store so prerendered HTML hydrates with the default and then re-renders
   with the visitor's stored choice, without a hydration mismatch. */

let currentTheme: Theme | null = null
const listeners = new Set<() => void>()

export function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage can be unavailable (privacy mode); fall back to the default.
  }
  return DEFAULT_THEME
}

function getSnapshot(): Theme {
  if (currentTheme === null) currentTheme = readStoredTheme()
  return currentTheme
}

const getServerSnapshot = (): Theme => DEFAULT_THEME

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Ignore: the theme still applies for this session.
  }
}

/** Mirrors the pre-paint script in index.html so both stay in sync. */
export function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLOR[theme])
}

export function setThemeValue(theme: Theme) {
  if (getSnapshot() === theme) return
  currentTheme = theme
  persistTheme(theme)
  applyThemeClass(theme)
  listeners.forEach((listener) => listener())
}

export function toggleThemeValue() {
  setThemeValue(getSnapshot() === 'dark' ? 'light' : 'dark')
}

export function useThemeValue(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
