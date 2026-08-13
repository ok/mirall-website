#!/usr/bin/env node
/**
 * Compares two postdeploy-gate runs and blocks only on regressions.
 *
 * The gate checks the correctness of the whole site, not of a PR's diff. Failing
 * a PR because some *other* page carries a defect it never touched is how a
 * useful check gets bypassed six months later — so the question this asks is
 * "did this PR break something that worked?", not "is the site perfect?".
 *
 *   BLOCK   green on baseline, red on candidate      the PR broke it
 *   report  red on both                              pre-existing, not this PR
 *   fixed   red on baseline, green on candidate      the PR improved it
 *
 * Consumes `MIRALL_GATE_JSON=1` output, not prose, for one specific reason: a
 * check *missing* from `checks` was never reached, which is different from
 * failing. Grepping English cannot express that. When the baseline cannot be
 * established for a check — production unreachable, or the run died early —
 * "was it green before?" is unknown, and treating unknown as green blocks PRs
 * for other people's defects while treating it as red waves a real regression
 * through. Both fail silently, so unknown falls back to strict and the output
 * names which rule it applied. A comparison gate that cannot say whether it
 * actually compared is the same defect as a summary claiming more than it checked.
 *
 * Usage: node gate-diff.mjs <baseline.json> <candidate.json>
 */
import { readFileSync } from 'node:fs'

/** The gate prints its JSON summary as the last line; earlier lines are prose. */
function parse(path) {
  let raw
  try {
    raw = readFileSync(path, 'utf8')
  } catch {
    return null
  }
  const line = raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('{') && l.endsWith('}'))
    .pop()
  if (!line) return null
  try {
    const d = JSON.parse(line)
    return d && typeof d.checks === 'object' ? d : null
  } catch {
    return null
  }
}

const [, , baselinePath, candidatePath] = process.argv
if (!baselinePath || !candidatePath) {
  console.error('usage: gate-diff.mjs <baseline.json> <candidate.json>')
  process.exit(2)
}

const baseline = parse(baselinePath)
const candidate = parse(candidatePath)

if (!candidate) {
  console.error(`FAIL — the candidate gate produced no JSON summary (${candidatePath}).`)
  console.error('The gate did not run to completion against this PR. Not treating that as a pass.')
  process.exit(1)
}
if (!baseline) {
  console.log(`note: no baseline summary at ${baselinePath} — every check falls back to strict.`)
}

const baseChecks = baseline?.checks ?? {}
const rows = []
let regressions = 0
let unjudged = 0

for (const [id, cand] of Object.entries(candidate.checks)) {
  // Absent from the baseline => never reached => unknown, not green.
  const base = Object.hasOwn(baseChecks, id) ? baseChecks[id] : 'unknown'
  let verdict, note

  if (cand === 'skip') {
    verdict = 'BLOCK'
    note = 'candidate skipped this check — an incomplete run is not a pass'
    unjudged++
  } else if (base === 'pass' && cand === 'fail') {
    verdict = 'BLOCK'
    note = 'green -> red (regression introduced by this PR)'
    regressions++
  } else if (base === 'fail' && cand === 'fail') {
    verdict = 'report'
    note = 'red -> red (pre-existing, not this PR)'
  } else if (base === 'fail' && cand === 'pass') {
    verdict = 'fixed'
    note = 'red -> green (this PR fixed it)'
  } else if (base === 'pass' && cand === 'pass') {
    verdict = 'ok'
    note = 'green -> green'
  } else if (cand === 'fail') {
    verdict = 'BLOCK'
    note = `baseline ${base} — cannot compare, treated strictly`
    unjudged++
  } else {
    verdict = 'ok'
    note = `baseline ${base} — candidate green`
  }

  rows.push({ id, verdict, note })
}

// JS orders integer-like object keys first, so "3b" would print after "5".
// Sort by numeric prefix then suffix to match the order the gate runs them in.
const key = (id) => {
  const m = id.match(/^(\d+)(.*)$/)
  return [Number(m?.[1] ?? 0), m?.[2] ?? '']
}
rows.sort((a, b) => {
  const [an, as] = key(a.id)
  const [bn, bs] = key(b.id)
  return an - bn || as.localeCompare(bs)
})

const w = Math.max(...rows.map((r) => r.id.length), 2)
console.log(`baseline:  ${baseline?.base ?? '(unavailable)'}`)
console.log(`candidate: ${candidate.base}`)
console.log('')
for (const r of rows) console.log(`  ${r.id.padEnd(w)}  ${r.verdict.padEnd(7)} ${r.note}`)
console.log('')

const fixed = rows.filter((r) => r.verdict === 'fixed').length
const preexisting = rows.filter((r) => r.verdict === 'report').length

if (regressions + unjudged > 0) {
  // "You broke this" and "this could not be judged" are different messages;
  // merging them would be the overclaim this gate exists to avoid.
  const parts = []
  if (regressions) parts.push(`${regressions} regression(s) introduced by this PR`)
  if (unjudged) parts.push(`${unjudged} check(s) that could not be judged (blocked to fail safe)`)
  console.log(
    `FAIL — ${parts.join('; ')}` +
      (preexisting ? `; ${preexisting} pre-existing failure(s) not counted against it` : ''),
  )
  process.exit(1)
}
console.log(
  'PASS — no regressions' +
    (fixed ? `; ${fixed} check(s) fixed by this PR` : '') +
    (preexisting ? `; ${preexisting} pre-existing failure(s) left as-is` : ''),
)
