# mirall-website

Marketing and download site for Mirall. Single-page React app built with Vite, deployed to Vercel.

## Stack

- **Vite 8** + **React 19** (SPA, no SSR)
- **React Router 7** for client-side routing
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **i18next** for translations (currently `en` only, in `src/i18n/locales/`)
- **TypeScript 5.9**, ESLint 9

## Prerequisites

- **Node.js** ≥ 20 (required by Vite 8)
- **npm** (repo uses `package-lock.json`)

## Setup

```sh
git clone <repo-url>
cd mirall-website
npm install
```

## Dev workflow

| Command          | What it does                                              |
| ---------------- | --------------------------------------------------------- |
| `npm run dev`    | Start the Vite dev server with HMR (default: `:5173`)     |
| `npm run build`  | Type-check (`tsc -b`) then produce a production bundle in `dist/` |
| `npm run preview`| Serve the built `dist/` locally to sanity-check the bundle |
| `npm run lint`   | Run ESLint across the repo                                |

There is no test runner configured in this repo. If you add one, document the command here.

## Project layout

```
src/
├── main.tsx              # entry — mounts <App />
├── App.tsx               # router setup
├── index.css             # Tailwind entry + global styles
├── pages/                # route-level components (Download, Docs, …)
├── components/           # shared UI (Navbar, Footer, Hero, …)
├── lib/                  # framework-agnostic helpers (e.g. detectPlatform)
└── i18n/                 # i18next config and locale JSON
public/                   # static assets served at /
vercel.json               # redirects (download URLs) + SPA rewrite
```

## Routing

- Client-side routing via React Router. All unmatched paths are rewritten to `/index.html` by `vercel.json` so deep links work.
- **Download redirects** are defined in `vercel.json` as 302s pointing at R2-hosted binaries. When you add a new platform, add a matching `redirects` entry.

## Deployment

Deployed by Vercel on push. `main` → production, other branches → preview.

- Build command: `npm run build`
- Output directory: `dist`
- No environment variables are required at build time.

## Conventions

- Keep framework-agnostic logic in `src/lib/` so it's easy to unit-test later.
- New UI strings go through `useTranslation()` — add the key to `src/i18n/locales/en.json`.
- Images in `public/` are referenced with absolute paths (`/hero-screenshot.webp`).
