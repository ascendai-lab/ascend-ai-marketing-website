/**
 * Accordions (.accordion > details) open and close with a smooth height animation.
 * Groups marked [data-one-open] keep one item open at a time. No animation for reduced motion.
 */
import { animateHeight, motionTiming } from './animate-height'

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function setOpen(details: HTMLDetailsElement, open: boolean) {
  const summary = details.querySelector('summary')
  const wantsOpen = details.dataset.state ? details.dataset.state === 'open' : details.open
  if (!summary || wantsOpen === open) return
  details.dataset.state = open ? 'open' : 'closed'
  if (reduce) { details.open = open; return }

  const from = details.getBoundingClientRect().height
  const wasMoving = details.getAnimations().length > 0
  details.getAnimations().forEach((a) => { if (!(a instanceof CSSTransition)) a.cancel() })
  details.classList.toggle('is-closing', !open)
  details.open = true
  const to = open ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height

  // The answer fades with the height, starting from wherever it is now, so a quick reversal never blinks.
  const timing = motionTiming()
  ;[...details.children].filter((el) => el !== summary).forEach((el) => {
    const style = getComputedStyle(el)
    const current = Number(style.opacity)
    const shift = style.translate === 'none' ? '0 0' : style.translate.includes(' ') ? style.translate : `${style.translate} 0`
    el.getAnimations().forEach((a) => a.cancel())
    const start = wasMoving ? current : open ? 0 : 1
    const from = wasMoving ? shift : open ? '0 -8px' : '0 0'
    el.animate(
      open
        ? [{ opacity: start, translate: from }, { opacity: 1, translate: '0 0' }]
        : [{ opacity: start, translate: from }, { opacity: 0, translate: '0 -8px' }],
      { ...timing, duration: open ? timing.duration : timing.duration * 0.6, fill: 'forwards' },
    )
  })

  const animation = animateHeight(details, from, to)
  const done = () => {
    details.open = open
    details.classList.remove('is-closing')
    delete details.dataset.state
    ;[...details.children].forEach((el) => { if (el !== summary) el.getAnimations().forEach((a) => a.cancel()) })
  }
  if (!animation) { done(); return }
  animation.onfinish = done
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
