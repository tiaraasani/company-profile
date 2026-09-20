import type { Plugin } from 'vite'

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
export function deferAppScript(): Plugin {
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
