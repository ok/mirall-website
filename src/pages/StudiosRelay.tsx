import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import StudioLayout from '../components/studios/StudioLayout'
import Words from '../components/studios/Words'
import { breadcrumbSchema } from '../lib/schema'

interface Tile { title: string; text: string }

/**
 * Deliberately short: what the relay does and that it is set up with the studio as
 * part of the rollout. Setup detail lives in the docs ("Run your own relay") and in
 * the project work, not here.
 */
export default function StudiosRelay() {
  const { t } = useTranslation()
  const title = t('studios.relayPage.title')
  const whatTitle = t('studios.relayPage.what.title')
  const deliveryTitle = t('studios.relayPage.delivery.title')
  const tiles = t('studios.relayPage.what.items', { returnObjects: true }) as Tile[]
  const delivery = t('studios.relayPage.delivery.items', { returnObjects: true }) as string[]

  return (
    <StudioLayout subpage>
      <Seo
        title={t('studios.relayPage.seo.title')}
        description={t('studios.relayPage.seo.description')}
        path="/studios/relay"
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: t('studios.relayPage.crumb'), path: '/studios' },
          { name: t('studios.relayPage.crumbHere'), path: '/studios/relay' },
        ])}
      />

      <section className="st-hero st-sub" aria-labelledby="relay-h">
        <div className="st-wrap">
          <nav className="st-crumb st-in" aria-label="Breadcrumb">
            <Link to="/studios">{t('studios.relayPage.crumb')}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{t('studios.relayPage.crumbHere')}</span>
          </nav>
          <h1 id="relay-h">
            <Words text={title} />
            <br />
            <span className="st-l2"><Words text={t('studios.relayPage.titleLine2')} start={title.split(/\s+/).length} /></span>
          </h1>
          <p className="st-lede st-in" style={{ '--i': 2 } as React.CSSProperties}>{t('studios.relayPage.lede')}</p>
          <div className="st-ctas st-in" style={{ '--i': 3 } as React.CSSProperties}>
            <Link className="st-btn st-btn-primary" to="/studios#beta">{t('studios.relayPage.cta')}</Link>
          </div>
        </div>
      </section>

      <section className="st-band st-alt" aria-labelledby="relay-what-h">
        <div className="st-wrap">
          <div className="st-head">
            <span className="st-eyebrow" data-reveal>{t('studios.relayPage.what.eyebrow')}</span>
            <h2 id="relay-what-h" data-split>
              <Words text={whatTitle} />
              <br />
              <span className="st-dim"><Words text={t('studios.relayPage.what.titleLine2')} start={whatTitle.split(/\s+/).length} /></span>
            </h2>
          </div>
          <div className="st-tiles">
            {tiles.map((tile) => (
              <div className="st-spot" key={tile.title} data-reveal>
                <h3>{tile.title}</h3>
                <p>{tile.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="st-band" aria-labelledby="relay-delivery-h">
        <div className="st-wrap">
          <div className="st-deliver">
            <div className="st-deliver-copy">
              <span className="st-eyebrow" data-reveal>{t('studios.relayPage.delivery.eyebrow')}</span>
              <h2 id="relay-delivery-h" data-split>
                <Words text={deliveryTitle} />
                <br />
                <span className="st-dim"><Words text={t('studios.relayPage.delivery.titleLine2')} start={deliveryTitle.split(/\s+/).length} /></span>
              </h2>
              <p className="st-lede" data-reveal>{t('studios.relayPage.delivery.lede')}</p>
              <div data-reveal><Link className="st-btn st-btn-primary" to="/studios#beta">{t('studios.relayPage.cta')}</Link></div>
            </div>
            <ul className="st-ticks" data-reveal>
              {delivery.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <p className="st-for-it" data-reveal>
            {t('studios.relayPage.delivery.forIt')}{' '}
            <Link to="/docs/guides#run-your-own-relay">{t('studios.relayPage.delivery.forItLink')}</Link>
          </p>
        </div>
      </section>
    </StudioLayout>
  )
}
