import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Support from './pages/Support'
import Docs from './pages/Docs'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </BrowserRouter>
  )
}
