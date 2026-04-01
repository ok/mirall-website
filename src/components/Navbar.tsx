import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const { t } = useTranslation()

  return (
    <header className="fixed top-0 w-full z-50 glass-nav shadow-sm">
      <nav className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-black text-emerald-700 font-headline tracking-tighter">
            {t('brand')}
          </Link>
          <div className="hidden md:flex items-center gap-8 font-body font-semibold tracking-tight">
            <a className="text-slate-600 hover:text-emerald-500 transition-colors duration-300" href="/#features">
              {t('nav.features')}
            </a>
            <a className="text-slate-600 hover:text-emerald-500 transition-colors duration-300" href="/#faq">
              {t('faq.title')}
            </a>
            <Link className="text-slate-600 hover:text-emerald-500 transition-colors duration-300" to="/docs">
              {t('docs.title')}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="/#download"
            className="hero-gradient text-on-primary px-6 py-2.5 rounded-lg font-bold text-sm ambient-shadow hover:scale-105 transition-transform"
          >
            {t('nav.download')}
          </a>
        </div>
      </nav>
    </header>
  )
}
