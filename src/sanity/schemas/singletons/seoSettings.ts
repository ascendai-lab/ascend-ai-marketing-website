import { defineField, defineType } from 'sanity'
import { ControlsIcon } from '@sanity/icons/Controls'

/** Technical settings for search engines and analytics. Only administrators see it in the menu. */
export const seoSettings = defineType({
  name: 'seoSettings',
  title: 'SEO & tracking',
  type: 'document',
  icon: ControlsIcon,
  fieldsets: [
    { name: 'seo', title: 'Search results (SEO)', options: { collapsible: true, collapsed: false } },
    { name: 'tracking', title: 'Analytics & tracking', options: { collapsible: true, collapsed: true } },
    { name: 'google', title: 'Google business data', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      fieldset: 'seo',
      name: 'titleTemplate',
      title: 'Page title format',
      type: 'string',
      description: 'Use %s for the page title, e.g. "%s | Uriah Child Care".',
      initialValue: '%s',
    }),
    defineField({
      fieldset: 'seo',
      name: 'defaultSeo',
      title: 'Fallback SEO',
      type: 'seoFields',
      description: 'Used when a page has no SEO fields of its own.',
    }),
    defineField({
      fieldset: 'tracking',
      name: 'gaId',
      title: 'Google Analytics 4 ID',
      type: 'string',
      description: 'e.g. G-XXXXXXXXXX',
    }),
    defineField({
      fieldset: 'tracking',
      name: 'gtmId',
      title: 'Google Tag Manager ID',
      type: 'string',
      description: 'e.g. GTM-XXXXXXX. If you use GTM, put GA4 inside it instead of above.',
    }),
    defineField({ fieldset: 'tracking', name: 'metaPixelId', title: 'Meta (Facebook) Pixel ID', type: 'string' }),
    defineField({
      fieldset: 'tracking',
      name: 'googleSiteVerification',
      title: 'Google Search Console verification code',
      type: 'string',
      description: 'Just the content="..." value from the HTML tag method.',
    }),
    defineField({
      fieldset: 'google',
      name: 'businessType',
      title: 'Business type (for Google)',
      type: 'string',
      description: 'schema.org type used in search results, e.g. ChildCare, Dentist, LocalBusiness.',
      initialValue: 'LocalBusiness',
    }),
    defineField({
      fieldset: 'google',
      name: 'priceRange',
      title: 'Price range (for Google)',
      type: 'string',
      description: 'e.g. $$',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'SEO & tracking' }
    },
  },
})
