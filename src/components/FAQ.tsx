import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function FAQ() {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const items = t('faq.items', { returnObjects: true }) as Array<{
    question: string
    answer: string
  }>

  return (
    <section id="faq" className="py-32 bg-surface-container-low">
      <div className="max-w-3xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black font-headline mb-4">{t('faq.title')}</h2>
          <p className="text-on-surface-variant">{t('faq.description')}</p>
        </div>
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-lg overflow-hidden transition-all duration-300">
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-container-high transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-bold text-lg">{item.question}</span>
                <span
                  className="material-symbols-outlined text-primary transition-transform duration-300"
                  style={{ transform: openIndex === i ? 'rotate(180deg)' : undefined }}
                >
                  expand_more
                </span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 text-on-surface-variant leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
