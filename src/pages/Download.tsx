import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

type Platform = 'darwin-arm64' | 'darwin-x64' | 'win32-x64' | 'linux-x64' | 'linux-arm64'

interface PlatformInfo {
  key: Platform
  icon: string
  translationKey: string
  format: string
}

const platforms: PlatformInfo[] = [
  { key: 'darwin-arm64', icon: 'laptop_mac', translationKey: 'download.platforms.macArm', format: '.dmg' },
  { key: 'darwin-x64', icon: 'laptop_mac', translationKey: 'download.platforms.macIntel', format: '.dmg' },
  { key: 'win32-x64', icon: 'laptop_windows', translationKey: 'download.platforms.windows', format: '.zip' },
  { key: 'linux-x64', icon: 'terminal', translationKey: 'download.platforms.linuxX64', format: '.AppImage' },
  { key: 'linux-arm64', icon: 'terminal', translationKey: 'download.platforms.linuxArm', format: '.AppImage' },
]

function detectPlatform(): Platform | null {
  const ua = navigator.userAgent
  if (ua.includes('Macintosh') || ua.includes('Mac OS X')) {
    // Apple Silicon detection: check via WebGL renderer or platform
    // navigator.platform is deprecated but still the most reliable way
    // to distinguish arm64 vs x64 on macOS
    return 'darwin-arm64'
  }
  if (ua.includes('Windows')) return 'win32-x64'
  if (ua.includes('Linux')) return 'linux-x64'
  return null
}

export default function Download() {
  const { t } = useTranslation()
  const [detected, setDetected] = useState<Platform | null>(null)

  useEffect(() => {
    setDetected(detectPlatform())
  }, [])

  const detectedPlatform = platforms.find(p => p.key === detected)
  const otherPlatforms = platforms.filter(p => p.key !== detected)

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-24 bg-background">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <span className="uppercase tracking-[0.1em] text-primary font-bold mb-6 block text-sm">
              {t('download.label')}
            </span>
            <h1 className="text-5xl font-black font-headline text-on-surface tracking-tighter mb-6">
              {t('download.title')}
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed mb-8 max-w-2xl mx-auto">
              {t('download.description')}
            </p>
            <div className="mb-16 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm font-medium">
              <span className="material-symbols-outlined text-lg">info</span>
              {t('download.betaNotice')}
            </div>

            {detectedPlatform && (
              <div className="mb-16">
                <a
                  href={`/download/${detectedPlatform.key}`}
                  className="inline-flex items-center gap-3 hero-gradient text-on-primary px-10 py-5 rounded-lg font-black text-lg ambient-shadow hover:scale-105 transition-transform"
                >
                  <span className="material-symbols-outlined text-3xl">{detectedPlatform.icon}</span>
                  {t('download.downloadFor', { platform: t(detectedPlatform.translationKey) })}
                </a>
              </div>
            )}

            <div className={detected ? 'border-t border-outline-variant pt-12' : ''}>
              {detected && (
                <p className="text-on-surface-variant font-semibold mb-8">{t('download.otherPlatforms')}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {(detected ? otherPlatforms : platforms).map(platform => (
                  <a
                    key={platform.key}
                    href={`/download/${platform.key}`}
                    className="flex items-center gap-4 px-6 py-4 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-2xl text-primary">{platform.icon}</span>
                    <div>
                      <span className="font-bold text-on-surface block">{t(platform.translationKey)}</span>
                      <span className="text-sm text-on-surface-variant">{platform.format}</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant ml-auto">download</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
