import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'

const DocsHub = lazy(() => import('./pages/docs/Hub'))
const Tutorials = lazy(() => import('./pages/docs/Tutorials'))
const Guides = lazy(() => import('./pages/docs/Guides'))
const Reference = lazy(() => import('./pages/docs/Reference'))
const Explanation = lazy(() => import('./pages/docs/Explanation'))
const Changelog = lazy(() => import('./pages/Changelog'))
const Support = lazy(() => import('./pages/Support'))
const Download = lazy(() => import('./pages/Download'))
const Preview = lazy(() => import('./pages/Preview'))

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0 })
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<DocsHub />} />
          <Route path="/docs/tutorials" element={<Tutorials />} />
          <Route path="/docs/guides" element={<Guides />} />
          <Route path="/docs/reference" element={<Reference />} />
          <Route path="/docs/explanation" element={<Explanation />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/support" element={<Support />} />
          <Route path="/download" element={<Download />} />
          <Route path="/preview" element={<Preview />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
