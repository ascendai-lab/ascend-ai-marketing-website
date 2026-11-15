/**
 * Entrance animations and small motion details. Only runs when <html> has .motion,
 * which BaseLayout sets in <head> unless the visitor asked for reduced motion.
 */
const root = document.documentElement
// Keep in step with the matching list under "Entrance" in global.css, which hides these before they arrive.
const SELECTOR = [
  '.section .section-head', '.section .split > :not(.accordion, script)', '.section .grid-2 > *', '.section .grid-3 > *',
  '.section .grid-4 > *', '.section .plan', '.section .plan__own', '.section .accordion > details', '[data-reveal]',
].join(', ')

if (root.classList.contains('motion')) {
  const css = getComputedStyle(root)
  const ms = (name: string, fallback: number) => parseFloat(css.getPropertyValue(name)) || fallback
  const step = ms('--reveal-step', 110)
  const settle = ms('--dur-reveal', 1000) + 200

  // Items slide up as soon as their top edge comes into view. Items that arrive in the
  // same moment (a row of cards) follow each other in reading order; nothing waits on
  // an item that is still off screen.
  const reveal = new IntersectionObserver((entries) => {
    const arriving = entries
      .filter((entry) => entry.isIntersecting)
      .map((entry) => entry.target as HTMLElement)
      .sort((a, b) => {
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect()
        return Math.round(ra.top - rb.top) || ra.left - rb.left
      })
    arriving.forEach((el, i) => {
      reveal.unobserve(el)
      const delay = Math.min(i, 4) * step
      el.style.setProperty('--reveal-delay', `${delay}ms`)
      el.classList.add('is-in')
      // Once it has landed, hand transitions back to the element's own hover effects.
      window.setTimeout(() => el.classList.add('is-done'), delay + settle)
    })
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0 })
  document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => reveal.observe(el))

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
