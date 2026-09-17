import { useMemo, type ReactNode } from 'react'
import { ThemeContext, setThemeValue, toggleThemeValue, useThemeValue } from './theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Backed by an external store (localStorage + <html class="dark">); see theme.ts.
  const theme = useThemeValue()

  const value = useMemo(
    () => ({ theme, setTheme: setThemeValue, toggleTheme: toggleThemeValue }),
    [theme],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}
