import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Copy, Desktop, EnvelopeSimple, PaperPlaneTilt } from '@phosphor-icons/react'
import { DOWNLOAD_URL } from '../lib/handheld'

const TONES = {
  light: {
    box: 'bg-surface-container-lowest rounded-xl p-6 sm:p-8 ambient-shadow text-left',
    icon: 'bg-primary-container/10 text-primary',
    title: 'text-on-surface',
    text: 'text-on-surface-variant',
    primary: 'hero-gradient text-on-primary',
    secondary: 'bg-surface-container-low text-on-surface hover:bg-surface-container-high',
    hint: 'text-on-surface-variant',
    url: 'text-on-surface',
  },
  dark: {
    box: 'text-left',
    icon: 'bg-[#5cc4b8]/15 text-[#5cc4b8]',
    title: 'text-[#fce8d2]',
    text: 'text-[#b9b4ad]',
    primary: 'bg-[#fd9c42] text-[#282c34] hover:bg-[#ffb062]',
    secondary: 'bg-[#0c0e12] text-[#fce8d2] hover:bg-black',
    hint: 'text-[#8f939c]',
    url: 'text-[#fce8d2]',
  },
}

/**
 * For a visitor on a phone or tablet: Mirall can't be installed there, so instead of
 * a download this gets the link onto the computer they'll use. The share sheet is the
 * quickest way (AirDrop to a Mac, a message to themselves); copying, email and the
 * short address cover everyone else.
 */
export default function SendToComputer({ tone = 'light', titleId }: { tone?: 'light' | 'dark'; titleId?: string }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const address = useRef<HTMLParagraphElement>(null)
  const c = TONES[tone]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(DOWNLOAD_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // No clipboard access: select the address so it can be copied by hand.
      const range = document.createRange()
      if (!address.current) return
      range.selectNodeContents(address.current)
      getSelection()?.removeAllRanges()
      getSelection()?.addRange(range)
    }
  }

  const share = async () => {
    if (!navigator.share) return copy()
    try {
      await navigator.share({ title: t('handoff.shareTitle'), text: t('handoff.shareText'), url: DOWNLOAD_URL })
    } catch {
      // Dismissing the share sheet rejects too; there's nothing to report.
    }
  }

  const mail = `mailto:?subject=${encodeURIComponent(t('handoff.emailSubject'))}&body=${encodeURIComponent(t('handoff.emailBody', { url: DOWNLOAD_URL }))}`
  const button = 'flex items-center justify-center gap-2 rounded-lg font-bold transition-colors'

  return (
    <div className={c.box}>
      <div className="flex items-start gap-4 mb-6">
        <span className={`shrink-0 w-11 h-11 rounded-lg flex items-center justify-center ${c.icon}`}>
          <Desktop size={24} weight="regular" />
        </span>
        <div>
          <h2 id={titleId} className={`font-headline font-extrabold text-xl leading-tight tracking-tight mb-2 ${c.title}`}>
            {t('handoff.title')}
          </h2>
          <p className={`text-[15px] leading-relaxed ${c.text}`}>{t('handoff.text')}</p>
        </div>
      </div>
      <div className="grid gap-3">
        <button type="button" onClick={share} className={`${button} ${c.primary} px-6 py-4 text-base`}>
          <PaperPlaneTilt size={20} weight="regular" />
          {t('handoff.share')}
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={copy} className={`${button} ${c.secondary} px-4 py-3 text-sm`} aria-live="polite">
            <Copy size={18} weight="regular" />
            {copied ? t('handoff.copied') : t('handoff.copy')}
          </button>
          <a href={mail} className={`${button} ${c.secondary} px-4 py-3 text-sm`}>
            <EnvelopeSimple size={18} weight="regular" />
            {t('handoff.email')}
          </a>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className={`text-xs ${c.hint}`}>{t('handoff.type')}</p>
        <p ref={address} className={`font-mono text-base font-semibold tracking-wide mt-1 select-all ${c.url}`}>
          mirall.app/download
        </p>
      </div>
    </div>
  )
}
