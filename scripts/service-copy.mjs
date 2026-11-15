#!/usr/bin/env node
/**
 * Turns the approved service page copy (docs/copy/C, D and E) into src/content/services.json.
 * The copy files stay the source of truth: edit them, then run `npm run services:copy`.
 *
 * Each page becomes { slug, category, seo, short, hero, sections[], closing }.
 * Each section keeps its build label, its heading and its content as blocks:
 *   p       a paragraph (with `lead` when it starts with a bold phrase)
 *   ul / ol a list (items can have a bold `lead`)
 *   quote   a client quote
 *   result  a past client result
 *   price   a price note
 *   faq     the questions and answers
 * Inline text keeps **bold** and [links](/path); the site renders those safely.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILES = ['docs/copy/C-services-web-seo.md', 'docs/copy/D-services-leads-ads-ai.md', 'docs/copy/E-services-custom-software.md']
const OUT = 'src/content/services.json'

const field = (line, name) => {
  const m = line.match(new RegExp(`^\\*\\*${name}:\\*\\*\\s*(.*)$`))
  return m ? m[1].trim() : null
}
const boldLead = (text) => {
  const m = text.match(/^\*\*(.+?)\*\*\s*(.*)$/)
  return m ? { lead: m[1].trim(), text: m[2].trim() } : { text }
}

function parsePage(chunk) {
  const lines = chunk.split('\n')
  const page = { slug: '', category: '', seo: { title: '', description: '' }, short: '', hero: {}, sections: [], closing: {} }
  let section = null
  for (const raw of lines) {
    const line = raw.trim()
    if (!line || line === '---' || line.startsWith('## ') || line.startsWith('# ')) continue
    if (line.startsWith('**Word count:**')) continue
    if (/^\[(OUTSIDE LINK|QUIZ TAG|PHOTO|IMAGE)[^\]]*\]$/.test(line)) continue

    const slug = field(line, 'Slug')
    if (slug !== null) { page.slug = slug.replace(/^\/services\//, ''); continue }
    const category = field(line, 'Category')
    if (category !== null) { page.category = category; continue }
    const seoTitle = field(line, 'SEO title')
    if (seoTitle !== null) { page.seo.title = seoTitle; continue }
    const seoDesc = field(line, 'SEO description')
    if (seoDesc !== null) { page.seo.description = seoDesc; continue }
    const short = field(line, 'Short description')
    if (short !== null) { page.short = short; continue }

    const label = line.match(/^###\s+\d+\.\s+(.*)$/)
    if (label) {
      section = { label: label[1].trim(), heading: '', blocks: [] }
      page.sections.push(section)
      continue
    }
    if (!section) continue

    const heading = field(line, 'Heading') ?? field(line, 'Headline')
    if (heading !== null) { section.heading = heading; continue }
    const sub = field(line, 'Subhead')
    if (sub !== null) { section.subhead = sub; continue }
    const main = field(line, 'Main button')
    if (main !== null) { section.primary = main; continue }
    const second = field(line, 'Second button')
    if (second !== null) { section.secondary = second; continue }
    const body = field(line, 'Body')
    if (body !== null) { section.body = body; continue }
    const result = field(line, 'Past client result')
    if (result !== null) { section.blocks.push({ type: 'result', text: result }); continue }
    const price = field(line, 'Price')
    if (price !== null) { section.blocks.push({ type: 'price', text: price }); continue }
    const teardown = line.match(/^\*\*(Not ready[^*]*)\*\*\s*(.*)$/)
    if (teardown) { section.teardown = { lead: teardown[1].trim(), text: teardown[2].trim() }; continue }

    const quote = line.match(/^>\s*"(.+?)"\s*(.*)$/)
    if (quote) { section.blocks.push({ type: 'quote', text: quote[1], who: quote[2].trim() }); continue }

    const last = section.blocks.at(-1)
    const bullet = line.match(/^-\s+(.*)$/)
    if (bullet) {
      if (last?.type === 'ul') last.items.push(boldLead(bullet[1]))
      else section.blocks.push({ type: 'ul', items: [boldLead(bullet[1])] })
      continue
    }
    const numbered = line.match(/^\d+\.\s+(.*)$/)
    if (numbered) {
      if (last?.type === 'ol') last.items.push(boldLead(numbered[1]))
      else section.blocks.push({ type: 'ol', items: [boldLead(numbered[1])] })
      continue
    }

    // FAQ: a bold question on its own line, then the answer.
    if (/faq|questions/i.test(section.label)) {
      const q = line.match(/^\*\*(.+\?)\*\*$/)
      if (q) {
        if (last?.type === 'faq') last.items.push({ q: q[1], a: '' })
        else section.blocks.push({ type: 'faq', items: [{ q: q[1], a: '' }] })
        continue
      }
      if (last?.type === 'faq' && last.items.at(-1).a === '') { last.items.at(-1).a = line; continue }
    }

    section.blocks.push({ type: 'p', ...boldLead(line) })
  }

  const hero = page.sections.shift()
  page.hero = { headline: hero.heading, subhead: hero.subhead ?? '', primary: hero.primary, secondary: hero.secondary }
  const closing = page.sections.pop()
  page.closing = { heading: closing.heading, body: closing.body ?? '', primary: closing.primary, secondary: closing.secondary, teardown: closing.teardown }
  return page
}

const pages = FILES.flatMap((file) =>
  readFileSync(file, 'utf8')
    .split(/^## (?=.*\(\/services\/)/m)
    .slice(1)
    .map((chunk) => ({ title: chunk.split('\n')[0].replace(/\s*\(\/services\/.*\)\s*$/, '').trim(), ...parsePage(chunk) })),
)

for (const page of pages) {
  if (!page.slug || !page.hero.headline || !page.closing.heading) throw new Error(`Incomplete page: ${page.title}`)
  for (const s of page.sections) if (!s.heading) throw new Error(`Section without a heading: ${page.title} / ${s.label}`)
}

writeFileSync(OUT, JSON.stringify(pages, null, 2) + '\n')
console.log(`Wrote ${pages.length} service pages to ${OUT}`)
