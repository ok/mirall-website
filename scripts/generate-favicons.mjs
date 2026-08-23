import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const root = path.resolve(fileURLToPath(import.meta.url), '..', '..')
const publicDir = path.join(root, 'public')
const svgPath = path.join(publicDir, 'favicon.svg')

const pngSizes = [
  { file: 'favicon-32.png', size: 32 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
]

const svg = await readFile(svgPath)

for (const { file, size } of pngSizes) {
  await sharp(svg).resize(size, size).png().toFile(path.join(publicDir, file))
  console.log(`wrote ${file} (${size}x${size})`)
}

const ico = await pngToIco([path.join(publicDir, 'favicon-32.png')])
await writeFile(path.join(publicDir, 'favicon.ico'), ico)
console.log('wrote favicon.ico')
