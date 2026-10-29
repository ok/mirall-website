import { useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../Navbar'
import Footer from '../Footer'
import { useHashScroll, useStudioMotion } from './useStudioMotion'

/**
 * The shell both studios pages share: the site's own header and footer in their
 * dark tone, so moving between /studios and the rest of the site changes colours
 * but never the layout. On the landing page the header links are its own
 * sections; on a subpage they lead back to them.
 */
export default function StudioLayout({ children, subpage = false }: { children: ReactNode; subpage?: boolean }) {
  const { t } = useTranslation()
  const root = useRef<HTMLDivElement>(null)
  useStudioMotion(root)
  useHashScroll()
  const base = subpage ? '/studios' : ''

  return (
    <div ref={root} className="studio">
      <Navbar
        tone="dark"
        items={[
          { label: t('studios.nav.how'), to: `${base}#how` },
          { label: t('studios.nav.infrastructure'), to: `${base}#infrastructure` },
          { label: t('studios.nav.console'), to: `${base}#console` },
          { label: t('studios.nav.docs'), to: '/studios/documentation' },
        ]}
        cta={{ label: t('studios.nav.cta'), shortLabel: t('studios.nav.ctaShort'), to: `${base}#beta` }}
      />
      <main className="pt-20">{children}</main>
      <Footer tone="dark" />
    </div>
  )
}
