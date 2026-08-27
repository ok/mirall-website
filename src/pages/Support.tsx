import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import { RichText } from '../components/docs/blocks'
import { breadcrumbSchema } from '../lib/schema'
import supportSrcSet from '../assets/support-screenshot.webp?w=400;640;960;1280;1600&format=webp&as=srcset'
import supportSrc from '../assets/support-screenshot.webp?w=960&format=webp'

/** One row of the triage list: a symptom, the first thing to check, and where the docs cover it. */
interface Problem {
  symptom: string
  check: string
  linkLabel: string
  to: string
}

export default function Support() {
  const { t } = useTranslation()
  const steps = t('support.steps.items', { returnObjects: true }) as string[]
  const problems = t('support.problems.items', { returnObjects: true }) as unknown as Problem[]
  const reportItems = t('support.report.items', { returnObjects: true }) as string[]

  return (
    <>
      <Seo
        title="Mirall Support — Help & Troubleshooting"
        description="Get help with Mirall. Fixes for the problems that come up most — a join that never completes, a connection that won't come up, a stalled transfer — plus built-in feedback that goes straight to our team."
        path="/support"
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Support', path: '/support' },
        ])}
      />
      <Navbar />
      <main className="pt-20">
        <section className="py-24 bg-background">
          <div className="max-w-4xl mx-auto px-8">
            <span className="uppercase tracking-[0.1em] text-primary font-bold mb-6 block text-sm">
              {t('support.title')}
            </span>
            <h1 className="text-5xl font-black font-headline text-on-surface tracking-tighter mb-6">
              {t('support.heading')}
            </h1>
            <RichText
              text={t('support.description')}
              className="block text-xl text-on-surface-variant leading-relaxed mb-16 max-w-2xl"
            />

            <div className="relative mb-16">
              <img
                className="w-full object-cover"
                style={{ filter: 'drop-shadow(0 1px 1.5px rgba(16, 24, 40, 0.12)) drop-shadow(0 5px 7px rgba(16, 24, 40, 0.22))' }}
                alt={t('support.screenshotAlt')}
                src={supportSrc}
                srcSet={supportSrcSet}
                sizes="(min-width: 896px) 832px, calc(100vw - 64px)"
                width={1600}
                height={1387}
                fetchPriority="high"
                decoding="async"
              />
              <div className="absolute top-[4.5%] right-[9%] w-[14%] h-[8%] rounded-xl animate-pulse pointer-events-none" />
            </div>

            <div className="bg-surface-container-low rounded-xl p-10 mb-12">
              <h2 className="text-2xl font-bold font-headline mb-6">{t('support.steps.title')}</h2>
              <ol className="space-y-4">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full hero-gradient text-on-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {i + 1}
                    </span>
                    <RichText
                      text={step}
                      className="text-lg text-on-surface-variant leading-relaxed pt-0.5"
                    />
                  </li>
                ))}
              </ol>
            </div>

            <p className="text-on-surface-variant text-lg italic">{t('support.note')}</p>
          </div>
        </section>

        <section className="py-24 bg-surface-container-low">
          <div className="max-w-4xl mx-auto px-8">
            <h2 className="text-3xl font-black font-headline text-on-surface tracking-tight mb-4">
              {t('support.problems.title')}
            </h2>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-12 max-w-2xl">
              {t('support.problems.intro')}
            </p>

            <ul className="space-y-4">
              {problems.map((problem, i) => (
                <li key={i} className="bg-surface-container-lowest rounded-xl p-8">
                  <h3 className="text-lg font-bold font-headline text-on-surface mb-2">
                    {problem.symptom}
                  </h3>
                  <RichText
                    text={problem.check}
                    className="block text-on-surface-variant leading-relaxed mb-4"
                  />
                  <Link
                    to={problem.to}
                    className="inline-flex items-center gap-1.5 text-primary hover:text-emerald-500 transition-colors font-medium"
                  >
                    <ArrowRight size={16} weight="bold" aria-hidden="true" />
                    {problem.linkLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="max-w-4xl mx-auto px-8">
            <h2 className="text-3xl font-black font-headline text-on-surface tracking-tight mb-4">
              {t('support.report.title')}
            </h2>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-10 max-w-2xl">
              {t('support.report.intro')}
            </p>

            <ul className="space-y-4 mb-12">
              {reportItems.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-3"
                  />
                  <RichText text={item} className="text-lg text-on-surface-variant leading-relaxed" />
                </li>
              ))}
            </ul>

            <div className="bg-surface-container-low rounded-xl p-10">
              <h3 className="text-xl font-bold font-headline text-on-surface mb-4">
                {t('support.report.consoleTitle')}
              </h3>
              <RichText
                text={t('support.report.consoleIntro')}
                className="block text-on-surface-variant leading-relaxed mb-4"
              />
              <RichText
                text={t('support.report.consoleNote')}
                className="block text-on-surface-variant leading-relaxed text-sm"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
