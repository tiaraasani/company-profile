import { createReadStream, existsSync } from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

/**
 * Makes `vite preview` behave like Vercel: prerendered pages are served from their own
 * folder (about/index.html) and every other extensionless URL gets the client-only shell
 * app.html, exactly what vercel.json rewrites to. Without this the preview would serve the
 * prerendered Home markup for every path and the client would re-render on top of it.
 */
export function previewFallback(): Plugin {
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
