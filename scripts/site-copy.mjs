#!/usr/bin/env node
/**
 * Turns the approved copy for the core pages (docs/copy/A-core.md) and the category pages
 * (docs/copy/B-categories.md) into src/content/pages.json. The copy files stay the source of truth:
 * edit them, then run `npm run pages:copy`.
 *
 * Each page becomes { path, title, kind, seo, hero, sections[], closing }. Sections keep their build
 * label, heading and content blocks, in the same shape the service pages use (see services.ts), plus:
 *   bold     the "Bold line" that closes a problem section
 *   label    a short label that introduces the list after it ("What the plan includes:")
 *   links    a list of services, each a link and a line ("[Missed call text back](/services/…): …")
 *   cta      a button ("Button:" or "Link:")
 *   pricing  the "One simple monthly plan. See pricing" line
 *   case     a past client card on the work page
 *   calendar where the booking calendar goes
 *   field    any other labelled line (name + text); pages that need it read it by name
 * Links to service pages that don't exist yet stay as plain text, so the site never links to a 404.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const OUT = 'src/content/pages.json'
const SOURCES = [
  { file: 'docs/copy/A-core.md', kind: 'core', paths: ['/hvac-lead-system', '/missed-calls', '/about', '/work', '/teardown', '/book'] },
  { file: 'docs/copy/B-categories.md', kind: 'category' },
]
const services = new Set(JSON.parse(readFileSync('src/content/services.json', 'utf8')).map((s) => s.slug))

const field = (line) => {
  const m = line.match(/^\*\*([^*]+?):\*\*\s*(.*)$/)
  return m ? { name: m[1].trim(), text: m[2].trim() } : null
}
const boldLead = (text) => {
  const m = text.match(/^\*\*(.+?)\*\*\s*(.*)$/)
  return m ? { lead: m[1].trim(), text: m[2].trim() } : { text }
}
/** Links to service pages that aren't built yet become plain text. */
const unlinkMissing = (text) =>
  text.replace(/\[([^\]]+)\]\(\/services\/([^)]+)\)/g, (all, label, slug) => (services.has(slug) ? all : label))
/** `Etheric Networks (past client): 45 leads. "Quote." Camille, Etheric Networks` → a result and a quote. */
const proof = (text) => {
  // The quote starts a new sentence and ends with its own full stop; quoted phrases inside a sentence aren't quotes.
  const m = text.match(/^(.*?[.!?])\s"([^"]+[.!?])"\s([^"]+)$/)
  return m ? [{ type: 'result', text: m[1].trim() }, { type: 'quote', text: m[2].trim(), who: m[3].trim() }] : [{ type: 'result', text }]
}
/** "See the full plan (/hvac-lead-system)" or "See pricing (links to /hvac-lead-system)" → text and href. */
const withHref = (text) => {
  const m = text.match(/^(.*?)\s*\((?:links to\s*)?(\/[^)]*)\)\s*$/)
  return m ? { text: m[1].trim(), href: m[2] } : { text, href: '' }
}

const HERO = { Headline: 'headline', Subhead: 'subhead', 'Main button': 'primary', 'Second button': 'secondary', 'Trust line': 'trust', 'Trust line under the buttons': 'trust', 'Under the button': 'note', 'Form fields': 'formFields', 'Form button': 'formButton', 'Text link': 'textLink' }
const CLOSING = { Heading: 'heading', 'Main button': 'primary', 'Second button': 'secondary', 'Small link': 'small', 'Form button': 'formButton', 'Pricing line': 'pricing' }

