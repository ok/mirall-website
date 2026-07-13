import { useTranslation } from 'react-i18next'
import Navbar from './Navbar'
import Footer from './Footer'
import Seo from './Seo'
import { DocBlocks } from './docs/blocks'
import type { Block } from './docs/content'
import { breadcrumbSchema } from '../lib/schema'

// Shared shell for the legal pages (privacy policy, Impressum). They differ only
// in their content namespace, so the layout lives here rather than twice.

interface Section {
  id: string
  title: string
  blocks: Block[]
}

export default function LegalPage({
  ns,
  seoTitle,
  seoDescription,
  path,
  breadcrumb,
}: {
  ns: string
  seoTitle: string
  seoDescription: string
  path: string
  breadcrumb: string
}) {
  const { t } = useTranslation()
  const sections = t(`${ns}.sections`, { returnObjects: true }) as unknown as Section[]
  // Only the privacy policy carries a "last updated" line.
  const updated = t(`${ns}.updated`, { defaultValue: '' })

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        path={path}
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: breadcrumb, path },
        ])}
      />
      <Navbar />
      <main className="pt-20">
        <section className="py-24 bg-background">
          <div className="max-w-3xl mx-auto px-8">
            <span className="uppercase tracking-[0.1em] text-primary font-bold mb-6 block text-sm">
              {t(`${ns}.label`)}
            </span>
            <h1 className="text-5xl font-black font-headline text-on-surface tracking-tighter mb-4">
              {t(`${ns}.title`)}
            </h1>
            {updated && <p className="text-sm text-on-surface-variant/70 mb-8">{updated}</p>}
            <p className="text-lg text-on-surface-variant leading-relaxed mb-16">
              {t(`${ns}.intro`)}
            </p>

            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28 mb-14">
                <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">
                  {section.title}
                </h2>
                <DocBlocks blocks={section.blocks} />
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
