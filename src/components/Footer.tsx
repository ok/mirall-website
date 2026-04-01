import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-slate-50 w-full py-12 px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          <span className="font-bold text-emerald-900 text-2xl font-headline tracking-tighter">
            {t('brand')}
          </span>
          <p className="text-slate-500 font-body text-sm leading-relaxed">{t('footer.tagline')}</p>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-slate-600 hover:text-emerald-600 transition-colors" href="#">
              <span className="material-symbols-outlined text-lg">public</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-slate-600 hover:text-emerald-600 transition-colors" href="#">
              <span className="material-symbols-outlined text-lg">share</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-slate-600 hover:text-emerald-600 transition-colors" href="#">
              <span className="material-symbols-outlined text-lg">alternate_email</span>
            </a>
          </div>
        </div>
        <div>
          <h5 className="font-bold mb-6 text-on-surface">{t('footer.product.title')}</h5>
          <ul className="space-y-4 font-body text-sm">
            <li><a className="text-slate-500 hover:text-emerald-600 transition-all" href="#">{t('footer.product.collections')}</a></li>
            <li><a className="text-slate-500 hover:text-emerald-600 transition-all" href="#">{t('footer.product.assets')}</a></li>
            <li><a className="text-slate-500 hover:text-emerald-600 transition-all" href="#">{t('footer.product.security')}</a></li>
            <li><a className="text-slate-500 hover:text-emerald-600 transition-all" href="#">{t('footer.product.integrations')}</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-6 text-on-surface">{t('footer.resources.title')}</h5>
          <ul className="space-y-4 font-body text-sm">
            <li><a className="text-slate-500 hover:text-emerald-600 transition-all" href="#">{t('footer.resources.apiDocs')}</a></li>
            <li><a className="text-slate-500 hover:text-emerald-600 transition-all" href="#">{t('footer.resources.helpCenter')}</a></li>
            <li><a className="text-slate-500 hover:text-emerald-600 transition-all" href="#">{t('footer.resources.contact')}</a></li>
            <li><a className="text-slate-500 hover:text-emerald-600 transition-all" href="#">{t('footer.resources.blog')}</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-6 text-on-surface">{t('footer.legal.title')}</h5>
          <ul className="space-y-4 font-body text-sm">
            <li><a className="text-slate-500 hover:text-emerald-600 transition-all" href="#">{t('footer.legal.privacy')}</a></li>
            <li><a className="text-slate-500 hover:text-emerald-600 transition-all" href="#">{t('footer.legal.terms')}</a></li>
            <li><a className="text-slate-500 hover:text-emerald-600 transition-all" href="#">{t('footer.legal.cookies')}</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-12 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-500 font-body text-sm">{t('footer.copyright')}</p>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            {t('footer.status')}
          </span>
        </div>
      </div>
    </footer>
  )
}
