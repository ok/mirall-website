import { useTranslation } from 'react-i18next'
import { InstagramLogo, XLogo } from '@phosphor-icons/react'
import GithubMark from './GithubMark'
import { GITHUB_URL, INSTAGRAM_URL, X_URL } from '../lib/links'

const LINK_CLASS =
  'flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 hover:text-emerald-500 hover:bg-surface-container-low transition-colors'

export default function SocialLinks({ className }: { className: string }) {
  const { t } = useTranslation()
  const links = [
    { href: GITHUB_URL, label: t('nav.githubAria'), icon: <GithubMark size={22} /> },
    { href: INSTAGRAM_URL, label: t('nav.instagramAria'), icon: <InstagramLogo size={24} weight="bold" aria-hidden="true" /> },
    { href: X_URL, label: t('nav.xAria'), icon: <XLogo size={22} weight="bold" aria-hidden="true" /> },
  ]

  return (
    <div className={className}>
      {links.map(({ href, label, icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={LINK_CLASS}
        >
          {icon}
        </a>
      ))}
    </div>
  )
}
