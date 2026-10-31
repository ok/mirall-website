import { useTranslation } from 'react-i18next'

/**
 * The Beta mark beside every Studios link in the site's header and footer. It wears
 * the studios pages' dark and orange, so it reads as their door wherever it appears.
 */
export default function BetaChip() {
  const { t } = useTranslation()
  return (
    <span className="ml-1.5 align-[2px] rounded-md bg-[#282c34] px-1.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.06em] text-[#fd9c42]">
      {t('nav.beta')}
    </span>
  )
}
