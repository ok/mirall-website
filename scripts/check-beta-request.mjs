// Holds the beta form to the Console's contract (src/lib/contracts):
//  - the website's choice codes are the schema's, in the same order (en.json's
//    labels are matched to them by position);
//  - invalidField() agrees with every vector: accepted bodies pass, invalid ones
//    fail. Automated bodies (the honeypot) are the Console's call and skipped.
// Imports the TypeScript module directly, so it needs Node's type stripping (22.18+).
import vectors from '../src/lib/contracts/beta-request-v1.vectors.json' with { type: 'json' }
import { CONSENT_VERSION, DELIVERY_SIZES, TEAM_SIZES, TOOLS, invalidField } from '../src/lib/betaRequest.ts'

const failures = []
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

for (const [name, ours] of Object.entries({ teamSize: TEAM_SIZES, tools: TOOLS, deliverySize: DELIVERY_SIZES })) {
  if (!same(ours, vectors.codes[name])) failures.push(`codes for ${name}: ${ours.join(',')} ≠ ${vectors.codes[name].join(',')}`)
}
if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(CONSENT_VERSION)) failures.push(`CONSENT_VERSION ${CONSENT_VERSION} is not a month`)

const asObject = (body) => (typeof body === 'object' && body !== null && !Array.isArray(body) ? body : null)
for (const { name, body } of vectors.bodies.accepted) {
  const field = invalidField(body)
  if (field) failures.push(`accepted "${name}" refused at ${field}`)
}
for (const { name, body } of vectors.bodies.invalid) {
  const object = asObject(body)
  if (object && !invalidField(object)) failures.push(`invalid "${name}" passed`)
}

const total = vectors.bodies.accepted.length + vectors.bodies.invalid.length
if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log(`beta request contract: codes match, ${total} vectors agree`)
