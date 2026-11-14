import { defineDocuments, defineLocations, type PresentationPluginOptions } from 'sanity/presentation'
import { routes } from './routes'

type Doc = { title?: string; slug?: string }

const location = (title: string | undefined, href: string) => ({ title: title ?? 'Untitled', href })

/**
 * Tells the Presentation tool which document a URL shows (mainDocuments)
 * and where a document appears on the site (locations).
 */
export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    { route: '/', filter: `_type == "homePage" && _id == "homePage"` },
    { route: '/services/:slug', filter: `_type == "service" && slug.current == $slug` },
    { route: '/areas/:slug', filter: `_type == "serviceArea" && slug.current == $slug` },
    { route: '/blog/:slug', filter: `_type == "blogPost" && slug.current == $slug` },
    { route: '/:slug', filter: `_type == "page" && slug.current == $slug` },
  ]),
  locations: {
    homePage: defineLocations({
      message: 'This is the home page',
      locations: [location('Home', routes.homePage())],
    }),
    page: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc: Doc | null) => ({ locations: doc?.slug ? [location(doc.title, routes.page(doc.slug))] : [] }),
    }),
    service: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc: Doc | null) => ({
        locations: [
          ...(doc?.slug ? [location(doc.title, routes.service(doc.slug))] : []),
          location('All services', '/services'),
        ],
      }),
    }),
    serviceArea: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc: Doc | null) => ({
        locations: [
          ...(doc?.slug ? [location(doc.title, routes.serviceArea(doc.slug))] : []),
          location('All areas', '/areas'),
        ],
      }),
    }),
    blogPost: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc: Doc | null) => ({
        locations: [
          ...(doc?.slug ? [location(doc.title, routes.blogPost(doc.slug))] : []),
          location('Blog', '/blog'),
        ],
      }),
    }),
  },
}
