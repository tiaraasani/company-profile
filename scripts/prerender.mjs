// Renders every static route, plus every published blog post, to its own HTML file so
// browsers paint before React loads. Runs as the last step of `npm run build`:
//   vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && node scripts/prerender.mjs
//
// Output:
//   dist/index.html              prerendered "/"
//   dist/about/index.html        prerendered "/about", and so on
//   dist/blog/<slug>/index.html  prerendered articles (data fetched from Backendless at build time)
//   dist/app.html                empty shell that vercel.json rewrites unmatched URLs to
//                                (articles published after the build, 404s) -> client render
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(import.meta.dirname, '..')
const distDir = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')
const MARKER = '<div id="root"></div>'
const CLIENT_RENDER_MARKER = '<!--$!'
const POSTS_PER_PAGE = 12

const { prerenderRoutes } = await import(
  pathToFileURL(path.join(root, 'src', 'data', 'routes.ts')).href
)
const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

/* ---- Backendless data for the blog pages -------------------------------------------- */

async function loadEnvFiles() {
  for (const file of ['.env.local', '.env']) {
    let text
    try {
      text = await readFile(path.join(root, file), 'utf8')
    } catch {
      continue
    }
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^\s*([\w.]+)\s*=\s*(.*?)\s*$/)
      if (match && !(match[1] in process.env)) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
      }
    }
  }
}

/** Same mapping as src/features/blog/blogApi.ts (kept in plain JS for the build). */
function toPost(row) {
  return {
    objectId: row.objectId,
    title: (row.title ?? '').trim(),
    slug: (row.slug ?? '').trim(),
    excerpt: (row.excerpt ?? '').trim(),
    content: row.content ?? '',
    tags: (row.tags ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    authorName: (row.authorName ?? '').trim() || 'Suitmedia',
    created: row.created ?? 0,
    ownerId: row.ownerId ?? null,
  }
}

async function fetchPublishedPosts() {
  await loadEnvFiles()
  const base = (process.env.VITE_BACKENDLESS_API_URL ?? '').trim().replace(/\/+$/, '')
  if (!base) {
    console.log('prerender: VITE_BACKENDLESS_API_URL not set, blog pages will render on the client')
    return []
  }
  try {
    const response = await fetch(
      `${base}/data/Blog?where=published%3Dtrue&sortBy=created%20desc&pageSize=100`,
    )
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const rows = await response.json()
    return rows.map(toPost).filter((post) => post.slug && post.title)
  } catch (error) {
    console.warn(`prerender: could not load blog posts (${error.message}); rendering them on the client`)
    return []
  }
}

/* ---- HTML assembly ------------------------------------------------------------------- */

const template = await readFile(path.join(distDir, 'index.html'), 'utf8')
if (!template.includes(MARKER)) {
  throw new Error('dist/index.html has no empty <div id="root"></div> to prerender into')
}

/** JSON that is safe inside a <script> element. */
const embedJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c')

function page(routePath, markup, resources) {
  const data =
    resources && Object.keys(resources).length > 0
      ? `<script id="__RESOURCES__" type="application/json">${embedJson(resources)}</script>`
      : ''
  return template.replace(MARKER, `${data}<div id="root" data-path="${routePath}">${markup}</div>`)
}

/** React.lazy routes suspend on the first pass; render again until every boundary resolves. */
async function renderResolved(url, resources) {
  let html = render(url, resources)
  for (let attempt = 0; attempt < 12 && html.includes(CLIENT_RENDER_MARKER); attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    html = render(url, resources)
  }
  if (html.includes(CLIENT_RENDER_MARKER)) {
    throw new Error(`Suspense boundaries did not resolve while prerendering ${url}`)
  }
  return html
}

async function writePage(routePath, resources) {
  const markup = await renderResolved(routePath, resources)
  const outFile =
    routePath === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, ...routePath.slice(1).split('/'), 'index.html')
  await mkdir(path.dirname(outFile), { recursive: true })
  await writeFile(outFile, page(routePath, markup, resources))
  console.log(
    `prerendered ${routePath.padEnd(40)} -> ${path.relative(root, outFile)} (${(markup.length / 1024).toFixed(1)} kB)`,
  )
}

// Client-only shell first, while dist/index.html is still the untouched template.
await writeFile(path.join(distDir, 'app.html'), page('', '', null))

const posts = await fetchPublishedPosts()
const listResources = { 'cp:posts:all': posts.slice(0, POSTS_PER_PAGE).map(({ content: _, ...rest }) => rest) }

for (const routePath of prerenderRoutes) {
  await writePage(routePath, routePath === '/blog' ? listResources : {})
}
for (const post of posts) {
  await writePage(`/blog/${post.slug}`, { [`cp:post:${post.slug}`]: post })
}

await rm(ssrDir, { recursive: true, force: true })
