# Documentation Update Playbook (Mirall website)

**Purpose.** When a new version of the Mirall desktop app ships, use this runbook to bring the website documentation up to date — re-home/extend the written content under the Diátaxis framework, refresh the changelog, and **re-capture every screenshot from the running app**.

Read this top to bottom once, then work the **Procedure** checklist. The **Screenshot Capture** section is the long one — it drives the real app.

> **Rewritten after v1.7.0.** The capture mechanics changed completely: screenshots are now driven through the app's own **frontend test harness** rather than hand-rolled `agent-desktop` CLI calls, and images are served through `vite-imagetools` rather than as fixed files in `public/`. If you find advice here that contradicts the app, trust the app and fix this file.

---

## 0. TL;DR / non-negotiables

- **Diátaxis**: every document is exactly one of *Tutorial · How-to · Reference · Explanation*. Never blend modes in one doc.
- **Content lives in `src/i18n/locales/en.json`** under the `docs` and `changelog` namespaces — structured data rendered by generic components. You almost never write JSX; you edit JSON.
- **Features get REMOVED, not just added.** This is the single biggest trap — see §3.1. A release that deletes a feature silently makes whole guides and explanation topics *describe UI that no longer exists*. Budget as much time for deletions as additions.
- **No version markers in the docs.** Never write "New in 1.6" / "now" / "previously". The docs describe how the app works *today*; the changelog is what records when things landed.
- **All screenshots are LIGHT mode**, captured from the **current build**, every release, with **real names and avatars**.
- **Re-shoot EVERY screenshot on every release — not just the new-feature ones.** Shared chrome (nav, buttons, status pills, badges, spacing, radii) changes between versions and silently makes *every* older screenshot wrong. **Never carry a screenshot over from a previous version.**
- **Drive the app through the frontend test harness** (`mirall-app/test/frontend/`), not raw `agent-desktop` calls. §4.
- **agent-desktop must be ≥ 0.3.0** (0.4.4 verified). *An older version of this playbook demanded 0.1.14 — that is wrong now; the harness preflight rejects anything below 0.3.0.*
- **Feature branch off `main`**, PR into `main`. Do **not** push to `main`. Do **not** branch from `stage` — it is stale (43 commits behind as of 2026-07-12 and predates the Diátaxis restructure).
- **No mention of AI** anywhere in content, commits, or PRs. No `Co-Authored-By` trailer.
- Target a **perfect Lighthouse score** — see §4.7 for the exact image spec.

---

## 1. Repos, paths & prerequisites

| Thing | Path |
|---|---|
| **Website repo** (what you edit) | `/Users/oliver/Code/mirall/mirall-website` |
| **App repo** (changelog + source-of-truth labels + capture harness) | `/Users/oliver/Code/mirall/mirall-app` |
| **Changelog** (user-facing release notes) | `mirall-app/CHANGELOG.md` |
| **Capture harness** | `mirall-app/test/frontend/` (`instance.mjs`, `helpers.mjs`, `scenarios/`) |
| **Avatars for personas** | `/Users/oliver/Projects/Mirall/test-data/anon-avatars/` |
| **Pre-seeded persona stores** (alternative, see §4.2) | `/Users/oliver/Projects/Mirall/test-data/test-userstore/user{1..6}store` |
| **Legacy persona dirs** (older approach) | `/Users/oliver/Projects/Mirall/documentation/doc-data/doc-user{1..5}` |

**Prerequisites:**

```bash
agent-desktop version                 # must be >= 0.3.0 (0.4.4 verified). NOT 0.1.14.
agent-desktop status                  # Accessibility + Screen Recording granted
cd /Users/oliver/Code/mirall/mirall-app && npm run build    # builds assets/dist (required before capture)
```

The app repo's `mirall-app` must be on the branch you're documenting (usually `staging`) and **up to date** — `git fetch && git log HEAD..origin/staging`. A stale local tree will make you document the wrong thing (v1.7.0: a late commit renamed the partial-download suffix to `.mirall.part`, which the docs had as `.partial`).

---

## 2. The documentation model

### 2.1 Information architecture (routes)

