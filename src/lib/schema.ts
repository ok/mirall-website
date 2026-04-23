export const SITE_URL = 'https://mirall.app'
export const SITE_NAME = 'Mirall'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.webp`

type JsonLd = Record<string, unknown>

export function organizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
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
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@type': 'Organization', name: SITE_NAME },
    inLanguage: 'en',
  }
}

export function softwareApplicationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    description:
      'Secure large file transfer for regulated industries. Move terabyte-scale files directly between devices. End-to-end encrypted, GDPR-compliant by architecture, no third-party servers.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'macOS, Windows, Linux',
    url: SITE_URL,
    downloadUrl: `${SITE_URL}/download`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    featureList: [
      'Direct device-to-device file transfer',
      'End-to-end encrypted',
      'No cloud storage, no third-party servers',
      'Supports files up to multi-terabyte',
      'Resumable transfers',
      'No accounts required',
      'GDPR compliant by architecture',
    ],
    publisher: { '@type': 'Organization', name: SITE_NAME },
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
        text: item.answer,
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
