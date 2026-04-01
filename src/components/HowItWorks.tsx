import { useTranslation } from 'react-i18next'

const stepColors = ['bg-primary', 'bg-secondary', 'bg-tertiary']
const stepIcons = ['add_circle', 'person_add', 'cloud_download']

export default function HowItWorks() {
  const { t } = useTranslation()
  const items = t('howItWorks.items', { returnObjects: true }) as Array<{
    step: string
    title: string
    description: string
  }>

  return (
    <section id="how-it-works" className="py-32 bg-background overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="max-w-xl mb-16">
          <h2 className="text-4xl font-black font-headline mb-4">{t('howItWorks.title')}</h2>
          <p className="text-on-surface-variant">{t('howItWorks.description')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-xl ambient-shadow relative">
              <div className={`w-14 h-14 ${stepColors[i]} rounded-xl flex items-center justify-center mb-8`}>
                <span className="material-symbols-outlined text-white text-2xl">{stepIcons[i]}</span>
              </div>
              <span className="text-sm font-bold text-on-surface-variant uppercase tracking-[0.1em] mb-2 block">
                Step {item.step}
              </span>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-on-surface-variant leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
