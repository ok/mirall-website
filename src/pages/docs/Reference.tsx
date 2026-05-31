import { useTranslation } from 'react-i18next'
import Seo from '../../components/Seo'
import DocsLayout, { DocsHeader } from '../../components/docs/DocsLayout'
import { Bullets, RefTable, DocImage } from '../../components/docs/blocks'
import { type DocItem } from '../../components/docs/content'
import { breadcrumbSchema } from '../../lib/schema'

export default function Reference() {
  const { t } = useTranslation()
  const sectionsData = t('docs.reference.sections', { returnObjects: true }) as unknown as DocItem[]

  const sections = sectionsData.map((s) => ({ id: s.id, label: s.title }))

  return (
    <DocsLayout
      active="reference"
      sections={sections}
      seo={
        <Seo
          title="Mirall Reference — Statuses, Shortcuts & Settings"
          description="Complete reference for Mirall: file statuses, folder and share types, file actions, keyboard shortcuts, settings, the application menu, and supported platforms."
          path="/docs/reference"
          jsonLd={breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Documentation', path: '/docs' },
            { name: 'Reference', path: '/docs/reference' },
          ])}
        />
      }
    >
      <DocsHeader
        label={t('docs.reference.label')}
        heading={t('docs.reference.heading')}
        intro={t('docs.reference.intro')}
      />

      {sectionsData.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-28 mb-14">
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-3">{section.title}</h2>
          {section.intro && (
            <p className="text-on-surface-variant leading-relaxed mb-6 text-lg">{section.intro}</p>
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
