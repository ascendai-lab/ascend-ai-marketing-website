/**
 * Accordions (.accordion > details) open and close with a smooth height animation.
 * Items open and close on their own, like the footer services: content only grows or shrinks below the
 * clicked question, so the page never scrolls. Groups marked [data-one-open] keep one item open at a time
 * and hold the clicked question in place while the others close. No animation for reduced motion.
 */
import { animateHeight, heightVelocity, motionTiming } from './animate-height'

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function setOpen(details: HTMLDetailsElement, open: boolean) {
  const summary = details.querySelector('summary')
  const wantsOpen = details.dataset.state ? details.dataset.state === 'open' : details.open
  if (!summary || wantsOpen === open) return
  details.dataset.state = open ? 'open' : 'closed'
  if (reduce) { details.open = open; return }

  const from = details.getBoundingClientRect().height
  const wasMoving = details.getAnimations().length > 0
  const velocity = heightVelocity(details)
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

  const animation = animateHeight(details, from, to, { interrupted: wasMoving, velocity })
  const done = () => {
    details.open = open
    details.classList.remove('is-closing')
    delete details.dataset.state
    ;[...details.children].forEach((el) => { if (el !== summary) el.getAnimations().forEach((a) => a.cancel()) })
  }
  if (!animation) { done(); return }
  animation.onfinish = done
}

/** One running hold per group: a new click replaces it, so an old hold never pulls a newer question away. */
const holds = new WeakMap<HTMLElement, number>()

function holdInPlace(el: HTMLElement, top: number, group: HTMLElement) {
  cancelAnimationFrame(holds.get(group) ?? 0)
  // Holds until every item in the group has stopped moving (a reversal can run longer than one duration).
  const start = performance.now()
  const limit = motionTiming().duration * 4
  const moving = () => [...group.querySelectorAll<HTMLElement>(':scope > details')].some((d) => d.getAnimations().length > 0)
  const step = () => {
    const shift = el.getBoundingClientRect().top - top
    if (Math.abs(shift) >= 1) window.scrollBy(0, Math.round(shift))
    const elapsed = performance.now() - start
    if (elapsed < 50 || (moving() && elapsed < limit)) holds.set(group, requestAnimationFrame(step))
  }
  holds.set(group, requestAnimationFrame(step))
}

document.querySelectorAll<HTMLElement>('.accordion').forEach((group) => {
  group.querySelectorAll<HTMLDetailsElement>(':scope > details').forEach((details) => {
    details.querySelector('summary')?.addEventListener('click', (event) => {
      event.preventDefault()
      const open = !(details.dataset.state ? details.dataset.state === 'open' : details.open)
      const summary = details.querySelector('summary')!
      const top = summary.getBoundingClientRect().top
      // Independent items: the question stays where it is and the answer grows below it. Nothing to hold.
      if (!group.hasAttribute('data-one-open')) { setOpen(details, open); return }
      if (open) {
        group.querySelectorAll<HTMLDetailsElement>(':scope > details').forEach((other) => {
          if (other === details) return
          setOpen(other, false)
        })
      }
      setOpen(details, open)
      // Whatever else in the group opens or closes, the clicked question stays under the pointer.
      if (!reduce) holdInPlace(summary, top, group)
      else {
        // No motion: the item above closes at once, so put the clicked question straight back under the pointer.
        const shift = summary.getBoundingClientRect().top - top
        if (Math.abs(shift) >= 1) window.scrollBy(0, Math.round(shift))
      }
    })
  })
})
