import { defineField, defineType } from 'sanity'
import { SplitHorizontalIcon } from '@sanity/icons/SplitHorizontal'
import { buttonsField, headingField, sectionGroups, sectionSettingsFields } from './shared'

export const imageText = defineType({
  name: 'imageText',
  title: 'Image + text',
  type: 'object',
  icon: SplitHorizontalIcon,
  groups: sectionGroups,
  fields: [
    defineField({ name: 'eyebrow', title: 'Small text above heading', type: 'string', group: 'content' }),
    headingField(),
    defineField({ name: 'body', title: 'Content', type: 'richText', group: 'content' }),
    buttonsField,
    defineField({
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      group: 'content',
      initialValue: 'right',
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
      },
    }),
    ...sectionSettingsFields,
  ],
  preview: {
    select: { heading: 'heading', media: 'image' },
    prepare({ heading, media }) {
      return { title: heading || 'Image + text', subtitle: 'Image + text', media }
    },
  },
})
