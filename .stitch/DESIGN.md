# Design System: Ascend AI Marketing (HVAC websites and lead systems) · "Evergreen"

The source of truth for every visual decision on the site. The tokens live in
`src/styles/global.css` and must match this file. A live preview of every token and
component is at `/design-system` (not indexed).

---

## 1. Visual theme and atmosphere

Evergreen feels like a calm, sure-footed partner for a busy trade. A deep green hero
and dark "proof" sections carry authority. Warm cream pages give the copy room to
breathe. Real product UI (missed-call texts, the lead inbox, booked jobs) does the
selling, not decoration. One soft sage accent marks the thing to look at.

**Key characteristics**
- Deep green and warm cream, with a single sage accent.
- Round, friendly type (Google Sans Flex with a little `ROND`), set light and large.
- Pill buttons, generous rounded cards, no hard lines between sections.
- Product UI pieces (texts, inbox rows, status pills) float over real photos.
- The missed-call quiz is the main call to action. "Book a 15-minute call" is the second.

**Name rule:** always write the full name, **Ascend AI Marketing**. Never "Ascend AI".

**House rules**
- No colored border lines anywhere (no colored top, bottom or left accents on cards, stats, steps or sections). Neutral 1px dividers inside a card are fine.
- Motion is calm and smooth, built from the motion tokens (`--ease-out`, `--dur-fast` 160ms, `--dur-base` 260ms). Entrances are one slow slide-up: `--reveal-shift` 40px over `--dur-reveal` 1000ms with `--ease-reveal` (ease-out cubic, a long soft landing); the fade (`--dur-reveal-fade` 700ms) ends first. Each item starts as soon as its top edge enters the view, and only items arriving together are staggered (`--reveal-step`; a big batch is squeezed into a 2-step window). Photos still downloading fade in when they arrive. Heights (accordions, reviews, quiz steps) ease with `--ease-reveal` over `--dur-accordion` 480ms. The slider glides 650ms with the same ease-out and fades when it wraps around; quiz steps cross-fade. Never nest a reveal inside another reveal; the hero arrives in sequence on load; big stats count up once; buttons, cards, icon chips and accordions have small hover moves. All of it turns off for reduced motion (`src/scripts/motion.ts`).
- Keep homepage copy short. Details (price after month 12, add-on prices) live on their own pages.
- Only the colors, sizes and spacing below. If something new is needed, add a token here first.

---

## 2. Color

### Primitives (`@theme` in global.css, also Tailwind utilities)
| Token | Hex | Use |
|---|---|---|
| `green-950` | `#0d2616` | Deepest sections (How it works) |
| `green-900` | `#11301c` | Header, hero, dark sections, primary button on light |
| `green-800` | `#173d25` | Photo placeholders |
| `green-700` | `#194728` | Brand green: icons, eyebrow dot, links on light |
| `sage-300` | `#abc9ae` | The accent: primary button on dark, accent words, "now" price |
| `sage-200` | `#c4dcc6` | Sage hover |
| `sage-100` | `#dce8dd` | Tint band, score box, "booked" status |
| `cream-200` | `#eee8dd` | Page background |
| `cream-100` | `#f7f3ec` | Cards on white, quiz options, inputs |
| `white` | `#ffffff` | Cards on cream, white sections |
| `ink` | `#1e1e1e` | Headings and strong text |
| `stone-600` | `#474d49` | Body text |
| `stone-500` | `#5f6661` | Muted text, labels |
| `stone-100` | `#ebeee9` | Incoming text bubble, muted status pill |
| `line` | `#e4ddd0` | Dividers |
| `blue-500` | `#2d9ffe` | Product UI only (UI icons) |
| `blue-600` | `#0d6cc4` | Product UI only: outgoing text bubble (white text passes contrast), "new" status text |
| `red-600` / `red-100` | `#c9412b` / `#fde9e6` | Missed-call icon in product UI, form errors |

On dark surfaces, translucent white comes from tokens too: `--color-control-inverse` (round buttons, nav pill), `--color-text-inverse-faint` (struck-through price), and `--color-overlay` behind pop-ups.

