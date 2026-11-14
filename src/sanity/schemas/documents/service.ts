import { defineField, defineType } from 'sanity'
import { PackageIcon } from '@sanity/icons/Package'
import { pageBuilderField } from '../objects/blocks'
import { orderByDisplayOrder, orderField, pageGroups, seoField, slugField, titleField } from '../shared'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: PackageIcon,
  groups: pageGroups,
  orderings: [orderByDisplayOrder],
  fields: [
    titleField('Service name'),
    defineField({
      name: 'excerpt',
      title: 'Short description',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Shown on service cards and listings.',
      validation: (Rule) => Rule.max(240),
    }),
    defineField({ name: 'image', title: 'Main image', type: 'imageWithAlt', group: 'content' }),
    defineField({ name: 'body', title: 'Page content', type: 'richText', group: 'content' }),
    pageBuilderField('content'),
    slugField('/services'),
    orderField,
    seoField,
  ],
  preview: {
    select: { title: 'title', subtitle: 'excerpt', media: 'image' },
  },
})
