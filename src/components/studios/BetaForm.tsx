import { useRef, useState, type FormEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { BetaRequestError, CONSENT_VERSION, DELIVERY_SIZES, TEAM_SIZES, TOOLS, invalidField, sendBetaRequest, type BetaRequest } from '../../lib/betaRequest'

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'error'; message: string } | { kind: 'done'; name: string; email: string }

export default function BetaForm() {
  const { t } = useTranslation()
  const form = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [invalid, setInvalid] = useState<string[]>([])
  const sizes = t('studios.beta.sizes', { returnObjects: true }) as string[]
  const tools = t('studios.beta.toolOptions', { returnObjects: true }) as string[]
  const volumes = t('studios.beta.volumes', { returnObjects: true }) as string[]

  const fail = (message: string, field?: string) => {
    setStatus({ kind: 'error', message })
    setInvalid(field ? [field] : [])
    if (field) form.current?.querySelector<HTMLElement>(`#bf-${field}`)?.focus()
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    // Control characters (a pasted one, say) are dropped rather than refused; the
    // Console takes none in a line, and only tabs and line breaks in the message.
    const text = (k: string) => String(data.get(k) ?? '').replace(/\p{Cc}/gu, '').trim()
    const missing = ['name', 'email', 'studio'].filter((k) => !text(k))
    if (missing.length) {
      setInvalid(missing)
      setStatus({ kind: 'error', message: t('studios.beta.errorRequired') })
      form.current?.querySelector<HTMLElement>(`#bf-${missing[0]}`)?.focus()
      return
    }

    const request: BetaRequest = {
      name: text('name'),
      email: text('email'),
      studio: text('studio'),
      teamSize: TEAM_SIZES[Number(data.get('teamSize'))],
      tools: data.getAll('tools').map((i) => TOOLS[Number(i)]),
      deliverySize: DELIVERY_SIZES[Number(data.get('deliverySize'))],
      message: String(data.get('message') ?? '').replace(/[^\P{Cc}\t\n\r]/gu, '').trim(),
      consent: data.get('consent') !== null,
      consentVersion: CONSENT_VERSION,
      website: text('bf-extra'),
    }
    // Checked against the Console's own schema, so what it would refuse is caught
    // here with a message that says what to fix.
    const field = invalidField({ ...request })
    if (field === 'email') return fail(t('studios.beta.errorEmail'), 'email')
    if (field === 'consent') return fail(t('studios.beta.errorConsent'), 'consent')
    if (field) return fail(t('studios.beta.errorSend'))

    setInvalid([])
    setStatus({ kind: 'sending' })
    try {
      await sendBetaRequest(request)
      setStatus({ kind: 'done', name: request.name.split(/\s+/)[0], email: request.email })
    } catch (err) {
      const busy = err instanceof BetaRequestError && err.status === 429
      setStatus({ kind: 'error', message: t(busy ? 'studios.beta.errorBusy' : 'studios.beta.errorSend') })
    }
  }

  if (status.kind === 'done') {
    return (
      <div className="st-lead" role="status" data-reveal>
        <div className="st-done">
          <b>{t('studios.beta.doneTitle', { name: status.name })}</b>
          <span>{t('studios.beta.doneText', { email: status.email })}</span>
        </div>
      </div>
    )
  }

  const bad = (k: string) => (invalid.includes(k) ? true : undefined)

  return (
    <form ref={form} className="st-lead" noValidate onSubmit={submit} data-reveal>
      <div className="st-f">
        <label htmlFor="bf-name">{t('studios.beta.name')}</label>
        <input id="bf-name" name="name" autoComplete="name" maxLength={120} required aria-invalid={bad('name')} placeholder={t('studios.beta.namePlaceholder')} />
      </div>
      <div className="st-f">
        <label htmlFor="bf-email">{t('studios.beta.email')}</label>
        <input id="bf-email" name="email" type="email" autoComplete="email" maxLength={254} required aria-invalid={bad('email')} placeholder={t('studios.beta.emailPlaceholder')} />
      </div>
      <div className="st-f">
        <label htmlFor="bf-studio">{t('studios.beta.studio')}</label>
        <input id="bf-studio" name="studio" autoComplete="organization" maxLength={120} required aria-invalid={bad('studio')} placeholder={t('studios.beta.studioPlaceholder')} />
      </div>
      <div className="st-f">
        <label htmlFor="bf-size">{t('studios.beta.size')}</label>
        <select id="bf-size" name="teamSize" defaultValue="1">
          {sizes.map((s, i) => <option key={s} value={i}>{s}</option>)}
        </select>
      </div>
      <fieldset className="st-f st-full">
        <legend>{t('studios.beta.tools')}</legend>
        <div className="st-chips">
          {tools.map((tool, i) => (
            <label key={tool}>
              <input type="checkbox" name="tools" value={i} />
              <span>{tool}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="st-f st-full">
        <label htmlFor="bf-volume">{t('studios.beta.volume')}</label>
        <select id="bf-volume" name="deliverySize" defaultValue="1">
          {volumes.map((v, i) => <option key={v} value={i}>{v}</option>)}
        </select>
      </div>
      <div className="st-f st-full">
        <label htmlFor="bf-message">
          {t('studios.beta.message')} <span className="st-opt">{t('studios.beta.optional')}</span>
        </label>
        <textarea id="bf-message" name="message" maxLength={2000} placeholder={t('studios.beta.messagePlaceholder')} />
      </div>
      {/* The honeypot, sent as `website`. Its name and label give autofill and password
          managers nothing to match (they fill a field named "website" even off screen), and the
          data- attributes tell the common managers to skip it outright. */}
      <div className="st-hp" aria-hidden="true">
        <label htmlFor="bf-extra">Leave this empty</label>
        <input id="bf-extra" name="bf-extra" type="text" tabIndex={-1} autoComplete="off" maxLength={200} data-1p-ignore="" data-lpignore="true" data-bwignore="" data-form-type="other" />
      </div>
      <label className="st-consent" htmlFor="bf-consent">
        <input id="bf-consent" type="checkbox" name="consent" required aria-invalid={bad('consent')} />
        <span>
          <Trans i18nKey="studios.beta.consent" components={{ privacy: <a href="/privacy#website" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-[#fce8d2]" /> }} />
        </span>
      </label>
      <div className="st-submit">
        <button className="st-btn st-btn-primary" type="submit" disabled={status.kind === 'sending'}>
          {status.kind === 'sending' ? t('studios.beta.sending') : t('studios.beta.submit')}
        </button>
        <span className="st-err" role="alert">{status.kind === 'error' ? status.message : ''}</span>
      </div>
    </form>
  )
}
