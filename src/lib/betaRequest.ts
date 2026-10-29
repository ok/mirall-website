// The studios beta form's one call to the Mirall Console.
//
// The site is static, so the request goes to a public endpoint the Console exposes
// through its API gateway; nothing here holds a key. The shape below is the
// website's half of a contract the Console has not published yet
// (plan-console-beta-requests.md). Until it is, VITE_BETA_REQUEST_URL is unset and
// the form says the request didn't go through instead of pretending it did.
//
// Choices are sent as stable codes, not their English labels, so the copy can
// change without changing what the Console stores. Each list matches the order of
// its labels in studios.beta (en.json).

export const TEAM_SIZES = ['1-10', '11-50', '51-200', '200+'] as const
export const TOOLS = ['dropbox', 'google-drive', 'wetransfer', 'aspera', 'masv', 'ftp', 'drives'] as const
export const DELIVERY_SIZES = ['lt-10gb', '10-100gb', '100gb-1tb', 'gt-1tb'] as const

export interface BetaRequest {
  name: string
  email: string
  studio: string
  teamSize: (typeof TEAM_SIZES)[number]
  tools: Array<(typeof TOOLS)[number]>
  deliverySize: (typeof DELIVERY_SIZES)[number]
  message: string
  consent: true
  /** Honeypot: a field people never see. Anything in it marks the request as automated. */
  website: string
}

const ENDPOINT = import.meta.env.VITE_BETA_REQUEST_URL as string | undefined

export async function sendBetaRequest(request: BetaRequest): Promise<void> {
  if (!ENDPOINT) throw new Error('beta requests are not connected')
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!res.ok) throw new Error(`beta request failed: ${res.status}`)
}
