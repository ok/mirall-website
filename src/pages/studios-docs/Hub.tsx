import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { GraduationCap, ListChecks, Table, BookOpen, ArrowRight } from '@phosphor-icons/react'
import Seo from '../../components/Seo'
import DocsLayout, { DocsHeader } from '../../components/docs/DocsLayout'
import { STUDIOS_DOCS, STUDIOS_DOCS_NAV, studiosDocsCrumbs, studiosDocsHeader } from '../../components/docs/studios'
import { breadcrumbSchema } from '../../lib/schema'

interface Card {
  id: string
  to: string
  title: string
  description: string
}

const ICONS: Record<string, React.ReactNode> = {
  tutorials: <GraduationCap size={28} weight="duotone" className="text-primary" aria-hidden="true" />,
  guides: <ListChecks size={28} weight="duotone" className="text-primary" aria-hidden="true" />,
  reference: <Table size={28} weight="duotone" className="text-primary" aria-hidden="true" />,
  explanation: <BookOpen size={28} weight="duotone" className="text-primary" aria-hidden="true" />,
}

export default function StudiosDocsHub() {
  const { t } = useTranslation()
  const cards = t('studiosDocs.hub.cards', { returnObjects: true }) as unknown as Card[]
  const popular = t('studiosDocs.hub.popular', { returnObjects: true }) as unknown as Array<{
    label: string
    to: string
  }>

  return (
    <DocsLayout
      active="overview"
      nav={STUDIOS_DOCS_NAV}
      navLabelKey="studiosDocs.title"
      header={studiosDocsHeader(t)}
      seo={
        <Seo
          title="Mirall for Studios Documentation — the Console, Keys & Configuration"
          description="How to run Mirall across a studio: set up the Mirall Console, issue license keys, publish configuration to every install, and connect each computer."
          path={STUDIOS_DOCS}
          jsonLd={breadcrumbSchema(studiosDocsCrumbs())}
        />
      }
    >
      <DocsHeader
        label={t('studiosDocs.hub.label')}
        heading={t('studiosDocs.hub.heading')}
        intro={t('studiosDocs.hub.intro')}
      />

      <div className="grid sm:grid-cols-2 gap-5 mb-16">
        {cards.map((card) => (
          <Link
            key={card.id}
            to={card.to}
            className="group block rounded-2xl border border-outline-variant/30 p-7 hover:border-primary/40 hover:bg-surface-container-low/50 transition-colors"
          >
            <div className="mb-4">{ICONS[card.id]}</div>
            <h2 className="text-xl font-bold font-headline text-on-surface mb-2 flex items-center gap-2">
              {card.title}
              <ArrowRight
                size={18}
                weight="bold"
                className="text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                aria-hidden="true"
              />
            </h2>
            <p className="text-on-surface-variant leading-relaxed">{card.description}</p>
          </Link>
        ))}
      </div>

      <section aria-labelledby="popular-heading">
        <h2
          id="popular-heading"
          className="text-sm font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-4"
        >
          {t('studiosDocs.hub.popularTitle')}
        </h2>
        <ul className="space-y-2">
          {popular.map((link, i) => (
            <li key={i}>
              <Link
                to={link.to}
                className="inline-flex items-center gap-1.5 text-primary hover:text-emerald-500 transition-colors font-medium"
              >
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </DocsLayout>
  )
}
