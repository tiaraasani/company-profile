/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backendless REST base, e.g. https://<subdomain>.backendless.app/api. Empty = not configured. */
  readonly VITE_BACKENDLESS_API_URL?: string
  /** Production URL used for canonical and Open Graph tags. */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
