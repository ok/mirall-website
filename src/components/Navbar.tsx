import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { List, X } from '@phosphor-icons/react'
import BrandLogo from './BrandLogo'
import SocialLinks from './SocialLinks'

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
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  return (
    <header className="fixed top-0 w-full z-50 glass-nav shadow-sm">
      <nav className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2">
            <BrandLogo />
          </Link>
          <div className="hidden lg:flex items-center gap-8 font-body font-semibold tracking-tight">
            <HashLink className="text-slate-600 hover:text-emerald-500 transition-colors duration-300" to="/#features">
              {t('nav.features')}
            </HashLink>
            <HashLink className="text-slate-600 hover:text-emerald-500 transition-colors duration-300" to="/#faq">
              {t('faq.title')}
            </HashLink>
            <Link className="text-slate-600 hover:text-emerald-500 transition-colors duration-300" to="/docs">
              {t('docs.title')}
            </Link>
            <Link className="text-slate-600 hover:text-emerald-500 transition-colors duration-300" to="/support">
              {t('support.title')}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Muted and icon-only: Download is the page's one call to action, and a
              second high-contrast control beside it would compete with it. */}
          <SocialLinks className="hidden lg:flex items-center gap-1" />
          <Link
            to="/download"
            className="hero-gradient text-on-primary px-6 py-2.5 rounded-lg font-bold text-sm ambient-shadow hover:scale-105 transition-transform"
          >
            {t('nav.download')}
          </Link>
          <button
            type="button"
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 hover:text-emerald-500 hover:bg-surface-container-low transition-colors"
            onClick={() => setMobileOpen(o => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="lg:hidden border-t border-outline-variant/10"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex flex-col px-8 py-2 font-body font-semibold text-base">
            <HashLink className="py-3 text-slate-700 hover:text-emerald-500 transition-colors" to="/#features">
              {t('nav.features')}
            </HashLink>
            <HashLink className="py-3 text-slate-700 hover:text-emerald-500 transition-colors" to="/#faq">
              {t('faq.title')}
            </HashLink>
            <Link className="py-3 text-slate-700 hover:text-emerald-500 transition-colors" to="/docs">
              {t('docs.title')}
            </Link>
            <Link className="py-3 text-slate-700 hover:text-emerald-500 transition-colors" to="/support">
              {t('support.title')}
            </Link>
          </div>
          {/* The header icons are desktop-only, so they would otherwise vanish here. */}
          <SocialLinks className="flex justify-center gap-4 px-8 pt-2 pb-6" />
        </div>
      )}
    </header>
  )
}
