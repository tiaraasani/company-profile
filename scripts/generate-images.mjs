// Generates the placeholder hero illustration, the Open Graph image and the touch icon.
//   npm run images
// Replace public/images/hero-home-*.webp with real photography later (same names and sizes).
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const publicDir = path.resolve(import.meta.dirname, '../public')
const imagesDir = path.join(publicDir, 'images')
await mkdir(imagesDir, { recursive: true })

const FONT = "'Segoe UI', Arial, Helvetica, sans-serif"

/* Abstract "digital work" composition in the brand palette: cards, a chart and a phone. */
const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff7ed"/>
      <stop offset="1" stop-color="#ffedd5"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#c2410c"/>
      <stop offset="1" stop-color="#fb923c"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#bg)"/>
  <circle cx="1320" cy="180" r="260" fill="#fdba74" opacity="0.35"/>
  <circle cx="220" cy="860" r="200" fill="#c2410c" opacity="0.12"/>
  <!-- dashboard card -->
  <rect x="200" y="180" width="760" height="520" rx="28" fill="#ffffff" stroke="#e2e8f0" stroke-width="3"/>
  <rect x="240" y="220" width="220" height="20" rx="10" fill="#0f172a"/>
  <rect x="240" y="256" width="140" height="12" rx="6" fill="#cbd5e1"/>
  <rect x="240" y="320" width="300" height="140" rx="16" fill="#f1f5f9"/>
  <rect x="264" y="344" width="90" height="12" rx="6" fill="#94a3b8"/>
  <rect x="264" y="372" width="160" height="30" rx="8" fill="#0f172a"/>
  <rect x="264" y="420" width="120" height="12" rx="6" fill="#c2410c"/>
  <rect x="564" y="320" width="356" height="340" rx="16" fill="#f8fafc"/>
  <rect x="600" y="560" width="40" height="80" rx="8" fill="url(#accent)"/>
  <rect x="660" y="500" width="40" height="140" rx="8" fill="url(#accent)"/>
  <rect x="720" y="440" width="40" height="200" rx="8" fill="url(#accent)"/>
  <rect x="780" y="480" width="40" height="160" rx="8" fill="url(#accent)"/>
  <rect x="840" y="380" width="40" height="260" rx="8" fill="url(#accent)"/>
  <rect x="240" y="500" width="300" height="160" rx="16" fill="#f1f5f9"/>
  <rect x="264" y="524" width="200" height="12" rx="6" fill="#94a3b8"/>
  <rect x="264" y="552" width="252" height="12" rx="6" fill="#cbd5e1"/>
  <rect x="264" y="580" width="180" height="12" rx="6" fill="#cbd5e1"/>
  <rect x="264" y="616" width="110" height="24" rx="12" fill="#c2410c"/>
  <!-- phone -->
  <rect x="1040" y="300" width="330" height="620" rx="44" fill="#0f172a"/>
  <rect x="1060" y="330" width="290" height="560" rx="32" fill="#ffffff"/>
  <rect x="1090" y="380" width="120" height="14" rx="7" fill="#0f172a"/>
  <rect x="1090" y="410" width="230" height="10" rx="5" fill="#cbd5e1"/>
  <rect x="1090" y="450" width="230" height="140" rx="16" fill="url(#accent)"/>
  <rect x="1090" y="614" width="230" height="56" rx="12" fill="#f1f5f9"/>
  <rect x="1090" y="686" width="230" height="56" rx="12" fill="#f1f5f9"/>
  <rect x="1090" y="758" width="230" height="56" rx="12" fill="#f1f5f9"/>
  <rect x="1150" y="846" width="110" height="10" rx="5" fill="#0f172a"/>
  <!-- floating badge -->
  <rect x="860" y="120" width="260" height="90" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="3"/>
  <circle cx="906" cy="165" r="22" fill="#c2410c"/>
  <path d="M896 165l7 7 14-14" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="944" y="150" width="140" height="12" rx="6" fill="#0f172a"/>
  <rect x="944" y="172" width="100" height="10" rx="5" fill="#94a3b8"/>
</svg>`

for (const width of [640, 1024, 1600]) {
  const height = Math.round((width * 1000) / 1600)
  await sharp(Buffer.from(heroSvg), { density: 96 })
    .resize(width, height)
    .webp({ quality: 80 })
    .toFile(path.join(imagesDir, `hero-home-${width}.webp`))
  console.log(`wrote public/images/hero-home-${width}.webp (${width}x${height})`)
}

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0f172a"/>
  <rect x="0" y="0" width="16" height="630" fill="#c2410c"/>
  <rect x="96" y="96" width="72" height="72" rx="20" fill="#c2410c"/>
  <text x="196" y="150" font-family="${FONT}" font-size="48" font-weight="800" fill="#f8fafc">Suitmedia</text>
  <text x="96" y="300" font-family="${FONT}" font-size="64" font-weight="700" fill="#f8fafc">Unlock your business potential</text>
  <text x="96" y="378" font-family="${FONT}" font-size="64" font-weight="700" fill="#fb923c">with digital transformation</text>
  <text x="96" y="470" font-family="${FONT}" font-size="28" fill="#cbd5e1">Strategy, creative, technology and communication for enterprise clients.</text>
  <text x="96" y="556" font-family="${FONT}" font-size="24" fill="#94a3b8">Indonesian digital agency since 2009  |  17+ years  |  900+ projects</text>
</svg>`

await sharp(Buffer.from(ogSvg)).png({ compressionLevel: 9 }).toFile(path.join(publicDir, 'og-image.png'))
console.log('wrote public/og-image.png')

const favicon = await readFile(path.join(publicDir, 'favicon.svg'))
await sharp(favicon, { density: 384 })
  .resize(180, 180)
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicDir, 'apple-touch-icon.png'))
console.log('wrote public/apple-touch-icon.png')
