import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import StudioLayout from '../components/studios/StudioLayout'
import Words from '../components/studios/Words'
import Steps from '../components/studios/Steps'
import InfraDiagram from '../components/studios/InfraDiagram'
import BetaForm from '../components/studios/BetaForm'
import { AuditPanel, InstancesPanel, LicensesPanel, ProfilePanel } from '../components/studios/ConsolePanels'
import { HERO } from '../components/studios/shots'
import { useHeroTilt } from '../components/studios/useStudioMotion'
import { breadcrumbSchema } from '../lib/schema'

interface Ticks { label: string; title: string; items: string[] }
interface Tile { title: string; text: string }
interface Feature { label: string; title: string; text: string }

const list = (value: unknown) => value as string[]

function Head({ eyebrow, title, line2, lede, id, statement = false }: {
  eyebrow: string; title: string; line2: string; lede?: string; id: string; statement?: boolean
}) {
  const first = title.split(/\s+/).length
  return (
    <div className="st-head">
      <span className="st-eyebrow" data-reveal>{eyebrow}</span>
      <h2 id={id} className={statement ? 'st-statement' : undefined} data-split>
        <Words text={title} />
        <br />
        {statement ? <em><Words text={line2} start={first} /></em> : <span className="st-dim"><Words text={line2} start={first} /></span>}
      </h2>
      {lede && <p className="st-lede" data-reveal>{lede}</p>}
    </div>
  )
}