```
/docs                  Hub — explains the 4 doc types + popular links
/docs/tutorials        Tutorials   (learning-oriented, guided, end-to-end)
/docs/guides           How-to guides (task-oriented, grouped: Spaces/Files/Folders/Storage/Account/App)
/docs/reference        Reference   (tables/lists: statuses, badges, shortcuts, settings, app menu, …)
/docs/explanation      Explanation (the "why": p2p, privacy & approval, sharing in place, mirroring, storage)
/changelog             Release notes (mirrored from mirall-app/CHANGELOG.md)
```

Source files:
- Routes: `src/App.tsx` (lazy-loaded).
- Shared shell + sidebar: `src/components/docs/DocsLayout.tsx`.
- Page components: `src/pages/docs/{Hub,Tutorials,Guides,Reference,Explanation}.tsx`, `src/pages/Changelog.tsx`.
- Generic renderers: `src/components/docs/blocks.tsx` (components) + `content.ts` (types + `stepsFromDoc`). **Keep `blocks.tsx` exporting components only** (`react-refresh/only-export-components` is enforced); put helpers/types in `content.ts`.
- **Screenshot source map: `src/components/docs/images.ts`** — see §2.4. New in v1.7.0.

### 2.2 Content model (`src/i18n/locales/en.json`)

All copy is data. Top-level relevant namespaces: `docs.*` and `changelog.*`.

- `docs.hub` → `{ label, heading, intro, cards[], popular[] }`
- `docs.tutorials` → `{ label, heading, intro, items: DocItem[] }`
- `docs.guides` → `{ label, heading, intro, groups: [{ id, title, docs: DocItem[] }] }`
- `docs.reference` → `{ label, heading, intro, sections: DocItem[] }`
- `docs.explanation` → `{ label, heading, intro, topics: DocItem[] }`
- `changelog` → `{ label, heading, intro, releases: [{ version, date, sections: [{ heading, items[] }] }] }`

**`DocItem`** = `{ id, title, intro?, blocks?: Block[], list?, table?, image?, related?: [{label,to}] }`.
`id` becomes the in-page anchor (used by the sidebar and cross-page `#deep-links`).

**`Block`** discriminated union (rendered by `DocBlocks`):
```
{ type: "p",          text }
{ type: "subheading", text }
{ type: "note",       text }                       // callout box
{ type: "bullets",    items: string[] }
{ type: "steps",      items: [{ title?, text }] }  // first steps block of a how-to → HowTo JSON-LD
{ type: "table",      columns: string[], rows: string[][] }
{ type: "image",      src, alt, width, height }
```

**Inline markup** inside any string: `**bold**` and `` `code` `` only. Escape JSON quotes as `\"`; prefer rephrasing over heavy escaping.

**Which pages render what — verify before you invent a field:**

| Field | Tutorials | Guides | Reference | Explanation |
|---|---|---|---|---|
| `intro` | ✅ | ✅ | ✅ | ❌ |
| `blocks` | ✅ | ✅ | ❌ | ✅ |
| `table` / `list` | ❌ | ❌ | ✅ | ❌ |
| top-level `image` | ❌ | ✅ | ✅ | ❌ |
| `related` | ✅ | ✅ | ❌ | ❌ |

`image` **blocks** render anywhere `DocBlocks` runs (tutorials, guides, explanation). Reference and Explanation do **not** render `related` — adding it there is dead data that silently does nothing. (Both mistakes were made and caught during v1.7.0.)

### 2.3 Diátaxis sorting rules

- **New end-to-end "learn it by doing" flow** → a Tutorial.
- **"How do I do X"** (one goal, steps) → a How-to guide, in the right group.
- **A new status / badge / shortcut / setting / menu** → a Reference table row or list item.
- **A new concept or trade-off (the "why")** → an Explanation topic.
- One feature often touches several modes (e.g. membership approval = a tutorial step + a how-to + a reference row + an explanation of the trade-off). Add to each; never cram the explanation into the how-to.
- **Re-home, don't duplicate.** If existing copy is in the wrong mode, move it.

### 2.4 Screenshots are imported assets, not public/ files (v1.7.0+)

Docs images live in **`src/assets/docs/<name>.webp`** and are resolved through **`src/components/docs/images.ts`**, which maps the stable key `/docs-<name>.webp` (what `en.json` references) to a `vite-imagetools` srcset. `DocImage` in `blocks.tsx` looks the key up and emits `srcset` + `sizes`.

