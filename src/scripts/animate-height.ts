/**
 * Smoothly animates an element's height between two pixel values with an ease-in-out,
 * so it neither snaps open nor stops abruptly. Clips overflow while it runs. Returns null (no animation)
 * for reduced motion.
 */
const savedOverflow = new WeakMap<HTMLElement, string>()
const heightAnimations = new WeakSet<Animation>()
/** The distance each element's last height animation covered, so a reversal can be sized to match. */
const lastDistance = new WeakMap<HTMLElement, number>()

export function motionTiming(fallbackMs = 420) {
  const css = getComputedStyle(document.documentElement)
  return {
    duration: parseFloat(css.getPropertyValue('--dur-accordion')) || fallbackMs,
    easing: css.getPropertyValue('--ease-height').trim() || 'ease-in-out',
  }
}

/**
 * How fast `el`'s running height animation is moving right now, in px per ms (0 when it isn't).
 * Call it before cancelling that animation, and pass the result to animateHeight as `velocity`.
 */
export function heightVelocity(el: HTMLElement): number {
  const running = el.getAnimations().find((a) => heightAnimations.has(a) && a.playState === 'running')
  if (!running || running.currentTime === null) return 0
  const t = Number(running.currentTime)
  if (t < 16) return 0
  const now = el.getBoundingClientRect().height
  running.currentTime = t - 16
  const before = el.getBoundingClientRect().height
  running.currentTime = t
  return (now - before) / 16
}

/** How long a reversal coasts to a stop before it turns around. */
const COAST_MS = 110

/**
 * Pass `interrupted` when the caller already stopped a running animation on `el` before measuring,
 * and `velocity` (from heightVelocity) so a reversal slows to a stop instead of stopping dead.
 */
export function animateHeight(el: HTMLElement, from: number, to: number, options: { interrupted?: boolean; velocity?: number } = {}): Animation | null {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || from === to) return null
  // Remember the element's own overflow only once, so overlapping animations never save a stale "hidden".
  if (!savedOverflow.has(el)) savedOverflow.set(el, el.style.overflow)
  el.style.overflow = 'hidden'
  const timing = motionTiming()
  const distance = Math.abs(to - from)
  // Long distances (a tall menu) get a little more time, so they glide instead of rushing past.
  let duration = timing.duration * Math.min(1.7, Math.max(1, Math.sqrt(distance / 300)))
  // Taller than the screen: most of the movement is out of sight, so don't make the visitor wait for it.
  if (distance > window.innerHeight) duration = Math.min(duration, timing.duration * 1.25)
  let easing = timing.easing
  // Reversing mid-way: it eases into the new direction instead of flipping at top speed,
  // and takes only as long as the share of the way it goes back.
  const interrupted = options.interrupted || el.getAnimations().some((a) => heightAnimations.has(a) && a.playState === 'running')
  if (interrupted) {
    const share = Math.min(1, distance / (lastDistance.get(el) || distance || 1))
    duration = Math.max(260, duration * Math.max(0.7, Math.sqrt(share)))
    // A gentle start, so the turn-around doesn't jump straight to full speed the other way.
    easing = 'cubic-bezier(0.3, 0, 0.2, 1)'
  }
  el.getAnimations().forEach((a) => { if (heightAnimations.has(a)) a.cancel() })
  if (!interrupted) lastDistance.set(el, distance)
  // Turning around: first coast to a stop the way it was going (a gentle deceleration that starts at
  // its current speed), then head to the target. Going the same way, it just carries on.
  const v = options.velocity ?? 0
  const reversing = interrupted && Math.abs(v) > 0.05 && Math.sign(v) !== Math.sign(to - from)
  const coastTo = Math.max(0, from + (v * COAST_MS) / 2)
  const keyframes: Keyframe[] = reversing
    ? [
        { height: `${from}px`, offset: 0, easing: 'cubic-bezier(0.333, 0.667, 0.667, 1)' },
        { height: `${coastTo}px`, offset: COAST_MS / (COAST_MS + duration), easing },
        { height: `${to}px`, offset: 1 },
      ]
    : [{ height: `${from}px` }, { height: `${to}px` }]
  const animation = el.animate(keyframes, reversing ? { duration: COAST_MS + duration, easing: 'linear' } : { duration, easing })
  heightAnimations.add(animation)
  // A reversal starts one frame in: the click's own frame already showed `from`, so starting at 0 would hold still for a frame.
  if (interrupted) animation.currentTime = 16
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
