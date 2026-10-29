import { useTranslation } from 'react-i18next'
import Seo from '../../components/Seo'
import DocsLayout, { DocsHeader } from '../../components/docs/DocsLayout'
import { Bullets, RefTable, DocImage, RichText } from '../../components/docs/blocks'
import { type DocItem } from '../../components/docs/content'
import { STUDIOS_DOCS, STUDIOS_DOCS_NAV, studiosDocsCrumbs, studiosDocsHeader } from '../../components/docs/studios'
import { breadcrumbSchema } from '../../lib/schema'

export default function StudiosReference() {
  const { t } = useTranslation()
  const sectionsData = t('studiosDocs.reference.sections', { returnObjects: true }) as unknown as DocItem[]

  const sections = sectionsData.map((s) => ({ id: s.id, label: s.title }))

  return (
    <DocsLayout
      active="reference"
      sections={sections}
      nav={STUDIOS_DOCS_NAV}
      navLabelKey="studiosDocs.title"
      header={studiosDocsHeader(t)}
      seo={
        <Seo
          title="Mirall for Studios Reference — Settings, Roles & Statuses"
          description="Reference for the Mirall Console: its pages, what each role may do, every setting it manages, backup folder paths, and the statuses of keys, profiles and computers."
          path={`${STUDIOS_DOCS}/reference`}
          jsonLd={breadcrumbSchema(studiosDocsCrumbs({ name: 'Reference', path: `${STUDIOS_DOCS}/reference` }))}
        />
      }
    >
      <DocsHeader
        label={t('studiosDocs.reference.label')}
        heading={t('studiosDocs.reference.heading')}
        intro={t('studiosDocs.reference.intro')}
      />

      {sectionsData.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-28 mb-14">
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-3">{section.title}</h2>
          {section.intro && (
            <p className="text-on-surface-variant leading-relaxed mb-6 text-lg">
              <RichText text={section.intro} />
            </p>
          )}
          {section.table && (
            <RefTable columns={section.table.columns} rows={section.table.rows} />
          )}
          {section.list && <Bullets items={section.list} />}
          {section.image && (
            <DocImage
              src={section.image.src}
              alt={section.image.alt}
              width={section.image.width}
              height={section.image.height}
            />
          )}
        </section>
      ))}
    </DocsLayout>
  )
}
