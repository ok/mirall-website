// Screenshots for /studios, captured from the real app by mirall-docs-rig in the
// dark theme. Each shot has two crops, not one image scaled: the app has no phone
// layout, so a desktop window shrunk to a phone is unreadable. Desktop step frames
// are 1280×1280 and phone frames 1080×1350 (2× and 3× their displayed size);
// the hero is the whole window at 2560×1600, with a 1080×675 copy for small screens.

import heroDesktop from '../../assets/studios/hero-space-desktop.webp?w=1152;1600;2304;2560&format=webp&as=srcset'
import heroDesktopSrc from '../../assets/studios/hero-space-desktop.webp?w=1600&format=webp'
import heroSmall from '../../assets/studios/hero-space-mobile-wide.webp?w=540;810;1080&format=webp&as=srcset'
import createDesktop from '../../assets/studios/create-desktop.webp?w=640;960;1280&format=webp&as=srcset'
import createDesktopSrc from '../../assets/studios/create-desktop.webp?w=960&format=webp'
import createMobile from '../../assets/studios/create-mobile.webp?w=540;810;1080&format=webp&as=srcset'
import inviteDesktop from '../../assets/studios/invite-desktop.webp?w=640;960;1280&format=webp&as=srcset'
import inviteDesktopSrc from '../../assets/studios/invite-desktop.webp?w=960&format=webp'
import inviteMobile from '../../assets/studios/invite-mobile.webp?w=540;810;1080&format=webp&as=srcset'
import joinDesktop from '../../assets/studios/join-requests-desktop.webp?w=640;960;1280&format=webp&as=srcset'
import joinDesktopSrc from '../../assets/studios/join-requests-desktop.webp?w=960&format=webp'
import joinMobile from '../../assets/studios/join-requests-mobile.webp?w=540;810;1080&format=webp&as=srcset'
import dropDesktop from '../../assets/studios/drop-desktop.webp?w=640;960;1280&format=webp&as=srcset'
import dropDesktopSrc from '../../assets/studios/drop-desktop.webp?w=960&format=webp'
import dropMobile from '../../assets/studios/drop-mobile.webp?w=540;810;1080&format=webp&as=srcset'
import mirrorDesktop from '../../assets/studios/mirror-desktop.webp?w=640;960;1280&format=webp&as=srcset'
import mirrorDesktopSrc from '../../assets/studios/mirror-desktop.webp?w=960&format=webp'
import mirrorMobile from '../../assets/studios/mirror-mobile.webp?w=540;810;1080&format=webp&as=srcset'

export interface Shot {
  desktop: string
  desktopSrc: string
  mobile: string
}

export const HERO = { desktop: heroDesktop, desktopSrc: heroDesktopSrc, small: heroSmall }

/** One per step; step 02 has a second frame that cross-fades in. */
export const STEP_SHOTS: Array<[Shot] | [Shot, Shot]> = [
  [{ desktop: createDesktop, desktopSrc: createDesktopSrc, mobile: createMobile }],
  [
    { desktop: inviteDesktop, desktopSrc: inviteDesktopSrc, mobile: inviteMobile },
    { desktop: joinDesktop, desktopSrc: joinDesktopSrc, mobile: joinMobile },
  ],
  [{ desktop: dropDesktop, desktopSrc: dropDesktopSrc, mobile: dropMobile }],
  [{ desktop: mirrorDesktop, desktopSrc: mirrorDesktopSrc, mobile: mirrorMobile }],
]
