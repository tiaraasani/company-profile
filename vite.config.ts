import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    // Vite 8 defaults: target baseline-widely-available, sourcemap false, cssCodeSplit true.
    // Keep the gzip column in the build log as the bundle-budget check.
    reportCompressedSize: true,
    chunkSizeWarningLimit: 300,
  },
})
