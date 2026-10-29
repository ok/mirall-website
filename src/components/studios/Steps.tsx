import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { STEP_SHOTS, type Shot } from './shots'
import { useActiveStep } from './useStudioMotion'

interface StepCopy {
  title: string
  text: string
  ui: string
  alt: string
  altB?: string
}

function StepImage({ shot, alt, className }: { shot: Shot; alt: string; className?: string }) {
  return (
    <picture className={className}>
      <source media="(max-width: 700px)" srcSet={shot.mobile} sizes="calc(100vw - 32px)" width={1080} height={1350} />
      <img
        src={shot.desktopSrc}
        srcSet={shot.desktop}
        sizes="(min-width: 1200px) 630px, (min-width: 900px) 55vw, calc(100vw - 48px)"
        width={1280}
        height={1280}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </picture>
  )
}

/**
 * The four steps. On a phone each step is its copy followed by its picture. From
 * 900px the copy scrolls in the left column while one sticky frame on the right
 * shows the active step's picture; that is pure CSS grid (every stage shares one
 * grid area), so the markup is the same at every width and nothing is moved.
 */
export default function Steps() {
  const { t } = useTranslation()
  const steps = t('studios.how.steps', { returnObjects: true }) as StepCopy[]
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useActiveStep(ref, useCallback((i: number) => setActive(i), []))

  return (
    <div className="st-steps" ref={ref}>
      {steps.map((step, i) => {
        const [first, second] = STEP_SHOTS[i]
        const on = i === active ? ' is-active' : ''
        return (
          <div className="st-step" key={step.title}>
            <div className={`st-copy${on}`} style={{ '--row': i + 1 } as React.CSSProperties}>
              <span className="st-num" aria-hidden="true" data-step-num>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <span className="st-ui">{step.ui}</span>
            </div>
            <div className={`st-stage${on}`}>
              {second ? (
                <div className="st-flip">
                  <StepImage shot={first} alt={step.alt} />
                  <StepImage shot={second} alt={step.altB ?? ''} className="st-flip-b" />
                </div>
              ) : (
                <StepImage shot={first} alt={step.alt} />
              )}
            </div>
          </div>
        )
      })}
      <div className="st-rail" aria-hidden="true">
        {steps.map((step, i) => (
          <i key={step.title} className={i === active ? 'is-active' : undefined} />
        ))}
      </div>
    </div>
  )
}
