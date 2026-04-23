import { useTranslation } from 'react-i18next'
import { SquaresFour, ArrowsLeftRight, Lock, IdentificationBadge, DownloadSimple, CloudSlash, type Icon } from '@phosphor-icons/react'

const featureCards: Array<{
  key: string
  Icon: Icon
  iconBg: string
  iconColor: string
  hoverBg: string
}> = [
  { key: 'spaces', Icon: SquaresFour, iconBg: 'bg-emerald-50', iconColor: 'text-primary', hoverBg: 'group-hover:bg-primary' },
  { key: 'direct', Icon: ArrowsLeftRight, iconBg: 'bg-purple-50', iconColor: 'text-tertiary', hoverBg: 'group-hover:bg-tertiary' },
  { key: 'encrypted', Icon: Lock, iconBg: 'bg-blue-50', iconColor: 'text-secondary', hoverBg: 'group-hover:bg-secondary' },
  { key: 'inviteOnly', Icon: IdentificationBadge, iconBg: 'bg-emerald-50', iconColor: 'text-primary', hoverBg: 'group-hover:bg-primary' },
  { key: 'explicitDownload', Icon: DownloadSimple, iconBg: 'bg-purple-50', iconColor: 'text-tertiary', hoverBg: 'group-hover:bg-tertiary' },
  { key: 'zeroInfra', Icon: CloudSlash, iconBg: 'bg-blue-50', iconColor: 'text-secondary', hoverBg: 'group-hover:bg-secondary' },
]

export default function Features() {
  const { t } = useTranslation()

  return (
    <section id="features" className="py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black font-headline mb-4">{t('features.title')}</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">{t('features.description')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureCards.map(({ key, Icon, iconBg, iconColor, hoverBg }) => (
            <div
              key={key}
              className="bg-surface-container-lowest p-8 rounded-xl ambient-shadow group hover:-translate-y-2 transition-all"
            >
              <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center mb-6 ${hoverBg} transition-colors`}>
                <Icon size={24} weight="regular" className={`${iconColor} group-hover:text-white`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{t(`features.${key}.title`)}</h3>
              <p className="text-on-surface-variant leading-relaxed">{t(`features.${key}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
