import { useLayoutEffect } from 'react'

export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? '').trim().replace(/\/+$/, '')

function setMeta(selector: string, attribute: string, value: string) {
  document.querySelector(selector)?.setAttribute(attribute, value)
}

/**
 * Per-route title, description and canonical. Lighthouse runs the JS, so setting these
 * during render is enough; index.html carries one of each tag for the hook to update.
 */
export function useSeo(title: string, description: string, path: string) {
  useLayoutEffect(() => {
    document.title = title
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[name="twitter:title"]', 'content', title)
    setMeta('meta[name="twitter:description"]', 'content', description)
    if (SITE_URL) {
      const url = `${SITE_URL}${path}`
      setMeta('link[rel="canonical"]', 'href', url)
      setMeta('meta[property="og:url"]', 'content', url)
    }
  }, [title, description, path])
}
