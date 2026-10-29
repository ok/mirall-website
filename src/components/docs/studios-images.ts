// Responsive sources for the Mirall for Studios documentation screenshots, merged into DOC_IMAGES
// by ./images.ts. They live apart from the app docs' so either set can change on its own.
//
// A full screen is 1344px wide like the app shots. A close-up of a dialog or drawer keeps its 2x
// capture size and is shown at half of it, so it gets its own two widths and its own `sizes`.

import auditLog from '../../assets/studios-docs/audit-log.webp?w=672;1008;1344&format=webp&as=srcset'
import instances from '../../assets/studios-docs/instances.webp?w=672;1008;1344&format=webp&as=srcset'
import inviteMember from '../../assets/studios-docs/invite-member.webp?w=448;896&format=webp&as=srcset'
import issueKey from '../../assets/studios-docs/issue-key.webp?w=448;896&format=webp&as=srcset'
import licenseDetails from '../../assets/studios-docs/license-details.webp?w=384;768&format=webp&as=srcset'
import licenses from '../../assets/studios-docs/licenses.webp?w=672;1008;1344&format=webp&as=srcset'
import managedActivityLog from '../../assets/studios-docs/managed-activity-log.webp?w=672;1008;1344&format=webp&as=srcset'
import managedConnect from '../../assets/studios-docs/managed-connect.webp?w=672;1008;1344&format=webp&as=srcset'
import managedOrganization from '../../assets/studios-docs/managed-organization.webp?w=672;1008;1344&format=webp&as=srcset'
import members from '../../assets/studios-docs/members.webp?w=672;1008;1344&format=webp&as=srcset'
import overview from '../../assets/studios-docs/overview.webp?w=672;1008;1344&format=webp&as=srcset'
import profileEditor from '../../assets/studios-docs/profile-editor.webp?w=672;1008;1344&format=webp&as=srcset'
import profiles from '../../assets/studios-docs/profiles.webp?w=672;1008;1344&format=webp&as=srcset'
import settingsOrganization from '../../assets/studios-docs/settings-organization.webp?w=672;1008;1344&format=webp&as=srcset'
import signIn from '../../assets/studios-docs/sign-in.webp?w=672;1008;1344&format=webp&as=srcset'
import twoFactorSetup from '../../assets/studios-docs/two-factor-setup.webp?w=672;1008;1344&format=webp&as=srcset'

const closeUp = (cssWidth: number) => `(max-width: 768px) 100vw, ${cssWidth}px`

export const STUDIOS_DOC_IMAGES: Record<string, { srcSet: string; sizes?: string }> = {
  '/studios-docs-audit-log.webp': { srcSet: auditLog },
  '/studios-docs-instances.webp': { srcSet: instances },
  '/studios-docs-invite-member.webp': { srcSet: inviteMember, sizes: closeUp(448) },
  '/studios-docs-issue-key.webp': { srcSet: issueKey, sizes: closeUp(448) },
  '/studios-docs-license-details.webp': { srcSet: licenseDetails, sizes: closeUp(384) },
  '/studios-docs-licenses.webp': { srcSet: licenses },
  '/studios-docs-managed-activity-log.webp': { srcSet: managedActivityLog },
  '/studios-docs-managed-connect.webp': { srcSet: managedConnect },
  '/studios-docs-managed-organization.webp': { srcSet: managedOrganization },
  '/studios-docs-members.webp': { srcSet: members },
  '/studios-docs-overview.webp': { srcSet: overview },
  '/studios-docs-profile-editor.webp': { srcSet: profileEditor },
  '/studios-docs-profiles.webp': { srcSet: profiles },
  '/studios-docs-settings-organization.webp': { srcSet: settingsOrganization },
  '/studios-docs-sign-in.webp': { srcSet: signIn },
  '/studios-docs-two-factor-setup.webp': { srcSet: twoFactorSetup },
}
