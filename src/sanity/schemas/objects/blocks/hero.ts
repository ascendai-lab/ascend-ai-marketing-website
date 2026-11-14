import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons/Star'
import { buttonsField, headingField, sectionGroups, sectionSettingsFields } from './shared'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: StarIcon,
  groups: sectionGroups,
  fields: [
    defineField({ name: 'eyebrow', title: 'Small text above heading', type: 'string', group: 'content' }),
    headingField(true),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 3, group: 'content' }),
    buttonsField,
    defineField({ name: 'image', title: 'Image', type: 'imageWithAlt', group: 'content' }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      group: 'content',
      initialValue: 'split',
      options: {
        layout: 'radio',
        list: [
          { title: 'Text left, image right', value: 'split' },
          { title: 'Centered text', value: 'centered' },
          { title: 'Full background image', value: 'background' },
        ],
      },
    }),
    ...sectionSettingsFields,
  ],
  preview: {
    select: { heading: 'heading', media: 'image' },
    prepare({ heading, media }) {
      return { title: heading || 'Hero', subtitle: 'Hero', media }
    },
  },
})
