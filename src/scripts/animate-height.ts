/**
 * Smoothly animates an element's height between two pixel values, with the same soft
 * ease-out as the entrances. Clips overflow while it runs. Returns null (no animation)
 * for reduced motion.
 */
export function animateHeight(el: HTMLElement, from: number, to: number): Animation | null {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || from === to) return null
  const css = getComputedStyle(document.documentElement)
  const overflow = el.style.overflow
  el.style.overflow = 'hidden'
  const animation = el.animate([{ height: `${from}px` }, { height: `${to}px` }], {
    duration: parseFloat(css.getPropertyValue('--dur-accordion')) || 480,
    easing: css.getPropertyValue('--ease-reveal').trim() || 'ease-out',
  })
  const restore = () => { el.style.overflow = overflow }
  animation.addEventListener('finish', restore)
  animation.addEventListener('cancel', restore)
  return animation
}