Tailwind's default palette is switched off, so off-brand colors can't be used by accident.

### Surfaces
Every section is one surface. The surface sets its children's colors, so cards, buttons,
icons and text adapt without extra classes.

| Surface | Background | Cards | Primary button |
|---|---|---|---|
| `surface-cream` | cream-200 | white | green-900 |
| `surface-white` | white | cream-100 | green-900 |
| `surface-tint` | sage-100 | white | green-900 |
| `surface-deep` | green-900 | white at 6% | sage-300 |
| `surface-deeper` | green-950 | white at 6% | sage-300 |

Page rhythm: deep hero, then cream and white sections, with deep sections used for
proof and the final quiz.

---

## 3. Typography

**Font:** Google Sans Flex (`opsz,wdth,wght,ROND`), `ROND 20`, falling back to
Google Sans and the system font.

| Role | Class | Size | Weight | Line height |
|---|---|---|---|---|
| Display (H1) | `.t-display` | 40 → 70px | 400 | 1.04 |
| H2 | `.t-h2` | 32 → 52px | 420 | 1.1 |
| H3 | `.t-h3` | 22 → 26px | 420 | 1.2 |
| H4 / card title | `.t-h4` | 18px | 560 (`--weight-ui`) | 1.3 |
| Price | `--text-price` | 64 → 92px | 400 | 1 |
| Final call to action | `--text-cta` | 38 → 62px | 400 | 1.04 |
| Stat | `--text-stat` | 48 → 64px | 450 (`--weight-stat`) | 1 |
| Figure | `--text-figure` | 30px | — | 1 |
| Quiz question | `--text-question` | 21 → 24px | 420 | 1.2 |
| Lead | `.lead` | 19 → 24px | 400 | 1.45 |
| Body large | `.body-lg` | 18px | 400 | 1.65 |
| Body | — | 16px | 400 | 1.6 |
| UI text | `--text-ui` | 15px | — | 1.45 |
| Small | `.text-sm` | 14px | 400 | 1.5 |
| Label / eyebrow | `.eyebrow` | 13px, caps, +0.16em | 500 | — |
| Product UI / badge | `--text-2xs` | 12px | — | — |
| Button | `.btn` | 16px (14px small) | 560 (`--weight-ui`) | 1 |

- Headings are light and large, with tight negative tracking. Wrap one phrase in `<em>` to color it (sage on dark, green on light).
- Every section opens with an eyebrow: a small square dot and an uppercase label.
- Nothing smaller than 12px. Body copy stays under about 60 characters wide.

---

## 4. Space, radius, elevation

**Space** is a 4px scale: `--space-1` (4) `-2` (8) `-3` (12) `-4` (16) `-5` (20) `-6` (24)
`-8` (32) `-10` (40) `-12` (48) `-14` (56) `-16` (64) `-20` (80).

| Token | Value | Use |
|---|---|---|
| `--section-y` | 80 → 120px | Top and bottom of every section |
| `--section-head-gap` | 40 → 56px | Section header to its content |
| `--container-max` | 1280px | Content width |
| `--container-padding-x` | 20 → 40px | Side gutter |
| `--grid-gap` | 16px | Between cards, everywhere |
| `--card-pad` | 22 → 32px | Inside every card |
| `--stack-body` | 24px | Heading to its body copy |
| `--stack-actions` | 32px | Body copy to its buttons |

Two sections on the same surface in a row share their padding (no double gap).

**Radius:** `sm` 10px (inputs, UI icons) · `md` 14px (UI panels, FAQ items, notes) ·
`lg` 20px (cards, photos) · `xl` 26px (big panels: plan, quiz, add-on band) · `full` (buttons, tags, icon chips).

**Elevation:** only things floating over a photo get a shadow: `--shadow-sm` (UI panel),
`--shadow-md` (notes, chip cards), `--shadow-lg` (inbox, quiz).

---

## 5. Components

