# Plan — Reorganize the Mirall docs around Diátaxis (for v1.6.0)

Status: **proposed / not started.** Implementation is gated on review of this plan.

## Locked decisions (confirmed with Olli)

1. **IA depth:** Hub + four category pages (`/docs` hub → `/docs/tutorials`, `/docs/guides`, `/docs/reference`, `/docs/explanation`) with a shared left sidebar. Items live as anchored sections inside each category page. High-value pages can later be promoted to their own routes without rework.
2. **Changelog:** add a `/changelog` page generated from `CHANGELOG.md`; wire the already-present-but-dead `footer.product.changelog` link to it.
3. **Languages:** English-first. Author/ship the EN reorg now; DE/FR/ES/IT docs translation is a separate later effort. (Site is English-only today regardless.)

## Goal & principle

Apply the **Diátaxis** framework (Daniele Procida): four documentation modes, **one mode per document, never blended**.

- **Tutorials** — learning-oriented; guided lesson to a first success.
- **How-to guides** — task-oriented; steps for one real goal, assumes basic familiarity.
- **Reference** — information-oriented; dry, exhaustive, lookup-able facts (tables).
- **Explanation** — understanding-oriented; the mental model and the "why".

Today's single `/docs` page is a good user guide but **blends all four modes** (how-to steps + reference tables + privacy explanation interleaved). The reorg re-sorts that content into the four modes and adds the v1.6.0 surface. **Reuse-first: almost no existing copy is discarded — it is re-homed.**

## Target information architecture

```
/docs                         Hub — explains the 4 doc types, links in, popular shortcuts
/docs/tutorials               Learning-oriented
   T1  Send your first files            (install → name → space → invite → share → download)
   T2  Share a folder and keep it synced   ← NEW (1.6 flagship lesson)
/docs/guides                  Task-oriented (grouped)
   Spaces:   create · join (code & app link) · invite · favorite · leave
   Files:    share files · download · pause/resume/retry/discard · unshare
   Folders:  share a folder (eager vs on-demand) ·          ← NEW
             browse a shared folder ·                        ← NEW
             mirror to disk · pause/resume/move/stop mirror  ← NEW
   Storage:  set download folder · clear a space's cache · reclaim disk space  ← reclaim NEW
   Account:  edit profile · fix a connection problem (Network / Reconnect)
   App:      background mode & launch at login · language · theme & size ·
             notifications · update Mirall / see a pending update   ← pending-update NEW
/docs/reference               Information-oriented (tables)
   File statuses          (+ on-demand & mirror states)     ← NEW rows
   Folder & share types / badges (mine · browse · mirrored · paused)  ← NEW
   File & folder actions
   Keyboard shortcuts     (+ Back, Home)                    ← NEW rows
   Settings reference     (General · Appearance · Notifications · Storage · About)
   Application menu       (File/View/Help; platform differences)  ← NEW
   Platforms, requirements & languages
/docs/explanation             Understanding-oriented
   How Mirall works: peer-to-peer, no server
   Privacy & security model (E2E, no accounts, invite-only, metadata vs content)
   Spaces, members & availability (online/offline → file availability)
   Eager vs on-demand sharing — disk-vs-latency trade-off   ← NEW
   Mirroring & the read-only model — why edits revert       ← NEW
   Storage, caching & reclaimable space — why dead bytes grow + auto-reclaim  ← NEW
   How updates work (background OTA)
   How Mirall compares & compliance (Aspera/MASV/WeTransfer; GDPR/Schrems II/HIPAA)

/changelog                    Release notes from CHANGELOG.md (adjacent to Diátaxis, not a quadrant)
```

## Where today's content goes (reuse map)

| Current `/docs` section (en.json key) | New home |
|---|---|
| `docs.gettingStarted` | Tutorial T1 + Guide "edit profile" |
| `docs.account` (+ connection, network) | Guide "fix a connection problem" + Reference (settings/account) |
| `docs.spaces` (creating/joining/managing) | Guides (create/join/favorite/leave) + Tutorial T1 |
| `docs.files` (uploading/downloading/transfers) | Guides + Reference (statuses/actions) |
| `docs.files.statuses` / `docs.files.actions` | Reference tables |
| `docs.members` (+ inviting) | Guide "invite" + Explanation "availability" |
| `docs.settings.*` (all sub-pages) | Reference (settings) + targeted guides (language/theme/notifications/background/storage) |
| `docs.keyboardShortcuts` | Reference (shortcuts) |
| `docs.privacy` | Explanation "privacy & security model" |
| `docs.leaving` | Guide "leave a space" |
| FAQ items on home (`faq.*`) | Cross-link into Explanation (offline behavior, encryption, comparison, compliance); keep on home too |

