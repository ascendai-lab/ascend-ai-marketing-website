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

  // The answer only fades (no slide, so nothing moves against the height). It starts from its current
  // opacity, so a quick reversal never blinks. Opening, it fades in once the space starts to open.
  const timing = motionTiming()
  ;[...details.children].filter((el) => el !== summary).forEach((el) => {
    const current = Number(getComputedStyle(el).opacity)
    el.getAnimations().forEach((a) => a.cancel())
    const start = wasMoving ? current : open ? 0 : 1
    el.animate([{ opacity: start }, { opacity: open ? 1 : 0 }], {
      duration: open ? timing.duration * 0.75 : timing.duration * 0.8,
      delay: open && !wasMoving ? timing.duration * 0.25 : 0,
      easing: 'ease-out',
      fill: 'both',
    })
  })

  const animation = animateHeight(details, from, to, { interrupted: wasMoving })
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
