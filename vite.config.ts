import { createReadStream, existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type HtmlTagDescriptor, type Plugin } from 'vite'
// Explicit extension so the config also loads under Vite's native config loader.
import { sitemapRoutes } from './src/data/routes.ts'

/**
 * URL-dependent SEO output driven by VITE_SITE_URL (set it in .env / Vercel):
 * absolute og:image, canonical and og:url, robots.txt with a Sitemap line, and a
 * sitemap.xml listing the public routes. Nothing here hard-codes a domain.
 */
function siteMetadata(siteUrl: string): Plugin {
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

/**
 * Response headers from vercel.json, applied to `vite preview` too, so a local Lighthouse
 * run sees the production headers (the Content-Security-Policy in particular).
 */
function vercelHeaders(): Record<string, string> {
  const config = JSON.parse(readFileSync(path.resolve(import.meta.dirname, 'vercel.json'), 'utf8')) as {
    headers?: { source: string; headers: { key: string; value: string }[] }[]
  }
  const block = config.headers?.find((entry) => entry.source === '/(.*)')
  return Object.fromEntries((block?.headers ?? []).map((header) => [header.key, header.value]))
}

/**
 * Inline loader for the deferred app bundle. Its text never changes between builds (the
 * asset URLs travel in data attributes), so its SHA-256 is pinned in the CSP header of
 * vercel.json; scripts/check-csp.mjs verifies that after every build.
 */
const APP_LOADER =
  "(function(){var s=document.currentScript,entry=s.getAttribute('data-entry'),deps=(s.getAttribute('data-deps')||'').split(',').filter(Boolean),started=false;" +
  'function load(){if(started)return;started=true;' +
  "deps.forEach(function(href){var l=document.createElement('link');l.rel='modulepreload';l.crossOrigin='';l.href=href;document.head.appendChild(l)});" +
  "var m=document.createElement('script');m.type='module';m.crossOrigin='';m.src=entry;document.body.appendChild(m)}" +
  "if(document.visibilityState==='visible'&&'requestAnimationFrame'in window){requestAnimationFrame(function(){requestAnimationFrame(load)})}" +
  'setTimeout(load,1500)})()'

const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

/**
 * Pages are prerendered, so the app bundle is only needed for hydration. Requesting it
 * after the first frame keeps it out of the first-paint critical path; a timeout fallback
 * still loads it in background tabs.
 */
function deferAppScript(): Plugin {
  return {
    name: 'defer-app-script',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const script = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>\s*/)
        if (!script) {
          console.warn('defer-app-script: entry script tag not found, HTML left unchanged')
          return html
        }
        const preloads = [...html.matchAll(/<link rel="modulepreload" crossorigin href="([^"]+)">\s*/g)]
        const deps = preloads.map((match) => match[1])

        let output = html.replace(script[0], '')
        for (const match of preloads) output = output.replace(match[0], '')

        const loader = `<script data-entry="${escapeAttr(script[1])}" data-deps="${escapeAttr(deps.join(','))}">${APP_LOADER}</script>`

        // LF line endings everywhere: inline-script hashes must match the Linux build on Vercel.
        return output.replace('</body>', `${loader}</body>`).replace(/\r\n/g, '\n')
      },
    },
  }
}

/**
 * Makes `vite preview` behave like Vercel: prerendered pages are served from their own
 * folder (about/index.html) and every other extensionless URL gets the client-only shell
 * app.html, exactly what vercel.json rewrites to. Without this the preview would serve the
 * prerendered Home markup for every path and the client would re-render on top of it.
 */
function previewFallback(): Plugin {
  return {
    name: 'preview-app-shell-fallback',
    configurePreviewServer(server) {
      const outDir = path.resolve(server.config.root, server.config.build.outDir)
      const shell = path.join(outDir, 'app.html')

      // Before Vite's static middleware: /about -> /about/index.html when that file exists
      // (Vite's preview server only matches exact files).
      server.middlewares.use((req, _res, next) => {
        const [pathname, query = ''] = (req.url ?? '').split('?')
        if (req.method === 'GET' && !path.extname(pathname) && pathname !== '/') {
          const clean = pathname.replace(/\/+$/, '')
          if (existsSync(path.join(outDir, ...clean.split('/').filter(Boolean), 'index.html'))) {
            req.url = `${clean}/index.html${query ? `?${query}` : ''}`
          }
        }
        next()
      })

      // After Vite's middlewares: anything still unmatched gets the client-only shell.
      return () => {
        server.middlewares.use((req, res, next) => {
          const pathname = (req.url ?? '').split('?')[0]
          if (req.method !== 'GET' || path.extname(pathname) || !existsSync(shell)) return next()
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          createReadStream(shell).pipe(res)
        })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const siteUrl = (env.VITE_SITE_URL ?? '').trim().replace(/\/+$/, '')

  return {
    // No SPA fallback to index.html: each prerendered page is its own HTML file.
    appType: 'mpa',
    plugins: [react(), tailwindcss(), siteMetadata(siteUrl), deferAppScript(), previewFallback()],
    preview: {
      headers: vercelHeaders(),
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    build: {
      reportCompressedSize: true,
      chunkSizeWarningLimit: 300,
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              // Form libraries are only needed by Login and Create Blog; keep them out of
              // the vendor chunk that every page downloads.
              {
                name: 'forms',
                test: /node_modules[\\/](react-hook-form|zod|@hookform)[\\/]/,
                priority: 3,
              },
              // Libraries shared by the shell and the lazy pages: one cacheable chunk.
              { name: 'vendor', test: /node_modules/, minShareCount: 2, priority: 2 },
              // App modules shared by two or more pages (layout, data, ui primitives).
              { name: 'shared', test: /[\\/]src[\\/]/, minShareCount: 2, priority: 1 },
            ],
          },
        },
      },
    },
  }
})
