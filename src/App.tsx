import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Hero />
        <Features />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
