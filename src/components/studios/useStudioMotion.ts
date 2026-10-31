import { useEffect, type RefObject } from 'react'

/**
 * Scroll motion for the studios pages, attached to the page root.
 *
 * Only what starts below the fold is hidden, so the first frame is complete and a
 * prerendered page never flashes from visible to hidden. Elements opt in with
 * `data-reveal`; headings with `data-split` (their words are already wrapped by
 * <Words>). Under prefers-reduced-motion nothing is hidden and nothing moves.
 */
export function useStudioMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.setAttribute('data-motion', '')
    const below = (n: Element) => n.getBoundingClientRect().top > innerHeight * 0.92

    const observers: IntersectionObserver[] = []
    const once = (nodes: Element[], margin: string, done: (n: Element) => void) => {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (!e.isIntersecting) return
          done(e.target)
          io.unobserve(e.target)
        }),
        { rootMargin: margin },
      )
      nodes.forEach((n) => io.observe(n))
      observers.push(io)
    }

    const heads = [...el.querySelectorAll('[data-split]')].filter(below)
    heads.forEach((h) => h.classList.add('st-split', 'is-pre'))
    once(heads, '0px 0px -12% 0px', (h) => h.classList.replace('is-pre', 'is-in'))

    const items = [...el.querySelectorAll<HTMLElement>('[data-reveal]')].filter(below)
    items.forEach((n) => {
      const sibs = [...(n.parentElement?.children ?? [])].filter((c) => items.includes(c as HTMLElement))
      n.style.setProperty('--i', String(Math.min(sibs.indexOf(n), 5)))
      n.classList.add('st-rv')
    })
    once(items, '0px 0px -8% 0px', (n) => n.classList.add('is-in'))

    // Cursor spotlight, delegated so cards need no handlers of their own.
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element).closest<HTMLElement>('.st-spot')
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    el.addEventListener('pointermove', onMove)

    return () => {
      observers.forEach((io) => io.disconnect())
      el.removeEventListener('pointermove', onMove)
      el.removeAttribute('data-motion')
    }
  }, [root])
}

/**
 * The pinned story: index of the step whose number has scrolled up past the middle
 * of the screen. A step takes over only then, so the picture never runs ahead of the
 * copy it belongs to.
 */
export function useActiveStep(container: RefObject<HTMLElement | null>, onChange: (i: number) => void) {
  useEffect(() => {
    const el = container.current
    if (!el) return
    const nums = [...el.querySelectorAll('[data-step-num]')]
    let cur = -1
    let raf = 0
    const pick = () => {
      raf = 0
      let i = 0
      nums.forEach((n, j) => { if (n.getBoundingClientRect().top < innerHeight * 0.5) i = j })
      if (i !== cur) { cur = i; onChange(i) }
    }
    const req = () => { if (!raf) raf = requestAnimationFrame(pick) }
    addEventListener('scroll', req, { passive: true })
    addEventListener('resize', req)
    pick()
    return () => {
      removeEventListener('scroll', req)
      removeEventListener('resize', req)
      cancelAnimationFrame(raf)
    }
  }, [container, onChange])
}

/** On arrival with a hash (/studios#beta from another page), scroll to it once rendered. */
export function useHashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])
}
