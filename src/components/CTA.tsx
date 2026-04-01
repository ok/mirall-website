import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function CTA() {
  const { t } = useTranslation()

  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-8">
        <div className="hero-gradient rounded-xl p-16 text-center text-on-primary ambient-shadow relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-5xl font-black font-headline mb-8 relative z-10">{t('cta.title')}</h2>
          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto relative z-10">{t('cta.description')}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <button className="bg-white text-primary px-10 py-5 rounded-lg font-black hover:bg-surface-container-low transition-colors">
              {t('cta.primaryButton')}
            </button>
            <Link to="/docs" className="bg-primary/20 border border-white/30 px-10 py-5 rounded-lg font-black hover:bg-primary/30 transition-colors">
              {t('cta.secondaryButton')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
