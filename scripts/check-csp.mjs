// Verifies that every inline <script> in the built HTML is allowed by the Content-Security-Policy
// in vercel.json (script-src is 'self' plus one SHA-256 per inline script). Runs as the last step
// of `npm run build`; when a hash is missing it prints the value to add and fails the build, so a
// changed inline script can never ship silently blocked.
import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const distDir = path.join(root, 'dist')

async function htmlFiles(dir) {
  const files = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await htmlFiles(full)))
    else if (entry.name.endsWith('.html')) files.push(full)
  }
  return files
}

const vercel = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'))
const cspHeader = (vercel.headers ?? [])
  .flatMap((block) => block.headers)
  .find((header) => header.key.toLowerCase() === 'content-security-policy')
if (!cspHeader) {
  console.error('check-csp: vercel.json has no Content-Security-Policy header')
  process.exit(1)
}
const scriptSrc = cspHeader.value
  .split(';')
  .map((part) => part.trim())
  .find((part) => part.startsWith('script-src'))
const allowed = new Set(
  [...(scriptSrc ?? '').matchAll(/'sha256-([A-Za-z0-9+/=]+)'/g)].map((match) => match[1]),
)

// Only these types execute; data blocks (application/ld+json, application/json) never run.
const EXECUTED_TYPES = new Set(['', 'module', 'text/javascript', 'application/javascript'])
const SCRIPT_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi

const files = await htmlFiles(distDir)
const missing = new Map()
for (const file of files) {
  const html = await readFile(file, 'utf8')
  for (const match of html.matchAll(SCRIPT_RE)) {
    const [, attrs, body] = match
    if (/\ssrc=/.test(attrs)) continue
    const type = (attrs.match(/\btype=["']([^"']*)["']/)?.[1] ?? '').toLowerCase()
    if (!EXECUTED_TYPES.has(type)) continue
    const hash = createHash('sha256').update(body, 'utf8').digest('base64')
    if (!allowed.has(hash)) missing.set(hash, body.trim().replace(/\s+/g, ' ').slice(0, 70))
  }
}

if (missing.size > 0) {
  console.error('check-csp: inline script(s) not covered by the CSP in vercel.json:')
  for (const [hash, snippet] of missing) console.error(`  'sha256-${hash}'  <- ${snippet}...`)
  console.error("Add the hash(es) to the script-src directive in vercel.json (keep 'self').")
  process.exit(1)
}
console.log(
  `check-csp: ${files.length} HTML file(s) checked, inline scripts covered by ${allowed.size} hash(es)`,
)