export default function Studios() {
  const { t } = useTranslation()
  const shot = useRef<HTMLDivElement>(null)
  useHeroTilt(shot)
  const download = t('studios.how.download', { returnObjects: true }) as Ticks
  const mirror = t('studios.how.mirror', { returnObjects: true }) as Ticks
  const access = t('studios.how.access.items', { returnObjects: true }) as Tile[]
  const feature = (key: string) => t(`studios.console.${key}`, { returnObjects: true }) as Feature
  const heroTitle = t('studios.hero.title')

  return (
    <StudioLayout>
      <Seo
        title={t('studios.seo.title')}
        description={t('studios.seo.description')}
        path="/studios"
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: t('studios.hero.eyebrow'), path: '/studios' },
        ])}
      />

      <section className="st-hero" aria-labelledby="studios-h">
        <div className="st-wrap">
          <span className="st-eyebrow st-in">
            {t('studios.hero.eyebrow')} <span className="st-sep">/</span> {t('studios.hero.beta')}
          </span>
          <h1 id="studios-h">
            <Words text={heroTitle} />
            <br />
            <span className="st-l2"><Words text={t('studios.hero.titleLine2')} start={heroTitle.split(/\s+/).length} /></span>
          </h1>
          <p className="st-lede st-in" style={{ '--i': 2 } as React.CSSProperties}>{t('studios.hero.lede')}</p>
          <div className="st-ctas st-in" style={{ '--i': 3 } as React.CSSProperties}>
            <a className="st-btn st-btn-primary" href="#beta">{t('studios.hero.cta')}</a>
            <a className="st-btn st-btn-ghost" href="#how">{t('studios.hero.secondary')}</a>
          </div>
          <ul className="st-facts st-in" style={{ '--i': 4 } as React.CSSProperties}>
            {list(t('studios.hero.facts', { returnObjects: true })).map((f) => <li key={f}>{f}</li>)}
          </ul>
          <div className="st-hero-shot st-in" style={{ '--i': 5 } as React.CSSProperties} ref={shot}>
            <picture>
              <source media="(max-width: 1024px)" srcSet={HERO.small} sizes="calc(100vw - 32px)" width={1080} height={675} />
              <img
                src={HERO.desktopSrc}
                srcSet={HERO.desktop}
                sizes="(min-width: 1200px) 1152px, calc(100vw - 48px)"
                width={2560}
                height={1600}
                alt={t('studios.hero.imageAlt')}
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      </section>

      <section className="st-replaces" aria-label={t('studios.replaces.label')}>
        <div className="st-wrap">
          <p data-reveal>{t('studios.replaces.line')}</p>
          <ul>
            {list(t('studios.replaces.items', { returnObjects: true })).map((item) => <li key={item} data-reveal>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="st-band" id="how" aria-labelledby="how-h">
        <div className="st-wrap">
          <Head id="how-h" eyebrow={t('studios.how.eyebrow')} title={t('studios.how.title')} line2={t('studios.how.titleLine2')} />
          <Steps />

          <div className="st-duo">
            {[download, mirror].map((d, i) => (
              <article className="st-card st-spot" key={d.label} data-reveal>
                <span className={`st-k${i ? ' st-teal' : ''}`}>{d.label}</span>
                <h3>{d.title}</h3>
                <ul className={`st-ticks${i ? ' st-teal' : ''}`}>
                  {d.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>

          <div className="st-access">
            <div className="st-head" style={{ marginBottom: 0 }}>
              <span className="st-eyebrow" data-reveal>{t('studios.how.access.eyebrow')}</span>
              <h2 data-split><Words text={t('studios.how.access.title')} /></h2>
            </div>
            <div className="st-tiles">
              {access.map((a) => (
                <div className="st-spot" key={a.title} data-reveal>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="st-band st-alt" id="infrastructure" aria-labelledby="infra-h">
        <div className="st-wrap">
          <Head id="infra-h" statement eyebrow={t('studios.infra.eyebrow')} title={t('studios.infra.title')} line2={t('studios.infra.titleLine2')} lede={t('studios.infra.lede')} />
          <InfraDiagram label={t('studios.infra.diagramLabel')} />
          <div className="st-relay">
            <div className="st-relay-copy" data-reveal>
              <span className="st-eyebrow">{t('studios.infra.relay.eyebrow')}</span>
              <h3>{t('studios.infra.relay.title')}</h3>
              <p>{t('studios.infra.relay.text')}</p>
              <Link className="st-btn st-btn-ghost" to="/studios/relay">{t('studios.infra.relay.cta')} →</Link>
            </div>
            <ul className="st-ticks" data-reveal>
              {list(t('studios.infra.relay.items', { returnObjects: true })).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="st-band" id="console" aria-labelledby="console-h">
        <div className="st-wrap">
          <Head id="console-h" eyebrow={t('studios.console.eyebrow')} title={t('studios.console.title')} line2={t('studios.console.titleLine2')} lede={t('studios.console.lede')} />
          <div className="st-cgrid">
            {([
              ['licenses', <LicensesPanel />, false],
              ['profiles', <ProfilePanel />, false],
              ['instances', <InstancesPanel />, true],
              ['audit', <AuditPanel />, true],
            ] as const).map(([key, panel, wide]) => {
              const f = feature(key)
              return (
                <article className={`st-card st-spot${wide ? ' st-wide' : ''}`} key={key} data-reveal>
                  <span className="st-k">{f.label}</span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                  {panel}
                </article>
              )
            })}
          </div>
          <div className="st-sees">
            <div className="st-spot" data-reveal>
              <span className="st-k">{t('studios.console.seesTitle')}</span>
              <ul>{list(t('studios.console.sees', { returnObjects: true })).map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
            <div className="st-spot" data-reveal>
              <span className="st-k">{t('studios.console.neverTitle')}</span>
              <ul className="st-never">{list(t('studios.console.never', { returnObjects: true })).map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          </div>
          <ul className="st-assure" data-reveal>
            {list(t('studios.console.assure', { returnObjects: true })).map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      </section>

      <section className="st-band st-alt" id="beta" aria-labelledby="beta-h">
        <div className="st-wrap st-beta">
          <div className="st-beta-copy">
            <span className="st-eyebrow" data-reveal>{t('studios.beta.eyebrow')}</span>
            <h2 id="beta-h" data-split><Words text={t('studios.beta.title')} /></h2>
            <p className="st-lede" data-reveal>{t('studios.beta.lede')}</p>
            <ul className="st-ticks" data-reveal>
              {list(t('studios.beta.benefits', { returnObjects: true })).map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
          <BetaForm />
        </div>
      </section>
    </StudioLayout>
  )
}
