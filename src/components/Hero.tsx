import { Trans, useTranslation } from 'react-i18next'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="z-10">
          <span className="uppercase tracking-[0.1em] text-primary font-bold mb-6 block text-sm">
            {t('hero.label')}
          </span>
          <h1 className="text-6xl font-black font-headline text-on-surface leading-[1.1] tracking-tighter mb-8">
            <Trans i18nKey="hero.title">
              The art of <span className="text-primary-container">seamless</span> sharing.
            </Trans>
          </h1>
          <p className="text-xl text-on-surface-variant leading-relaxed mb-12 max-w-xl">
            {t('hero.description')}
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="hero-gradient text-on-primary px-8 py-4 rounded-lg font-bold flex items-center gap-3 ambient-shadow hover:scale-105 transition-transform">
              <span className="material-symbols-outlined">download</span>
              {t('hero.cta')}
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl"></div>
          <div className="bg-surface-container-lowest rounded-xl ambient-shadow p-4 relative overflow-hidden">
            <img
              className="rounded-lg w-full aspect-[4/3] object-cover shadow-inner"
              alt="Modern sleek application interface showing a clean file management dashboard"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWWL8sz2CkYlItzGERbp73f2Nq-XOVotNUgny_-kfXmkmnREnQf0xOexm7R_g0KG-Gbsq9N4a_XP7u6Km6_dkd-zTH3TnLFciNj45kb_p9YYELnrNTtuuSFCUJ1ekh7deHQpyj1vBQJZuEeel2GiX3o4ynE99WzjFfgKRkpVlnBwpjE9Xmb1UzY_3IliPsZKAUc1r_c2fUptloTdVmDM9pCI5bmtnTP3QJ_dVEoP_xalDgVxE0cQHQC4lehu9jCigDE-R57Aed3UYS"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