**To add a new screenshot you must touch three places:**
1. Drop the file at `src/assets/docs/<name>.webp`.
2. Add an import + a `SRCSETS` entry in `images.ts` keyed `/docs-<name>.webp`.
3. Reference `/docs-<name>.webp` from `en.json` with `width`/`height` matching the file **exactly**.

Forget step 2 and the image silently falls back to a bare `src` that 404s (nothing is in `public/` any more).

---

## 3. Procedure (per release)

> For a **minor** release just proceed. For a **major** restructure, write a short proposal and check in with the user before authoring — they consistently ask for proposal-first on big changes.

### 3.1 Research the release — additions AND removals

1. Read `mirall-app/CHANGELOG.md` (top entry = the new version). Check there is no `## Unreleased` section — **never document unreleased features.**
2. **Hunt for removals.** The changelog's *Changed* section is where features die, and it understates them. For every guide, reference row, and explanation topic already in the docs, ask *"does this still exist?"* Grep the app source for the UI you describe:
   ```bash
   cd ../mirall-app
   grep -rn "<the label you documented>" src/renderer --include=*.tsx
   grep -rn "discontinued\|deprecated\|migrate" src/shared src/main
   ```
   In v1.7.0 this caught three whole features the docs still described in detail (eager/on-demand sharing, per-space cache clearing, per-space reclaim) — a bigger job than the additions.
3. **Verify every UI label against the source**, not the changelog's paraphrase. The authoritative string table is `mirall-app/src/renderer/locales/en/common.json`; components reference it by key. Dialog titles, toggle labels, badge text, statuses, menu items, shortcut accelerators — all of it.
   - Shortcuts: `src/renderer/keyboard/known-commands.ts`
   - Statuses/badges: `src/renderer/statusBadge.js`
   - App menu: `src/main/menu.js`
   - Feature flags (is it actually on by default?): `feature-flags.json`
4. **Beware orphaned i18n keys.** `common.json` keeps strings for removed UI. A key existing does **not** mean the UI does — grep the `.tsx` files for the key before documenting it.
5. Also **audit the marketing pages** (`features`, `howItWorks`, `faq`, `hero` in `en.json`). They drift too. v1.7.0 left an "Invite-Only Access" card and two FAQ answers describing an invite flow that no longer existed.

### 3.2 Branch

```bash
cd /Users/oliver/Code/mirall/mirall-website
git checkout -b feat-docs-<version> origin/main
```
Branch from **`main`**, PR into **`main`**. Not `stage` (stale). A worktree is fine but not required.

> **Verify the branch actually took** before committing — `git branch --show-current`. A `checkout -B` that silently doesn't stick will land your commit on `main`.

### 3.3 Update written content

In `src/i18n/locales/en.json`: add/remove/re-home per §2.3 and §3.1. Keep prose tight, second person, present tense. `**bold**` for UI labels. **No version markers.**

### 3.4 Update the changelog

Mirror the new `CHANGELOG.md` entry into `changelog.releases[0]` (newest first), preserving the `Added/Security/Changed/Fixed` structure and the `**bold lead.**` style. Section headings render generically, so any heading works.

### 3.5 Capture screenshots — §4.

### 3.6 Wire images — §2.4, with **descriptive alt text** on every one.

### 3.7 Verify — §5.

### 3.8 Hand off

Commit and push **only when asked**. Feature branch → PR into `main`. No `Co-Authored-By`.

---

## 4. Screenshot capture

**Use the app's frontend test harness.** It already solves window management, AX-tree flakiness, cross-process refs, native pickers, and multi-peer setup. Hand-rolling `agent-desktop` CLI calls (what this playbook used to describe) is strictly worse.

### 4.1 The approach

