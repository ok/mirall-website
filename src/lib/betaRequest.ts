// The studios beta form's one call to the Mirall Console.
//
// The site is static, so the request goes to a public endpoint the Console exposes
// through its API gateway (POST /v1/beta-request); nothing here holds a key. The
// body is the Console's contract, copied verbatim into ./contracts (see its README):
// the form checks a request against that JSON Schema before sending, so a request
// the Console would refuse is caught here with a message that says what to fix.
// Until VITE_BETA_REQUEST_URL is set, the form says the request didn't go through
// instead of pretending it did.
//
// Choices are sent as stable codes, not their English labels, so the copy can
// change without changing what the Console stores. Each list matches the order of
// its labels in studios.beta (en.json); npm run check:contract compares them with
// the schema.

import schema from './contracts/beta-request-v1.schema.json' with { type: 'json' }

export const TEAM_SIZES = ['1-10', '11-50', '51-200', '200+'] as const
export const TOOLS = ['dropbox', 'google-drive', 'wetransfer', 'aspera', 'masv', 'ftp', 'drives'] as const
export const DELIVERY_SIZES = ['lt-10gb', '10-100gb', '100gb-1tb', 'gt-1tb'] as const

/**
 * The month of the consent wording the form shows (studios.beta.consent) and of the
 * privacy policy section it points to. Change it whenever either changes.
 */
export const CONSENT_VERSION = '2026-10'

export interface BetaRequest {
  name: string
  email: string
  studio: string
  teamSize: (typeof TEAM_SIZES)[number]
  tools: Array<(typeof TOOLS)[number]>
  deliverySize: (typeof DELIVERY_SIZES)[number]
  message: string
  consent: boolean
  consentVersion: string
  /** Honeypot: a field people never see. Anything in it marks the request as automated. */
  website: string
}

interface Rule {
  type?: string
  enum?: string[]
  const?: unknown
  minLength?: number
  maxLength?: number
  maxItems?: number
  pattern?: string
  uniqueItems?: boolean
  items?: Rule
}

const rules = schema.properties as Record<string, Rule>

// The schema's patterns are Unicode-aware (\P{Cc}), and its lengths count UTF-16
// units like JavaScript's, so string.length and a /u RegExp read it as written.
function valid(rule: Rule, value: unknown): boolean {
  if (rule.const !== undefined && value !== rule.const) return false
  if (rule.type === 'boolean') return typeof value === 'boolean'
  if (rule.type === 'array') {
    if (!Array.isArray(value)) return false
    if (rule.maxItems !== undefined && value.length > rule.maxItems) return false
    if (rule.uniqueItems && new Set(value).size !== value.length) return false
    return value.every((item) => !rule.items || valid(rule.items, item))
  }
  if (typeof value !== 'string') return false
  if (rule.enum && !rule.enum.includes(value)) return false
  if (rule.minLength !== undefined && value.length < rule.minLength) return false
  if (rule.maxLength !== undefined && value.length > rule.maxLength) return false
  return !rule.pattern || new RegExp(rule.pattern, 'u').test(value)
}

/**
 * The first field of `body` the Console would refuse, in the schema's order, or
 * null when it would take the request. An unknown field counts as refused.
 */
export function invalidField(body: Record<string, unknown>): string | null {
  for (const key of schema.required) if (!(key in body) || !valid(rules[key], body[key])) return key
  return Object.keys(body).find((key) => !(key in rules)) ?? null
}

export class BetaRequestError extends Error {
  readonly status: number
  constructor(status: number) {
    super(`beta request failed: ${status}`)
    this.status = status
  }
}

export async function sendBetaRequest(request: BetaRequest): Promise<void> {
  const endpoint = import.meta.env.VITE_BETA_REQUEST_URL as string | undefined
  if (!endpoint) throw new BetaRequestError(0)
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!res.ok) throw new BetaRequestError(res.status)
}
