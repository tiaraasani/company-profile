import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from '@/App'
import { ThemeProvider } from '@/context/ThemeProvider'

/**
 * Build-time prerender entry (see scripts/prerender.mjs). Each URL is rendered to static
 * HTML; the client hydrates it when the path matches, otherwise it renders from scratch.
 */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <ThemeProvider>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </ThemeProvider>
    </StrictMode>,
  )
}
