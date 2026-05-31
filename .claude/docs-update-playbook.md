# Documentation Update Playbook (Mirall website)

**Purpose.** When a new version of the Mirall desktop app ships, use this runbook to bring the website documentation up to date — re-home/extend the written content under the Diátaxis framework, refresh the changelog, and **capture or update the screenshots from the running app** using the persona data dirs. It encodes the exact procedure, conventions, and gotchas established when the docs were rebuilt for v1.6.0.

Read this top to bottom once, then work the **Procedure** checklist. The **Screenshot Capture** section is the long one — it drives the real app through `agent-desktop`.

---

## 0. TL;DR / non-negotiables

- **Diátaxis**: every document is exactly one of *Tutorial · How-to · Reference · Explanation*. Never blend modes in one doc.
- **Content lives in `src/i18n/locales/en.json`** under the `docs` and `changelog` namespaces — as structured data, rendered by generic components. You almost never write JSX; you edit JSON.
- **All screenshots are taken in LIGHT mode.** No exceptions. Set Light theme on every persona before capturing.
- **Never wipe a persona store.** Tear personas down with `pkill`/SIGTERM only. Do **not** use the test harness `Instance.kill()` (it `rm -rf`s the store). The five `doc-data/doc-user*` dirs are precious, reusable identities.
- **agent-desktop must be `0.1.14`** (0.2.x breaks refs). The ref field in snapshots is `ref_id` (e.g. `@e7`), not `ref`.
- **Work on a feature branch in a git worktree**, never on `main`. Don't commit unless explicitly asked.
- **No mention of AI** anywhere in content, commits, or PRs. Keep PR/commit text terse.
- **Re-shoot EVERY screenshot on every release — not just the new-feature ones.** Shared chrome (top navigation, buttons, status pills, avatars, badges, spacing, radii, theme) changes between versions and silently makes *every* older screenshot wrong, even for screens whose feature didn't change. Treat the entire image set as stale each release and regenerate all of it from the current build. **Never carry a screenshot over from a previous version.**
- Target a **perfect Lighthouse score**: screenshots are 1600px-wide webp, ~60–80 KB.

---

## 1. Repos, paths & prerequisites

| Thing | Path |
|---|---|
| **Website repo** (what you edit) | `/Users/oliver/Code/mirall/mirall-website` |
| **App repo** (changelog + source-of-truth labels + screenshot harness) | `/Users/oliver/Code/mirall/mirall-app` |
| **Changelog** (user-facing release notes) | `mirall-app/CHANGELOG.md` |
| **Persona data dirs** (5 pre-seeded identities) | `/Users/oliver/Projects/Mirall/documentation/doc-data/doc-user{1..5}` |
| **Existing raw screenshots** (reference look) | `/Users/oliver/Projects/Mirall/documentation/screenshots` |
| **Frontend test harness** (launch/flow reference) | `mirall-app/test/frontend/` |

**Prerequisites (verify before starting screenshots):**

```bash
agent-desktop version            # must report "version":"0.1.14"  (0.2.x WILL break — refs go STALE_REF)
agent-desktop status             # {"permissions":{"granted":true}, ...}  Accessibility + Screen Recording
ls /Users/oliver/Code/mirall/mirall-app/assets/dist   # app/renderer built (app.css, main.js). If missing: cd mirall-app && npm run build
```

If agent-desktop is the wrong version: `npm install -g agent-desktop@0.1.14`.
If permissions aren't granted: `agent-desktop permissions --request` and tell the user to grant **Accessibility** and **Screen Recording** to the terminal/Claude process.

The agent-desktop skill (`/Users/oliver/.claude/skills/agent-desktop`) documents the CLI — load it for command details.

---

## 2. The documentation model

### 2.1 Information architecture (routes)

```
/docs                  Hub — explains the 4 doc types + popular links
/docs/tutorials        Tutorials   (learning-oriented, guided, end-to-end)
/docs/guides           How-to guides (task-oriented, grouped: Spaces/Files/Folders/Storage/Account/App)
/docs/reference        Reference   (tables/lists: statuses, folder types, shortcuts, settings, app menu, …)
/docs/explanation      Explanation (the "why": p2p, privacy, mirroring, eager-vs-on-demand, storage, …)
/changelog             Release notes (mirrored from mirall-app/CHANGELOG.md)
```

