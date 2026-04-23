import { useTranslation } from 'react-i18next'
import { Check } from '@phosphor-icons/react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Screenshot({ src, alt, width = 1400, height = 1039 }: { src: string; alt: string; width?: number; height?: number }) {
  return (
    <div className="my-10">
      <img
        className="w-full max-w-3xl mx-auto object-cover"
        style={{ filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.04))' }}
        alt={alt}
        src={src}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 mb-16">
      {children}
    </section>
  )
}

export default function Docs() {
  const { t } = useTranslation()

  const creatingSteps = t('docs.spaces.creating.steps', { returnObjects: true }) as string[]
  const joiningSteps = t('docs.spaces.joining.steps', { returnObjects: true }) as string[]
  const fileStatuses = t('docs.files.statuses.items', { returnObjects: true }) as Array<{ status: string; meaning: string }>
  const fileActions = t('docs.files.actions.items', { returnObjects: true }) as string[]
  const settingsItems = t('docs.settings.items', { returnObjects: true }) as string[]

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="py-24 bg-background">
          <div className="max-w-4xl mx-auto px-8">
            <span className="uppercase tracking-[0.1em] text-primary font-bold mb-6 block text-sm">
              {t('docs.title')}
            </span>
            <h1 className="text-5xl font-black font-headline text-on-surface tracking-tighter mb-6">
              {t('docs.heading')}
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed mb-8 max-w-2xl">
              {t('docs.intro')}
            </p>

            <nav className="bg-surface-container-low rounded-xl p-8 mb-16">
              <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-4">On this page</h2>
              <ul className="space-y-2">
                {['gettingStarted', 'spaces', 'files', 'members', 'settings', 'privacy', 'leaving'].map((key) => (
                  <li key={key}>
                    <a href={`#${key}`} className="text-primary hover:text-emerald-500 transition-colors font-medium">
                      {t(`docs.${key}.title`)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <Section id="gettingStarted">
              <h2 className="text-3xl font-black font-headline mb-4">{t('docs.gettingStarted.title')}</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed">{t('docs.gettingStarted.description')}</p>
              <Screenshot src="/docs-getting-started.webp" alt={t('docs.gettingStarted.screenshotAlt')} />
            </Section>

            <Section id="spaces">
              <h2 className="text-3xl font-black font-headline mb-4">{t('docs.spaces.title')}</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-8">{t('docs.spaces.description')}</p>

              <Screenshot src="/hero-screenshot.webp" alt={t('docs.spaces.screenshotAlt')} />

              <h3 className="text-xl font-bold mb-3 mt-10">{t('docs.spaces.creating.title')}</h3>
              <ol className="space-y-3 mb-8">
                {creatingSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="w-7 h-7 rounded-full hero-gradient text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-lg text-on-surface-variant leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>

              <h3 className="text-xl font-bold mb-3">{t('docs.spaces.joining.title')}</h3>
              <ol className="space-y-3 mb-8">
                {joiningSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="w-7 h-7 rounded-full hero-gradient text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-lg text-on-surface-variant leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>

              <div className="bg-surface-container-low rounded-xl p-8">
                <h3 className="text-xl font-bold mb-3">{t('docs.spaces.managing.title')}</h3>
                <p className="text-on-surface-variant leading-relaxed">{t('docs.spaces.managing.description')}</p>
              </div>
            </Section>

            <Section id="files">
              <h2 className="text-3xl font-black font-headline mb-4">{t('docs.files.title')}</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-8">{t('docs.files.description')}</p>

              <Screenshot src="/docs-space-view.webp" alt={t('docs.files.screenshotAlt')} />

              <div className="bg-surface-container-low rounded-xl p-8 mb-8">
                <h3 className="text-xl font-bold mb-3">{t('docs.files.uploading.title')}</h3>
                <p className="text-on-surface-variant leading-relaxed">{t('docs.files.uploading.description')}</p>
              </div>

              <div className="bg-surface-container-low rounded-xl p-8 mb-8">
                <h3 className="text-xl font-bold mb-3">{t('docs.files.downloading.title')}</h3>
                <p className="text-on-surface-variant leading-relaxed">{t('docs.files.downloading.description')}</p>
              </div>

              <div className="bg-surface-container-low rounded-xl p-8 mb-8">
                <h3 className="text-xl font-bold mb-3">{t('docs.files.transfers.title')}</h3>
                <p className="text-on-surface-variant leading-relaxed">{t('docs.files.transfers.description')}</p>
              </div>

              <h3 className="text-xl font-bold mb-4">{t('docs.files.statuses.title')}</h3>
              <div className="space-y-3 mb-10">
                {fileStatuses.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="font-bold text-on-surface min-w-[140px] shrink-0">{item.status}</span>
                    <span className="text-on-surface-variant">{item.meaning}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold mb-4">{t('docs.files.actions.title')}</h3>
              <ul className="space-y-2">
                {fileActions.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={20} weight="bold" className="text-primary mt-0.5 shrink-0" />
                    <span className="text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="members">
              <h2 className="text-3xl font-black font-headline mb-4">{t('docs.members.title')}</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-8">{t('docs.members.description')}</p>

              <div className="bg-surface-container-low rounded-xl p-8">
                <h3 className="text-xl font-bold mb-3">{t('docs.members.inviting.title')}</h3>
                <p className="text-on-surface-variant leading-relaxed">{t('docs.members.inviting.description')}</p>
              </div>

              <Screenshot src="/docs-invite.webp" alt={t('docs.members.inviting.title')} />
            </Section>

            <Section id="settings">
              <h2 className="text-3xl font-black font-headline mb-4">{t('docs.settings.title')}</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-4">{t('docs.settings.description')}</p>
              <ul className="space-y-2 mb-8">
                {settingsItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={20} weight="bold" className="text-primary mt-0.5 shrink-0" />
                    <span className="text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>

              <Screenshot src="/docs-settings.webp" alt={t('docs.settings.screenshotAlt')} />

              <div className="bg-surface-container-low rounded-xl p-8 mb-8 mt-10">
                <h3 className="text-xl font-bold mb-3">{t('docs.settings.storage.title')}</h3>
                <p className="text-on-surface-variant leading-relaxed">{t('docs.settings.storage.description')}</p>
              </div>

              <div className="bg-surface-container-low rounded-xl p-8">
                <h3 className="text-xl font-bold mb-3">{t('docs.settings.about.title')}</h3>
                <p className="text-on-surface-variant leading-relaxed">{t('docs.settings.about.description')}</p>
              </div>
            </Section>

            <Section id="privacy">
              <h2 className="text-3xl font-black font-headline mb-4">{t('docs.privacy.title')}</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed">{t('docs.privacy.description')}</p>
            </Section>

            <Section id="leaving">
              <h2 className="text-3xl font-black font-headline mb-4">{t('docs.leaving.title')}</h2>
              <p className="text-lg text-on-surface-variant leading-relaxed">{t('docs.leaving.description')}</p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