function parsePage(chunk, kind) {
  const lines = chunk.split('\n')
  const head = lines[0].match(/^(.*?)\s*\((\/[^)]*)\)\s*$/)
  const page = { path: head[2], title: head[1].trim(), kind, seo: { title: '', description: '' }, hero: {}, sections: [], closing: {} }
  let section = null
  let card = null
  let inComment = false
  for (const raw of lines.slice(1)) {
    if (raw.includes('<!--')) inComment = !raw.includes('-->')
    else if (inComment) { if (raw.includes('-->')) inComment = false; continue }
    if (raw.includes('<!--')) continue
    const tag = raw.match(/\[QUIZ TAG:\s*interest-([a-z0-9-]+)\]/)
    if (tag && section) page.quizTag = tag[1]
    const line = unlinkMissing(raw.replace(/\s*\[(OUTSIDE LINK|QUIZ TAG)[^\]]*\]/g, '').trim())
    if (!line || line === '---' || /^\*\*Word count/.test(line)) continue
    if (/^\*\*(SEO title|SEO description|Main keyword):\*\*/.test(line)) {
      const f = field(line)
      if (f.name === 'SEO title') page.seo.title = f.text
      if (f.name === 'SEO description') page.seo.description = f.text
      continue
    }
    const label = line.match(/^###\s+(\d+)\.\s+(.*)$/)
    if (label || /^### /.test(line)) {
      section = label ? { label: label[2].trim(), heading: '', blocks: [] } : null
      if (section) page.sections.push(section)
      card = null
      continue
    }
    if (!section) continue
    const blocks = section.blocks
    const last = blocks.at(-1)
    const indented = /^\s{2,}-\s/.test(raw)

    // Work page cards: "**Card: Name (past client, what we did)**", then labelled bullets.
    const cardHead = line.match(/^\*\*Card:\s*(.+?)\s*\((.+)\)\*\*$/)
    if (cardHead) {
      card = { type: 'case', name: cardHead[1], kind: cardHead[2].replace(/^past client,\s*/, ''), headline: '', did: [], result: '' }
      blocks.push(card)
      continue
    }
    if (card && /^-\s/.test(line)) {
      const item = line.replace(/^-\s+/, '')
      if (indented) { card.did.push(item); continue }
      const f = field(item)
      if (f?.name === 'Result headline') card.headline = f.text
      else if (f?.name === 'Result') card.result = f.text
      else if (f?.name === 'Quote') { const q = proof(`x ${f.text}`)[1]; if (q) card.quote = { text: q.text, who: q.who } }
      else if (f?.name !== 'What we did') throw new Error(`Unknown card line "${line}" on ${page.path}`)
      continue
    }

    const f = field(line)
    if (f) {
      if (f.name === 'Heading' || f.name === 'Headline') { section.heading = f.text; continue }
      if (f.name === 'Bold line') { blocks.push({ type: 'bold', text: f.text }); continue }
      if (f.name === 'Proof' || f.name === 'Proof strip') { blocks.push(...proof(f.text)); continue }
      if (f.name === 'Button' || f.name === 'Link') { blocks.push({ type: 'cta', ...withHref(f.text) }); continue }
      if (f.name === 'Pricing line') { const [lead, rest] = f.text.split(/(?<=\.)\s/); blocks.push({ type: 'pricing', text: lead, link: withHref(rest) }); continue }
      if (!f.text) { blocks.push({ type: 'label', text: f.name }); continue }
      section.fields = { ...section.fields, [f.name]: f.text }
      blocks.push({ type: 'field', name: f.name, text: f.text })
      continue
    }
    if (/^\*\*Calendar embed\*\*/.test(line)) { blocks.push({ type: 'calendar' }); continue }
    // "**Not ready to book?** That's fine. …" is a labelled line whose label is a question.
    const asked = line.match(/^\*\*([^*]+\?)\*\*\s+(.+)$/)
    if (asked && !/faq/i.test(section.label)) { section.fields = { ...section.fields, [asked[1]]: asked[2] }; blocks.push({ type: 'field', name: asked[1], text: asked[2] }); continue }

    // FAQ: "**Question?** Answer" on one line, or the question on its own line and the answer below it.
    if (/faq/i.test(section.label)) {
      const q = line.match(/^\*\*(.+\?)\*\*\s*(.*)$/)
      if (q) {
        const item = { q: q[1], a: q[2] }
        if (last?.type === 'faq') last.items.push(item)
        else blocks.push({ type: 'faq', items: [item] })
        continue
      }
      if (last?.type === 'faq' && last.items.at(-1).a === '') { last.items.at(-1).a = line; continue }
      throw new Error(`Extra FAQ text on ${page.path}: "${line}"`)
    }

    const serviceLink = (text) => text.match(/^\[([^\]]+)\]\((\/services\/[^)]+)\):\s*(.*)$/)
    const bullet = line.match(/^-\s+(.*)$/)
    if (bullet) {
      const linked = serviceLink(bullet[1])
      if (linked) {
        const item = { title: linked[1], href: linked[2], text: linked[3] }
        if (last?.type === 'links') last.items.push(item)
        else blocks.push({ type: 'links', items: [item] })
        continue
      }
      // A link to a page that isn't built yet: the bullet keeps its words, as a plain list item.
      const plain = bullet[1].match(/^([^[\]]+?):\s+(.*)$/)
      if (last?.type === 'links' && plain && !bullet[1].startsWith('**')) { last.items.push({ title: plain[1], text: plain[2] }); continue }
      if (last?.type === 'ul') last.items.push(boldLead(bullet[1]))
      else blocks.push({ type: 'ul', items: [boldLead(bullet[1])] })
      continue
    }
    const numbered = line.match(/^\d+\.\s+(.*)$/)
    if (numbered) {
      if (last?.type === 'ol') last.items.push(boldLead(numbered[1]))
      else blocks.push({ type: 'ol', items: [boldLead(numbered[1])] })
      continue
    }
    const linkedPara = serviceLink(line)
    if (linkedPara) {
      const item = { title: linkedPara[1], href: linkedPara[2], text: linkedPara[3] }
      // Paragraphs between linked ones (a note on the plan) stay with the list as its note.
      blocks.push({ type: 'links', items: [item] })
      continue
    }
    if (/\[[A-Z][A-Z ]+[\]:]/.test(line) && !line.includes('[BUSINESS PHONE]')) throw new Error(`Placeholder left in the copy on ${page.path}: "${line}"`)
    // "See pricing (links to /hvac-lead-system)" inside a paragraph becomes a real link.
    blocks.push({ type: 'p', ...boldLead(line.replace(/(See [^.()]+?)\s*\((?:links to\s*)?(\/[a-z0-9\-/#]*)\)/g, '[$1]($2)')) })
  }

  // A note that sits between two linked paragraphs belongs to the one above it ("[Workflows](…): … Our plan already covers…").
  for (const s of page.sections) {
    const merged = []
    for (const b of s.blocks) {
      const prev = merged.at(-1)
      const prev2 = merged.at(-2)
      if (b.type === 'links' && prev?.type === 'p' && !prev.lead && prev2?.type === 'links') {
        merged.pop()
        prev2.items.at(-1).text += ` ${prev.text}`
        prev2.items.push(...b.items)
      } else if (b.type === 'links' && prev?.type === 'links') prev.items.push(...b.items)
      else merged.push(b)
    }
    s.blocks = merged
  }

  // The first section is the hero and the last is the closing call to action.
  const hero = page.sections.shift()
  for (const b of hero.blocks) if (b.type === 'field' && HERO[b.name]) page.hero[HERO[b.name]] = b.text
  page.hero.headline = hero.heading
  // Build notes in brackets after a button ("(starts the quiz)") aren't part of the label.
  for (const key of ['primary', 'secondary']) if (page.hero[key]) page.hero[key] = page.hero[key].replace(/\s*\((starts|jumps)[^)]*\)$/, '')
  const closing = page.sections.pop()
  page.closing = { heading: closing.heading, body: closing.blocks.filter((b) => b.type === 'p').map((b) => b.text).join(' ') }
  for (const b of closing.blocks) {
    if (b.type === 'field' && CLOSING[b.name]) page.closing[CLOSING[b.name]] = b.text
    if (b.type === 'pricing') page.closing.pricing = b
  }
  // Sections that only describe the quiz itself (its questions and contact step) are drawn by the quiz.
  page.sections = page.sections.filter((s) => !/^(the 5 questions|contact step)$/i.test(s.label))
  return page
}

const pages = SOURCES.flatMap(({ file, kind, paths }) =>
  readFileSync(file, 'utf8')
    .split(/^## /m)
    .slice(1)
    .filter((chunk) => {
      const path = chunk.split('\n')[0].match(/\((\/[^)]*)\)\s*$/)?.[1]
      return path && (!paths || paths.includes(path))
    })
    .map((chunk) => parsePage(chunk, kind)),
)

for (const page of pages) {
  if (!page.hero.headline || !page.closing.heading || !page.seo.title) throw new Error(`Incomplete page: ${page.path}`)
  page.sections.forEach((s) => { if (!s.heading && !/faq/i.test(s.label)) throw new Error(`Section without a heading: ${page.path} / ${s.label}`) })
}

// "15-minute" never breaks after the hyphen in a heading or label (a non-breaking hyphen looks the same).
const keepTogether = (text) => text.replace(/(\d)-(?=[a-z])/g, '$1\u2011')
const tidy = (value, key) =>
  typeof value === 'string' ? (['heading', 'label', 'headline'].includes(key) ? keepTogether(value) : value)
  : Array.isArray(value) ? value.map((v) => tidy(v))
  : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, tidy(v, k)]))
  : value
writeFileSync(OUT, JSON.stringify(tidy(pages), null, 2) + '\n')
console.log(`Wrote ${pages.length} pages to ${OUT}: ${pages.map((p) => p.path).join(', ')}`)