## New v1.6.0 content to write

Source: `CHANGELOG.md` v1.6.0 + source research (renderer labels/statuses). **Exact labels, badge text, and auto-reclaim thresholds must be re-verified against `mirall-app/src/renderer` at authoring time — do not trust paraphrased strings.**

- **Folders — owned ("Shared by you"):** Add Folder dialog flow; subfolders sync; changes propagate automatically.
- **Folders — eager vs on-demand:** the "Folder Share" toggle; eager = full second copy/instant peer downloads/~2× disk; on-demand = no copy, just-in-time prep, owner must be online. Guide (how to pick in the dialog) + Explanation (the trade-off).
- **Folders — browse:** open a foreign folder, download individual files without mirroring the whole thing; "Browse" badge.
- **Folders — mirror to disk:** start a mirror, read-only (edits revert), pause / resume / change location / unmount; "Mirrored"/"Paused" badges.
- **Storage — per-share usage + reclaim:** per-share breakdown in Storage settings; manual "Reclaim space"; auto-reclaim when a space is idle and dead bytes grow large. Guide + Explanation (why dead bytes accumulate) + Reference (what counts).
- **Reference additions:** new file statuses (Preparing…, On your device, Owner offline, Not available, mirror/on-demand states); folder/share badges; Back + Home shortcuts; Application menu map (File/View/Help) with macOS vs Windows/Linux differences; collapsible Storage/Members sidebar note.
- **App:** pending update now shown in About; update banner no longer overlaps content. Small how-to + reference touch.
- **Accessibility note:** full keyboard + screen-reader support; honors reduced-motion. Short explanation/reference blurb.

## Technical scaffolding (Phase 1)

- `src/App.tsx` — add lazy routes for `/docs`, `/docs/tutorials`, `/docs/guides`, `/docs/reference`, `/docs/explanation`, `/changelog`. Keep SPA rewrite in `vercel.json` (already correct).
- New `src/components/DocsLayout.tsx` — shared shell: left sidebar (4 categories + their items, active-state highlight), content slot, optional prev/next. Reuse `Navbar`/`Footer`/`Seo`.
- Content model — restructure `docs` namespace in `src/i18n/locales/en.json` by mode: `docs.tutorials.*`, `docs.guides.*`, `docs.reference.*`, `docs.explanation.*`, plus `changelog.*`. If it grows large, split locale JSON per page (stack spec allows "one namespace per custom page"). English only for now.
- `public/sitemap.xml` — add all new routes (hand-maintained).
- Nav — add a Docs entry/dropdown surfacing the four categories; wire `footer.product.changelog` → `/changelog`.

## SEO / structured data

- Each new route mounts its own `<Seo>` (title + description) and `breadcrumbSchema`.
- Add `HowTo` JSON-LD to how-to guides and `FAQPage` JSON-LD to explanation/FAQ → eligible for rich results. Real organic-search upside for the new folder-sharing pages.

## Screenshots needed (content task — requires driving the running app; agent-desktop in a later pass)

Reuse existing: onboarding, account, space-list, space-view, invite-to-space, settings, settings-appearance, settings-notifications, settings-storage.

New captures:
- `docs-add-folder.webp` (Add Folder dialog **with the eager/on-demand toggle**)
- `docs-folder-browse.webp` (foreign folder, browse view)
- `docs-folder-mirror.webp` (Mirror-to-Disk dialog) + `docs-folder-mirrored-card.webp` (Mirrored/Paused badge)
- `docs-storage-reclaim.webp` (Storage settings: per-share usage + Reclaim)
- `docs-sidebar-collapsible.webp` (collapsed Storage/Members panels)
- `docs-app-menu.webp` (Windows/Linux File/View/Help menu)

## Phased checklist

