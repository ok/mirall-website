import { useTranslation } from 'react-i18next'

const featureCards = [
  { key: 'spaces', icon: 'workspaces', iconBg: 'bg-emerald-50', iconColor: 'text-primary', hoverBg: 'group-hover:bg-primary' },
  { key: 'p2p', icon: 'swap_horiz', iconBg: 'bg-purple-50', iconColor: 'text-tertiary', hoverBg: 'group-hover:bg-tertiary' },
  { key: 'encrypted', icon: 'lock', iconBg: 'bg-blue-50', iconColor: 'text-secondary', hoverBg: 'group-hover:bg-secondary' },
  { key: 'inviteOnly', icon: 'badge', iconBg: 'bg-emerald-50', iconColor: 'text-primary', hoverBg: 'group-hover:bg-primary' },
  { key: 'explicitDownload', icon: 'download_for_offline', iconBg: 'bg-purple-50', iconColor: 'text-tertiary', hoverBg: 'group-hover:bg-tertiary' },
  { key: 'zeroInfra', icon: 'cloud_off', iconBg: 'bg-blue-50', iconColor: 'text-secondary', hoverBg: 'group-hover:bg-secondary' },
] as const

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
          {featureCards.map(({ key, icon, iconBg, iconColor, hoverBg }) => (
            <div
              key={key}
              className="bg-surface-container-lowest p-8 rounded-xl ambient-shadow group hover:-translate-y-2 transition-all"
            >
              <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center mb-6 ${hoverBg} transition-colors`}>
                <span className={`material-symbols-outlined ${iconColor} group-hover:text-white`}>{icon}</span>
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
