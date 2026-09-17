/**
 * Single source of truth for the site's pages. Used by the header and footer navigation,
 * by `useSeo` for per-route titles, by the sitemap, and by scripts/prerender.mjs to decide
 * which URLs get static HTML at build time.
 */
export interface RouteMeta {
  path: string
  /** Label in the navigation; omit to keep the page out of the menus. */
  label?: string
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
    label: 'Home',
    title: 'Suitmedia | Digital Agency in Indonesia',
    description:
      'Suitmedia is an Indonesian digital agency delivering strategy, creative, technology and communication for enterprise clients.',
    prerender: true,
    indexable: true,
  },
  {
    path: '/about',
    label: 'About Us',
    title: 'About Us | Suitmedia',
    description:
      'Our story since 2009, the milestones along the way, the people behind the work and the culture that holds it together.',
    prerender: true,
    indexable: true,
  },
  {
    path: '/services',
    label: 'Services',
    title: 'Services | Suitmedia',
    description:
      'Strategy, creative, technology and communication services, with engagement models and pricing guidance for each.',
    prerender: true,
    indexable: true,
  },
  {
    path: '/teams',
    label: 'Teams',
    title: 'Our Team | Suitmedia',
    description:
      'Meet the strategists, engineers, designers and analysts who deliver our digital projects.',
    prerender: true,
    indexable: true,
  },
  {
    path: '/blog',
    label: 'Blog',
    title: 'Blog | Suitmedia',
    description:
      'Insights on digital strategy, design and engineering from the Suitmedia team.',
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
    label: undefined,
    title: 'Log in | Suitmedia',
    description: 'Sign in to write and manage blog posts.',
    prerender: true,
    indexable: false,
  },
]

/** Items shown in the header and footer menus, in order. */
export const navRoutes = routes.filter((route) => route.label)

export const prerenderRoutes = routes.filter((route) => route.prerender).map((r) => r.path)

export const sitemapRoutes = routes.filter((route) => route.indexable).map((r) => r.path)

export function findRoute(path: string): RouteMeta | undefined {
  return routes.find((route) => route.path === path)
}
