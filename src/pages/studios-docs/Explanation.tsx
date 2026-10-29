import { useTranslation } from 'react-i18next'
import Seo from '../../components/Seo'
import DocsLayout, { DocsHeader } from '../../components/docs/DocsLayout'
import { DocBlocks } from '../../components/docs/blocks'
import { type DocItem } from '../../components/docs/content'
import { STUDIOS_DOCS, STUDIOS_DOCS_NAV, studiosDocsCrumbs, studiosDocsHeader } from '../../components/docs/studios'
import { breadcrumbSchema } from '../../lib/schema'

export default function StudiosExplanation() {
  const { t } = useTranslation()
  const topics = t('studiosDocs.explanation.topics', { returnObjects: true }) as unknown as DocItem[]

  const sections = topics.map((topic) => ({ id: topic.id, label: topic.title }))

  return (
    <DocsLayout
      active="explanation"
      sections={sections}
      nav={STUDIOS_DOCS_NAV}
      navLabelKey="studiosDocs.title"
      header={studiosDocsHeader(t)}
      seo={
        <Seo
          title="Mirall for Studios Explained — How the Console Fits In"
          description="What the Mirall Console holds and never sees, how license keys, profiles and templates fit together, how configuration is delivered, and your studio's relay."
          path={`${STUDIOS_DOCS}/explanation`}
          jsonLd={breadcrumbSchema(studiosDocsCrumbs({ name: 'Explanation', path: `${STUDIOS_DOCS}/explanation` }))}
        />
      }
    >
      <DocsHeader
        label={t('studiosDocs.explanation.label')}
        heading={t('studiosDocs.explanation.heading')}
        intro={t('studiosDocs.explanation.intro')}
      />

      {topics.map((topic) => (
        <section key={topic.id} id={topic.id} className="scroll-mt-28 mb-14">
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">{topic.title}</h2>
          {topic.blocks && <DocBlocks blocks={topic.blocks} />}
        </section>
      ))}
    </DocsLayout>
  )
}
