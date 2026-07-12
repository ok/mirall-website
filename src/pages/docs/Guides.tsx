import { useTranslation } from 'react-i18next'
import Seo from '../../components/Seo'
import DocsLayout, { DocsHeader } from '../../components/docs/DocsLayout'
import { DocBlocks, DocImage, RelatedLinks } from '../../components/docs/blocks'
import { stepsFromDoc, type DocItem } from '../../components/docs/content'
import { breadcrumbSchema, howToSchema } from '../../lib/schema'

interface Group {
  id: string
  title: string
  docs: DocItem[]
}

export default function Guides() {
  const { t } = useTranslation()
  const groups = t('docs.guides.groups', { returnObjects: true }) as unknown as Group[]

  const sections = groups.map((g) => ({ id: g.id, label: g.title }))

  const howTos = groups
    .flatMap((g) => g.docs)
    .map((doc) => {
      const steps = stepsFromDoc(doc)
      return steps ? howToSchema(doc.title, doc.intro || doc.title, steps) : null
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  return (
    <DocsLayout
      active="guides"
      sections={sections}
      seo={
        <Seo
          title="Mirall How-to Guides — Spaces, Files & Folders"
          description="Step-by-step recipes for everyday tasks in Mirall: create and join spaces, approve who joins, share files and folders, mirror a folder to disk, and more."
          path="/docs/guides"
          jsonLd={[
            breadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Documentation', path: '/docs' },
              { name: 'How-to guides', path: '/docs/guides' },
            ]),
            ...howTos,
          ]}
        />
      }
    >
      <DocsHeader
        label={t('docs.guides.label')}
        heading={t('docs.guides.heading')}
        intro={t('docs.guides.intro')}
      />

      {groups.map((group) => (
        <section key={group.id} id={group.id} className="scroll-mt-28 mb-14">
          <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-6 pb-2 border-b border-outline-variant/30">
            {group.title}
          </h2>
          <div className="space-y-12">
            {group.docs.map((doc) => (
              <article key={doc.id} id={doc.id} className="scroll-mt-28">
                <h3 className="text-2xl font-bold font-headline text-on-surface mb-3">
                  {doc.title}
                </h3>
                {doc.intro && (
                  <p className="text-lg text-on-surface-variant leading-relaxed mb-6">{doc.intro}</p>
                )}
                {doc.blocks && <DocBlocks blocks={doc.blocks} />}
                {doc.image && (
                  <DocImage
                    src={doc.image.src}
                    alt={doc.image.alt}
                    width={doc.image.width}
                    height={doc.image.height}
                  />
                )}
                {doc.related && <RelatedLinks links={doc.related} />}
              </article>
            ))}
          </div>
        </section>
      ))}
    </DocsLayout>
  )
}
