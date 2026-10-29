import en from './locales/en.json'
import studiosDocs from './locales/studios-docs.en.json'

/**
 * The strings both the client (./index.ts) and the prerender (src/entry-server.tsx) load. The
 * Mirall for Studios docs keep their own file, so they change without touching the app docs.
 */
export const resources = {
  en: { translation: { ...en, studiosDocs } },
}
