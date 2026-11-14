/**
 * Accordions (.accordion > details) open and close with a smooth height animation.
 * Groups marked [data-one-open] keep one item open at a time. No animation for reduced motion.
 */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const css = getComputedStyle(document.documentElement)
const duration = parseFloat(css.getPropertyValue('--dur-accordion')) || 420
const easing = css.getPropertyValue('--ease-out').trim() || 'ease-out'

function setOpen(details: HTMLDetailsElement, open: boolean) {
  const summary = details.querySelector('summary')
  const wantsOpen = details.dataset.state ? details.dataset.state === 'open' : details.open
  if (!summary || wantsOpen === open) return
  details.dataset.state = open ? 'open' : 'closed'
  if (reduce) { details.open = open; return }

  const from = details.getBoundingClientRect().height
  details.getAnimations().forEach((a) => { if (a instanceof Animation && !(a instanceof CSSTransition)) a.cancel() })
  details.classList.toggle('is-closing', !open)
  details.open = true
  const to = open ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height
  details.style.overflow = 'hidden'
  const animation = details.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration, easing })
  animation.onfinish = () => {
    details.open = open
    details.classList.remove('is-closing')
    details.style.overflow = ''
    delete details.dataset.state
  }
}

document.querySelectorAll<HTMLElement>('.accordion').forEach((group) => {
  group.querySelectorAll<HTMLDetailsElement>(':scope > details').forEach((details) => {
    details.querySelector('summary')?.addEventListener('click', (event) => {
      event.preventDefault()
      const open = !(details.dataset.state ? details.dataset.state === 'open' : details.open)
      if (open && group.hasAttribute('data-one-open')) {
        group.querySelectorAll<HTMLDetailsElement>(':scope > details').forEach((other) => { if (other !== details) setOpen(other, false) })
      }
      setOpen(details, open)
    })
  })
})