- [x] **Phase 0 — Decisions.** (hub+4, changelog yes, EN-first.)
- [x] **Phase 1 — Skeleton.** Routes, `DocsLayout` + sidebar, `/docs` hub, four category pages, `/changelog` route, sitemap + footer wiring.
- [x] **Phase 2 — Re-sort existing content** into the four modes; blended sections split.
- [x] **Phase 3 — Author v1.6.0 content** (folders/mirror/on-demand/reclaim guides; new reference rows; three new explanation topics; T2 tutorial).
- [x] **Phase 4 — Changelog page** (hand-mirrored from `CHANGELOG.md` into the locale, since the changelog lives in the `mirall-app` repo, not the website repo).
- [x] **Phase 5 — Structured data + smoke test.** `HowTo` + breadcrumb JSON-LD wired; `tsc -b` + `vite build` green; all 7 routes serve 200; locale data-contract validated (53/53).
- [x] **Phase 6 — Screenshots (1.6 features).** Captured live from the running app (agent-desktop driving two persona instances connected over real DHT in Steve's Space), **light mode**, then resized to 1600px webp (57–78 KB each, alpha preserved) into `public/`. In-page render verified in Chrome. Seven new assets: `docs-add-folder` (eager/on-demand dialog), `docs-folder-browse`, `docs-folder-mirror`, `docs-folder-mirrored`, `docs-storage-folders` (per-share usage), `docs-sidebar-collapsible`, `docs-space-folder` — wired into the share/browse/mirror/manage-mirror/reclaim guides, the folder tutorial, and a new "space sidebar" reference entry (Reference page now renders section images).

## Review section

Implemented on branch `feat-docs-diataxis` (worktree at `../mirall-website-worktrees/feat-docs-diataxis`, off `main`). **14 files, +1590/−417.** Uncommitted (awaiting review).

**Structure shipped**
- Content model: restructured `docs` namespace by Diátaxis mode + a `changelog` namespace in `en.json`; a tiny `**bold**`/`` `code` `` inline renderer + generic block primitives (`steps`, `bullets`, `table`, `note`, `image`, `p`) so content is data, not markup.
- New: `components/docs/{DocsLayout,blocks}.tsx` + `content.ts` (types/helpers kept JSX-free for `react-refresh/only-export-components`), pages `docs/{Hub,Tutorials,Guides,Reference,Explanation}.tsx`, and `Changelog.tsx`. `App.tsx` routes added; old single-page `Docs.tsx` removed; footer changelog link wired; sitemap updated.
- Inventory: 2 tutorials, 23 how-to guides (4 emit `HowTo` JSON-LD), 8 reference tables/lists, 8 explanation topics, 12 changelog releases. Shared left sidebar with active-state + in-page anchors; cross-page hash deep-links scroll correctly.

**Verification**
- `tsc -b` clean; `vite build` clean (per-page lazy chunks emitted); all 7 routes 200 under `vite preview`; 53/53 locale data-contract assertions pass (rectangular tables, every page's key paths present); all 3 referenced screenshots exist.
- Lint: the 2 errors reported are **pre-existing on `main`** (`Navbar.tsx` set-state-in-effect, `Seo.tsx` missing `react/no-danger` rule def) — confirmed identical on `main`; zero new lint problems from this change.

**Deferred / notes**
- Screenshots are **done** (see Phase 6). The only one not captured is a Windows/Linux **application menu** shot — the menu lives in the macOS system menu bar here, so it can't be captured meaningfully on this machine; the Reference "Application menu" entry stays a table (no image).
- New-1.6 content labels were confirmed against the live app while capturing (Add Folder / Eager / On demand / Mirror to Disk / read-only banner / per-share storage all match).
- Translations (DE/FR/ES/IT) intentionally out of scope (EN-first decision).

## To verify at authoring time

- Exact renderer strings/labels for: Add Folder dialog, eager/on-demand toggle, mirror actions, folder badges, new file statuses, app-menu items, About pending-update text.
- Auto-reclaim trigger thresholds and whether any of this is behind a feature flag that affects what end users actually see in a shipped 1.6.0 build (check `feature-flags.json` on the release branch).
- Whether `/changelog` should render `CHANGELOG.md` at build time (import as text) or be hand-mirrored into the locale — decide in Phase 4.

## Review section

_(to be filled after implementation)_
