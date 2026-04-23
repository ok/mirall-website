import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'

function preloadCriticalFonts(): Plugin {
  return {
    name: 'preload-critical-fonts',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html
        const preloads: string[] = []
        for (const fileName of Object.keys(ctx.bundle)) {
          if (/(plus-jakarta-sans|manrope)-latin-wght-normal-[^.]+\.woff2$/.test(fileName)) {
            preloads.push(
              `<link rel="preload" href="/${fileName}" as="font" type="font/woff2" crossorigin>`
            )
          }
        }
        return html.replace('</head>', `  ${preloads.join('\n  ')}\n  </head>`)
      },
    },
  }
}

function inlineCss(): Plugin {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html
        let cssContents = ''
        const cssFiles: string[] = []
        for (const [fileName, chunk] of Object.entries(ctx.bundle)) {
          if (fileName.endsWith('.css') && chunk.type === 'asset') {
            const source = chunk.source
            cssContents += typeof source === 'string' ? source : Buffer.from(source).toString()
            cssFiles.push(fileName)
          }
        }
        if (!cssContents) return html
        for (const fileName of cssFiles) {
          delete ctx.bundle[fileName]
        }
        let out = html.replace(/\s*<link\s+rel="stylesheet"[^>]+href="[^"]+\.css"[^>]*>/g, '')
        out = out.replace('</head>', `<style>${cssContents}</style></head>`)
        return out
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), imagetools(), preloadCriticalFonts(), inlineCss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react-i18next') || id.includes('i18next')) return 'vendor-i18n'
          if (id.includes('react-router')) return 'vendor-router'
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
            return 'vendor-react'
          }
        },
      },
    },
  },
})