### Buttons (`Btn.astro`, classes `.btn`)
One height (52px), one pill shape, two styles and a text link. The header button is the only small one (42px).
- **Primary** `.btn--primary`: the main action. Green-900 on light surfaces, sage on dark ones. Hover goes to ink (light) or white (dark).
- **Secondary** `.btn--secondary`: an outlined pill. White with a hairline on light, transparent with a 40% white ring on dark.
- **Link** `.link`: underlined text with an optional arrow, for a third, quieter action.
- On phones, buttons in an `.actions` row go full width.
- CMS buttons (`Button.astro`) render the same classes. The old `ghost` variant maps to the link style.

### Cards (`.card`)
- Background from the surface (`--surface-card`), radius `lg`, padding `--card-pad`, no border, no shadow.
- `.card--feature`: icon chip, title, text. On phones it becomes a row.
- `.card--row`: icon chip beside one line of text.
- A dark card in a light section adds `surface-deep` to the card itself.

### Icon chip (`.icon-chip`)
44px circle with a 20px stroke icon. Green-900 with white on light surfaces, sage at 16% with
sage on dark. `.icon-chip--ui` is the blue rounded square used only inside product UI.

### Tags (`.tag`)
Small pills for categories ("Local SEO and Google Ads") and offers (`.tag--accent`, sage).

### Product UI
`.ui-panel`, `.ui-row`, `.bubble`, `.avatar`, `.status--new|done|muted`, `.float-note`. These are the
only places blue and red appear.

### Section header (`SectionHead.astro`)
Eyebrow, H2, optional intro. `align`: `left` (default), `center` (left on phones) or `split`
(heading left, intro or link right).

### Reviews (`HomeReviews.astro`)
Three cards. Long reviews show about 6 lines; the last line is cut through the middle and fades into the card, with a plain "Show more" text link right under it that opens the full review in place (animated).

### Accordion (`.accordion`)
White items, radius `md`, a round plus that turns into a dark x when open. One open at a time. Items open and close with a smooth height animation (`src/scripts/accordion.ts`, `--dur-accordion`).

### Hero slider (`HeroSlider.astro`)
A row of photo and product-UI cards that scrolls sideways, with snap points, a pause button and
prev/next buttons. It autoplays one slide every 3.5 seconds and loops. It waits while someone hovers,
focuses or touches it, while it's off screen, and never plays for reduced-motion users. No quiz card
and no testimonial in the slider.

### Video button (`VideoButton.astro`)
A secondary pill with a round play icon ("Watch the video"). It opens a pop-up player (a `<dialog>`, 16:9, radius `lg`) that loads the YouTube or Vimeo video only when opened and stops it on close. The hero's video link lives in `hero.video.url` in `src/content/home.ts`; while it's empty, the pop-up says the video is coming soon and offers "Book a 15-minute call".

### More services (`HomeServices.astro`)
Standalone services on a `surface-deeper` band: heading left (sticky on desktop), an accordion of
large numbered rows right. The open row turns white and shows one short line plus a "Learn more
about …" link to its service page. No prices. Ends with a "View all services" link.

### Missed-call quiz (`MissedCallQuiz.astro`)
White panel, radius `xl`, shadow `lg`. Four-option answers on cream-100. The lead posts to
`/api/contact`.

### Header and footer
- Header: sticky, green-900, logo left, pill nav centered, primary button right. On phones: a full-screen green menu.
- Footer: cream, logo and quiz button, three link columns, then the copyright line, then **Ascend AI Marketing** across the full width as a watermark: light weight, wide letter spacing, green at 20% fading to nothing at the bottom edge (no logo mark).

---

## 6. Building pages (DRY)

- Copy for the homepage lives in `src/content/home.ts`. Sections live in `src/components/home/`.
- New pages are built from the same pieces: `Section`, `SectionHead`, `Btn`, `.card`, `.icon-chip`, `.grid-2|3|4`, `.split`.
- Service pages share one template; only their content changes.
- Never write a raw color, font size, radius or spacing value in a component. Use a token.
