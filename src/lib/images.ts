/**
 * Responsive sources for the stock photos served from Unsplash, which resizes by URL (`w=`).
 * Local photos (/images/…) are already sized for the page, so they get no srcset.
 */
const UNSPLASH = 'https://images.unsplash.com/'

export function photoSrcset(src: string, widths: number[] = [480, 800, 1200, 1600]): string | undefined {
  if (!src.startsWith(UNSPLASH)) return undefined
  return widths
    .map((w) => {
      const url = new URL(src)
      url.searchParams.set('w', String(w))
      return `${url.href} ${w}w`
    })
    .join(', ')
}

/** `sizes` for a photo in a two-column section: half the container on wide screens, full width below. */
export const HALF_SIZES = '(min-width: 1360px) 640px, (min-width: 960px) 50vw, 100vw'
