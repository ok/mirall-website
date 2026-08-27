# CLAUDE.md

## What this repo is

The **marketing site and documentation** for [Mirall](https://mirall.app), a serverless peer-to-peer desktop file-transfer app. This repo is the *website only* — the app itself lives in a sibling repo (see below).

Vite 8 + React 19 SPA, React Router 7, Tailwind 4, i18next, TypeScript. Deployed to Vercel. Node ≥ 20 (`.nvmrc` pins 22).

There is no SSR server. Every route in `src/routes.ts` is rendered to a static HTML file at build time — `src/entry-server.tsx` renders it, `scripts/prerender.mjs` writes it, and Vercel serves the result. A route added to `routes.ts` is prerendered automatically; one added anywhere else ships as an empty shell.

Routes: `/` · `/download` · `/preview` · `/support` · `/changelog` · `/privacy` · `/impressum` · `/docs` (+ `/docs/{tutorials,guides,reference,explanation}`).

```sh
npm run dev      # dev server
npm run build    # tsc + client build + SSR build + prerender — must be clean
npm run lint     # see the known-baseline note below
npm run preview  # serve the production build
```

## Obligatory reading

**Before touching documentation, screenshots, or homepage copy, read [`.claude/docs-update-playbook.md`](.claude/docs-update-playbook.md) in full.**

It is not optional background — it encodes procedure and hard-won gotchas that are not discoverable from the code, and following your instincts instead will produce wrong output. In particular it covers:

- **The content model.** Nearly all copy is *data*, not JSX — it lives in `src/i18n/locales/en.json` and is rendered by generic components. You edit JSON, not components. Which page renders which field is non-obvious (some pages silently ignore fields you add).
- **Documentation follows Diátaxis.** Every doc is exactly one of Tutorial / How-to / Reference / Explanation. Never blend modes.
- **Screenshots are captured from the real running app** by the capture rig (see below), then wired through `src/components/docs/images.ts`. They are not hand-taken, and they are **all re-shot every release**. The frames ship *without* a drop shadow — the site draws it in CSS.
- **Releases remove features, not just add them.** The single biggest trap: a release that deletes a feature silently leaves whole guides describing UI that no longer exists. Budget for deletions.
- **Never ship a capability claim you haven't found in the app source.** Especially security claims. The playbook records the ones that were wrong.

## The app repo

The source of truth for anything the docs assert is the app, at `/Users/oliver/Code/mirall/mirall-app`:

- `CHANGELOG.md` — user-facing release notes; the spine of every docs update.
- `src/renderer/locales/en/common.json` — the authoritative UI strings. Verify labels here, not from the changelog's paraphrase. **A key existing does not mean the UI does** — orphaned strings outlive their screens.
- `test/frontend/` — the harness the capture rig drives.

## The capture rig

Screenshots come from **`/Users/oliver/Code/mirall/mirall-docs-rig`** — a separate repo holding the personas, the scenes, and the PNG→webp step. Read its `docs/capture-rig.md` before capturing.

**Do not write a throwaway capture script.** The playbook used to tell you to, nothing was ever committed, and the screenshots fell behind every release. If a shot is missing, add a scene to the rig and commit it there.

## Guardrails

- **Never push to `main` or `stage` directly.** Work on a feature branch, open a PR.
- **Branch from `origin/stage`, and PR into `stage`.** Vercel renders a preview for `stage` but not for arbitrary feature branches, so that is where work gets reviewed. `stage` merges to `main` separately. (This used to say to branch from `main` and to treat `stage` as stale — that stopped being true; `stage` now leads `main`.)
- **No commits or pushes unless asked in the current turn.**
- **No `Co-Authored-By` trailer.** No mention of AI anywhere in content, commits, or PRs.
- **No version markers in the docs** ("New in 1.6", "now", "previously"). The docs describe how the app works *today*; the changelog records when things landed.
- **Lint baseline:** `npm run lint` reports **2 pre-existing errors** (`src/components/Navbar.tsx`, `src/components/Seo.tsx`). They are not yours — confirm they're identical on `stage` and leave them. Add zero new lint problems.
- `blocks.tsx` must export **components only** (`react-refresh/only-export-components` is enforced); helpers and types go in `content.ts`.
