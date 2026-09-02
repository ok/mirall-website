// Regenerates public/og-image.webp — the 1200x630 card that Slack, WhatsApp,
// iMessage, X, LinkedIn and every other unfurler renders when someone shares a
// mirall.app link.
//
// It exists as a script because the hand-made version rotted invisibly: it
// carried the pre-August wordmark and a screenshot of an app two releases old
// for weeks after the brand changed, and nothing on the site could notice.
// Nobody sees this asset while working on the site — it only appears in someone
// else's chat window.
//
// The card is composed from the same three sources the homepage hero uses, so
// re-running it is how the card follows the site:
//
//   public/logo.svg              the wordmark (a copy of the app's brand asset)
//   src/assets/hero-screenshot.webp   the current app frame, from the capture rig
//   src/i18n/locales/en.json     hero.title / hero.industries, the live copy
//
// Rendered through headless Chrome rather than composed in sharp, because the
// headline is set in the site's own variable fonts and no SVG text renderer
// available here loads them reliably. The output is committed; a build never
// runs any of this.
//
//   node scripts/generate-og-image.mjs [--keep-png]
//
// CHROME overrides the browser binary.
import { readFile, writeFile, unlink, mkdtemp } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { tmpdir } from 'node:os'
import path from 'node:path'
import sharp from 'sharp'

const run = promisify(execFile)
const root = path.resolve(fileURLToPath(import.meta.url), '..', '..')

const WIDTH = 1200
const HEIGHT = 630

const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

// Straight from src/index.css's @theme block. Duplicated rather than parsed:
// four hex values are not worth a CSS parser, and a drifted one is visible the
// moment you look at the output.
const COLOR = {
  surface: '#f7f9fb',
  onSurface: '#191c1e',
  onSurfaceVariant: '#3c4a42',
  primary: '#006c49',
  primaryContainer: '#10b981',
  secondaryContainer: '#6063ee',
}

async function dataUri(file, mime) {
  return `data:${mime};base64,${(await readFile(file)).toString('base64')}`
}

// The i18n copy is the source of truth for the words on the card, so the card
// cannot end up quoting a headline the homepage has stopped using. hero.title
// carries a <1> accent span and \n line breaks; both are honoured here.
function heroCopy(en) {
  const raw = en.hero.title
  const lines = raw.split('\n').map((line) =>
    line.replace(/<1>(.*?)<\/1>/g, '<span class="accent">$1</span>')
  )
  return { label: en.hero.label, lines, industries: en.hero.industries }
}

function html({ label, lines, industries, logo, shot, jakarta, manrope }) {
  return `<!doctype html>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: 'Jakarta';
    src: url('${jakarta}') format('woff2-variations');
    font-weight: 200 800;
  }
  @font-face {
    font-family: 'Manrope';
    src: url('${manrope}') format('woff2-variations');
    font-weight: 200 800;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${WIDTH}px; height: ${HEIGHT}px; }
  body {
    background: ${COLOR.surface};
    font-family: 'Manrope', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
    position: relative;
  }
  /* The hero's two ambient blooms, same colours and same 10% strength. They are
     what stops a flat #f7f9fb card reading as a screenshot of nothing.
     Anchored mostly OFF the canvas on purpose: a 10% disc under a 64px blur
     still has a discernible rim, and a rim is what makes a bloom look like a
     circle someone drew. Only the falloff should be on screen. */
  .bloom {
    position: absolute;
    width: 640px; height: 640px;
    border-radius: 50%;
    filter: blur(100px);
  }
  .bloom-a { top: -300px; right: -190px; background: ${COLOR.primaryContainer}1a; }
  .bloom-b { bottom: -340px; left: 500px; background: ${COLOR.secondaryContainer}1a; }

  .card { position: relative; display: flex; align-items: center; height: 100%; padding: 0 64px; gap: 44px; }
  .copy { width: 548px; flex: none; }

  .logo { height: 62px; width: auto; display: block; margin-bottom: 38px; }

  .eyebrow {
    font-family: 'Jakarta', sans-serif;
    font-weight: 700; font-size: 15px;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: ${COLOR.primary};
    margin-bottom: 14px;
  }
  h1 {
    font-family: 'Jakarta', sans-serif;
    font-weight: 800; font-size: 47px; line-height: 1.12;
    letter-spacing: -0.035em;
    color: ${COLOR.onSurface};
  }
  h1 .accent { color: ${COLOR.primaryContainer}; }
  .sub {
    margin-top: 20px;
    font-size: 17px; line-height: 1.5; font-weight: 500;
    color: ${COLOR.onSurfaceVariant};
  }

  .shot { flex: none; width: 492px; }
  /* Identical to DocImage and Hero: the asset is the bare window, elevation is
     drawn here. drop-shadow follows the alpha, so the window's own rounded
     corners stay right and nothing clips. */
  .shot img {
    width: 100%; height: auto; display: block;
    filter: drop-shadow(0 1px 1.5px rgba(16, 24, 40, 0.12)) drop-shadow(0 5px 7px rgba(16, 24, 40, 0.22));
  }
</style>
<div class="bloom bloom-a"></div>
<div class="bloom bloom-b"></div>
<div class="card">
  <div class="copy">
    <img class="logo" src="${logo}" alt="">
    <div class="eyebrow">${label}</div>
    <h1>${lines.join('<br>')}</h1>
    <p class="sub">${industries}</p>
  </div>
  <div class="shot"><img src="${shot}" alt=""></div>
</div>
`
}

const en = JSON.parse(await readFile(path.join(root, 'src/i18n/locales/en.json'), 'utf8'))
const page = html({
  ...heroCopy(en),
  logo: await dataUri(path.join(root, 'public/logo.svg'), 'image/svg+xml'),
  shot: await dataUri(path.join(root, 'src/assets/hero-screenshot.webp'), 'image/webp'),
  jakarta: await dataUri(
    path.join(root, 'node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2'),
    'font/woff2'
  ),
  manrope: await dataUri(
    path.join(root, 'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2'),
    'font/woff2'
  ),
})

const work = await mkdtemp(path.join(tmpdir(), 'mirall-og-'))
const htmlPath = path.join(work, 'og.html')
const pngPath = path.join(root, 'public/og-image.png')
await writeFile(htmlPath, page)

// --headless (old) captures the full layout at the window size, which is exactly
// the fixed 1200x630 canvas here. --hide-scrollbars matters: without it Chrome
// reserves gutter width and the card comes out 1185px of content on a 1200px
// canvas, shifting everything left of centre.
await run(CHROME, [
  '--headless',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=2',
  `--window-size=${WIDTH},${HEIGHT}`,
  `--screenshot=${pngPath}`,
  pathToFileURL(htmlPath).href,
]).catch((err) => {
  throw new Error(`Chrome failed (set CHROME= to override the binary): ${err.message}`)
})

// Rendered at 2x for crisp text, then resized down to the 1200x630 the meta tags
// declare. Unfurlers do not read a 2x asset as retina; they read it as a file
// whose dimensions disagree with og:image:width, and some refuse it.
const out = path.join(root, 'public/og-image.webp')
const { width, height } = await sharp(pngPath)
  .resize(WIDTH, HEIGHT)
  .webp({ quality: 90 })
  .toFile(out)
  .then(async (info) => info)

if (!process.argv.includes('--keep-png')) await unlink(pngPath)

console.log(`wrote public/og-image.webp (${width}x${height}, ${(await readFile(out)).length} bytes)`)
console.log('Next: bump the ?v= cache-bust token in index.html and src/lib/schema.ts.')
console.log('Unfurlers key on the full URL and hold it for weeks — a same-URL replacement is invisible.')
