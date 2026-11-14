import { defineQuery } from 'groq'

/* ── Fragments ────────────────────────────────────────────────────────────── */

const linkFields = /* groq */ `
  linkType,
  external,
  email,
  phone,
  anchor,
  openInNewTab,
  "internal": internal->{ _type, "slug": slug.current }
`

const imageFields = /* groq */ `
  asset,
  hotspot,
  crop,
  alt,
  decorative,
  caption,
  "dimensions": asset->metadata.dimensions { width, height },
  "lqip": asset->metadata.lqip
`

const buttonFields = /* groq */ `
  _key,
  label,
  variant,
  link { ${linkFields} }
`

const richTextFields = /* groq */ `
  ...,
  markDefs[] {
    ...,
    _type == "link" => { ${linkFields} }
  },
  _type == "imageWithAlt" => { _key, _type, ${imageFields} },
  _type == "ctaButton" => { _type, ${buttonFields} }
`

const seoFields = /* groq */ `
  seo {
    metaTitle,
    metaDescription,
    canonicalUrl,
    noIndex,
    ogImage { ${imageFields} }
  }
`

const serviceCardFields = /* groq */ `
  _id,
  title,
  excerpt,
  "slug": slug.current,
  image { ${imageFields} }
`

const testimonialFields = /* groq */ `
  _id,
  name,
  context,
  quote,
  rating,
  source,
  photo { ${imageFields} }
`

const faqFields = /* groq */ `
  _id,
  question,
  answer[] { ${richTextFields} }
`

const teamFields = /* groq */ `
  _id,
  name,
  role,
  bio,
  photo { ${imageFields} }
`

const areaCardFields = /* groq */ `
  _id,
  city,
  state,
  title,
  excerpt,
  "slug": slug.current
`

const postCardFields = /* groq */ `
  _id,
  title,
  excerpt,
  publishedAt,
  "slug": slug.current,
  image { ${imageFields} }
`

/** Every page-builder section, with lists resolved ("all" or the picked items). */
const pageBuilderFields = /* groq */ `
  pageBuilder[] {
    _key,
    _type,
    "anchorId": anchorId.current,
    background,
    heading,
    _type == "hero" => {
      eyebrow, subheading, layout,
      buttons[] { ${buttonFields} },
      image { ${imageFields} }
    },
    _type == "textBlock" => { width, body[] { ${richTextFields} } },
    _type == "imageText" => {
      eyebrow, imagePosition,
      body[] { ${richTextFields} },
      buttons[] { ${buttonFields} },
      image { ${imageFields} }
    },
    _type == "featureGrid" => {
      intro, columns,
      items[] { _key, title, description, image { ${imageFields} }, link { ${linkFields} } }
    },
    _type == "statsBlock" => { items[] { _key, value, label } },
    _type == "servicesBlock" => {
      intro,
      "items": select(
        mode == "selected" => services[]->{ ${serviceCardFields} },
        *[_type == "service" && defined(slug.current)] | order(order asc, title asc) { ${serviceCardFields} }
      )
    },
    _type == "serviceAreasBlock" => {
      intro,
      "items": select(
        mode == "selected" => areas[]->{ ${areaCardFields} },
        *[_type == "serviceArea" && defined(slug.current)] | order(order asc, city asc) { ${areaCardFields} }
      )
    },
    _type == "testimonialsBlock" => {
      intro,
      "items": select(
        mode == "selected" => testimonials[]->{ ${testimonialFields} },
        *[_type == "testimonial"] | order(order asc, _createdAt desc) { ${testimonialFields} }
      )
    },
    _type == "faqBlock" => {
      intro,
      "items": select(
        mode == "selected" => faqs[]->{ ${faqFields} },
        *[_type == "faq"] | order(order asc, _createdAt asc) { ${faqFields} }
      )
    },
    _type == "teamBlock" => {
      intro,
      "items": select(
        mode == "selected" => members[]->{ ${teamFields} },
        *[_type == "teamMember"] | order(order asc, name asc) { ${teamFields} }
      )
    },
    _type == "latestPostsBlock" => {
      intro,
      "items": *[_type == "blogPost" && defined(slug.current) && publishedAt <= now()]
        | order(publishedAt desc) [0...12] { ${postCardFields} },
      count
    },
    _type == "ctaBlock" => { body, buttons[] { ${buttonFields} } },
    _type == "contactFormBlock" => { intro, successMessage, showContactDetails },
    _type == "videoBlock" => { intro, video { url, caption, autoplay } }
  }
`

/* ── Layout ───────────────────────────────────────────────────────────────── */

