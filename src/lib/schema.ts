import { stripLinks } from './inline'
import { GITHUB_URL } from './links'

export const SITE_URL = 'https://mirall.app'
export const SITE_NAME = 'Mirall'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.webp`

// Stable node ids. Without them each schema block declares its own anonymous
// "Mirall", and a search engine has three unrelated nodes that happen to share a
// name rather than one entity described three ways — which is exactly the
// consolidation sameAs below is meant to achieve.
export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

type JsonLd = Record<string, unknown>

export function organizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    // How a search engine ties this name to profiles it already recognises —
    // the standard remedy when a common word resolves to somebody else's entity.
    //
    // Only list a URL that IS this entity. A third-party article about Mirall is
    // a mention, not a profile. The personal GitHub account that hosts the
    // repository is a person, not the project, so it is deliberately absent —
    // claiming it here would blur the entity rather than sharpen it.
    //
    // sameAs gets stronger with each corroborating profile: add them here as they
    // exist (Mastodon, LinkedIn, Wikidata, a package registry listing).
    sameAs: [GITHUB_URL],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Berlin',
      addressCountry: 'DE',
    },
  }
}

export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
  }
}

export function softwareApplicationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    description:
      'Move hundreds of gigabytes or terabytes directly between devices — no size caps, no per-GB fees. End-to-end encrypted. No cloud storage, no accounts, no telemetry.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'macOS, Windows, Linux',
    url: SITE_URL,
    downloadUrl: `${SITE_URL}/download`,
    // Open-source signals: schema.org properties search engines use to recognise
    // a project as such.
    codeRepository: GITHUB_URL,
    license: 'https://www.gnu.org/licenses/agpl-3.0.html',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    featureList: [
      'Direct device-to-device file transfer',
      'End-to-end encrypted',
      'No cloud storage',
      'Supports files up to multi-terabyte',
      'Resumable transfers',
      'No accounts required',
      'Local-first — works offline',
    ],
    publisher: { '@id': ORG_ID },
  }
}

export function faqPageSchema(items: Array<{ question: string; answer: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        // Answers may carry [label](url) markup for the on-page render; structured
        // data takes the prose only.
        text: stripLinks(item.answer),
      },
    })),
  }
}

export function howToSchema(
  name: string,
  description: string,
  steps: Array<{ title: string; description: string }>,
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.description,
    })),
  }
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}
