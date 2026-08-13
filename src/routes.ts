import type { ComponentType } from 'react'
import Home from './pages/Home'

export interface RouteDef {
  path: string
  load: () => Promise<{ default: ComponentType }>
  /**
   * Rendered directly instead of through `lazy()` on the client. Home is in the
   * main bundle already, so routing it through a lazy boundary would add a
   * chunk fetch to the landing page for no gain.
   */
  eager?: ComponentType
}

/**
 * The single source of truth for the site's routes. `App` builds the client
 * router from this, and `scripts/prerender.mjs` walks the same array — so a
 * route added here is prerendered automatically rather than silently shipping
 * as an empty shell.
 */
export const routes: RouteDef[] = [
  { path: '/', load: () => import('./pages/Home'), eager: Home },
  { path: '/docs', load: () => import('./pages/docs/Hub') },
  { path: '/docs/tutorials', load: () => import('./pages/docs/Tutorials') },
  { path: '/docs/guides', load: () => import('./pages/docs/Guides') },
  { path: '/docs/reference', load: () => import('./pages/docs/Reference') },
  { path: '/docs/explanation', load: () => import('./pages/docs/Explanation') },
  { path: '/changelog', load: () => import('./pages/Changelog') },
  { path: '/support', load: () => import('./pages/Support') },
  { path: '/download', load: () => import('./pages/Download') },
  { path: '/preview', load: () => import('./pages/Preview') },
  { path: '/privacy', load: () => import('./pages/Privacy') },
  { path: '/impressum', load: () => import('./pages/Impressum') },
]
