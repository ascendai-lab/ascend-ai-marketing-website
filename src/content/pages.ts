/**
 * The core pages (docs/copy/A-core.md) and the category pages (docs/copy/B-categories.md).
 * The copy is approved and used as written. scripts/site-copy.mjs writes pages.json from it:
 * run `npm run pages:copy` after the copy changes. This file adds the types and how each section is shown.
 */
import data from './pages.json'
import type { ServiceSectionCopy, CategoryLook } from './services'
import { categories } from './services'
import { about, success } from './home'

export interface PageCopy {
  path: string
  title: string
  kind: 'core' | 'category'
  seo: { title: string; description: string }
  hero: {
    headline: string
    subhead?: string
    primary?: string
    secondary?: string
    trust?: string
    note?: string
    formFields?: string
    formButton?: string
    textLink?: string
  }
  sections: ServiceSectionCopy[]
  closing: { heading: string; body: string; primary?: string; secondary?: string; small?: string; formButton?: string }
  quizTag?: string
}

export const sitePages = data as PageCopy[]
export const findPage = (path: string) => sitePages.find((page) => page.path === path)

export type PageRole = 'problem' | 'about' | 'steps' | 'life' | 'stakes' | 'nationwide' | 'faq' | 'founder' | 'cases' | 'calendar' | 'detail'

/** How a section on these pages is drawn, from its build label and content. */
export function pageRoleOf(sections: ServiceSectionCopy[], index: number): PageRole {
  const s = sections[index]
  const is = (re: RegExp) => re.test(s.label)
  if (index === 0) return 'problem'
  if (s.blocks.some((b) => b.type === 'faq')) return 'faq'
  if (is(/what's at stake|why it matters/i)) return 'stakes'
  if (is(/^nationwide|nationwide$/i)) return 'nationwide'
  if (is(/meet our founder/i)) return 'founder'
  if (s.blocks.some((b) => b.type === 'case')) return 'cases'
  if (s.blocks.some((b) => b.type === 'calendar')) return 'calendar'
  if (is(/^(who we are|who built|who records|who you'll talk|the team behind)/i)) return 'about'
  if (s.blocks[0]?.type === 'ol') return 'steps'
  if (is(/^(what changes|life after)/i)) return 'life'
  return 'detail'
}

/** The look (photo, notes, eyebrow) for each page: category pages use their category's; core pages pick one. */
const categoryFor: Record<string, string> = {
  '/hvac-website-design': 'HVAC Website Design',
  '/hvac-local-seo': 'HVAC Local SEO',
  '/hvac-lead-management': 'HVAC Lead Management',
  '/hvac-ads': 'HVAC Ads',
  '/hvac-ai-automation': 'AI Agents and Automation',
}
export function lookForPage(page: PageCopy): CategoryLook {
  const category = categoryFor[page.path]
  if (category) return categories[category]
  const base = categories['HVAC Lead Management']
  if (page.path === '/about')
    return { ...base, name: 'Ascend AI Marketing', photo: about.portraits.hero, notes: [], storyPhoto: about.photo }
  if (page.path === '/book') return { ...base, name: 'Ascend AI Marketing', photo: about.photo, notes: [] }
  if (page.path === '/work') return { ...base, name: 'Our work', photo: success.photo, notes: success.notes }
  if (page.path === '/hvac-lead-system') return { ...base, name: 'The 72-hour HVAC lead system' }
  return { ...base, name: 'Ascend AI Marketing' }
}
