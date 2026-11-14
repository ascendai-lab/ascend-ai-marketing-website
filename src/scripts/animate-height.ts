/**
 * Smoothly animates an element's height between two pixel values, using the
 * accordion motion tokens. Returns null (no animation) for reduced motion.
 */
export function animateHeight(el: HTMLElement, from: number, to: number): Animation | null {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  const css = getComputedStyle(document.documentElement)
  return el.animate([{ height: `${from}px` }, { height: `${to}px` }], {
    duration: parseFloat(css.getPropertyValue('--dur-accordion')) || 420,
    easing: css.getPropertyValue('--ease-out').trim() || 'ease-out',
  })
}