Source files:
- Routes: `src/App.tsx` (lazy-loaded).
- Shared shell + sidebar: `src/components/docs/DocsLayout.tsx`.
- Page components: `src/pages/docs/{Hub,Tutorials,Guides,Reference,Explanation}.tsx`, `src/pages/Changelog.tsx`.
- Generic renderers: `src/components/docs/blocks.tsx` (components) + `content.ts` (types + `stepsFromDoc`). **Keep `blocks.tsx` exporting components only** (the repo enforces `react-refresh/only-export-components`); put helpers/types in `content.ts`.

### 2.2 Content model (`src/i18n/locales/en.json`)

All copy is data. Top-level relevant namespaces: `docs.*` and `changelog.*`.

- `docs.hub` → `{ label, heading, intro, cards[], popular[] }`
- `docs.tutorials` → `{ label, heading, intro, items: DocItem[] }`
- `docs.guides` → `{ label, heading, intro, groups: [{ id, title, docs: DocItem[] }] }`
- `docs.reference` → `{ label, heading, intro, sections: DocItem[] }` (each has a `table`, `list`, and/or `image`)
- `docs.explanation` → `{ label, heading, intro, topics: DocItem[] }`
- `changelog` → `{ label, heading, intro, releases: [{ version, date, sections: [{ heading, items[] }] }] }`

**`DocItem`** = `{ id, title, intro?, blocks?: Block[], list?, table?, image?, related?: [{label,to}] }`.
`id` becomes the in-page anchor (used by the sidebar and cross-page `#deep-links`).

**`Block`** discriminated union (rendered by `DocBlocks`):
```
{ type: "p",        text }
{ type: "subheading", text }
{ type: "note",     text }                       // callout box
{ type: "bullets",  items: string[] }
{ type: "steps",    items: [{ title?, text }] }  // first steps block of a how-to → HowTo JSON-LD
{ type: "table",    columns: string[], rows: string[][] }
{ type: "image",    src, alt, width, height }
```

**Inline markup** inside any string: `**bold**` and `` `code` `` only (a tiny renderer handles them; no full markdown). Escape JSON quotes as `\"`; prefer rephrasing to avoid heavy escaping.

**Where images render:** `image` blocks render anywhere `DocBlocks` runs (tutorials, explanation, guide `blocks`). Guides also render a top-level `doc.image` (after the blocks). Reference renders `section.image` (after table/list). The Hub does not take images.

### 2.3 Diátaxis sorting rules (how to place new content)

- **New end-to-end "learn it by doing" flow** → a Tutorial.
- **"How do I do X"** (one goal, steps) → a How-to guide, in the right group.
- **A new status / badge / shortcut / setting / menu** → a Reference table row or list item.
- **A new concept or trade-off (the "why")** → an Explanation topic.
- A single feature often touches several modes (e.g. "on-demand sharing" = a how-to step + a reference status + an explanation of the trade-off). Add to each as needed; never cram the explanation into the how-to.
- **Re-home, don't duplicate.** If existing copy is in the wrong mode, move it.

---

## 3. Procedure (per release)

> For a **minor** release (a few new features + screenshots) just proceed. For a **major** restructure, write a short proposal of the IA changes to `.claude/tasks/plan.md` and check in with the user before authoring — historically the user asked for a proposal-first on big changes.

1. **Research the release.**
   - Read `mirall-app/CHANGELOG.md` (top entry = the new version) — it's already user-facing and is the spine of what to document.
   - Optionally `git -C ../mirall-app log --oneline <prevTag>..HEAD` for anything user-visible the changelog missed.
   - **Verify exact UI labels** against the renderer source (`mirall-app/src/renderer` + its locale JSON) — dialog titles, toggle labels, badge text, statuses. Don't trust paraphrases; the docs must match what the user sees.

