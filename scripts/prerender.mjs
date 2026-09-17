// Renders every static route to its own HTML file so browsers paint before React loads.
// Runs as the last step of `npm run build`:
//   vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && node scripts/prerender.mjs
//
// Output:
//   dist/index.html        prerendered "/"
//   dist/about/index.html  prerendered "/about", and so on
//   dist/app.html          empty shell that vercel.json rewrites unmatched URLs to
//                          (blog articles and 404s render on the client)
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(import.meta.dirname, '..')
const distDir = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')
const MARKER = '<div id="root"></div>'
const CLIENT_RENDER_MARKER = '<!--$!'

const { prerenderRoutes } = await import(
  pathToFileURL(path.join(root, 'src', 'data', 'routes.ts')).href
)
const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

const template = await readFile(path.join(distDir, 'index.html'), 'utf8')
if (!template.includes(MARKER)) {
  throw new Error('dist/index.html has no empty <div id="root"></div> to prerender into')
}

const page = (routePath, markup) =>
  template.replace(MARKER, `<div id="root" data-path="${routePath}">${markup}</div>`)

/** React.lazy routes suspend on the first pass; render again until every boundary resolves. */
async function renderResolved(url) {
  let html = render(url)
  for (let attempt = 0; attempt < 12 && html.includes(CLIENT_RENDER_MARKER); attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    html = render(url)
  }
  if (html.includes(CLIENT_RENDER_MARKER)) {
    throw new Error(`Suspense boundaries did not resolve while prerendering ${url}`)
  }
  return html
}

// Client-only shell first, while dist/index.html is still the untouched template.
await writeFile(path.join(distDir, 'app.html'), page('', ''))

for (const routePath of prerenderRoutes) {
  const markup = await renderResolved(routePath)
  const outFile =
    routePath === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, ...routePath.slice(1).split('/'), 'index.html')
  await mkdir(path.dirname(outFile), { recursive: true })
  await writeFile(outFile, page(routePath, markup))
  console.log(
    `prerendered ${routePath.padEnd(10)} -> ${path.relative(root, outFile)} (${(markup.length / 1024).toFixed(1)} kB)`,
  )
}

await rm(ssrDir, { recursive: true, force: true })
