import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'

export type DocsSection = 'overview' | 'tutorials' | 'guides' | 'reference' | 'explanation' | 'changelog'

interface NavEntry {
  key: DocsSection
  to: string
  labelKey: string
}

const NAV: NavEntry[] = [
  { key: 'overview', to: '/docs', labelKey: 'docs.nav.overview' },
  { key: 'tutorials', to: '/docs/tutorials', labelKey: 'docs.nav.tutorials' },
  { key: 'guides', to: '/docs/guides', labelKey: 'docs.nav.guides' },
  { key: 'reference', to: '/docs/reference', labelKey: 'docs.nav.reference' },
  { key: 'explanation', to: '/docs/explanation', labelKey: 'docs.nav.explanation' },
  { key: 'changelog', to: '/changelog', labelKey: 'docs.nav.changelog' },
]

interface DocsLayoutProps {
  active: DocsSection
  /** In-page anchors for the active page, rendered as sub-links under it. */
  sections?: Array<{ id: string; label: string }>
  seo: React.ReactNode
  children: React.ReactNode
}

export default function DocsLayout({ active, sections = [], seo, children }: DocsLayoutProps) {
  const { t } = useTranslation()
  const { hash } = useLocation()

  // react-router does not scroll to #hash targets on navigation; do it here so
  // cross-page "Related" and "Popular" deep links land on the right section.
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])

  return (
    <>
      {seo}
      <Navbar />
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="lg:grid lg:grid-cols-[14rem_1fr] lg:gap-12">
            <aside className="hidden lg:block">
              <nav
                aria-label={t('docs.title')}
                className="sticky top-28 text-sm"
              >
                <ul className="space-y-1">
                  {NAV.map((entry) => {
                    const isActive = entry.key === active
                    return (
                      <li key={entry.key}>
                        <Link
                          to={entry.to}
                          aria-current={isActive ? 'page' : undefined}
                          className={
                            isActive
                              ? 'block rounded-lg px-3 py-2 font-bold text-primary bg-surface-container-low'
                              : 'block rounded-lg px-3 py-2 font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container-low/60 transition-colors'
                          }
                        >
                          {t(entry.labelKey)}
                        </Link>
                        {isActive && sections.length > 0 && (
                          <ul className="mt-1 mb-2 ml-3 border-l border-outline-variant/30 space-y-0.5">
                            {sections.map((s) => (
                              <li key={s.id}>
                                <a
                                  href={`#${s.id}`}
                                  className="block py-1.5 pl-4 -ml-px border-l border-transparent text-on-surface-variant hover:text-primary hover:border-primary transition-colors"
                                >
                                  {s.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </aside>

            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

/** Shared page header used across docs category pages. */
export function DocsHeader({
  label,
  heading,
  intro,
}: {
  label: string
  heading: string
  intro: string
}) {
  return (
    <header className="mb-12">
      <span className="uppercase tracking-[0.1em] text-primary font-bold mb-4 block text-sm">
        {label}
      </span>
      <h1 className="text-4xl md:text-5xl font-black font-headline text-on-surface tracking-tighter mb-5">
        {heading}
      </h1>
      <p className="text-xl text-on-surface-variant leading-relaxed max-w-2xl">{intro}</p>
    </header>
  )
}
