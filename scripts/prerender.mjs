/**
 * Renders every route in `src/routes.ts` to a real HTML file at build time.
 *
 * Runs after `vite build`, so the shell it works from is the *built*
 * index.html — the one the `inlineCss` and `preloadCriticalFonts` plugins have
 * already rewritten. Reading the source index.html instead would drop the
 * inlined stylesheet and ship every prerendered page unstyled.
 *
 * Metadata handling is the part that earns its complexity. React 19 hoists
 * <title>/<meta> into document.head as a *client DOM* operation; rendering to a
 * string has no document, so Seo.tsx's tags come back inline in the markup. Left
 * alone they would sit in <body> while the shell's hardcoded homepage tags stayed
 * in <head> — every page would still unfurl as the homepage, which is the exact
 * symptom this change exists to fix. So: strip the shell's page-specific tags,
 * lift the rendered ones out of the body, and splice them into the head.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

/** Tags Seo.tsx owns per page. The shell's copies are homepage-specific. */
const PAGE_META = [
  /\s*<title>[\s\S]*?<\/title>/gi,
  /\s*<meta\s+name="description"[^>]*>/gi,
  /\s*<meta\s+name="robots"[^>]*>/gi,
  /\s*<meta\s+property="og:[^"]*"[^>]*>/gi,
  /\s*<meta\s+name="twitter:[^"]*"[^>]*>/gi,
  /\s*<link\s+rel="canonical"[^>]*>/gi,
]

/** Same tags, plus JSON-LD, as they come back out of renderToString. */
const HOISTABLE = [
  /<title>[\s\S]*?<\/title>/gi,
  /<meta\s+name="description"[^>]*\/?>/gi,
  /<meta\s+name="robots"[^>]*\/?>/gi,
  /<meta\s+property="og:[^"]*"[^>]*\/?>/gi,
  /<meta\s+name="twitter:[^"]*"[^>]*\/?>/gi,
  /<link\s+rel="canonical"[^>]*\/?>/gi,
  /<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi,
]

function extractHoistable(markup) {
  const found = []
  let body = markup
  for (const re of HOISTABLE) {
    body = body.replace(re, (m) => {
      found.push(m)
      return ''
    })
  }
  return { body, head: found }
}

function stripShellMeta(html) {
  const headEnd = html.indexOf('</head>')
  if (headEnd === -1) throw new Error('built index.html has no </head>')
  let head = html.slice(0, headEnd)
  const rest = html.slice(headEnd)
  for (const re of PAGE_META) head = head.replace(re, '')
  return head + rest
}

const shell = stripShellMeta(await readFile(join(dist, 'index.html'), 'utf8'))
const { render, paths } = await import(join(root, 'dist-ssr', 'entry-server.js'))

const failures = []
const titles = new Map()

for (const path of paths) {
  const rendered = render(path)
  const { body, head } = extractHoistable(rendered)

  const html = shell
    .replace('</head>', `${head.join('\n    ')}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)

  const outDir = path === '/' ? dist : join(dist, path)
  await mkdir(outDir, { recursive: true })
  await writeFile(join(outDir, 'index.html'), html)

  // Every check below has a failure it was written for. A prerender that
  // silently emits an empty shell still produces a file, and "the file exists"
  // is exactly the assertion that would let it through.
  const headHtml = html.slice(0, html.indexOf('</head>'))
  const bodyHtml = html.slice(html.indexOf('</head>'))
  const titleMatch = headHtml.match(/<title>([\s\S]*?)<\/title>/i)

  if (!/<h1/i.test(body)) failures.push(`${path}: no <h1> in rendered markup`)
  if (!/<style>[\s\S]*?\S[\s\S]*?<\/style>/i.test(headHtml)) {
    failures.push(`${path}: no non-empty <style> — inlineCss output was lost`)
  }
  if (!titleMatch) failures.push(`${path}: no <title> in <head>`)
  if ((headHtml.match(/<title>/gi) || []).length > 1) {
    failures.push(`${path}: more than one <title> in <head>`)
  }
  if (/<title>/i.test(bodyHtml)) failures.push(`${path}: <title> left in <body>`)
  if (/<meta\s+property="og:/i.test(bodyHtml)) failures.push(`${path}: og: tags left in <body>`)
  if (!/<meta\s+property="og:url"/i.test(headHtml)) failures.push(`${path}: no og:url in <head>`)

  if (titleMatch) titles.set(path, titleMatch[1])
  console.log(`  ${path} → ${(html.length / 1024).toFixed(0)} KB · ${titleMatch?.[1] ?? '(no title)'}`)
}

// The homepage-metadata-everywhere bug is invisible per-page: each document is
// internally valid and only the comparison across pages reveals it.
const distinct = new Set(titles.values())
if (distinct.size !== titles.size) {
  const dupes = [...titles.entries()].filter(
    ([, t]) => [...titles.values()].filter((x) => x === t).length > 1,
  )
  failures.push(`duplicate <title> across routes: ${dupes.map(([p]) => p).join(', ')}`)
}

if (failures.length) {
  console.error(`\nprerender failed:\n${failures.map((f) => `  ✗ ${f}`).join('\n')}`)
  process.exit(1)
}
console.log(`\nprerendered ${paths.length} routes, ${distinct.size} distinct titles`)
