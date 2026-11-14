import { defineField, defineType } from 'sanity'
import { PinIcon } from '@sanity/icons/Pin'
import { pageBuilderField } from '../objects/blocks'
import { orderByDisplayOrder, orderField, pageGroups, seoField, slugField } from '../shared'

/** Location landing pages, e.g. "Daycare in Vineland, NJ". Great for local SEO. */
export const serviceArea = defineType({
  name: 'serviceArea',
  title: 'Service area',
  type: 'document',
  icon: PinIcon,
  groups: pageGroups,
  orderings: [orderByDisplayOrder],
  fields: [
    defineField({
      name: 'city',
      title: 'City / town',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'state', title: 'State', type: 'string', group: 'content', initialValue: 'NJ' }),
    defineField({
      name: 'title',
      title: 'Page heading',
      type: 'string',
      group: 'content',
      description: 'e.g. "Trusted daycare in Vineland, NJ"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Short description',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({ name: 'image', title: 'Main image', type: 'imageWithAlt', group: 'content' }),
    defineField({ name: 'body', title: 'Page content', type: 'richText', group: 'content' }),
    pageBuilderField('content'),
    slugField('/areas'),
    orderField,
    seoField,
  ],
  preview: {
    select: { city: 'city', state: 'state', title: 'title', media: 'image' },
    prepare({ city, state, title, media }) {
      return { title: [city, state].filter(Boolean).join(', '), subtitle: title, media }
    },
  },
})
