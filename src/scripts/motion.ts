/**
 * Entrance animations and small motion details. Only runs when <html> has .motion,
 * which BaseLayout sets in <head> unless the visitor asked for reduced motion.
 */
const root = document.documentElement
// Keep in step with the matching list under "Entrance" in global.css, which hides these before they arrive.
const SELECTOR = [
  '.section .section-head', '.section .split > *', '.section .grid-2 > *', '.section .grid-3 > *',
  '.section .grid-4 > *', '.section .plan', '.section .plan__own', '.section .accordion > details', '[data-reveal]',
].join(', ')

if (root.classList.contains('motion')) {
  // Stagger siblings so a row of cards arrives one after another.
  const targets = [...document.querySelectorAll<HTMLElement>(SELECTOR)]
  targets.forEach((el) => {
    const siblings = el.parentElement ? [...el.parentElement.children].filter((c) => targets.includes(c as HTMLElement)) : []
    const index = Math.min(siblings.indexOf(el), 5)
    if (index > 0) el.style.setProperty('--reveal-delay', `calc(var(--reveal-step) * ${index})`)
  })

  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      const el = entry.target as HTMLElement
      el.classList.add('is-in')
      reveal.unobserve(el)
      // Once it has arrived, hand transitions back to the element's own hover effects.
      const done = () => el.classList.add('is-done')
      el.addEventListener('transitionend', (e) => { if (e.target === el && e.propertyName === 'opacity') done() })
      window.setTimeout(done, 1600)
    })
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
  targets.forEach((el) => reveal.observe(el))

  // Hero slides and trust items get their index for the load sequence.
  document.querySelectorAll<HTMLElement>('.hero .slide, .hero__trust li').forEach((el) => {
    el.style.setProperty('--i', String([...(el.parentElement?.children ?? [])].indexOf(el)))
  })

  // Big numbers count up the first time they are seen: "$750,000+" runs from $0 to $750,000.
  const counters = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      counters.unobserve(entry.target)
      const el = entry.target as HTMLElement
      const match = el.textContent?.match(/^(\D*)([\d,]+)(.*)$/)
      if (!match) return
      const [, prefix, digits, suffix] = match
      // Screen readers get the final number once, not every step of the count.
      const final = document.createElement('span')
      final.className = 'sr-only'
      final.textContent = el.textContent ?? ''
      el.setAttribute('aria-hidden', 'true')
      el.after(final)
      const target = Number(digits.replace(/,/g, ''))
      const start = performance.now()
      const duration = 1400
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        el.textContent = `${prefix}${Math.round(target * eased).toLocaleString('en-US')}${suffix}`
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
  }, { threshold: 0.6 })
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => counters.observe(el))
}

// The sticky header gets a soft shadow once the page scrolls.
const header = document.querySelector<HTMLElement>('.site-header')
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}
