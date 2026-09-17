import { getStoredToken } from '@/features/auth/authStorage'
import { lazyWithPreload } from '@/lib/lazyWithPreload'

/**
 * Lazily loaded pages, shared by App.tsx (rendering) and main.tsx (preloading the page
 * that a client-only URL needs before the first render). Home is imported eagerly in App.
 */
export const pages = {
  about: lazyWithPreload(() => import('@/routes/AboutPage')),
  services: lazyWithPreload(() => import('@/routes/ServicesPage')),
  teams: lazyWithPreload(() => import('@/routes/TeamPage')),
  blogList: lazyWithPreload(() => import('@/routes/BlogListPage')),
  blogDetail: lazyWithPreload(() => import('@/routes/BlogDetailPage')),
  createBlog: lazyWithPreload(() => import('@/routes/CreateBlogPage')),
  login: lazyWithPreload(() => import('@/routes/LoginPage')),
  notFound: lazyWithPreload(() => import('@/routes/NotFoundPage')),
}

/** Picks the page chunk for a pathname (mirrors the routes in App.tsx). */
export function preloadPage(pathname: string): Promise<void> {
  const path = pathname.replace(/(.)\/+$/, '$1')
  if (path === '/about') return pages.about.preload()
  if (path === '/services') return pages.services.preload()
  if (path === '/teams') return pages.teams.preload()
  if (path === '/blog') return pages.blogList.preload()
  // Without a stored session the editor redirects to /login, so that is the chunk to warm.
  if (path === '/blog/new') return getStoredToken() ? pages.createBlog.preload() : pages.login.preload()
  if (path.startsWith('/blog/')) return pages.blogDetail.preload()
  if (path === '/login') return pages.login.preload()
  if (path === '/') return Promise.resolve()
  return pages.notFound.preload()
}
