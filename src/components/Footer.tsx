import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import BetaChip from './BetaChip'
import { GITHUB_URL } from '../lib/links'

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

const TONES = {
  light: { footer: 'bg-slate-50', text: 'text-slate-500', link: 'text-slate-500 hover:text-emerald-600', head: 'text-on-surface', rule: 'border-slate-200' },
  dark: { footer: 'bg-[#090b0f] shadow-[inset_0_1px_0_rgba(252,232,210,0.08)]', text: 'text-[#8f939c]', link: 'text-[#8f939c] hover:text-[#fd9c42]', head: 'text-[#fce8d2]', rule: 'border-white/10' },
}

/** Dark is the studios pages; only colours change between tones. */
export default function Footer({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { t } = useTranslation()
  const c = TONES[tone]

  return (
    <footer className={`${c.footer} w-full py-12 px-8`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <div className="space-y-4">
          <Link to="/" aria-label="Mirall home" className="inline-block">
            <BrandLogo inverse={tone === 'dark'} />
          </Link>
          <p className={`${c.text} font-body text-sm leading-relaxed`}>{t('footer.tagline')}</p>
        </div>
        <div>
          <p className={`font-bold mb-6 ${c.head}`}>{t('footer.product.title')}</p>
          <ul className="space-y-3 font-body text-sm">
            <li><HashLink className={`${c.link} transition-all`} to="/#features">{t('footer.product.features')}</HashLink></li>
            <li><Link className={`${c.link} transition-all`} to="/download">{t('footer.product.download')}</Link></li>
            <li><Link className={`${c.link} transition-all`} to="/changelog">{t('footer.product.changelog')}</Link></li>
            <li><Link className={`${c.link} transition-all`} to="/studios">{t('nav.studios')}<BetaChip /></Link></li>
          </ul>
        </div>
        <div>
          <p className={`font-bold mb-6 ${c.head}`}>{t('footer.resources.title')}</p>
          <ul className="space-y-3 font-body text-sm">
            <li><Link className={`${c.link} transition-all`} to="/docs">{t('footer.resources.docs')}</Link></li>
            <li><Link className={`${c.link} transition-all`} to="/support">{t('footer.resources.support')}</Link></li>
            <li>
              <a className={`${c.link} transition-all`} href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                {t('footer.resources.github')}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className={`font-bold mb-6 ${c.head}`}>{t('footer.legal.title')}</p>
          <ul className="space-y-3 font-body text-sm">
            <li><Link className={`${c.link} transition-all`} to="/impressum">{t('footer.legal.impressum')}</Link></li>
            <li><Link className={`${c.link} transition-all`} to="/privacy">{t('footer.legal.privacy')}</Link></li>
            <li><a className={`${c.link} transition-all`} href="#">{t('footer.legal.terms')}</a></li>
          </ul>
        </div>
      </div>
      <div className={`max-w-7xl mx-auto mt-12 pt-8 border-t ${c.rule}`}>
        <p className={`${c.text} font-body text-sm`}>{t('footer.trademark')}</p>
      </div>
    </footer>
  )
}
