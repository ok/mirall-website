import { lazy, Suspense, useEffect, createElement, type ComponentType } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { routes } from './routes'

/** Code-split on the client — one chunk per route, fetched on navigation. */
const lazyComponents = new Map(routes.map((r) => [r.path, r.eager ?? lazy(r.load)]))

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0 })
  }, [pathname, hash])
  return null
}

/**
 * `components` is injectable because the prerender must pass *resolved*
 * modules. `renderToString` does not wait on a suspended boundary, so rendering
 * the lazy map on the server emits the `null` fallback — a full-size HTML file
 * with an empty page inside it.
 */
export function AppRoutes({
  components = lazyComponents,
}: {
  components?: Map<string, ComponentType>
}) {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={createElement(components.get(r.path)!)} />
          ))}
        </Routes>
      </Suspense>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
