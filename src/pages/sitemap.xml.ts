import type { APIRoute } from 'astro'
import { loadQuery } from '@cms/lib/load'
import { sitemapQuery } from '@cms/queries'
import { hrefFor, indexRoutes } from '@cms/routes'
import { serviceHref, servicePages } from '@/content/services'
import { sitePages } from '@/content/pages'

/** Built from the CMS on request, so new pages appear without a rebuild. */
export const GET: APIRoute = async ({ site, url }) => {
  const origin = site ?? new URL(url.origin)
  const docs = await loadQuery(false, sitemapQuery).catch(() => [])
  // Pages that are still drawn from the approved copy (no CMS document yet).
  const cmsPaths = new Set(docs.map((doc) => hrefFor(doc._type, doc.slug)))
  const copyPages = ['/', '/privacy', ...sitePages.map((page) => page.path), ...servicePages.map((page) => serviceHref(page.slug))].filter((path) => !cmsPaths.has(path))

  const entries = [
    ...docs.flatMap((doc) => {
      const path = hrefFor(doc._type, doc.slug)
      return path ? [{ loc: new URL(path, origin).href, lastmod: doc._updatedAt }] : []
    }),
    ...copyPages.map((path) => ({ loc: new URL(path, origin).href, lastmod: undefined })),
    // Area and blog listings only exist once the CMS has areas or posts.
    ...[
      indexRoutes.services,
      ...(docs.some((doc) => doc._type === 'serviceArea') ? [indexRoutes.serviceAreas] : []),
      ...(docs.some((doc) => doc._type === 'blogPost') ? [indexRoutes.blog] : []),
    ].map((path) => ({ loc: new URL(path, origin).href, lastmod: undefined })),
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map((e) => `  <url><loc>${e.loc}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</url>`)
  .join('\n')}
</urlset>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Netlify-CDN-Cache-Control': 'public, durable, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
