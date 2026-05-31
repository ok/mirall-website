import { useTranslation } from 'react-i18next'
import Seo from '../../components/Seo'
import DocsLayout, { DocsHeader } from '../../components/docs/DocsLayout'
import { DocBlocks } from '../../components/docs/blocks'
import { type DocItem } from '../../components/docs/content'
import { breadcrumbSchema } from '../../lib/schema'

export default function Explanation() {
  const { t } = useTranslation()
  const topics = t('docs.explanation.topics', { returnObjects: true }) as unknown as DocItem[]

  const sections = topics.map((topic) => ({ id: topic.id, label: topic.title }))

  return (
    <DocsLayout
      active="explanation"
      sections={sections}
      seo={
        <Seo
          title="Mirall Explained — How Peer-to-Peer File Transfer Works"
          description="Understand how Mirall works: the peer-to-peer model, end-to-end encryption, mirroring, eager vs on-demand sharing, storage reclaim, and how it compares to cloud transfer services."
          path="/docs/explanation"
          jsonLd={breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Documentation', path: '/docs' },
            { name: 'Explanation', path: '/docs/explanation' },
          ])}
        />
      }
    >
      <DocsHeader
        label={t('docs.explanation.label')}
        heading={t('docs.explanation.heading')}
        intro={t('docs.explanation.intro')}
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
