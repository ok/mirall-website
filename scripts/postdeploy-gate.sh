#!/usr/bin/env bash
#
# THE ONLY COPY. Authored by Sentinel; it lives here because CI can only run
# what is committed to the repo it gates. It was briefly duplicated in the
# agents' shared workspace; that copy is deleted, deliberately, rather than kept
# in sync — the two were identical for five minutes and a whitespace fix landed
# in one of them during that window. A mirror with a header would not have
# helped: only one copy does.
#
# The reason this file belongs in the repo rather than beside it: the gate
# asserts properties of *this* site — its routes, its claims, its redirects. Add
# a route or retire a claim and the check list has to change in the same commit,
# which only happens if the script is versioned alongside what it checks.
#
# Post-deploy gate for mirall.app after the prerender PR ships.
#
# Run AFTER deploy. Exits non-zero on any failure so it can be a CI step
# rather than a thing someone remembers to eyeball.
#
# Covers four findings that all pass through this one build change:
#   1. routes serve real content without JS        (Sentinel)
#   2. unknown routes return a real 404            (Sentinel — needs the catch-all narrowed)
#   3. inlined CSS survives prerender              (Forge)
#   4. per-page metadata lands in <head>, distinct (Atlas)
#
# Check 4 is the one that fails quietly: the pages render, the headings are
# there, the styles are there, and every unfurl still shows the homepage.
#
# Usage: ./mirall-postdeploy-gate.sh [base-url]
set -uo pipefail

BASE="${1:-https://mirall.app}"
fail=0
# A summary that says "all gates green" while a check was skipped asserts more
# than it checked — the same defect this gate exists to catch elsewhere. Count
# skips and name them in the verdict.
skipped=0
TOTAL_CHECKS=9   # 1, 2, 3, 3b, 3c, 3d, 4, 5, 5b

# Check 5 is the one check that CANNOT pass against a local build: the download
# redirects live in vercel.json, which a plain static server (npx serve, python
# -m http.server) never reads — there is no file at dist/download/darwin-arm64
# for it to find, so all eight report 404. That is the harness, not a
# regression. Set MIRALL_GATE_LOCAL=1 when running against a local serve so
# nobody bisects a phantom failure; drop it for a real deploy or `vercel dev`.
# Every other check here is evaluable locally.
LOCAL="${MIRALL_GATE_LOCAL:-0}"

# For CI use: a skipped check must fail the build. Against a Vercel preview or
# production nothing should skip, so a skip in CI means the run was
# misconfigured — and "exit 0 with a hole in it" is the failure mode that
# already cost one wrong summary today. Set MIRALL_GATE_STRICT=1 in CI.
STRICT="${MIRALL_GATE_STRICT:-0}"

ROUTES=(
  "/" "/docs" "/docs/tutorials" "/docs/guides" "/docs/reference"
  "/docs/explanation" "/changelog" "/support" "/download" "/preview"
  "/privacy" "/impressum"
)

say()  { printf '%s\n' "$*"; }
good() { printf '  ok    %s\n' "$*"; }

# ---------------------------------------------------------------------------
# Per-check result tracking.
#
# Added so a comparison gate (baseline-vs-candidate) can diff two runs without
# parsing English out of this output. A CI job grepping prose is exactly the
# brittleness this script exists to catch elsewhere — and Atlas's three-state
# design needs "unknown" to be representable, which prose cannot express.
#
# MIRALL_GATE_JSON=1 emits a machine-readable summary on the last line.
JSON="${MIRALL_GATE_JSON:-0}"
CUR_NAME=""; CUR_STATUS=""
RESULTS_FILE=""

markfail() { [ -n "$CUR_NAME" ] && CUR_STATUS=fail; fail=1; return 0; }
bad()  { printf '  FAIL  %s\n' "$*"; markfail; }
markskip() { [ -n "$CUR_NAME" ] && CUR_STATUS=skip; return 0; }

flush_check() {
  [ -n "$CUR_NAME" ] || return 0
  printf '%s\t%s\n' "$CUR_NAME" "$CUR_STATUS" >> "$RESULTS_FILE"
  CUR_NAME=""
}

# begin <id> <human description>
begin() {
  flush_check
  CUR_NAME="$1"; CUR_STATUS=pass
  shift
  say ""
  say "== $CUR_NAME. $* =="
}

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
RESULTS_FILE="$tmp/results.tsv"; : > "$RESULTS_FILE"

say "== fetching ${#ROUTES[@]} routes from $BASE =="
for r in "${ROUTES[@]}"; do
  curl -sS --max-time 20 "$BASE$r" -o "$tmp/$(echo "$r" | tr '/' '_').html" || bad "fetch $r"
