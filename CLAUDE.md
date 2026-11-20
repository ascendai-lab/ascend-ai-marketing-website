# CLAUDE.md — Ascend AI Starter

This file tells Claude Code everything it needs to build consistently in this project.
Read this before touching any file.

---

## Stack

| Layer | Tool | Notes |
|---|---|---|
| Framework | Astro 5 | `output: 'server'` — full SSR required for Sanity visual editing |
| Styling | Tailwind CSS 4 | No config file — all via `@import "tailwindcss"` in global.css |
| UI Components | Astro components + plain CSS tokens | React only for interactive islands (`.tsx`) |
| CMS | Sanity v6 | Studio embedded at `/studio` (can also be deployed with `npm run sanity:deploy`) |
| Visual Editing | Sanity Presentation Tool + Stega | Requires SSR — do NOT switch to static output |
| Hosting | Netlify | SSR via Netlify adapter. NOT Cloudflare Pages |
| Forms | Custom API route → LeadLine (GHL) webhook | See `src/pages/api/contact.ts` |
| Language | TypeScript strict | No `any` types. Use Zod for runtime validation |

---

## Design System

The DESIGN.md file in `.stitch/DESIGN.md` is the source of truth for ALL visual decisions.

- Colors, typography, spacing, and component styles come from DESIGN.md
- Never introduce colors, fonts, or spacing not defined there
- When building components, reference DESIGN.md first

CSS custom properties are defined in `src/styles/global.css`.
Tailwind utility classes map to those properties wherever possible.

---

## File Conventions

### Astro components (`.astro`)
- Used for layouts, pages, and non-interactive UI sections
- Fetch Sanity data at the top of a page with `loadQuery(Astro.locals.draftMode, query, params)` from `@cms/lib/load`
- Load `layoutQuery` alongside the page query (`Promise.all`) and pass it to `BaseLayout`
- Query results are typed automatically by Sanity TypeGen (`src/sanity/types.ts`). Run `npm run typegen` after changing a schema or a query
- Values that end up in classes, ids, hrefs or `<head>` must go through `stegaClean()` (or `resolveLink()` for links)

### React components (`.tsx`)
- Used for interactive UI only (forms, modals, carousels, portable text renderer)
- UI components live in `src/components/ui/`
- Portable text renderer is always a React component (`src/components/ui/PortableText.tsx`)

### Pages
- `src/pages/index.astro` — home page, renders the `homePage` singleton's page builder
- `src/pages/[...slug].astro` — every `page` document
- `src/pages/services/`, `areas/`, `blog/` — listings + detail pages for those document types
- `src/pages/sitemap.xml.ts`, `robots.txt.ts` — generated from the CMS on request
- `src/pages/api/contact.ts` — form submission API route
- `src/pages/api/draft-mode/{enable,disable}.ts` — visual editing preview on/off
- `src/middleware.ts` — draft-mode detection, CDN cache headers, CMS redirects on 404

### Routes
`src/sanity/routes.ts` is the single map from document type → URL. The site, sitemap, links
and the Presentation tool all use it. Add a new routable type there first.

---

## Sanity Schema Rules

- **Singletons** go in `src/sanity/schemas/singletons/` — one document, no list (add the name to `singletonTypes` in `schemas/index.ts`)
- **Repeatable documents** go in `src/sanity/schemas/documents/`
- **Reusable field objects** go in `src/sanity/schemas/objects/`
- **Page-builder sections** go in `src/sanity/schemas/objects/blocks/` — register in `blockTypes`, add a projection in `pageBuilderFields` (queries.ts) and a component in `src/components/blocks/` + `PageBuilder.astro`
- Every page schema MUST include `seoField` (from `schemas/shared.ts`) and be listed in `routes.ts` + `src/sanity/presentation.ts` for visual editing
- Every image uses the `imageWithAlt` type (alt text is required unless marked decorative)
- Every link uses the `link` type (internal reference / URL / email / phone) — never a free-text href
- Rich text uses the `richText` type
- Video embeds use the `videoEmbed` object schema — supports YouTube + Vimeo
- Icons: import from subpaths, e.g. `import { HomeIcon } from '@sanity/icons/Home'` (the root export is removed in @sanity/icons v5)

### Singleton pattern (always use this for fixed pages)
See `src/sanity/structure.ts` (`singletonListItem`). Singletons are also hidden from
"Create new" and can't be duplicated or deleted (see `sanity.config.ts`).

### Visual editing
- Studio is embedded at `/studio`; the Presentation tool opens the site via `/api/draft-mode/enable`
- Draft mode needs `SANITY_API_READ_TOKEN` (Viewer). The cookie value is derived from the token, so it can't be forged
- Page-builder sections get `data-sanity` attributes (`editAttr`) so editors can click and drag-reorder them

---

## Environment Variables

Never hardcode project IDs, tokens, or webhook URLs.
All env vars are documented in `.env.example`.

| Variable | Used in |
|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | astro.config.mjs, sanity.config.ts |
| `PUBLIC_SANITY_DATASET` | astro.config.mjs, sanity.config.ts |
| `SANITY_STUDIO_URL` | astro.config.mjs (stega) — optional, defaults to `/studio` |
| `SANITY_API_READ_TOKEN` | src/sanity/lib/load.ts, api/draft-mode (server only) |
| `LEADLINE_WEBHOOK_URL` | src/pages/api/contact.ts |
| `SITE_URL` | astro.config.mjs |
| `PUBLIC_GHL_CALENDAR_URL` | Booking calendar embed (/book, quiz results). Optional: without it a call request form shows |

---

## Forms → LeadLine (GoHighLevel)

Every form submission goes to `POST /api/contact`.
That endpoint validates with Zod, then POSTs to `LEADLINE_WEBHOOK_URL`, the URL of an
"Inbound Webhook" trigger on a LeadLine (GHL) workflow. The workflow creates or updates the contact.
There is no n8n in this setup.

Each lead is also posted to the `website-leads` Netlify form (declared in `public/__forms.html`),
so Netlify emails a copy to the addresses under Forms → Form notifications. That copy is best effort.

The payload sent to LeadLine (flat keys, easy to map in the workflow):
```json
{
  "first_name": "string",
  "last_name": "string",
  "full_name": "string",
  "email": "string",
  "phone": "string (may be empty)",
  "message": "string",
  "source": "website-contact-form | missed-call-quiz | teardown-request | call-request",
  "tags": "comma separated, e.g. website-lead,missed-call-quiz,interest-google-ads",
  "sms_consent": "yes | no",
  "page": "string",
  "site_url": "string",
  "timestamp": "ISO 8601"
}
```

---

## Netlify Visual Editing Fix

The `netlify.toml` sets `Content-Security-Policy: frame-ancestors` to allow
Sanity Studio to embed the site in an iframe. Do NOT remove this header.
If visual editing breaks, this header is the first thing to check.

---

## What NOT to Do

- Do NOT use colored border lines in any design (no colored border-top/bottom/left accents on cards, stats, steps or sections). See the house rules in `.stitch/DESIGN.md`

- Do NOT switch `output` to `static` — visual editing breaks
- Do NOT use `useCdn: true` in the Sanity client — drafts won't load (published pages are cached at Netlify's CDN instead, see middleware.ts)
- Do NOT add `X-Frame-Options: DENY` — it overrides the CSP and breaks visual editing
- Do NOT store API tokens in the frontend — use server-side routes
- Do NOT create Tailwind config files — Tailwind 4 is config-free
- Do NOT use `<form>` action attributes — all forms post via fetch to `/api/contact`