2. **Branch in a worktree** (never edit `main` directly):
   ```bash
   cd /Users/oliver/Code/mirall/mirall-website
   git worktree add /Users/oliver/Code/mirall/mirall-website-worktrees/feat-docs-<version> -b feat-docs-<version> main
   cd /Users/oliver/Code/mirall/mirall-website-worktrees/feat-docs-<version> && npm install
   ```
   (Worktree lives **outside** the repo so `main` stays clean — `worktrees/` is not gitignored in this repo.)

3. **Update written content** in `src/i18n/locales/en.json`:
   - Add new how-to guides / tutorial steps / reference rows / explanation topics per §2.3.
   - Re-home anything now mis-filed.
   - Keep prose tight, second person, present tense. Use `**bold**` for UI labels.

4. **Update the changelog** — mirror the new `CHANGELOG.md` entry into `changelog.releases[0]` (newest first), preserving the `Added/Changed/Fixed` structure and the `**bold lead.**` style.

5. **Capture / refresh screenshots** — see §4. Light mode, persona-driven, 1600px webp.

6. **Wire images** into the relevant docs (`image` blocks / `doc.image` / `section.image`) with **descriptive alt text**.

7. **Verify** — see §5.

8. **Hand off.** Do **not** commit/push unless asked. Summarize the change set and the screenshot inventory.

---

## 4. Screenshot capture playbook

This is the part that drives the real app. It produced the v1.6.0 folder/mirror/storage screenshots.

### 4.0 Re-capture the ENTIRE set every release (read first)

Do **not** only shoot the new features. Every screenshot the docs use must be **re-taken from the current build** each release, because cross-cutting UI changes (the top nav bar, button styles, status pills, avatars, badges, spacing) make older shots inconsistent or outright wrong — e.g. a redesigned top navigation will be visible in the new feature shots but stale in the older onboarding/settings shots, and the doc set looks broken.

**Authoritative list of what to capture** = every image the docs reference. Get it from the content:
```bash
cd <worktree>
grep -o '/docs-[a-z-]*\.webp' src/i18n/locales/en.json | sort -u
```
Capture a fresh PNG for each, process to webp, and overwrite the file in `public/`. After the run, **delete any `public/docs-*.webp` that's no longer referenced** (don't ship stale assets from a prior version).

**Full capture checklist** (the canonical set — adjust as the app/docs evolve). All in **light mode**, 1312×1040 window, processed to 1600px webp.

