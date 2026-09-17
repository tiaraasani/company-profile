import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from '@/App'
import { ThemeProvider } from '@/context/ThemeProvider'

const container = document.getElementById('root')!

const app = (
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)

// Pages that were prerendered carry the URL they were built for. Hydrate only when it
// matches the current path; otherwise (a blog article, an unknown URL) render fresh,
// which avoids a hydration mismatch and the console errors that come with it.
const prerenderedPath = container.dataset.path
const currentPath = window.location.pathname.replace(/(.)\/+$/, '$1') // "/about/" -> "/about"
if (prerenderedPath && prerenderedPath === currentPath) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
