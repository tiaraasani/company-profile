import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from '@/App'
import { ThemeProvider } from '@/context/ThemeProvider'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { primeResources } from '@/lib/resource'
import { preloadPage } from '@/routes/pages'

const container = document.getElementById('root')!

const app = (
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)

// Data fetched at build time (blog posts) travels with the page so hydration matches.
const embedded = document.getElementById('__RESOURCES__')?.textContent
if (embedded) {
  try {
    primeResources(JSON.parse(embedded) as Record<string, unknown>)
  } catch {
    // Malformed payload: the pages simply fetch on the client.
  }
}

// Pages that were prerendered carry the URL they were built for. Hydrate only when it
// matches the current path; otherwise (a new blog article, an unknown URL) load the page
// chunk first and render fresh, so there is no hydration mismatch and no skeleton swap.
const prerenderedPath = container.dataset.path
const currentPath = window.location.pathname.replace(/(.)\/+$/, '$1') // "/about/" -> "/about"

if (prerenderedPath && prerenderedPath === currentPath) {
  hydrateRoot(container, app)
} else {
  preloadPage(currentPath)
    .catch(() => {
      // The chunk failed to preload; the lazy boundary will retry when rendering.
    })
    .then(() => {
      createRoot(container).render(app)
    })
}
