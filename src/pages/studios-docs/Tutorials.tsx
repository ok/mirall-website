import { useTranslation } from 'react-i18next'
import Seo from '../../components/Seo'
import DocsLayout, { DocsHeader } from '../../components/docs/DocsLayout'
import { DocBlocks, RelatedLinks, RichText } from '../../components/docs/blocks'
import { stepsFromDoc, stripInline, type DocItem } from '../../components/docs/content'
import { STUDIOS_DOCS, STUDIOS_DOCS_NAV, studiosDocsCrumbs, studiosDocsHeader } from '../../components/docs/studios'
import { breadcrumbSchema, howToSchema } from '../../lib/schema'

export default function StudiosTutorials() {
  const { t } = useTranslation()
  const items = t('studiosDocs.tutorials.items', { returnObjects: true }) as unknown as DocItem[]

  const sections = items.map((item) => ({ id: item.id, label: item.title }))
  const howTos = items
    .map((item) => {
      const steps = stepsFromDoc(item)
      return steps ? howToSchema(item.title, stripInline(item.intro || item.title), steps) : null
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  return (
    <DocsLayout
      active="tutorials"
      sections={sections}
      nav={STUDIOS_DOCS_NAV}
      navLabelKey="studiosDocs.title"
      header={studiosDocsHeader(t)}
      seo={
        <Seo
          title="Mirall for Studios Tutorials — Set Up Your Studio"
          description="A guided first run through the Mirall Console: create your organization, publish its first configuration, issue a license key and connect a computer."
          path={`${STUDIOS_DOCS}/tutorials`}
          jsonLd={[
            breadcrumbSchema(studiosDocsCrumbs({ name: 'Tutorials', path: `${STUDIOS_DOCS}/tutorials` })),
            ...howTos,
          ]}
        />
      }
    >
      <DocsHeader
        label={t('studiosDocs.tutorials.label')}
        heading={t('studiosDocs.tutorials.heading')}
        intro={t('studiosDocs.tutorials.intro')}
      />

      {items.map((item) => (
        <section key={item.id} id={item.id} className="scroll-mt-28 mb-16">
          <h2 className="text-3xl font-black font-headline text-on-surface mb-4">{item.title}</h2>
          {item.intro && (
            <p className="text-lg text-on-surface-variant leading-relaxed mb-8">
              <RichText text={item.intro} />
            </p>
          )}
          {item.blocks && <DocBlocks blocks={item.blocks} />}
          {item.related && <RelatedLinks links={item.related} />}
        </section>
      ))}
    </DocsLayout>
  )
}
