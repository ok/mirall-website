import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Download } from '@phosphor-icons/react'
import heroSrcSet from '../assets/hero-screenshot.webp?w=400;640;960;1280;1600&format=webp&as=srcset'
import heroSrc from '../assets/hero-screenshot.webp?w=960&format=webp'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="z-10">
          <span className="uppercase tracking-[0.1em] text-primary font-bold mb-6 block text-sm">
            {t('hero.label')}
          </span>
          <h1 className="text-6xl font-black font-headline text-on-surface leading-[1.1] tracking-tighter mb-8 whitespace-pre-line">
            <Trans i18nKey="hero.title">
              The art of <span className="text-primary-container">seamless</span> sharing.
            </Trans>
          </h1>
          <p className="text-xl text-on-surface-variant leading-relaxed mb-12 max-w-xl">
            {t('hero.description')}
          </p>
          <p className="text-sm text-on-surface-variant/70 mb-8 -mt-6">
            {t('hero.industries')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/download" className="hero-gradient text-on-primary px-8 py-4 rounded-lg font-bold flex items-center gap-3 ambient-shadow hover:scale-105 transition-transform">
              <Download size={24} weight="regular" />
              {t('hero.cta')}
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl"></div>
          <img
            className="w-full h-auto object-cover relative" style={{ filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.04))' }}
            alt="Mirall desktop app — Shared Spaces view with large files transferring directly between devices for post-production, architecture, and legal workflows"
            src={heroSrc}
            srcSet={heroSrcSet}
            sizes="(min-width: 1024px) 580px, calc(100vw - 64px)"
            width={2624}
            height={2224}
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
    </section>
  )
}
