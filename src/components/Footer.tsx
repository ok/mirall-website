import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import BrandLogo from './BrandLogo'

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

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-slate-50 w-full py-12 px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <div className="space-y-4">
          <Link to="/" aria-label="Mirall home">
            <BrandLogo />
          </Link>
          <p className="text-slate-500 font-body text-sm leading-relaxed">{t('footer.tagline')}</p>
        </div>
        <div>
          <p className="font-bold mb-6 text-on-surface">{t('footer.product.title')}</p>
          <ul className="space-y-3 font-body text-sm">
            <li><HashLink className="text-slate-500 hover:text-emerald-600 transition-all" to="/#features">{t('footer.product.features')}</HashLink></li>
            <li><Link className="text-slate-500 hover:text-emerald-600 transition-all" to="/download">{t('footer.product.download')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-bold mb-6 text-on-surface">{t('footer.resources.title')}</p>
          <ul className="space-y-3 font-body text-sm">
            <li><Link className="text-slate-500 hover:text-emerald-600 transition-all" to="/docs">{t('footer.resources.docs')}</Link></li>
            <li><Link className="text-slate-500 hover:text-emerald-600 transition-all" to="/support">{t('footer.resources.support')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-bold mb-6 text-on-surface">{t('footer.legal.title')}</p>
          <ul className="space-y-3 font-body text-sm">
            <li><a className="text-slate-500 hover:text-emerald-600 transition-all" href="#">{t('footer.legal.privacy')}</a></li>
            <li><a className="text-slate-500 hover:text-emerald-600 transition-all" href="#">{t('footer.legal.terms')}</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-12 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-500 font-body text-sm">{t('footer.copyright')}</p>
      </div>
    </footer>
  )
}
