import type { TFunction } from 'i18next'
import type { NavItem } from '../Navbar'
import type { NavEntry } from './DocsLayout'

// The Mirall for Studios docs' sidebar and header. Its copy lives in studios-docs.en.json, under
// `studiosDocs`, beside the app docs rather than in them.

export const STUDIOS_DOCS = '/studios/documentation'

export const STUDIOS_DOCS_NAV: NavEntry[] = [
  { key: 'overview', to: STUDIOS_DOCS, labelKey: 'studiosDocs.nav.overview' },
  { key: 'tutorials', to: `${STUDIOS_DOCS}/tutorials`, labelKey: 'studiosDocs.nav.tutorials' },
  { key: 'guides', to: `${STUDIOS_DOCS}/guides`, labelKey: 'studiosDocs.nav.guides' },
  { key: 'reference', to: `${STUDIOS_DOCS}/reference`, labelKey: 'studiosDocs.nav.reference' },
  { key: 'explanation', to: `${STUDIOS_DOCS}/explanation`, labelKey: 'studiosDocs.nav.explanation' },
]

/** The header the studios pages show, so the docs read as part of them. */
export function studiosDocsHeader(t: TFunction): { items: NavItem[]; cta: { label: string; shortLabel: string; to: string } } {
  return {
    items: [
      { label: t('studios.nav.how'), to: '/studios#how' },
      { label: t('studios.nav.infrastructure'), to: '/studios#infrastructure' },
      { label: t('studios.nav.console'), to: '/studios#console' },
      { label: t('studios.nav.docs'), to: STUDIOS_DOCS },
    ],
    cta: { label: t('studios.nav.cta'), shortLabel: t('studios.nav.ctaShort'), to: '/studios#beta' },
  }
}

/** Home › Mirall for Studios › Documentation, then the page itself. */
export function studiosDocsCrumbs(page?: { name: string; path: string }) {
  return [
    { name: 'Home', path: '/' },
    { name: 'Mirall for Studios', path: '/studios' },
    { name: 'Documentation', path: STUDIOS_DOCS },
    ...(page ? [page] : []),
  ]
}
