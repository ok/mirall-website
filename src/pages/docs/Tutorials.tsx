import { useTranslation } from 'react-i18next'
import Seo from '../../components/Seo'
import DocsLayout, { DocsHeader } from '../../components/docs/DocsLayout'
import { DocBlocks, RelatedLinks } from '../../components/docs/blocks'
import { stepsFromDoc, type DocItem } from '../../components/docs/content'
import { breadcrumbSchema, howToSchema } from '../../lib/schema'

export default function Tutorials() {
  const { t } = useTranslation()
  const items = t('docs.tutorials.items', { returnObjects: true }) as unknown as DocItem[]

  const sections = items.map((item) => ({ id: item.id, label: item.title }))
  const howTos = items
    .map((item) => {
      const steps = stepsFromDoc(item)
      return steps ? howToSchema(item.title, item.intro || item.title, steps) : null
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  return (
    <DocsLayout
      active="tutorials"
      sections={sections}
      seo={
        <Seo
          title="Mirall Tutorials — Get Started Step by Step"
          description="Guided, end-to-end lessons for newcomers: send your first files and share a folder that stays in sync between devices."
          path="/docs/tutorials"
          jsonLd={[
            breadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Documentation', path: '/docs' },
              { name: 'Tutorials', path: '/docs/tutorials' },
            ]),
            ...howTos,
          ]}
        />
      }
    >
      <DocsHeader
        label={t('docs.tutorials.label')}
        heading={t('docs.tutorials.heading')}
        intro={t('docs.tutorials.intro')}
      />

      {items.map((item) => (
        <section key={item.id} id={item.id} className="scroll-mt-28 mb-16">
          <h2 className="text-3xl font-black font-headline text-on-surface mb-4">{item.title}</h2>
          {item.intro && (
            <p className="text-lg text-on-surface-variant leading-relaxed mb-8">{item.intro}</p>
          )}
          {item.blocks && <DocBlocks blocks={item.blocks} />}
          {item.related && <RelatedLinks links={item.related} />}
        </section>
      ))}
    </DocsLayout>
  )
}
