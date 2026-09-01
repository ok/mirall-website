// Regenerates the site's icon set — the tab favicon, the iOS Home Screen icon
// and the PWA manifest icons — from public/favicon.svg.
//
// public/favicon.svg is a copy of resources/brand/mirall-icon.svg in the app
// repo (the macOS squircle; the other brand source, mirall-icon-win11.svg,
// differs only in corner radius), with its viewBox tightened from the 2500²
// artboard down to the artwork's own 2446² box so the PNGs below sit
// edge-to-edge rather than inheriting the export's ~1% margin.
//
// Nothing keeps that copy in sync with the app. When the brand icon changes
// there, re-copy it, re-apply the viewBox, and re-run this script. The
// generated files are committed, so a build never runs any of this.
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const root = path.resolve(fileURLToPath(import.meta.url), '..', '..')
const publicDir = path.join(root, 'public')
const svgPath = path.join(publicDir, 'favicon.svg')

// The rounded square's own fill. iOS ignores the alpha channel: it composites
// the icon onto black before applying its own mask, so transparent corners come
// back as dark fringes. Painting the ground across the whole canvas gives it the
// full-bleed square it expects and lets it do the rounding. The tab and manifest
// icons are drawn unmasked, so they keep their transparent corners.
const brandGround = '#fbf9f5'

const pngSizes = [
  { file: 'favicon-32.png', size: 32 },
  { file: 'apple-touch-icon.png', size: 180, ground: true },
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
]

const svg = await readFile(svgPath)

for (const { file, size, ground } of pngSizes) {
  const image = sharp(svg).resize(size, size)
  if (ground) image.flatten({ background: brandGround })
  await image.png().toFile(path.join(publicDir, file))
  console.log(`wrote ${file} (${size}x${size})${ground ? ` on ${brandGround}` : ''}`)
}

const ico = await pngToIco([path.join(publicDir, 'favicon-32.png')])
await writeFile(path.join(publicDir, 'favicon.ico'), ico)
console.log('wrote favicon.ico')
