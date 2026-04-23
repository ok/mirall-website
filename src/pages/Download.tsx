import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import { breadcrumbSchema } from '../lib/schema'
import { detectPlatform, type Platform } from '../lib/detectPlatform'
import { AppleLogo, WindowsLogo, LinuxLogo, Info, Download as DownloadIcon, type Icon } from '@phosphor-icons/react'

interface PlatformInfo {
  key: Platform
  Icon: Icon
  translationKey: string
  format: string
}

const platforms: PlatformInfo[] = [
  { key: 'darwin-arm64', Icon: AppleLogo, translationKey: 'download.platforms.macArm', format: '.dmg' },
  { key: 'darwin-x64', Icon: AppleLogo, translationKey: 'download.platforms.macIntel', format: '.dmg' },
  { key: 'win32-x64', Icon: WindowsLogo, translationKey: 'download.platforms.windows', format: '.msix' },
  { key: 'linux-x64', Icon: LinuxLogo, translationKey: 'download.platforms.linuxX64', format: '.AppImage.tar.gz' },
  { key: 'linux-arm64', Icon: LinuxLogo, translationKey: 'download.platforms.linuxArm', format: '.AppImage.tar.gz' },
]

export default function Download() {
  const { t } = useTranslation()
  const [detected, setDetected] = useState<Platform | null>(null)

  useEffect(() => {
    let cancelled = false
    detectPlatform().then(p => { if (!cancelled) setDetected(p) })
    return () => { cancelled = true }
  }, [])

  const detectedPlatform = platforms.find(p => p.key === detected)
  const otherPlatforms = platforms.filter(p => p.key !== detected)

  return (
    <>
      <Seo
        title="Download Mirall for Mac, Windows, Linux"
        description="Secure large file transfer app for desktop. End-to-end encrypted, runs on macOS, Windows, and Linux. Free beta — download now."
        path="/download"
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Download', path: '/download' },
        ])}
      />
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
              <Info size={18} weight="regular" />
              {t('download.betaNotice')}
            </div>

            {detectedPlatform && (() => {
              const DetectedIcon = detectedPlatform.Icon
              return (
                <div className="mb-16">
                  <a
                    href={`/download/${detectedPlatform.key}`}
                    className="inline-flex items-center gap-3 hero-gradient text-on-primary px-10 py-5 rounded-lg font-black text-lg ambient-shadow hover:scale-105 transition-transform"
                  >
                    <DetectedIcon size={32} weight="regular" />
                    {t('download.downloadFor', { platform: t(detectedPlatform.translationKey) })}
                  </a>
                </div>
              )
            })()}

            <div className={detected ? 'border-t border-outline-variant pt-12' : ''}>
              {detected && (
                <p className="text-on-surface-variant font-semibold mb-8">{t('download.otherPlatforms')}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {(detected ? otherPlatforms : platforms).map(platform => {
                  const PlatformIcon = platform.Icon
                  return (
                    <a
                      key={platform.key}
                      href={`/download/${platform.key}`}
                      className="flex items-center gap-4 px-6 py-4 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-left"
                    >
                      <PlatformIcon size={28} weight="regular" className="text-primary" />
                      <div>
                        <span className="font-bold text-on-surface block">{t(platform.translationKey)}</span>
                        <span className="text-sm text-on-surface-variant">{platform.format}</span>
                      </div>
                      <DownloadIcon size={22} weight="regular" className="text-on-surface-variant ml-auto" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
