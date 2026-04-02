import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Support() {
  const { t } = useTranslation()
  const steps = t('support.steps.items', { returnObjects: true }) as string[]

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-24 bg-background">
          <div className="max-w-4xl mx-auto px-8">
            <span className="uppercase tracking-[0.1em] text-primary font-bold mb-6 block text-sm">
              {t('support.title')}
            </span>
            <h1 className="text-5xl font-black font-headline text-on-surface tracking-tighter mb-6">
              {t('support.heading')}
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed mb-16 max-w-2xl">
              {t('support.description')}
            </p>

            <div className="relative mb-16">
              <img
                className="w-full object-cover"
                style={{ filter: 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.08))' }}
                alt={t('support.screenshotAlt')}
                src="/support-screenshot.webp"
              />
              <div className="absolute top-[4.5%] right-[9%] w-[14%] h-[8%] rounded-xl animate-pulse pointer-events-none" />
            </div>

            <div className="bg-surface-container-low rounded-xl p-10 mb-12">
              <h2 className="text-2xl font-bold font-headline mb-6">{t('support.steps.title')}</h2>
              <ol className="space-y-4">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full hero-gradient text-on-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-lg text-on-surface-variant leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="text-on-surface-variant text-lg italic">{t('support.note')}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
