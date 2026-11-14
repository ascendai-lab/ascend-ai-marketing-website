import { stegaClean } from '@sanity/client/stega'

export function formatDate(value: string | null | undefined) {
  if (!value) return ''
  return new Date(stegaClean(value)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

/** "%s | Brand" + "About" → "About | Brand" */
export function applyTitleTemplate(template: string | null | undefined, title: string) {
  const clean = stegaClean(template)
  return clean && clean.includes('%s') ? clean.replace('%s', title) : title
}
