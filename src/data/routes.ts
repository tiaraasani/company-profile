/**
 * Single source of truth for the site's pages. Used by the header and footer navigation,
 * by `useSeo` for per-route titles, by the sitemap, and by scripts/prerender.mjs to decide
 * which URLs get static HTML at build time. The menu order follows suitmedia.com.
 */
export interface RouteMeta {
  path: string
  /** Link text in the footer; omit to keep the page out of every menu. */
  label?: string
  /** Also show in the header navigation (the footer lists every labelled page). */
  inNav?: boolean
  title: string
  description: string
  /** Render this URL to static HTML at build time. */
  prerender: boolean
  /** Include in sitemap.xml. */
  indexable: boolean
}

export const routes: RouteMeta[] = [
  {
    path: '/',
    title: 'Suitmedia | Digital Agency in Indonesia',
    description:
      'Suitmedia is a leading Indonesian digital agency, driving proven results in technology and marketing for enterprise clients.',
    prerender: true,
    indexable: true,
  },
  {
    path: '/services',
    label: 'Expertises',
    inNav: true,
    title: 'Expertises | Suitmedia',
    description:
      'Strategy, creative, technology and communication: sixteen services delivered end to end by one team, with engagement models for each.',
    prerender: true,
    indexable: true,
  },
  {
    path: '/blog',
    label: 'Insights',
    inNav: true,
    title: 'Insights | Suitmedia',
    description:
      'Articles on digital strategy, design and engineering from the Suitmedia team.',
    prerender: true,
    indexable: true,
  },
  {
    path: '/about',
    label: 'About',
    inNav: true,
    title: 'About Us | Suitmedia',
    description:
      'Our values, our approach, the journey since 2009, answers to common questions and the people behind the work.',
    prerender: true,
    indexable: true,
  },
  {
    path: '/teams',
    label: 'Team',
    inNav: true,
    title: 'Our Team | Suitmedia',
    description:
      'Meet the strategists, engineers, designers and analysts who deliver our digital projects.',
    prerender: true,
    indexable: true,
  },
  {
    path: '/blog/new',
    label: 'Write a post',
    title: 'Write a post | Suitmedia',
    description: 'Publish a new article. Signing in is required.',
    prerender: false,
    indexable: false,
  },
  {
    path: '/login',
    title: 'Log in | Suitmedia',
    description: 'Sign in to write and manage blog posts.',
    prerender: true,
    indexable: false,
  },
]

/** Items in the header menu, in order. */
export const navRoutes = routes.filter((route) => route.label && route.inNav)

/** Every page with a label, for the footer. */
export const footerRoutes = routes.filter((route) => route.label)

export const prerenderRoutes = routes.filter((route) => route.prerender).map((r) => r.path)

export const sitemapRoutes = routes.filter((route) => route.indexable).map((r) => r.path)

export function findRoute(path: string): RouteMeta | undefined {
  return routes.find((route) => route.path === path)
}
