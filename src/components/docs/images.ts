// Responsive sources for the documentation screenshots.
//
// The docs content lives in i18n JSON, which can't import assets, so it refers to
// each screenshot by a stable "/docs-<name>.webp" key and we resolve that here.
// Routing them through vite-imagetools (rather than serving one fixed file from
// public/) means a phone fetches the 672px variant instead of the full 1344px one,
// which is what keeps Lighthouse's "properly size images" audit clean.

import accountSecurity from '../../assets/docs/account-security.webp?w=672;1008;1344&format=webp&as=srcset'
import addFolder from '../../assets/docs/add-folder.webp?w=672;1008;1344&format=webp&as=srcset'
import approvalReview from '../../assets/docs/approval-review.webp?w=672;1008;1344&format=webp&as=srcset'
import folderBrowse from '../../assets/docs/folder-browse.webp?w=672;1008;1344&format=webp&as=srcset'
import folderMirror from '../../assets/docs/folder-mirror.webp?w=672;1008;1344&format=webp&as=srcset'
import folderMirrored from '../../assets/docs/folder-mirrored.webp?w=672;1008;1344&format=webp&as=srcset'
import inviteToSpace from '../../assets/docs/invite-to-space.webp?w=672;1008;1344&format=webp&as=srcset'
import joinApproval from '../../assets/docs/join-approval.webp?w=672;1008;1344&format=webp&as=srcset'
import joinWaiting from '../../assets/docs/join-waiting.webp?w=672;1008;1344&format=webp&as=srcset'
import mirroredBy from '../../assets/docs/mirrored-by.webp?w=672;1008;1344&format=webp&as=srcset'
import onboarding from '../../assets/docs/onboarding.webp?w=672;1008;1344&format=webp&as=srcset'
import peerDownloads from '../../assets/docs/peer-downloads.webp?w=672;1008;1344&format=webp&as=srcset'
import settingsStorage from '../../assets/docs/settings-storage.webp?w=672;1008;1344&format=webp&as=srcset'
import sidebarCollapsible from '../../assets/docs/sidebar-collapsible.webp?w=672;1008;1344&format=webp&as=srcset'
import spaceFolder from '../../assets/docs/space-folder.webp?w=672;1008;1344&format=webp&as=srcset'
import spaceView from '../../assets/docs/space-view.webp?w=672;1008;1344&format=webp&as=srcset'

// A srcset reads "<url> 672w, <url> 1008w, <url> 1344w". Reuse its widest entry as
// the plain `src` fallback rather than importing the same asset a second time —
// a separate `?w=1344` import emits a byte-identical file under a second hash and
// ships it to no one.
function widest(srcSet: string): string {
  const last = srcSet.split(',').pop()
  return (last ?? '').trim().split(/\s+/)[0] ?? ''
}

const SRCSETS: Record<string, string> = {
  '/docs-account-security.webp': accountSecurity,
  '/docs-add-folder.webp': addFolder,
  '/docs-approval-review.webp': approvalReview,
  '/docs-folder-browse.webp': folderBrowse,
  '/docs-folder-mirror.webp': folderMirror,
  '/docs-folder-mirrored.webp': folderMirrored,
  '/docs-invite-to-space.webp': inviteToSpace,
  '/docs-join-approval.webp': joinApproval,
  '/docs-join-waiting.webp': joinWaiting,
  '/docs-mirrored-by.webp': mirroredBy,
  '/docs-onboarding.webp': onboarding,
  '/docs-peer-downloads.webp': peerDownloads,
  '/docs-settings-storage.webp': settingsStorage,
  '/docs-sidebar-collapsible.webp': sidebarCollapsible,
  '/docs-space-folder.webp': spaceFolder,
  '/docs-space-view.webp': spaceView,
}

export const DOC_IMAGES: Record<string, { src: string; srcSet: string }> = Object.fromEntries(
  Object.entries(SRCSETS).map(([key, srcSet]) => [key, { src: widest(srcSet), srcSet }])
)

// The docs column caps at max-w-2xl (672px); below that the image is full-bleed.
export const DOC_IMAGE_SIZES = '(max-width: 768px) 100vw, 672px'
