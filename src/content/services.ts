/**
 * Service pages. The copy comes from docs/copy (approved, used as written) through
 * scripts/service-copy.mjs, which writes services.json. Run `npm run services:copy` after
 * the copy changes. This file adds the types, the photos and how each section is shown.
 */
import data from './services.json'
import type { IconName } from '@components/ui/Icon.astro'

export type Inline = { lead?: string; text: string }
export type Link = { text: string; href: string }
/** A past client card on the work page. */
export type CaseCard = { name: string; kind: string; headline: string; did: string[]; result: string; quote?: { text: string; who: string } }
export type Block =
  | ({ type: 'p' } & Inline)
  | { type: 'ul' | 'ol'; items: Inline[] }
  | { type: 'quote'; text: string; who: string }
  | { type: 'result' | 'price' | 'bold' | 'label'; text: string }
  | { type: 'faq'; items: { q: string; a: string }[] }
  | { type: 'links'; items: { title: string; href?: string; text: string }[] }
  | ({ type: 'cta' } & Link)
  | { type: 'pricing'; text: string; link: Link }
  | { type: 'field'; name: string; text: string }
  | ({ type: 'case' } & CaseCard)
  | { type: 'calendar' }

export interface ServiceSectionCopy {
  label: string
  heading: string
  blocks: Block[]
  /** Labelled lines in the section ("Tip line", "Founder quote"), by name. */
  fields?: Record<string, string>
}

export interface ServiceCopy {
  title: string
  slug: string
  category: string
  seo: { title: string; description: string }
  short: string
  hero: { headline: string; subhead: string; primary: string; secondary: string }
  sections: ServiceSectionCopy[]
  closing: { heading: string; body: string; primary: string; secondary: string; teardown?: { lead: string; text: string } }
  /** The interest tag the quiz sends from this page ("google-ads" → interest-google-ads). */
  quizTag?: string
}

export const servicePages = data as ServiceCopy[]

/** How a section is drawn. Fixed sections come from their place or label; the rest share one layout. */
export type Role = 'problem' | 'about' | 'steps' | 'life' | 'stakes' | 'nationwide' | 'faq' | 'detail'

export function roleOf(sections: ServiceSectionCopy[], index: number): Role {
  const s = sections[index]
  const is = (re: RegExp) => re.test(s.label)
  if (index === 0) return 'problem'
  if (index === 1) return 'about'
  if (s.blocks.some((b) => b.type === 'faq')) return 'faq'
  if (is(/cost of waiting|why it matters/i)) return 'stakes'
  if (is(/nationwide/i)) return 'nationwide'
  if (s.blocks[0]?.type === 'ol') return 'steps'
  if (sections[index + 1] && /cost of waiting|why it matters/i.test(sections[index + 1].label)) return 'life'
  return 'detail'
}

/** Category look: the eyebrow, the hero photo and the small notes floating over it. Photos are stand-ins. */
const photo = (id: string, w = 1400) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`

type Note = { icon: IconName; title: string; text: string }
export interface CategoryLook {
  name: string
  /** The category's hub page. */
  href: string
  icon: IconName
  photo: { src: string; alt: string }
  notes: Note[]
}

export const categories: Record<string, CategoryLook> = {
  'HVAC Website Design': {
    name: 'HVAC Website Design',
    href: '/hvac-website-design',
    icon: 'layout',
    photo: { src: photo('1758598497049-da3b63569529'), alt: 'A contractor smiles while he takes a call' },
    notes: [
      { icon: 'phone', title: 'Tap to call', text: 'From any phone' },
      { icon: 'cal', title: 'Visit booked online', text: 'Thursday, 9:00 AM' },
    ],
  },
  'HVAC Local SEO': {
    name: 'HVAC Local SEO',
    href: '/hvac-local-seo',
    icon: 'map',
    photo: { src: photo('1792799888905-8696bd32a11a'), alt: 'An HVAC technician services an outdoor unit' },
    notes: [
      { icon: 'pin', title: 'Found on the map', text: '"AC repair near me"' },
      { icon: 'star', title: 'New 5-star review', text: 'From your last job' },
    ],
  },
  'HVAC Lead Management': {
    name: 'HVAC Lead Management',
    href: '/hvac-lead-management',
    icon: 'inbox',
    photo: { src: photo('1791395534168-af200f472f93'), alt: 'An HVAC technician and a homeowner look over a job on a phone' },
    notes: [
      { icon: 'msg', title: 'Missed call text back', text: 'Sent in seconds' },
      { icon: 'cal', title: 'New job booked', text: 'On your calendar by lunch' },
    ],
  },
  'HVAC Ads': {
    name: 'HVAC Ads',
    href: '/hvac-ads',
    icon: 'megaphone',
    photo: { src: photo('1792799888905-8696bd32a11a'), alt: 'An HVAC technician services an outdoor unit' },
    notes: [
      { icon: 'phone', title: 'Call from your ad', text: 'Answered or texted back' },
      { icon: 'search', title: 'Searched "furnace repair"', text: 'Your ad showed first' },
    ],
  },
  'AI Agents and Automation': {
    name: 'AI Agents and Automation',
    href: '/hvac-ai-automation',
    icon: 'bot',
    photo: { src: photo('1791395534168-af200f472f93'), alt: 'An HVAC technician and a homeowner look over a job on a phone' },
    notes: [
      { icon: 'zap', title: 'Runs on its own', text: 'Every step, on time' },
      { icon: 'users', title: 'A person can step in', text: 'Any time' },
    ],
  },
}

export const lookFor = (category: string): CategoryLook => categories[category] ?? categories['HVAC Lead Management']

export const serviceHref = (slug: string) => `/services/${slug}`
export const findService = (slug: string) => servicePages.find((page) => page.slug === slug)

/** Steps read "Take the 60-second quiz. See what…": the first sentence is the title. */
export function splitStep(text: string) {
  const i = text.indexOf('. ')
  return i === -1 ? { title: text, text: '' } : { title: text.slice(0, i + 1), text: text.slice(i + 2) }
}

/** The services, grouped by category in the order the categories are listed above. */
export const servicesByCategory = Object.values(categories)
  .map((look) => ({ look, pages: servicePages.filter((page) => page.category === look.name) }))
  .filter((group) => group.pages.length > 0)

/** "HVAC Local SEO" → "hvac-local-seo": the id of a category on the services page. */
export const categoryId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