Write a **standalone script in a scratch dir** (never inside `mirall-app`, so you don't dirty that tree) that imports the harness by absolute path:

```js
const APP = '/Users/oliver/Code/mirall/mirall-app'
const { Instance }     = await import(`${APP}/test/frontend/instance.mjs`)
const { startTestnet } = await import(`${APP}/test/frontend/testnet.mjs`)
const { joinPending }  = await import(`${APP}/test/frontend/helpers.mjs`)
const { workDir }      = await import(`${APP}/test/frontend/paths.mjs`)
```

Run it with **cwd = `mirall-app`** (`node /path/to/scratch/shots.mjs`).

Key harness API:
- `new Instance({ name, bootstrap, slot, total })` — `name` becomes the display name at onboarding.
- `.launch({ onboard })`, `.onboard()`, `.focus()`, `.moveCursorAway()`, `.shot(label, dir)`
- `.click(sel)`, `.type(sel, text)`, `.press(combo)`, `.waitText(str, ms)`, `.has(sel)`, `.hasText(str)`, `.nodeValue(sel)`, `.back()`
- `.openAccount()`, `.gotoSettings(section)`, `.openInviteModal()`, `.openFolder(name)`, `.addFile(path)`, `.openAddFolderModal(dir)`, `.mirrorShare(dir)`, `.nativeChoosePath(path)`, `._confirmPreview(label, text)`
- `.quit()` — **use this, not `.kill()`** (`kill()` wipes the store).
- Selectors: `{ role, name, contains, last }`. `role` is optional and sometimes *must* be omitted (§4.6).

Read `test/frontend/scenarios/` for working examples of any flow — there is almost certainly one for what you need (`s54` approval, `s73` peer downloads, `s76` invite, `s103` folder tree).

Wrap each shot in a `try/catch` step so one failure doesn't cost the whole run, and print a summary at the end. A full 3-peer run takes ~15 minutes.

### 4.2 Personas: fresh identities + real avatars (recommended)

The docs need **realistic names and avatar photos**. Onboard fresh instances and upload an avatar to each:

- Names: **Michael, Sarah, Chris** (also Helen, Steve) — matching `test-data/anon-avatars/{michael.png,sarah.jpeg,chris.jpeg,helen.jpeg,steve.png}`.
- Space: **Project Fairlight**. Folder: **Production Footage**. (Consistent with the established docs look.)

```js
// Account → avatar button opens a native file chooser (a hidden <input type=file>,
// NOT an Electron dialog) and the app resizes the image itself — there is no crop step.
async function setAvatar(I, file) {
  await I.openAccount()
  await I.click({ name: 'Change profile picture' })
  await I.nativeChoosePath(path.join(AVATARS, file))
  await sleep(2500)                                   // FileReader + resize
  await I.click({ role: 'button', name: 'Save Changes' })
  await I.press('cmd+shift+h')
}
```

**Why not the pre-seeded stores?** `test-data/test-userstore/user*store` are full Electron `userData` dirs with real identities (Michael, Sarah, Helen, Steve, Chris) and could be booted with `--storage`. But each carries **spaces from earlier sessions whose peers aren't on the local testnet** — they render as stale, owner-offline clutter in every frame. Fresh onboarding + the same avatars gives the same realism with a clean slate, and removes the "never wipe a persona" hazard entirely. Reach for the prepared stores only if you specifically need pre-existing rich content, and **copy them first — never point the app at the originals.**

### 4.3 Light theme: seed it before launch

Don't click through Settings — the **welcome screen appears before Settings is reachable**, so the onboarding shot would come out dark. Seed the store's `config.json` before `launch()`:

```js
function seedLightTheme(I) {
  mkdirSync(I.store, { recursive: true })
  writeFileSync(path.join(I.store, 'config.json'),
    JSON.stringify({ version: 1, appearance: { theme: 'light', locale: null } }, null, 2))
}
```
The app follows the OS theme by default, and the dev machine is dark — so without this **every** shot comes out dark and unusable.

### 4.4 Window sizing (uniform aspect ratio)

`Instance` sizes windows via `tile(slot, total)`. On the 3008×1667 dev display, `total: 2` yields an identical **1200×1040** window for slots 0, 1 **and** 2 — so pass `total: 2` even with three peers and every shot shares one aspect ratio. Verify after processing: all files should report the same intrinsic size.

### 4.5 The capture set

Get the authoritative list from the content itself:
```bash
grep -o '/docs-[a-z-]*\.webp' src/i18n/locales/en.json | sort -u
```
Capture a fresh PNG for each. Afterwards, **delete any `src/assets/docs/*.webp` no longer referenced, and its `images.ts` entry.**

Current set (v1.7.0) — 16 images, all light mode, all 1344×1173:

| File | Shows | Captured from |
|---|---|---|
| `onboarding` | "Welcome to Mirall" (name + avatar) | owner, `launch({onboard:false})` |
| `invite-to-space` | Invite dialog — auto-approve + expiry | owner |
| `join-waiting` | "Waiting to be let in" + Cancel request | pending peer |
| `join-approval` | "<name> wants to join" banner + Approve/Deny | owner, 1 requester |
| `approval-review` | "Requests to join" batch modal | owner, 2 requesters |
| `space-view` | Space with loose files, drop zone, members | owner |
| `peer-downloads` | Downloader facepile expanded — per-person speed/ETA | owner, 2 peers downloading |
| `add-folder` | Add Folder dialog (path + share name) | owner |
| `space-folder` | Space with a "Shared by you" folder card | owner |
| `folder-browse` | Folder tree with per-folder stats + Expand all | browsing peer |
| `folder-mirror` | Mirror to Disk dialog | peer |
| `folder-mirrored` | Mirrored folder — "On your device" + verified shield | peer |
| `mirrored-by` | "Mirrored by" facepile on an owned folder | owner, 2 mirrorers |
| `sidebar-collapsible` | Sidebar with Space Storage collapsed | owner |
| `settings-storage` | Settings → Storage (App Storage breakdown) | owner |
| `account-security` | Account → Security (keychain status) | owner |

**Not capturable on macOS:** the Windows/Linux application menu (it lives in the macOS menu bar). The Reference "Application menu" entry stays a table.

### 4.6 Gotchas (all of these bit during v1.7.0)

| Symptom | Cause / fix |
|---|---|
| **Theme click finds no element** (`{role:'button', name:'Light'}`) | Segmented controls (Theme Mode, Display Size) are `aria-pressed` and carry **no button role** in the AX tree. Match on **name only**: `{ name: 'Light' }`. Confirm with `nodeValue({name:'Light'}) === '1'`. |
| **"Expand all" not found** in a folder | **Top-level folders are open by default**, so the toggle reads **"Collapse all"**. It's one button, not two. To get a good tree shot: click *Collapse all*, then re-open one folder — that shows the per-folder stat lines *and* file rows in one frame. |
| **Peer-download indicator never appears** | Two separate causes. (a) The big file is still **indexing on the owner**, so the peer has no Download button yet — poll `has({role:'button',name:'Download'})` until it appears. (b) The transfer **finished before you shot it** — use a ~900 MB file, and clear the small files off the peers first so the only remaining Download button is the big one. |
| Native picker can't reach the path | Source folders **must not** live under `/private/var` (where `os.tmpdir()` points) — macOS blocks the panel there. Use the harness `workDir()` (under `mirall-app/test/frontend/.work/`). |
| Snapshot empty / `WINDOW_NOT_FOUND` | Focus the window first; the harness re-resolves stale AX ids by pid. Always `focus()` + `moveCursorAway()` before a shot so no hover state leaks in. |
| Store gets wiped | You called `Instance.kill()`. Use `.quit()`. |
| A dead feature flag re-enables old UI | `Instance` defaults `flags: { eagerTransferMode: true }` — a **dead flag**; it no longer exists in the app source and changes nothing. Don't cargo-cult it into meaning the eager UI is back. Check `feature-flags.json` for what's real. |

### 4.7 Process PNGs → webp (the Lighthouse spec)

Raw captures are 2× window screenshots on a transparent canvas (rounded corners + shadow). Run the processor from **inside the website repo** so Node resolves `sharp`.

```js
await sharp(rawPng)
  .trim()                                          // drop the dead transparent border; the soft shadow survives
  .resize({ width: 1344, withoutEnlargement: true })
  .webp({ quality: 82, effort: 6 })
  .toFile(`src/assets/docs/${name}.webp`)
```

- **1344px** = exactly 2× the 672px (`max-w-2xl`) the docs render at. The old 1600px was oversized and is what risks Lighthouse's *"properly size images"*.
- Expect **~34–62 KB** each, ~800 KB for the set.
- **`.trim()` is correct now** (an older version of this playbook said not to) — but you *must* then read back the real output dimensions and use them, because:
- **`width`/`height` in `en.json` must match the file exactly.** The `<img>` has `object-cover`; a mismatch crops the image and risks a CLS/aspect-ratio flag. Print the intrinsic size from the processor and copy it in. (v1.7.0 shipped several off-by-one values from the previous set.)
- Responsive variants (672/1008/1344) + `sizes` are generated by `vite-imagetools` via `images.ts` — a phone fetches a ~13 KB variant instead of the full 40 KB. Keep `loading="lazy"` and `decoding="async"`.

---

## 5. Verify

```bash
python3 -c "import json;json.load(open('src/i18n/locales/en.json'));print('en.json valid')"
npm run build          # tsc + vite must be clean
npx tsc --noEmit -p tsconfig.app.json
```

**Every referenced image resolves** (they're bundled now, so a missing one fails the build — but a missing `images.ts` entry does *not*, it silently 404s at runtime):
```bash
grep -o '/docs-[a-z-]*\.webp' src/i18n/locales/en.json | sort -u   # every one must appear in images.ts
```

**Every internal anchor resolves** — cross-links break silently when you rename or delete a doc id. Walk the JSON: collect every `tutorials/guides/reference/explanation` `id`, collect every `related[].to` and `popular[].to`, and diff.

**In-page render check (gold standard):**
```bash
npx vite preview --port 4317
open -a "Google Chrome" "http://localhost:4317/docs/guides"
# screenshot the Chrome window with agent-desktop and Read it back
pkill -f "vite preview --port 4317"
```
Confirm the images render, the chrome looks current, and the sidebar works. Spot-check a second page.

**Lint baseline:** `npm run lint` reports **2 pre-existing errors** — `src/components/Navbar.tsx` (set-state-in-effect) and `src/components/Seo.tsx` (missing `react/no-danger` rule def). They are **not yours**; confirm they're identical on `main` and don't chase them. Add **zero** new lint problems.

**SPA note:** per-route `<title>`/meta are applied client-side (React 19 metadata) — view-source shows the base title. Expected.

---

## 6. Conventions & guardrails

- **Light mode only** for screenshots; **real names + avatars**; re-shot every release.
- **One Diátaxis mode per document**; re-home, don't duplicate.
- **No version markers** ("New in 1.6") anywhere in the docs.
- **Match the app exactly** — verify labels against `mirall-app/src/renderer` before writing them.
- **No AI mentions** in content, commits, or PRs. No `Co-Authored-By`. Commit = `[type] Subject`, blank line, body.
- **No time estimates** in plans. Use complexity language.
- **Accessibility:** semantic headings in order, `alt` on every image, links with discernible text, tables with `<th scope>` (block components handle this). Don't regress it.
- **SEO/perf:** §4.7 image spec; each route keeps its `<Seo>` (breadcrumb; `HowTo` JSON-LD on guides with steps). Add new routes to `public/sitemap.xml` (it has no `lastmod`, so nothing to bump).
- **Never push to `main`.** Feature branch → PR. No commits/pushes unless asked this turn.
- **English-first.** Translations (DE/FR/ES/IT) are a separate, later effort.

---

## 7. Quick troubleshooting

| Symptom | Cause / fix |
|---|---|
| Harness aborts on version | agent-desktop < 0.3.0. `npm install -g agent-desktop@latest`. |
| Snapshot empty tree | Window not focused/painted, or a stale AX id → the harness re-resolves by pid; make sure you `focus()` first. |
| `role`-qualified selector finds nothing | It's an `aria-pressed` segment — drop the `role`, match by name (§4.6). |
| Native picker won't open the path | Source under `/private/var`/tmp → use `workDir()`. |
| Screenshots all dark | You didn't seed `config.json` before launch (§4.3). |
| Avatars are letter placeholders | `setAvatar()` didn't run or failed silently — check the step's catch output. |
| Persona store destroyed | You used `Instance.kill()` instead of `.quit()`. |
| `sharp` not found | Run the processor from **inside the website repo**, not the scratch dir. |
| Image 404s at runtime but build passed | Missing `images.ts` entry (§2.4). |
| Docs describe a dialog that isn't in the app | You trusted the changelog / an orphaned i18n key instead of the components (§3.1). |
| Build fails on `react-refresh/only-export-components` | A `.tsx` exports a non-component — move helpers/types into a `.ts`. |

---

*Keep this file in sync with `src/components/docs/*`, `src/components/docs/images.ts`, and the `docs`/`changelog` namespaces in `en.json`. If the content model or the capture mechanics change, update the relevant section here.*