done

# ---------------------------------------------------------------------------
begin "1" "real content without JS (>=1 <h1>, and body text well past the 45-char shell)"
for r in "${ROUTES[@]}"; do
  f="$tmp/$(echo "$r" | tr '/' '_').html"
  [ -s "$f" ] || { bad "$r — empty response"; continue; }
  h1=$(grep -o '<h1' "$f" | wc -l | tr -d ' ')
  chars=$(python3 -c "
import re,sys
h=open(sys.argv[1],encoding='utf-8',errors='replace').read()
h=re.sub(r'<script.*?</script>','',h,flags=re.S|re.I)
h=re.sub(r'<style.*?</style>','',h,flags=re.S|re.I)
print(len(re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',h)).strip()))
" "$f")
  if [ "$h1" -ge 1 ] && [ "$chars" -gt 500 ]; then
    good "$r — ${h1} h1, ${chars} chars"
  else
    bad "$r — ${h1} h1, ${chars} chars of visible text (pre-fix baseline was 0 h1 / 45 chars)"
  fi
done

# ---------------------------------------------------------------------------
begin "2" "inlined CSS survived the prerender (non-empty <style> per page)"
for r in "${ROUTES[@]}"; do
  f="$tmp/$(echo "$r" | tr '/' '_').html"
  [ -s "$f" ] || continue
  if python3 -c "
import re,sys
h=open(sys.argv[1],encoding='utf-8',errors='replace').read()
sys.exit(0 if any(len(s.strip())>200 for s in re.findall(r'<style[^>]*>(.*?)</style>',h,re.S|re.I)) else 1)
" "$f"; then good "$r"; else bad "$r — no substantive inline <style>; docs would ship unstyled"; fi
done

# ---------------------------------------------------------------------------
begin "3" "per-page metadata in <head>, exactly one <title>, and distinct"
# Atlas's assertion, implemented over the WHOLE document rather than just the
# head slice. Counting inside <head> alone cannot see a second <title> left
# behind in <body> by React's client-only metadata hoisting — which is the
# exact defect this check exists to catch. `head -1` would mask it too.
for r in "${ROUTES[@]}"; do
  f="$tmp/$(echo "$r" | tr '/' '_').html"
  [ -s "$f" ] || continue
  python3 - "$f" "$r" <<'PY' || markfail
import re,sys
f,route=sys.argv[1],sys.argv[2]
h=open(f,encoding='utf-8',errors='replace').read()
head=h.split('</head>')[0] if '</head>' in h else ''
body=h[len(head):] if head else h
n_all=len(re.findall(r'<title[^>]*>',h,re.I))
n_head=len(re.findall(r'<title[^>]*>',head,re.I))
og_body=len(re.findall(r'<meta[^>]+og:',body,re.I))
errs=[]
if n_all!=1: errs.append(f'{n_all} <title> in document (want exactly 1)')
if n_head!=1: errs.append(f'{n_head} <title> in <head> — metadata did not hoist')
if og_body:   errs.append(f'{og_body} og: tags stranded in <body> — unfurlers stop at </head>')
print(('  FAIL  ' if errs else '  ok    ')+route+((' — '+'; '.join(errs)) if errs else ''))
sys.exit(1 if errs else 0)
PY
done

begin "3b" "/, /docs, /preview must differ in title AND og:url"
python3 - "$tmp" <<'PY' || markfail
import re,sys,os
tmp=sys.argv[1]
def grab(route):
    f=os.path.join(tmp, route.replace('/','_')+'.html')
    h=open(f,encoding='utf-8',errors='replace').read() if os.path.exists(f) else ''
    t=re.search(r'<title[^>]*>([^<]*)',h,re.I)
    u=re.search(r'<meta[^>]+og:url[^>]+content="([^"]*)"',h,re.I)
    return (t.group(1).strip() if t else ''), (u.group(1).strip() if u else '')
rows=[(r,)+grab(r) for r in ('/','/docs','/preview')]
for r,t,u in rows: print(f'  {r:10} title={t!r} og:url={u!r}')
ok=True
if len({t for _,t,_ in rows})!=3: print('  FAIL  titles are not all distinct'); ok=False
if len({u for _,_,u in rows})!=3: print('  FAIL  og:urls are not all distinct'); ok=False
if ok: print('  ok    three routes, three identities')
sys.exit(0 if ok else 1)
PY

# ---------------------------------------------------------------------------
begin "3c" "no retired claim survives in JSON-LD"
# SIBLING GATE: the same guarantee is enforced for the app repo by the `git grep`
# claim gate in mirall-app's release sign-off (§1), which blocks the tag. Two
# gates, two repos, two mechanisms, one guarantee — a new claim surface has to be
# taught to both, because neither can see the other's. Neither reaches the GitHub
# repo description, which is a settings field and stays a named human check.
#
# Requested by Atlas. Structured data is the one surface a third-party index
# ingests verbatim and caches — that copy cannot be edited later.
#
# Deliberately NOT a keyword ban on "GDPR" / "third-party". Two legitimate uses
# exist in the current copy and a blunt check would false-positive on both:
#   en.json:1263 "The data controller for the purposes of the GDPR is named..."
#                — correct, and the privacy policy is where GDPR belongs
#   en.json:1237 "no third-party scripts"
#                — a true claim about the *website*, not the transport
# So this matches the retired CLAIMS, and separately prints any other JSON-LD
# GDPR mention for a human to eyeball rather than failing it.
for r in "${ROUTES[@]}"; do
  f="$tmp/$(echo "$r" | tr '/' '_').html"
  [ -s "$f" ] || continue
  python3 - "$f" "$r" <<'PY' || markfail
import re,sys
f,route=sys.argv[1],sys.argv[2]
h=open(f,encoding='utf-8',errors='replace').read()
blocks=re.findall(r'<script[^>]+ld\+json[^>]*>(.*?)</script>',h,re.S|re.I)
blob=' '.join(blocks)
# whitespace/hyphen tolerant: `GDPR[- ]` missed a double space, and a claim
# gate that a stray space defeats is not a gate. Same for the hyphen in
# third-party. Found by testing the pattern rather than by reading it.
RETIRED=[
  r'GDPR[-\s]+compliant\s+by\s+architecture',
  r'no\s+third[-\s]party\s+servers',
  r'No\s+middleman', r'there\s+is\s+no\s+server', r'no\s+server\s+in\s+between',
]
hits=[p for p in RETIRED if re.search(p,blob,re.I)]
notes=[s for s in re.findall(r'"([^"]{0,300}GDPR[^"]{0,300})"',blob)
       if not any(re.search(p,s,re.I) for p in RETIRED)]
if hits:
    print(f'  FAIL  {route} — retired claim in JSON-LD: {hits}')
else:
    extra=f'  (review: {len(notes)} other GDPR mention(s))' if notes else ''
    print(f'  ok    {route} — {len(blocks)} JSON-LD block(s){extra}')
    for s in notes: print(f'          → {s[:120]}')
sys.exit(1 if hits else 0)
PY
done

# ---------------------------------------------------------------------------
begin "3d" "no retired claim survives in the meta descriptions"
# Requested by Atlas, and it closes the one real hole in 3c: scoping to
# ld+json means 3c cannot see <meta>, and all three retired GDPR claims being
# served TODAY live in description / og:description / twitter:description.
#
# Attribute-scoped for the same reason 3c is block-scoped: matching page body
# text would punish the privacy policy's correct GDPR reference.
for r in "${ROUTES[@]}"; do
  f="$tmp/$(echo "$r" | tr '/' '_').html"
  [ -s "$f" ] || continue
  python3 - "$f" "$r" <<'PY' || markfail
import re,sys
f,route=sys.argv[1],sys.argv[2]
h=open(f,encoding='utf-8',errors='replace').read()
vals=[]
for m in re.finditer(r'<meta[^>]*>',h,re.I):
    tag=m.group(0)
    if not re.search(r'(name|property)="(og:)?(twitter:)?description"',tag,re.I): continue
    c=re.search(r'content="([^"]*)"',tag,re.I)
    if c: vals.append(c.group(1))
RETIRED=[r'GDPR[-\s]+compliant\s+by\s+architecture', r'no\s+third[-\s]party\s+servers',
         r'No\s+middleman', r'there\s+is\s+no\s+server', r'no\s+server\s+in\s+between']
hits=sorted({p for v in vals for p in RETIRED if re.search(p,v,re.I)})
print((f'  FAIL  {route} — retired claim in meta description: {hits}') if hits
      else f'  ok    {route} — {len(vals)} description tag(s) clean')
sys.exit(1 if hits else 0)
PY
done

# ---------------------------------------------------------------------------
begin "4" "unknown routes return a real 404 (only valid AFTER the catch-all is narrowed)"
for p in /nope-9f3a /docs/nope-9f3a /docs/guides/nope-9f3a; do
  code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "$BASE$p")
  if [ "$code" = "404" ]; then good "$p -> 404"; else bad "$p -> $code (want 404; 200 means no failure signal)"; fi
done

# ---------------------------------------------------------------------------
begin "5" "the conversion path still converts"
# Requested by Atlas. The gate covered content, CSS, metadata and 404s — and
# none of it touches the download links, which live in the ONE file the
# prerender PR edits (vercel.json: narrowing `rewrites` sits directly beside
# the `redirects` array). A broken redirect passes every other check here while
# nobody can download the product.
#
# Strengthened past a status-code check: a 302 pointing at a dead artifact
# would satisfy "-> 302" and still ship a broken download. So each redirect is
# followed with a range request and must return real bytes.
if [ "$LOCAL" = "1" ]; then
  skipped=$((skipped + 1)); markskip
  say "  SKIP  MIRALL_GATE_LOCAL=1 — redirects live in vercel.json, which a static"
  say "        server never reads. Re-run without it against a real deploy."
fi
for p in download/darwin-arm64 download/darwin-x64 download/win32-x64 \
         download/linux-x64 download/linux-arm64 \
         preview/darwin-arm64 preview/win32-x64 preview/linux-x64; do
  [ "$LOCAL" = "1" ] && continue
  code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 25 "$BASE/$p")
  if [ "$code" != "302" ]; then bad "$p -> $code (want 302)"; continue; fi
  read -r fcode fbytes < <(curl -sSL -r 0-1023 -o /dev/null \
      -w '%{http_code} %{size_download}' --max-time 40 "$BASE/$p")
  if { [ "$fcode" = "206" ] || [ "$fcode" = "200" ]; } && [ "${fbytes:-0}" -gt 0 ]; then
    good "$p -> 302 -> $fcode, ${fbytes}B served"
  else
    bad "$p -> 302 but artifact returned $fcode / ${fbytes}B — redirect points at nothing"
  fi
done

begin "5b" "page routes and redirect prefixes share a namespace — both must work"
# /download and /preview are the only paths where a prerendered page and a
# redirect prefix collide. Post-change, a shadowed page is a hard 404 rather
# than the old SPA-shell 200, so the failure is louder but still invisible to
# every other check here.
for p in /download /preview; do
  f="$tmp/$(echo "$p" | tr '/' '_').html"
  code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "$BASE$p")
  # `x=$(cond && grep|wc || echo 0)` emits BOTH the wc count and the fallback
  # when grep matches nothing — "0\n0" — which then blows up the -ge test.
  h1=0
  if [ -s "$f" ]; then h1=$(grep -o '<h1' "$f" | wc -l | tr -d ' '); fi
  # Message says only what this block tested. It previously claimed "redirects
  # intact under $p/*" while testing neither — and in Forge's local run it
  # printed that next to check 5 reporting those same URLs as 404. A message
  # that documents something it did not test is the same defect as the two
  # relay test names being renamed.
  if [ "$code" = "200" ] && [ "$h1" -ge 1 ]; then
    good "$p -> 200 prerendered page (${h1} h1), page route not shadowed"
  else
    bad "$p -> $code with ${h1} h1 — the redirect prefix is shadowing the page route"
  fi
