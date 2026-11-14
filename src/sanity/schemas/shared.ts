import { defineField } from 'sanity'

/** Standard field groups for anything that becomes a page on the site. */
export const pageGroups = [
  { name: 'content', title: 'Content', default: true },
  { name: 'seo', title: 'SEO & sharing' },
  { name: 'settings', title: 'Page settings' },
]

export const titleField = (title = 'Title') =>
  defineField({
    name: 'title',
    title,
    type: 'string',
    group: 'content',
    validation: (Rule) => Rule.required(),
  })

export const slugField = (prefix = '') =>
  defineField({
    name: 'slug',
    title: 'URL',
    type: 'slug',
    group: 'settings',
    description: `Created from the title. Becomes ${prefix}/your-slug. Changing it after launch breaks old links, so add a Redirect if you do.`,
    options: { source: 'title', maxLength: 96 },
    validation: (Rule) => Rule.required(),
  })

export const seoField = defineField({
  name: 'seo',
  title: 'SEO & sharing',
  type: 'seoFields',
  group: 'seo',
})

export const orderField = defineField({
  name: 'order',
  title: 'Display order',
  type: 'number',
  description: 'Lower numbers show first.',
  group: 'settings',
})

export const orderByDisplayOrder = {
  title: 'Display order',
  name: 'displayOrder',
  by: [{ field: 'order', direction: 'asc' as const }],
}

/** Random key for arrays in initial values. */
export const randomKey = () => Math.random().toString(36).slice(2, 12)
