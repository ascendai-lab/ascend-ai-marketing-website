/**
 * Entrance animations and small motion details. Only runs when <html> has .motion,
 * which BaseLayout sets in <head> unless the visitor asked for reduced motion.
 */
const root = document.documentElement
// Keep in step with the matching list under "Entrance" in global.css, which hides these before they arrive.
const SELECTOR = [
  // Sparing on purpose: section headings slide in, plus a few blocks marked [data-reveal].
  // Body copy, cards, forms and photos are simply there.
  '.section .section-head', '[data-reveal]',
].join(', ')

if (root.classList.contains('motion')) {
  const css = getComputedStyle(root)
  const ms = (name: string, fallback: number) => parseFloat(css.getPropertyValue(name)) || fallback
  const step = ms('--reveal-step', 110)
  const settle = ms('--dur-reveal', 1000) + 200
  // Hidden items sit this far below their place, so the observer looks the same distance below
  // the screen: an item starts the moment its real top edge comes into view.
  const shift = (parseFloat(css.getPropertyValue('--reveal-shift')) || 2.5) * (parseFloat(css.fontSize) || 16)

  // Big numbers count up once: "$750,000+" runs from $0 to $750,000.
  const countUp = (el: HTMLElement) => {
    const match = el.textContent?.match(/^(\D*)([\d,]+)(.*)$/)
    if (!match || el.dataset.counted) return
    el.dataset.counted = 'true'
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
  }

  // Items slide up as soon as their top edge comes into view. Items that arrive together
  // follow each other in reading order. A big batch (after a jump down the page) shares the
  // same short window, so nothing on screen waits long or lands in a clump at the end.
  const maxStagger = step * 1.25
  const reveal = new IntersectionObserver((entries) => {
    const arriving = entries
      .filter((entry) => entry.isIntersecting)
      .map((entry) => ({ el: entry.target as HTMLElement, box: entry.boundingClientRect }))
      .sort((a, b) => Math.round(a.box.top - b.box.top) || a.box.left - b.box.left)
    const gap = arriving.length > 1 ? Math.min(step, maxStagger / (arriving.length - 1)) : 0
    // Items already well inside the screen (a fast flick, a jump) arrive at once instead of waiting their turn.
    const inside = window.innerHeight * 0.75
    arriving.forEach(({ el, box }, i) => {
      reveal.unobserve(el)
      const delay = box.top < inside ? 0 : Math.round(i * gap)
      el.style.setProperty('--reveal-delay', `${delay}ms`)
      el.classList.add('is-in')
      // Numbers inside start counting as their card arrives.
      el.querySelectorAll<HTMLElement>('[data-count]').forEach((n) => window.setTimeout(() => countUp(n), delay))
      // Once it has landed, hand transitions back to the element's own hover effects.
      window.setTimeout(() => el.classList.add('is-done'), delay + settle)
    })
  }, { rootMargin: `0px 0px ${shift + 80}px 0px`, threshold: 0 })
  // A piece inside something that already slides in arrives with it, not on its own.
  const targets = [...document.querySelectorAll<HTMLElement>(SELECTOR)].filter((el) => !el.parentElement?.closest(SELECTOR))
  targets.forEach((el) => reveal.observe(el))
  // Tabbing into something that hasn't slid in yet shows it at once, so focus never lands on an invisible link.
  document.addEventListener('focusin', (event) => {
    const el = targets.find((t) => !t.classList.contains('is-in') && t.contains(event.target as Node))
    if (!el) return
    reveal.unobserve(el)
    el.classList.add('is-in', 'is-done')
  })

  // Numbers that aren't inside a sliding item count up when they come into view.
  const counters = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      counters.unobserve(entry.target)
      countUp(entry.target as HTMLElement)
    })
  }, { threshold: 0.6 })
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    if (!targets.some((t) => t.contains(el))) counters.observe(el)
  })

  // Photos still downloading fade in once they arrive.
  document.querySelectorAll<HTMLImageElement>('.media img').forEach((img) => {
    if (img.complete) return
    img.classList.add('is-loading')
    const done = () => img.classList.remove('is-loading')
    img.addEventListener('load', done, { once: true })
    img.addEventListener('error', done, { once: true })
  })
}

// The sticky header gets a soft shadow once the page scrolls.
const header = document.querySelector<HTMLElement>('.site-header')
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}
