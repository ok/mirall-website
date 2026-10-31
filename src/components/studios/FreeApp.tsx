import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Desktop, X } from '@phosphor-icons/react'
import SendToComputer from '../SendToComputer'
import { isHandheld } from '../../lib/handheld'

/**
 * The free app as the hero's second path, for people who aren't choosing for a studio.
 * Most of them arrive on a phone from the QR code on our cards, where a download would
 * lead nowhere: there it opens a sheet that sends the link to their computer, and
 * they stay on the page. Everywhere else it is a plain link to /download.
 */
export default function FreeApp() {
  const { t } = useTranslation()
  const sheet = useRef<HTMLDialogElement>(null)

  const open = (e: React.MouseEvent) => {
    if (!isHandheld() || !sheet.current) return
    e.preventDefault()
    sheet.current.showModal()
  }
  const close = () => sheet.current?.close()

  return (
    <>
      <Link to="/download" className="st-free" onClick={open}>
        <span className="st-free-icon" aria-hidden="true"><Desktop size={20} weight="regular" /></span>
        <span className="st-free-title">{t('studios.hero.free.title')}</span>
        <span className="st-free-link">{t('studios.hero.free.link')} →</span>
      </Link>
      {/* A click on the backdrop lands on the dialog itself, never on its content. */}
      <dialog ref={sheet} className="st-sheet" aria-labelledby="send-to-computer" onClick={(e) => e.target === e.currentTarget && close()}>
        <div className="st-sheet-body">
          <button type="button" className="st-sheet-close" onClick={close} aria-label={t('handoff.close')}>
            <X size={20} weight="bold" />
          </button>
          <SendToComputer tone="dark" titleId="send-to-computer" />
        </div>
      </dialog>
    </>
  )
}
