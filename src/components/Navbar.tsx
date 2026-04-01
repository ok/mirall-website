import { useTranslation } from 'react-i18next'

export default function Navbar() {
  const { t } = useTranslation()

  return (
    <header className="fixed top-0 w-full z-50 glass-nav shadow-sm">
      <nav className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-12">
          <span className="text-2xl font-black text-emerald-700 font-headline tracking-tighter">
            {t('brand')}
          </span>
          <div className="hidden md:flex items-center gap-8 font-body font-semibold tracking-tight">
            <a className="text-emerald-700 border-b-2 border-emerald-600 pb-1" href="#">
              {t('nav.collections')}
            </a>
            <a className="text-slate-600 hover:text-emerald-500 transition-colors duration-300" href="#">
              {t('nav.assets')}
            </a>
            <a className="text-slate-600 hover:text-emerald-500 transition-colors duration-300" href="#">
              {t('nav.collaborators')}
            </a>
            <a className="text-slate-600 hover:text-emerald-500 transition-colors duration-300" href="#">
              {t('nav.history')}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4"></div>
        </div>
      </nav>
    </header>
  )
}
