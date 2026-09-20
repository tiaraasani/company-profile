import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
// Explicit extensions so the config also loads under Vite's native config loader.
import { deferAppScript } from './vite/defer-app-script.ts'
import { previewFallback } from './vite/preview-fallback.ts'
import { siteMetadata } from './vite/site-metadata.ts'
import { vercelHeaders } from './vite/vercel-headers.ts'

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
