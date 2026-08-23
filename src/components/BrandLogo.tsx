import { useTranslation } from 'react-i18next'

interface BrandLogoProps {
  className?: string
}

export default function BrandLogo({ className = 'text-2xl' }: BrandLogoProps) {
  const { t } = useTranslation()
  return (
    <span className={`font-extrabold text-black tracking-tighter font-headline ${className}`}>
      {t('brand')}<span className="text-[#fd9c42]">.</span>
    </span>
  )
}
