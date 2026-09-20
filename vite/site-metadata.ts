import type { HtmlTagDescriptor, Plugin } from 'vite'
// Explicit extension so the file also loads under Vite's native config loader.
import { sitemapRoutes } from '../src/data/routes.ts'

/**
 * URL-dependent SEO output driven by VITE_SITE_URL (set it in .env / Vercel):
 * absolute og:image, canonical and og:url, robots.txt with a Sitemap line, and a
 * sitemap.xml listing the public routes. Nothing here hard-codes a domain.
 */
export function siteMetadata(siteUrl: string): Plugin {
  const absolute = (pathname: string) => (siteUrl ? `${siteUrl}${pathname}` : pathname)

  return {
    name: 'site-metadata',
    transformIndexHtml() {
      const tags: HtmlTagDescriptor[] = [
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: absolute('/og-image.png') },
          injectTo: 'head',
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:image', content: absolute('/og-image.png') },
          injectTo: 'head',
        },
      ]
      if (siteUrl) {
        tags.push(
          { tag: 'link', attrs: { rel: 'canonical', href: `${siteUrl}/` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: `${siteUrl}/` }, injectTo: 'head' },
        )
      }
      return tags
    },
    generateBundle() {
      const robots = [
        'User-agent: *',
        'Allow: /',
        ...(siteUrl ? [`Sitemap: ${siteUrl}/sitemap.xml`] : []),
        '',
      ].join('\n')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })

      if (siteUrl) {
        const lastmod = new Date().toISOString().slice(0, 10)
        const sitemap = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...sitemapRoutes.map(
            (route) =>
              `  <url><loc>${siteUrl}${route === '/' ? '/' : route}</loc><lastmod>${lastmod}</lastmod></url>`,
          ),
          '</urlset>',
          '',
        ].join('\n')
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
      }
    },
  }
}
