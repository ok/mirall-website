import { useTranslation } from 'react-i18next'

const avatars = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBHDlwgoaJOfS05NdsrsepEMSFMTJTDuGpZSy3Qr6d-PoRQp673rBidDAXPioRNnzLHD5nHdZmjJkAQosz8t9ZtVP3JPx8PFtWq1ArFEFqCvUz10NQ8vezEbA5-0ps5sBPjCXJe8pgWZdrbUDVEgnQxjVswFlEEx_T6mGGukoI_ICfrrJxFBxLJ5-Syisn0SPKfuoMbMhWjtKKwGReza-Re2YlknMVEi41xg4_m2HbZS5U_MCP7GEfTmRTHMFGc-fXKi_jqcX5OhD46',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBJDa6iDU0JmqE0Nwu6Xomtyg_1djytkF5aO9xeuVJSfDV7t-ZR8PjEeRHuil784Dle4BgOjtaFAPznYjTFFHuIqt8eGoWf_Jc_OWhoeaSdrDOFnOgQo-ITRkQP9JryYoyiAqap6hX7XbczbGZZzT3Jndx-dx8Dlox5IawvVgZHPVL2LI3oQYKZ0Ieg9abm1oCsKOHsgIgM0P7IDzk9XLvWAaksXaH03ADJdx9d9lvf1CNki1Ach9gwBzbLqbqIj66_11mE5sSe4_an',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD-6h8BchQIEOMqNqpTpQEAgMqoDOid-XWGHhx10dkAF__CKicaeag9DYtw88W5WvjznyHAniIfd4fEyYKUlO-m9xnyXg77jvEdr_qJLcxNhsLEd3meRc5hZZcTlf5hU34_SPJV2bVXqeeoF7XOnC10yZif1dLaF1vP5csIaPSXQRBcJcFrVcICQAyj2V79o6QhiNVeuud8nkHSQW0zswY_O9IgV0Imzd1ZfqmjxYAsqTFCMqBuXOjyAX0I1Kx89k1n80QD7agC-NNs',
]

const borderColors = ['border-primary', 'border-secondary', 'border-tertiary']
const starColors = ['text-primary', 'text-secondary', 'text-tertiary']

export default function Testimonials() {
  const { t } = useTranslation()
  const items = t('testimonials.items', { returnObjects: true }) as Array<{
    quote: string
    name: string
    role: string
  }>

  return (
    <section className="py-32 bg-background overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="flex justify-between items-end mb-16">
          <div className="max-w-xl">
            <h2 className="text-4xl font-black font-headline mb-4">{t('testimonials.title')}</h2>
            <p className="text-on-surface-variant">{t('testimonials.description')}</p>
          </div>
          <div className="hidden md:flex gap-4">
            <button className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div key={i} className={`bg-white p-10 rounded-xl ambient-shadow border-l-4 ${borderColors[i]}`}>
              <div className={`flex gap-1 mb-6 ${starColors[i]}`}>
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                ))}
              </div>
              <p className="text-lg italic mb-8 text-on-surface">"{item.quote}"</p>
              <div className="flex items-center gap-4">
                <img className="w-12 h-12 rounded-full object-cover" alt={item.name} src={avatars[i]} />
                <div>
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-sm text-on-surface-variant">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
