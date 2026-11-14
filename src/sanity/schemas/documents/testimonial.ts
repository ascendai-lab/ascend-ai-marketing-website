import { defineField, defineType } from 'sanity'
import { CommentIcon } from '@sanity/icons/Comment'
import { orderByDisplayOrder } from '../shared'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  orderings: [orderByDisplayOrder],
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'context',
      title: 'Who they are',
      type: 'string',
      description: 'e.g. "Parent of two, Millville"',
    }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 5, validation: (Rule) => Rule.required() }),
    defineField({
      name: 'rating',
      title: 'Star rating',
      type: 'number',
      options: { list: [5, 4, 3, 2, 1], layout: 'radio', direction: 'horizontal' },
    }),
    defineField({
      name: 'source',
      title: 'Where the review is from',
      type: 'string',
      options: { list: ['Google', 'Facebook', 'Yelp', 'Email', 'In person'] },
    }),
    defineField({ name: 'photo', title: 'Photo (optional)', type: 'imageWithAlt' }),
    defineField({ name: 'order', title: 'Display order', type: 'number' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'quote', media: 'photo' },
  },
})
