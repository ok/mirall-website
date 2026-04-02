import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useLocation } from 'react-router-dom'

function HashLink({ to, className, children }: { to: string; className: string; children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const hash = to.replace('/', '')
    if (location.pathname === '/') {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  return <a href={to} className={className} onClick={handleClick}>{children}</a>
}

export default function Navbar() {
  const { t } = useTranslation()

  return (
    <header className="fixed top-0 w-full z-50 glass-nav shadow-sm">
      <nav className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-black text-emerald-700 font-headline tracking-tighter flex items-center gap-2">
            {t('brand')}
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full leading-none">
              {t('beta')}
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-body font-semibold tracking-tight">
            <HashLink className="text-slate-600 hover:text-emerald-500 transition-colors duration-300" to="/#features">
              {t('nav.features')}
            </HashLink>
            <HashLink className="text-slate-600 hover:text-emerald-500 transition-colors duration-300" to="/#faq">
              {t('faq.title')}
            </HashLink>
            <Link className="text-slate-600 hover:text-emerald-500 transition-colors duration-300" to="/docs">
              {t('docs.title')}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link
            to="/download"
            className="hero-gradient text-on-primary px-6 py-2.5 rounded-lg font-bold text-sm ambient-shadow hover:scale-105 transition-transform"
          >
            {t('nav.download')}
          </Link>
        </div>
      </nav>
    </header>
  )
}