| File | Screen / state | How to reach it | Store |
|---|---|---|---|
| `docs-onboarding` | "Welcome to Mirall" (name + avatar) | Launch against a **fresh empty store** (personas are already onboarded, so they skip it) — see note below | temp `--storage` dir |
| `docs-space-list` | Shared Spaces home (list, All/Favorites) | Persona home, after dismissing "What's new" | doc-user1 |
| `docs-space-view` | A space with files + members | Open a populated space (e.g. Project Fairlight) | doc-user1 |
| `docs-space-folder` | A space showing a "Shared by you" folder card | The space after a folder is shared (Steve's Space) | doc-user1 |
| `docs-sidebar-collapsible` | Sidebar with File Storage collapsed | In a space, click the **File Storage** panel header to collapse it | doc-user1 |
| `docs-account` | Account page (Profile + Network) | Click your avatar (top-right) → Account | doc-user1 |
| `docs-invite-to-space` | Invite dialog (Code / App link toggle) | Open a space → **Invite** | doc-user1 |
| `docs-settings` | Settings home (sub-page list) | Top-nav gear → Settings | doc-user1 |
| `docs-settings-appearance` | Appearance (theme / size / language) | Settings → Appearance | doc-user1 |
| `docs-settings-notifications` | Notifications toggles | Settings → Notifications | doc-user1 |
| `docs-storage-folders` | Storage settings — per-share usage | Space header **More → Manage Storage** (or Settings → Storage) | doc-user1 |
| `docs-add-folder` | Add Folder dialog (Eager/On demand) | In a space, `cmd+shift+u` → pick a source folder | doc-user1 (owner) |
| `docs-folder-browse` | Browsing a peer's shared folder | Peer opens the foreign folder card | doc-user2 (peer) |
| `docs-folder-mirror` | Mirror to Disk dialog | Peer's folder view → **Mirror to Disk…** | doc-user2 (peer) |
| `docs-folder-mirrored` | Mirrored folder (read-only, on-device) | Peer after mirroring completes | doc-user2 (peer) |

> **Onboarding shot needs a fresh store.** Launch with a throwaway empty dir, e.g. `--storage /tmp/mirall-onboarding-$RANDOM` — it boots to "Welcome to Mirall". Capture it, then **delete that temp dir** (it's not a persona, safe to remove). Never point `--storage` at a persona expecting onboarding.

Plan the run to minimize relaunches: do all **doc-user1 single-window** shots in one session (space list → space view → account → invite → settings/appearance/notifications/storage), then bring up **doc-user2** for the two-peer folder flow, then the **fresh-store** onboarding shot last.

### 4.1 The personas

Each `doc-data/doc-user*` dir is a full Electron `userData` store with a pre-seeded Mirall identity, spaces, members, and avatars. Launching the app against one boots straight past onboarding into that identity (it shows the "What's new" modal first — dismiss it).

Known mapping (re-verify each run — open a space and read the Members panel):

| Persona | Display name | Spaces (observed) |
|---|---|---|
| `doc-user1` | **Michael** | Steve's Space, Holiday Photos, Project Fairlight |
| `doc-user2` | **Steve Mason** | Steve's Space |
| `doc-user3/4/5` | (inspect) | (inspect) |

- **`doc-user1` + `doc-user2` are co-members of "Steve's Space"** and **connect over real DHT** when both are running — this is the verified pair for **two-peer flows** (owner shares a folder → peer browses/mirrors). Steve's Space starts empty → clean backdrop.
- **`doc-user1` (Michael)** is the rich single-user persona (avatars, multiple spaces) — used for single-window shots (dialogs, settings, sidebar). "Project Fairlight" is the space featured in the older screenshots.

### 4.2 Launch a persona

From `mirall-app`. One window per persona; tile them so each can be focused independently.

```bash
cd /Users/oliver/Code/mirall/mirall-app
MIRALL_NO_DEVTOOLS=1 MIRALL_FORCE_A11Y=1 MIRALL_VERBOSE=1 \
  MIRALL_WINDOW_BOUNDS='{"x":60,"y":80,"width":1312,"height":1040}' \
  npx electron-forge start -- --no-updates --storage "/Users/oliver/Projects/Mirall/documentation/doc-data/doc-user1" \
  > /tmp/mirall-shot-user1.log 2>&1 &
```

- `MIRALL_FORCE_A11Y=1` is **required** — without it a backgrounded renderer never builds its AX tree and snapshots come back empty.
- `MIRALL_NO_DEVTOOLS=1` keeps DevTools from stealing the window.
- `--storage <personaDir>` points Electron's `userData` at the persona (the app does `app.setPath('userData', customStorage)`).
- `1312×1040` logical → **2848×2304** retina capture (the existing webp are 1600px wide; we downscale).
- For a second persona, give it different bounds (e.g. `"x":720,"y":140`) and write to `/tmp/mirall-shot-user2.log`.

Wait ~9s, then resolve the window:
```bash
agent-desktop wait 9000 >/dev/null 2>&1
agent-desktop list-windows | python3 -c "import sys,json;[print(w['id'],'pid',w['pid'],repr(w.get('title'))) for w in json.load(sys.stdin)['data'] if w.get('app_name')=='Electron']"
# windows report app_name 'Electron' (forge runs unbranded); title 'Mirall'. Native pickers show title 'Open'/'Save' (same pid).
```

### 4.3 agent-desktop driving conventions

Drive the app with **snapshot → find ref_id → click**, re-snapshotting after every UI change (refs are snapshot-scoped). Use this helper (write it once):

```bash
cat > /tmp/ax.py <<'PY'
import sys,json
mode=sys.argv[1] if len(sys.argv)>1 else 'dump'
want=sys.argv[2] if len(sys.argv)>2 else ''
d=json.load(sys.stdin)
if not d.get('ok'): print('ERR'); sys.exit(1)
rows=[]
def walk(n):
    rows.append(n)
    for c in n.get('children',[]) or []: walk(c)
walk(d['data']['tree'])
if mode=='ref':           # first element whose name/description == want → its ref_id
    for n in rows:
        nm=n.get('name') or n.get('description') or ''
        if n.get('ref_id') and nm==want: print(n['ref_id']); break
elif mode=='dump':        # ref_id, role, name for every interactive/named node
    for n in rows:
        nm=n.get('name') or n.get('description') or n.get('value') or ''
        r=n.get('role','')
        if n.get('ref_id') and (r in ('button','textfield','checkbox','tab','link','menuitem','radiobutton','combobox') or nm):
            print(f"{n['ref_id']}\t{r}\t{nm[:55]}")
PY
```

Click-by-name pattern (snapshot then click immediately so the ref is fresh):
```bash
WID=w-xxxxxx
ref=$(agent-desktop snapshot --window-id $WID --max-depth 45 | python3 /tmp/ax.py ref "Create Space")
agent-desktop click "$ref"
agent-desktop wait 1500 >/dev/null 2>&1
```

**Gotchas (learned the hard way):**
- The ref field is **`ref_id`** (`@e7`), *not* `ref`.
- A window's AX id can be **reassigned on repaint** → a cached `WID` goes stale (empty/`WINDOW_NOT_FOUND`). Re-resolve by **pid**: list windows, pick the one with the same pid, use its new id.
- **Focus the target window before acting/screenshotting** (`agent-desktop focus-window --window-id $WID`) — a backgrounded renderer may not be painted, and clicks on a background window misfire.
- Menus (`More`) are role `combobox`/`menuitem`; match by name. After opening a menu, re-snapshot to get the item refs.
- `set-value` is more reliable than `type` for the React inputs (type double-emits); verify by reading the value back.

### 4.4 LIGHT MODE — do this on every persona first

```bash
WID=w-xxxxxx
agent-desktop focus-window --window-id $WID
sref=$(agent-desktop snapshot --window-id $WID --max-depth 40 | python3 /tmp/ax.py ref "Settings");    agent-desktop click "$sref"; agent-desktop wait 1500 >/dev/null
aref=$(agent-desktop snapshot --window-id $WID --max-depth 45 | python3 /tmp/ax.py ref "Appearance");  agent-desktop click "$aref"; agent-desktop wait 1200 >/dev/null
lref=$(agent-desktop snapshot --window-id $WID --max-depth 50 | python3 /tmp/ax.py ref "Light");       agent-desktop click "$lref"; agent-desktop wait 800  >/dev/null
```
Then **verify visually**: screenshot and Read it back — the UI must be the light/cream theme, not dark. (`Theme Mode` shows Light / System / Dark as a segmented control; "Light" must be the selected one.)

### 4.5 Capturing a screenshot

```bash
agent-desktop focus-window --window-id $WID
agent-desktop resize-window --window-id $WID --width 1312 --height 1040   # consistent framing
agent-desktop wait 700 >/dev/null 2>&1
agent-desktop screenshot /tmp/shots/<name>.png --window-id $WID
```
- `screenshot --window-id` captures the window's own image even if another window overlaps it (so overlapping personas are fine — just focus first so it's painted).
- **Always Read the PNG back** to confirm it shows the right state, in light mode, with the intended content, before moving on.
- Keep raw PNGs in `/tmp/shots/`.

### 4.6 Native folder/file picker (for Add Folder / Mirror to Disk)

Sharing a folder or mirroring opens an NSOpenPanel (window `app_name 'Electron'`, `title 'Open'`, same pid). Drive it via go-to-folder:

```bash
# trigger: cmd+shift+u = Add Folder ; or open the share card "More" → "Mirror to Disk…" then its "Browse…"
agent-desktop press cmd+shift+u; agent-desktop wait 2500 >/dev/null
OPEN=$(agent-desktop list-windows | python3 -c "import sys,json;ws=[w for w in json.load(sys.stdin)['data'] if w.get('app_name')=='Electron' and w.get('title')=='Open'];print(ws[0]['id'] if ws else '')")
agent-desktop focus-window --window-id $OPEN; agent-desktop wait 500 >/dev/null
agent-desktop press cmd+shift+g; agent-desktop wait 800 >/dev/null          # "Go to folder" sheet
tf=$(agent-desktop snapshot --app Electron --surface sheet | python3 -c "import sys,json;d=json.load(sys.stdin);t=d.get('data',{});t=t.get('tree',t)
def w(n):
  if n.get('role')=='textfield' and n.get('ref_id'): return n['ref_id']
  for c in n.get('children',[]) or []:
    r=w(c)
    if r: return r
print(w(t) or '')")
agent-desktop set-value "$tf" "/absolute/path/to/folder"
agent-desktop press return; agent-desktop wait 700 >/dev/null               # fill path
agent-desktop press return; agent-desktop wait 1500 >/dev/null              # confirm selection
```

- **Source folders the picker must reach must NOT live under `/private/var` / `os.tmpdir()`** (macOS blocks the panel there). Use a folder under the repo (`mirall-app/test/frontend/.work/...`) or under `~/Code` / `~/Projects`.
- For realistic content, make a source folder with plausibly-named files of a few MB each (e.g. `Production Footage/` with `Scene_01_Take_03.mov`, an `Audio/` subfolder, a `.pdf`). Use `dd if=/dev/urandom ... bs=1m count=N`. Keep total small (~15–20 MB) so transfers/mirrors finish fast. **Delete these temp folders during teardown.**

### 4.7 Two-peer flow (browse / mirror screenshots)

1. On the **owner** (doc-user1, "Michael"): open the shared space (use **"Steve's Space"** — empty, both members online). `Share…` → **Add Folder** (or `cmd+shift+u`), pick the source folder. The **Add Folder** dialog opens at the edit step showing **Share name** + the **Folder Share: Eager / On demand** toggle → *screenshot here* (this is `docs-add-folder`). Then `Next: Preview` → confirm `Add Folder` (Eager, so peers can download immediately).
2. On the **peer** (doc-user2, "Steve Mason"): open the same space → the foreign folder card appears (replication over DHT) → open it → **browse view** (files "Available" + Download buttons, "Mirror to Disk…" in the corner) → *screenshot* (`docs-folder-browse`).
3. Peer clicks **Mirror to Disk…** → dialog with the read-only-revert note + location picker → *screenshot* (`docs-folder-mirror`). `Browse…` → pick an **empty** destination folder → `Next: Preview` → `Start Mirroring`.
4. After mirroring, re-open the folder → **"MIRRORED · READ-ONLY"** badge, files now **"On your device"** → *screenshot* (`docs-folder-mirrored`).

Verify mirroring actually happened by checking the destination dir filled with the files (and the `Audio/` subfolder).

### 4.8 Single-user shots (owner side)

In the shared space after the folder is shared:
- **Collapsible sidebar** (`docs-sidebar-collapsible`): click the **File Storage** panel header to collapse it (leave **Members** expanded) → screenshot. Shows the fold affordance.
- **Space with shared folder** (`docs-space-folder`): the space view with the folder card ("Shared by you") + sidebar panels.
- **Storage / per-share usage** (`docs-storage-folders`): space header **More → Manage Storage** → the Storage screen lists **Active Spaces** with the new **per-share breakdown** ("<Folder> · <size> · N files"). *(Reclaimable space only appears after files in a shared folder are edited/replaced, creating superseded versions; induce churn only if you specifically need the "Reclaimable" line.)*

### 4.9 Process PNGs → web-optimized webp

Run from **inside the website worktree** (so Node resolves `sharp` from its `node_modules`). Map raw names → `docs-*.webp`, resize to 1600px, keep alpha (the rounded window corners are transparent — matches the existing assets).

```js
// save as <worktree>/_process-shots.mjs, run `node _process-shots.mjs`, then delete it
import sharp from 'sharp'
import { statSync } from 'node:fs'
const SRC = '/tmp/shots'
const OUT = '<worktree>/public'
const map = {
  'add-folder':'docs-add-folder', 'folder-browse':'docs-folder-browse',
  'folder-mirror':'docs-folder-mirror', 'folder-mirrored':'docs-folder-mirrored',
  'storage':'docs-storage-folders', 'sidebar-collapsible':'docs-sidebar-collapsible',
  'space-folder':'docs-space-folder',
}
for (const [s,o] of Object.entries(map)) {
  const p = `${OUT}/${o}.webp`
  const i = await sharp(`${SRC}/${s}.png`).resize({ width:1600 }).webp({ quality:80, effort:6 }).toFile(p)
  console.log(`${o}.webp  ${i.width}x${i.height}  ${(statSync(p).size/1024).toFixed(1)} KB`)
}
```
Expect ~1600×1294, **~57–78 KB** each. (Don't `.trim()` — it removes the shadow padding and desyncs aspect ratios.)

### 4.10 Teardown — SAFELY (never wipe a persona)

```bash
pkill -f "doc-data/doc-user1"      # SIGTERM the persona's Electron main; before-quit tears the worker down cleanly
pkill -f "doc-data/doc-user2"
agent-desktop wait 4000 >/dev/null 2>&1
agent-desktop list-windows | python3 -c "import sys,json;print('Electron windows:',sum(1 for w in json.load(sys.stdin)['data'] if w.get('app_name')=='Electron'))"   # expect 0
# CONFIRM the stores are intact (must still list items):
ls "/Users/oliver/Projects/Mirall/documentation/doc-data/doc-user1/app-storage"
rm -rf "/Users/oliver/Code/mirall/mirall-app/test/frontend/.work/<your temp source/dest folders>"   # clean temp only
```

> **DANGER:** Do not reuse `mirall-app/test/frontend/instance.mjs`'s `Instance.kill()` — it `rmSync`s the store/download dirs. That's correct for ephemeral test instances but would **destroy a persona**. Always tear down personas by signalling the process and verifying the store still exists.

---

## 5. Verify

From the worktree:
```bash
node -e "JSON.parse(require('fs').readFileSync('src/i18n/locales/en.json','utf8'));console.log('en.json: valid')"
# every referenced image exists:
for img in $(grep -o '/docs-[a-z-]*\.webp' src/i18n/locales/en.json | sort -u); do test -f "public$img" && echo "OK $img" || echo "MISSING $img"; done
npm run build        # tsc -b + vite build must be clean
```
- **No stale screenshots:** every referenced image must have been regenerated *this* run. List them (`grep -o '/docs-[a-z-]*\.webp' src/i18n/locales/en.json | sort -u`) and confirm each `public/docs-*.webp` mtime is from today's capture — a shot carried over from a prior version is a bug. Then delete any `public/docs-*.webp` that's no longer referenced.
- **In-page render check (gold standard):** `npm run preview -- --port 4317`, then `open -a "Google Chrome" "http://localhost:4317/docs/guides"`, screenshot the Chrome window with agent-desktop, and Read it back — confirm the images render, the **top nav and chrome look current**, and the sidebar nav works. Spot-check a context page too (e.g. `/docs/tutorials`) so an older screen's chrome isn't stale. Stop the server (`pkill -f "vite preview"`) after.
- **Lint baseline:** `npm run lint` currently reports **2 pre-existing errors** in `src/components/Navbar.tsx` (set-state-in-effect) and `src/components/Seo.tsx` (missing `react/no-danger` rule def). These are **not yours** — confirm they're identical on `main` and don't chase them. Your new files must add **zero** new lint problems.
- SPA note: per-route `<title>`/meta are applied client-side (React 19 metadata) — view-source shows the base title; that's expected and matches the rest of the site.

---

## 6. Screenshot inventory (current set → what it shows → home)

**Every file in this set is re-shot each release** (§4.0) — none are carried over from a prior version. Update this table when you add/rename shots. All are 1600px-wide webp in `public/`, light mode.

| File | Shows | Wired into |
|---|---|---|
| `docs-add-folder.webp` | Add Folder dialog — share name + Eager/On demand toggle | guide `share-a-folder`; tutorial `share-a-folder-and-keep-it-synced` |
| `docs-folder-browse.webp` | Browsing a shared folder — files "Available" + download | guide `browse-a-shared-folder` |
| `docs-folder-mirror.webp` | Mirror to Disk dialog — read-only note + location | guide `mirror-a-folder-to-disk` |
| `docs-folder-mirrored.webp` | Mirrored folder — "MIRRORED · READ-ONLY", "On your device" | guide `manage-a-mirror` |
| `docs-storage-folders.webp` | Storage settings — per-share usage breakdown | guide `reclaim-disk-space` |
| `docs-sidebar-collapsible.webp` | Space sidebar — File Storage collapsed, Members expanded | reference `space-sidebar` |
| `docs-space-folder.webp` | A space with a "Shared by you" folder card | tutorial `share-a-folder-and-keep-it-synced` |
| `docs-onboarding`, `docs-space-list`, `docs-space-view`, `docs-account`, `docs-invite-to-space`, `docs-settings`, `docs-settings-appearance`, `docs-settings-notifications` | onboarding / spaces / account / invite / settings screens | tutorials, guides, reference — **equally reshot every release** (see the §4.0 checklist for how to reach each) |

**Not capturable on macOS:** a Windows/Linux **application menu** screenshot — that menu lives in the macOS system menu bar here. The Reference "Application menu" entry stays a table (no image). Capture it only if you're running on Windows/Linux.

**Alt text:** every screenshot needs descriptive alt text in its `image` block — describe what's on screen and the feature it demonstrates (see existing entries for tone).

---

## 7. Conventions & guardrails

- **Light mode only** for screenshots (§4.4).
- **One Diátaxis mode per document**; re-home, don't duplicate.
- **Match the app exactly** — verify dialog titles, toggle labels, badges, statuses against `mirall-app/src/renderer` before writing them.
- **No AI mentions** in content, commits, or PRs. PR bodies terse; commit = title, blank line, one unwrapped paragraph.
- **No time estimates** in any plan ("X days"). Use complexity language.
- **Accessibility:** semantic headings in order, `alt` on every image, links with discernible text, tables with `<th scope>` (the block components already do this). Don't regress it.
- **SEO/perf:** screenshots stay ~60–80 KB webp; each route keeps its `<Seo>` (breadcrumb; `HowTo` JSON-LD on guides with steps). Add new routes to `public/sitemap.xml`.
- **Worktree discipline:** code work on a feature branch in a sibling worktree; clean up with `git worktree remove` after merge/abandon. Never auto-clean.
- **No commits/pushes** unless the user asks this turn.
- **English-first.** Translations (DE/FR/ES/IT) are a separate, later effort; structure content so they can slot in.

---

## 8. Quick troubleshooting

| Symptom | Cause / fix |
|---|---|
| Snapshot returns empty tree | Window not focused/painted → `focus-window` first; or AX id stale → re-resolve by pid. Or `MIRALL_FORCE_A11Y=1` was missing on launch. |
| All refs are `None` | You read `ref` — it's `ref_id`. |
| Refs go `STALE_REF`, suite stalls | agent-desktop is 0.2.x → downgrade to `0.1.14`. |
| Native picker won't open the path | Source under `/private/var`/tmp → move it under the repo or `~/Code`/`~/Projects`. |
| Persona shows "Welcome to Mirall" | A store with no identity (not a persona) — you pointed `--storage` at the wrong dir. |
| Two personas don't see each other's folders | Not co-members of the space, or one isn't online — use `doc-user1`+`doc-user2` in **Steve's Space**; check the Members panel shows the other as **Online**. |
| `sharp` not found when processing | Run the script from **inside the website worktree**, not `/tmp`. |
| Build fails on `react-refresh/only-export-components` | A `.tsx` exports a non-component — move helpers/types to a `.ts` (e.g. `content.ts`). |

---

*Keep this file in sync with `src/components/docs/*` and the `docs`/`changelog` namespaces in `en.json`. If the content model or the launch/capture mechanics change, update the relevant section here.*