done

flush_check
say ""
ran=$((TOTAL_CHECKS - skipped))
if [ "$fail" -eq 0 ]; then
  if [ "$skipped" -eq 0 ]; then
    say "PASS — $ran/$TOTAL_CHECKS checks green, none skipped"
  else
    say "PASS (INCOMPLETE) — $ran/$TOTAL_CHECKS checks green, $skipped skipped."
    say "  Not a full pass: check 5 (download links) was not evaluated. Re-run"
    say "  without MIRALL_GATE_LOCAL against a real deploy to complete the gate."
    if [ "$STRICT" = "1" ]; then
      say "  MIRALL_GATE_STRICT=1 — an incomplete run is a failed run. Exiting 1."
      fail=1
    fi
  fi
else
  say "FAIL — see above ($skipped skipped)"
fi

# Machine-readable summary for the comparison gate. One JSON object on the last
# line: {"base":..., "exit":N, "checks":{"1":"pass","3c":"fail","5":"skip",...}}.
# Statuses are pass | fail | skip. A check absent from `checks` was never
# reached — which is how a consumer distinguishes "green on baseline" from
# "baseline never established", the unknown state Atlas needs representable.
if [ "$JSON" = "1" ]; then
  python3 - "$RESULTS_FILE" "$BASE" "$fail" <<'PY'
import json,sys
rows={}
for line in open(sys.argv[1],encoding='utf-8'):
    if '\t' in line:
        k,v = line.rstrip('\n').split('\t',1)
        rows[k]=v
print(json.dumps({"base":sys.argv[2],"exit":int(sys.argv[3]),"checks":rows},separators=(',',':')))
PY
fi

exit "$fail"
