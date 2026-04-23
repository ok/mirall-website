import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import FAQ from '../components/FAQ'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import {
  faqPageSchema,
  howToSchema,
  softwareApplicationSchema,
} from '../lib/schema'

export default function Home() {
  const { t } = useTranslation()

  const faqItems = t('faq.items', { returnObjects: true }) as Array<{
    question: string
    answer: string
  }>
  const howItWorksItems = t('howItWorks.items', { returnObjects: true }) as Array<{
    step: string
    title: string
    description: string
  }>

  return (
    <>
      <Seo
        title="Mirall — Secure Large File Transfer, No Cloud"
        description="Move terabyte-scale files directly between devices. End-to-end encrypted, GDPR-compliant by architecture, no third-party servers. Built for post-production, architecture, and legal workflows."
        path="/"
        jsonLd={[
          softwareApplicationSchema(),
          faqPageSchema(faqItems),
          howToSchema(
            'How Mirall works',
            t('howItWorks.description'),
            howItWorksItems,
          ),
        ]}
      />
      <Navbar />
      <main className="pt-20">
        <Hero />
        <Features />
        <HowItWorks />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
