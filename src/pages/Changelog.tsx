import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'
import DocsLayout, { DocsHeader } from '../components/docs/DocsLayout'
import { RichText } from '../components/docs/blocks'
import { breadcrumbSchema } from '../lib/schema'

interface Release {
  version: string
  date: string
  sections: Array<{ heading: string; items: string[] }>
}

const HEADING_STYLES: Record<string, string> = {
  Added: 'bg-primary-container/60 text-on-primary-container',
  Changed: 'bg-secondary-fixed text-on-secondary-fixed-variant',
  Fixed: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
}

export default function Changelog() {
  const { t } = useTranslation()
  const releases = t('changelog.releases', { returnObjects: true }) as unknown as Release[]

  const sections = releases.map((r) => ({ id: `v${r.version}`, label: `v${r.version}` }))

  return (
    <DocsLayout
      active="changelog"
      sections={sections}
      seo={
        <Seo
          title="Mirall Changelog — What's New"
          description="Release notes for Mirall. Folder sharing and mirroring, on-demand sharing, per-folder storage, navigation, accessibility, and every user-facing change before it."
          path="/changelog"
          jsonLd={breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Changelog', path: '/changelog' },
          ])}
        />
      }
    >
      <DocsHeader
        label={t('changelog.label')}
        heading={t('changelog.heading')}
        intro={t('changelog.intro')}
      />

      <div className="space-y-14">
        {releases.map((release) => (
          <section key={release.version} id={`v${release.version}`} className="scroll-mt-28">
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="text-2xl font-black font-headline text-on-surface">
                v{release.version}
              </h2>
              <time className="text-sm text-on-surface-variant font-medium" dateTime={release.date}>
                {release.date}
              </time>
            </div>
            <div className="space-y-6">
              {release.sections.map((section, si) => (
                <div key={si}>
                  <h3 className="mb-3">
                    <span
                      className={`inline-block text-xs font-bold uppercase tracking-[0.08em] rounded-full px-2.5 py-1 ${
                        HEADING_STYLES[section.heading] || 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {section.heading}
                    </span>
                  </h3>
                  <ul className="space-y-2.5 pl-1">
                    {section.items.map((item, ii) => (
                      <li key={ii} className="flex items-start gap-3">
                        <span
                          className="mt-2 h-1.5 w-1.5 rounded-full bg-outline shrink-0"
                          aria-hidden="true"
                        />
                        <RichText
                          text={item}
                          className="text-on-surface-variant leading-relaxed"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </DocsLayout>
  )
}
