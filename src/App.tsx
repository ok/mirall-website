import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

const Docs = lazy(() => import('./pages/Docs'))
const Support = lazy(() => import('./pages/Support'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