export const layoutQuery = defineQuery(`{
  "settings": {
    "siteName": *[_id == "businessInfo"][0].siteName,
    "tagline": *[_id == "brandSettings"][0].tagline,
    "logo": *[_id == "brandSettings"][0].logo { ${imageFields} },
    "logoInverse": *[_id == "brandSettings"][0].logoInverse { ${imageFields} },
    "faviconUrl": *[_id == "brandSettings"][0].favicon.asset->url,
    "phone": *[_id == "businessInfo"][0].phone,
    "email": *[_id == "businessInfo"][0].email,
    "address": *[_id == "businessInfo"][0].address { street, city, state, zip },
    "mapUrl": *[_id == "businessInfo"][0].mapUrl,
    "hours": *[_id == "businessInfo"][0].hours[] { _key, days, open24Hours, opens, closes },
    "businessType": *[_id == "seoSettings"][0].businessType,
    "priceRange": *[_id == "seoSettings"][0].priceRange,
    "socialLinks": *[_id == "brandSettings"][0].socialLinks[] { _key, platform, url },
    "titleTemplate": *[_id == "seoSettings"][0].titleTemplate,
    "defaultSeo": *[_id == "seoSettings"][0].defaultSeo {
      metaTitle,
      metaDescription,
      ogImage { ${imageFields} }
    },
    "gaId": *[_id == "seoSettings"][0].gaId,
    "gtmId": *[_id == "seoSettings"][0].gtmId,
    "metaPixelId": *[_id == "seoSettings"][0].metaPixelId,
    "googleSiteVerification": *[_id == "seoSettings"][0].googleSiteVerification,
    "announcement": *[_id == "announcementBar"][0] { enabled, text, link { ${linkFields} } },
    "footerText": *[_id == "brandSettings"][0].footerText,
    "copyrightName": *[_id == "brandSettings"][0].copyrightName
  },
  "navigation": *[_type == "navigation" && _id == "navigation"][0] {
    headerLinks[] {
      _key,
      label,
      link { ${linkFields} },
      children[] { _key, label, link { ${linkFields} } }
    },
    headerCta { ${buttonFields} },
    footerColumns[] {
      _key,
      heading,
      links[] { _key, label, link { ${linkFields} } }
    }
  },
  "footerPages": *[_type == "page" && showInFooter == true && defined(slug.current)] | order(title asc) {
    _id, title, "slug": slug.current
  }
}`)

/* ── Pages ────────────────────────────────────────────────────────────────── */

export const homePageQuery = defineQuery(`
  *[_type == "homePage" && _id == "homePage"][0] {
    _id,
    _type,
    ${pageBuilderFields},
    ${seoFields}
  }
`)

export const pageQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    ${pageBuilderFields},
    ${seoFields}
  }
`)

export const servicesIndexQuery = defineQuery(`
  *[_type == "service" && defined(slug.current)] | order(order asc, title asc) { ${serviceCardFields} }
`)

export const serviceQuery = defineQuery(`
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    excerpt,
    "slug": slug.current,
    image { ${imageFields} },
    body[] { ${richTextFields} },
    ${pageBuilderFields},
    ${seoFields}
  }
`)

export const areasIndexQuery = defineQuery(`
  *[_type == "serviceArea" && defined(slug.current)] | order(order asc, city asc) { ${areaCardFields} }
`)

export const serviceAreaQuery = defineQuery(`
  *[_type == "serviceArea" && slug.current == $slug][0] {
    _id,
    _type,
    city,
    state,
    title,
    excerpt,
    "slug": slug.current,
    image { ${imageFields} },
    body[] { ${richTextFields} },
    ${pageBuilderFields},
    ${seoFields}
  }
`)

export const blogIndexQuery = defineQuery(`
  *[_type == "blogPost" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc) {
    ${postCardFields}
  }
`)

export const blogPostQuery = defineQuery(`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    excerpt,
    publishedAt,
    _updatedAt,
    categories,
    "slug": slug.current,
    image { ${imageFields} },
    body[] { ${richTextFields} },
    author->{ name, role, photo { ${imageFields} } },
    ${seoFields}
  }
`)

/* ── Utility ──────────────────────────────────────────────────────────────── */

export const redirectQuery = defineQuery(`
  *[_type == "redirect" && source in $paths][0] {
    permanent,
    destination { ${linkFields} }
  }
`)

export const sitemapQuery = defineQuery(`
  *[_type in ["homePage", "page", "service", "serviceArea", "blogPost"] && seo.noIndex != true
    && (_type == "homePage" || defined(slug.current))] {
    _type,
    _updatedAt,
    "slug": slug.current
  }
`)
