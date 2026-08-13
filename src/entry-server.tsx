import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './i18n/locales/en.json'
import { routes } from './routes'
import { AppRoutes } from './App'

/**
 * Deliberately does not import `./i18n` — that module installs
 * `i18next-browser-languagedetector`, which needs a browser. The language is
 * pinned instead: there is one locale, and a prerender has no navigator to
 * detect from.
 */
await i18n.use(initReactI18next).init({
  resources: { en: { translation: en } },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

/**
 * The client wraps these in `lazy()`; a prerender cannot, because
 * `renderToString` does not wait on suspended boundaries — it would emit the
 * `null` fallback and write an empty page that still passes a "file exists"
 * check. Resolving every module up front is what makes the output real.
 */
const components = new Map(
  await Promise.all(
    routes.map(async (r) => [r.path, (await r.load()).default] as const),
  ),
)

export function render(path: string): string {
  return renderToString(
    <StaticRouter location={path}>
      <AppRoutes components={components} />
    </StaticRouter>,
  )
}

export const paths = routes.map((r) => r.path)
