import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { List, X } from '@phosphor-icons/react'
import BrandLogo from './BrandLogo'
import BetaChip from './BetaChip'
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

export interface NavItem {
  label: string
  /** `#id` for a section of this page, `/path#id` for another page's section, or a route. */
  to: string
}

interface NavbarProps {
  /** Dark is the studios pages. Only colours change between tones, never the layout. */
  tone?: 'light' | 'dark'
  /** Replaces the site links. The studios pages list their own sections. */
  items?: NavItem[]
  cta?: { label: string; shortLabel?: string; to: string }
  /** Extra links for the mobile menu only, set apart below `items`: the way back to the rest of the site. */
  menuExtras?: NavItem[]
}

const TONES = {
  light: {
    header: 'glass-nav shadow-sm',
    link: 'text-slate-600 hover:text-emerald-500',
    mobileLink: 'text-slate-700 hover:text-emerald-500',
    burger: 'text-slate-600 hover:text-emerald-500 hover:bg-surface-container-low',
    cta: 'hero-gradient text-on-primary ambient-shadow',
    divider: 'border-outline-variant/10',
    extra: 'text-primary hover:text-emerald-500',
  },
  dark: {
    header: 'bg-[#090b0f]/80 backdrop-blur-[24px] shadow-[0_1px_2px_rgba(0,0,0,0.4)]',
    link: 'text-[#8f939c] hover:text-[#fd9c42]',
    mobileLink: 'text-[#8f939c] hover:text-[#fd9c42]',
    burger: 'text-[#8f939c] hover:text-[#fd9c42] hover:bg-white/5',
    cta: 'bg-[#fd9c42] text-[#282c34] shadow-[0_8px_30px_rgba(253,156,66,0.12)]',
    divider: 'border-white/10',
    extra: 'text-[#5cc4b8] hover:text-[#fd9c42]',
  },
}

function NavLink({ item, className }: { item: NavItem; className: string }) {
  if (item.to.startsWith('#')) return <a className={className} href={item.to}>{item.label}</a>
  return <Link className={className} to={item.to}>{item.label}</Link>
}

export default function Navbar({ tone = 'light', items, cta, menuExtras }: NavbarProps = {}) {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const c = TONES[tone]

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

  const siteLinks = (linkClass: string) => (
    <>
      <HashLink className={linkClass} to="/#features">
        {t('nav.features')}
      </HashLink>
      <HashLink className={linkClass} to="/#faq">
        {t('faq.title')}
      </HashLink>
      <Link className={linkClass} to="/docs">
        {t('docs.title')}
      </Link>
      <Link className={linkClass} to="/support">
        {t('support.title')}
      </Link>
      <Link className={linkClass} to="/studios">
        {t('nav.studios')}
        <BetaChip />
      </Link>
    </>
  )
  const links = (linkClass: string) =>
    items ? items.map((item) => <NavLink key={item.to} item={item} className={linkClass} />) : siteLinks(linkClass)

  const ctaClass = `${c.cta} px-6 py-2.5 rounded-lg font-bold text-sm hover:scale-105 transition-transform`
  const ctaLabel = cta && (
    cta.shortLabel ? (
      <>
        <span className="max-[479px]:hidden">{cta.label}</span>
        <span className="min-[480px]:hidden">{cta.shortLabel}</span>
      </>
    ) : cta.label
  )

  return (
    <header className={`fixed top-0 w-full z-50 ${c.header}`}>
      <nav className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2">
            <BrandLogo inverse={tone === 'dark'} />
          </Link>
          <div className="hidden lg:flex items-center gap-8 font-body font-semibold tracking-tight">
            {links(`${c.link} transition-colors duration-300`)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Muted and icon-only: Download is the page's one call to action, and a
              second high-contrast control beside it would compete with it. */}
          <SocialLinks className="hidden lg:flex items-center gap-1" tone={tone} />
          {cta ? (
            cta.to.startsWith('#') ? (
              <a href={cta.to} className={ctaClass}>{ctaLabel}</a>
            ) : (
              <Link to={cta.to} className={ctaClass}>{ctaLabel}</Link>
            )
          ) : (
            <Link to="/download" className={ctaClass}>
              {t('nav.download')}
            </Link>
          )}
          <button
            type="button"
            className={`lg:hidden flex items-center justify-center w-10 h-10 rounded-lg ${c.burger} transition-colors`}
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
          className={`lg:hidden border-t ${c.divider}`}
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex flex-col px-8 py-2 font-body font-semibold text-base">
            {links(`py-3 ${c.mobileLink} transition-colors`)}
            {menuExtras && (
              <div className={`mt-2 pt-2 border-t ${c.divider} flex flex-col`}>
                {menuExtras.map((item) => <NavLink key={item.to} item={item} className={`py-3 ${c.extra} transition-colors`} />)}
              </div>
            )}
          </div>
          {/* The header icons are desktop-only, so they would otherwise vanish here. */}
          <SocialLinks className="flex justify-center gap-4 px-8 pt-2 pb-6" tone={tone} />
        </div>
      )}
    </header>
  )
}
