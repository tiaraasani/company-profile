import { readFileSync } from 'node:fs'
import path from 'node:path'

/**
 * Response headers from vercel.json, applied to `vite preview` too, so a local Lighthouse
 * run sees the production headers (the Content-Security-Policy in particular).
 */
export function vercelHeaders(): Record<string, string> {
  const config = JSON.parse(readFileSync(path.resolve(import.meta.dirname, '..', 'vercel.json'), 'utf8')) as {
    headers?: { source: string; headers: { key: string; value: string }[] }[]
  }
  const block = config.headers?.find((entry) => entry.source === '/(.*)')
  return Object.fromEntries((block?.headers ?? []).map((header) => [header.key, header.value]))
}
