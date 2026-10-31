import { useSyncExternalStore } from 'react'
import { SITE_URL } from './schema'

/** Where a phone sends someone: the download page, on whichever computer opens it. */
export const DOWNLOAD_URL = `${SITE_URL}/download`

/**
 * A phone or tablet: a device Mirall can't be installed on. Visitors arrive on one
 * from the QR code on our cards, and a .dmg or .msix offered there leads nowhere.
 *
 * iPadOS asks for the desktop site and reports itself as a Mac, so a Mac with a
 * touchscreen is a tablet: no Mac has one.
 */
export function isHandheld(): boolean {
  if (typeof navigator === 'undefined') return false
  const nav = navigator as Navigator & { userAgentData?: { mobile?: boolean } }
  if (nav.userAgentData?.mobile) return true
  const ua = nav.userAgent
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return true
  return /Macintosh/.test(ua) && nav.maxTouchPoints > 1
}

const unchanging = () => () => {}

/**
 * isHandheld() for rendering. The prerendered HTML is the desktop version, and a phone
 * switches over once it hydrates, so the page never mismatches its own markup.
 */
export function useHandheld(): boolean {
  return useSyncExternalStore(unchanging, isHandheld, () => false)
}
