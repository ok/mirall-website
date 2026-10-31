import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import shotSrcSet from '../assets/studios/hero-space-desktop.webp?w=640;960;1280;1600&format=webp&as=srcset'
import shotSrc from '../assets/studios/hero-space-desktop.webp?w=960&format=webp'

/**
 * The homepage's door to /studios. It borrows the studios pages' own dark palette
 * (studios.css, under .studio), so the change of tone sets it apart from the light
 * page without a border, and it previews the page the link opens.
 */
export default function StudiosTeaser() {
  const { t } = useTranslation()
  const chips = t('studiosTeaser.chips', { returnObjects: true }) as string[]

  return (
    <section id="studios" className="studio st-teaser" aria-labelledby="studios-teaser-h">
      <div className="st-wrap">
        <div className="st-teaser-copy">
          <span className="st-eyebrow">
            {t('studios.hero.eyebrow')} <span className="st-sep">/</span> {t('studios.hero.beta')}
          </span>
          <h2 id="studios-teaser-h">
            {t('studios.hero.title')}
            <br />
            <span className="st-dim">{t('studios.hero.titleLine2')}</span>
          </h2>
          <p>{t('studiosTeaser.text')}</p>
          <ul className="st-teaser-chips">
            {chips.map((c) => <li key={c}>{c}</li>)}
          </ul>
          <div className="st-ctas">
            <Link className="st-btn st-btn-primary" to="/studios">{t('studiosTeaser.cta')}</Link>
            <Link className="st-btn st-btn-ghost" to="/studios#beta">{t('studios.hero.cta')}</Link>
          </div>
        </div>
        <img
          className="st-teaser-shot"
          src={shotSrc}
          srcSet={shotSrcSet}
          sizes="(min-width: 1024px) 560px, calc(100vw - 32px)"
          width={2560}
          height={1600}
          alt={t('studios.hero.imageAlt')}
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  )
}
