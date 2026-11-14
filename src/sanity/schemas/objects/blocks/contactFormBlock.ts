import { defineField, defineType } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons/Envelope'
import { blockPreview, headingField, introField, sectionGroups, sectionSettingsFields } from './shared'

export const contactFormBlock = defineType({
  name: 'contactFormBlock',
  title: 'Contact form',
  type: 'object',
  icon: EnvelopeIcon,
  groups: sectionGroups,
  fields: [
    headingField(),
    introField,
    defineField({
      name: 'successMessage',
      title: 'Message after sending',
      type: 'string',
      group: 'content',
      initialValue: "Thanks! We'll get back to you within one business day.",
    }),
    defineField({
      name: 'showContactDetails',
      title: 'Show phone, email, address and hours next to the form',
      type: 'boolean',
      group: 'content',
      initialValue: true,
    }),
    ...sectionSettingsFields,
  ],
  preview: blockPreview('Contact form'),
})
