import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from '@/App'
import { ThemeProvider } from '@/context/ThemeProvider'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { primeResources, resetResources } from '@/lib/resource'

/**
 * Build-time prerender entry (see scripts/prerender.mjs). Each URL is rendered to static
 * HTML; `resources` seeds the data store (blog posts fetched at build time) and the same
 * JSON is embedded in the page so the client hydrates against identical markup.
 */
export function render(url: string, resources: Record<string, unknown> = {}): string {
  resetResources()
  primeResources(resources)

  return renderToString(
    <StrictMode>
      <ThemeProvider>
        <AuthProvider>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </AuthProvider>
      </ThemeProvider>
    </StrictMode>,
  )
}
