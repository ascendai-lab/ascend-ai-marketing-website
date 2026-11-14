/**
 * One place that maps document types to front-end URLs.
 * Used by the website (links, sitemap) and by the Studio (Presentation tool),
 * so a new route only has to be added here.
 */
export const routes = {
  homePage: () => '/',
  page: (slug: string) => `/${slug}`,
  service: (slug: string) => `/services/${slug}`,
  serviceArea: (slug: string) => `/areas/${slug}`,
  blogPost: (slug: string) => `/blog/${slug}`,
} as const

export type RoutableType = keyof typeof routes

/** Listing pages that are not documents themselves. */
export const indexRoutes = {
  services: '/services',
  serviceAreas: '/areas',
  blog: '/blog',
} as const

export function isRoutableType(type: string): type is RoutableType {
  return type in routes
}

export function hrefFor(type: string, slug?: string | null): string | null {
  if (!isRoutableType(type)) return null
  if (type === 'homePage') return routes.homePage()
  if (!slug) return null
  return routes[type](slug)
}

/** Document types that have their own URL — used for internal link references. */
export const linkableTypes: RoutableType[] = ['page', 'homePage', 'service', 'serviceArea', 'blogPost']
