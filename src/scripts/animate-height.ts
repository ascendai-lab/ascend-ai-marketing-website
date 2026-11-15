/**
 * Smoothly animates an element's height between two pixel values, with the same soft
 * ease-out as the entrances. Clips overflow while it runs. Returns null (no animation)
 * for reduced motion.
 */
const savedOverflow = new WeakMap<HTMLElement, string>()
const heightAnimations = new WeakSet<Animation>()

export function motionTiming(fallbackMs = 480) {
  const css = getComputedStyle(document.documentElement)
  return {
    duration: parseFloat(css.getPropertyValue('--dur-accordion')) || fallbackMs,
    easing: css.getPropertyValue('--ease-reveal').trim() || 'ease-out',
  }
}

export function animateHeight(el: HTMLElement, from: number, to: number): Animation | null {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || from === to) return null
  // Remember the element's own overflow only once, so overlapping animations never save a stale "hidden".
  if (!savedOverflow.has(el)) savedOverflow.set(el, el.style.overflow)
  el.style.overflow = 'hidden'
  const animation = el.animate([{ height: `${from}px` }, { height: `${to}px` }], motionTiming())
  heightAnimations.add(animation)
  const restore = () => {
    // Only the last running height animation hands overflow back.
    const running = el.getAnimations().some((a) => a !== animation && heightAnimations.has(a) && a.playState === 'running')
    if (running || !savedOverflow.has(el)) return
    el.style.overflow = savedOverflow.get(el) ?? ''
    savedOverflow.delete(el)
  }
  animation.addEventListener('finish', restore)
  animation.addEventListener('cancel', restore)
  return animation
}
