import { useTranslation } from 'react-i18next'

interface BrandLogoProps {
  className?: string
  /** The white wordmark, for dark backgrounds. */
  inverse?: boolean
}

export default function BrandLogo({ className = 'h-7', inverse = false }: BrandLogoProps) {
  const { t } = useTranslation()
  // The SVG carries no width/height of its own, so the viewBox supplies the
  // aspect ratio and callers size the mark by height alone.
  return <img src={inverse ? '/logo-invers.svg' : '/logo.svg'} alt={t('brand')} className={`block w-auto ${className}`} />
}
