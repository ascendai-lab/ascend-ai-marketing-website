/**
 * Homepage content. Approved copy from docs/copy/pages/A/home-page.md, used as written.
 * The page renders this until the homePage document in Sanity has sections of its own.
 * Photos are Unsplash stand-ins until Mark picks the final ones.
 */
import type { IconName } from '@components/ui/Icon.astro'

export const brand = {
  name: 'Ascend AI Marketing',
  tagline: 'Serving HVAC shops nationwide.',
}

export const links = {
  quiz: '/missed-calls',
  book: '/book',
  plan: '/hvac-lead-system',
  work: '/work',
  about: '/about',
  teardown: '/teardown',
  reviews: 'https://www.google.com/search?q=Ascend+AI+Marketing+reviews',
}

const photo = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`

/** The main menu. `menu: 'services'` opens the services panel (every service, grouped by category). */
export const nav: { label: string; href: string; menu?: 'services' }[] = [
  { label: 'Services', href: '/services', menu: 'services' },
  { label: 'The lead system', href: '/hvac-lead-system' },
  { label: 'Pricing', href: '/hvac-lead-system#pricing' },
  { label: 'Our work', href: '/work' },
  { label: 'About', href: '/about' },
]

export const hero = {
  eyebrow: 'Ascend AI Marketing',
  heading: 'Book more HVAC jobs from the calls you <em>already get.</em>',
  body: 'We build your HVAC website and lead system. It answers every lead and follows up for you, so more jobs land on your calendar. You own all of it.',
  primary: 'Take the 60-second quiz',
  secondary: 'Book a 15-minute call',
  /** The hero video. Paste the YouTube (or Vimeo) link into `url` once it's uploaded. */
  video: {
    url: '',
    label: 'Watch the video',
    title: 'How Ascend AI Marketing works',
  },
  trust: [
    { icon: 'clock', text: 'Live in 72 hours.' },
    { icon: 'key', text: 'You own your site.' },
    { icon: 'users', text: 'Real people who answer.' },
  ] satisfies { icon: IconName; text: string }[],
}

/** Hero slider. `kind` picks how each slide is drawn. */
export type Slide =
  | { kind: 'photo'; src: string; alt: string; caption?: string }
  | { kind: 'textback' }
  | { kind: 'inbox' }
  | { kind: 'booked'; src: string; alt: string }

export const slides: Slide[] = [
  { kind: 'photo', src: photo('1791395534168-af200f472f93', 1000), alt: 'An HVAC technician and a homeowner look over a job on a phone', caption: 'Real people who answer.' },
  { kind: 'textback' },
  { kind: 'booked', src: photo('1792799888905-8696bd32a11a', 1000), alt: 'An HVAC technician services an outdoor unit' },
  { kind: 'inbox' },
  { kind: 'photo', src: photo('1758598497049-da3b63569529', 1000), alt: 'A contractor smiles while he takes a call' },
]

export const problem = {
  eyebrow: 'The problem',
  heading: "You're losing jobs you never knew you had.",
  statement: "You're on a job. The phone rings. You can't pick up. The homeowner doesn't leave a message. They call the next shop on Google.",
  turn: "It's not your work. It's your phone.",
  pains: [
    { icon: 'phone-missed', text: 'Calls go to voicemail while your crew is working.' },
    { icon: 'clock', text: 'Web leads sit for hours before anyone calls back.' },
    { icon: 'search', text: "Your website doesn't show up on Google or AI search. Or it shows up and doesn't get the call." },
    { icon: 'file', text: 'You paid an agency before. You got a monthly bill and a report no one reads.' },
  ] satisfies { icon: IconName; text: string }[],
  feel: "Your work is good. But you can't be on a roof and at the phone at the same time, and money slips away every week.",
  close: 'A good shop should not lose a job to a voicemail.',
}

export const results = {
  eyebrow: 'Our work',
  heading: 'Past clients.',
  link: 'See our work',
  items: [
    { tag: 'Local SEO and a custom website', num: '45', what: 'qualified leads in 60 days', quote: '"Within just two months, we saw incredible results."', who: 'Camille H., Etheric Networks', dark: false },
    { tag: 'Local SEO and Google Ads', num: '$100,000+', what: 'in revenue, and the #1 spot on Google Maps.', who: 'A fence and tree company', dark: true },
    { tag: 'Online giving system', num: '$750,000+', what: 'in online revenue.', who: 'Miracle Temple C.O.G.I.C.', dark: false },
  ],
}

export const about = {
  eyebrow: 'About us',
  heading: "We've seen good shops lose to slow callbacks. We built the fix.",
  body: [
    "We've watched good contractors lose jobs to slow callbacks. We've watched them lose their own websites to agencies. That's why Ascend AI Marketing exists.",
    'Our founder, Mark Johnson, has built websites for more than 20 years. He has built hundreds of them. Ascend AI Marketing started in 2019.',
  ],
  photo: { src: '/images/about/mark-at-desk.webp', alt: 'Mark Johnson, founder of Ascend AI Marketing, at work at his desk' },
  /** The about page hero. */
  portrait: { src: '/images/about/mark-arms-crossed.webp', alt: 'Mark Johnson, founder of Ascend AI Marketing, smiling with his arms crossed' },
  chips: [
    { icon: 'users', title: 'Real people', text: 'Not a ticket system. Not a call center.' },
    { icon: 'clock', title: 'Live in 72 hours', text: 'After we have everything we need.' },
  ] satisfies { icon: IconName; title: string; text: string }[],
}

export const steps = {
  eyebrow: 'How it works',
  heading: 'Three steps to a full schedule.',
  note: 'The 72 hours start once we have everything we need from you.',
  items: [
    { icon: 'clock', title: 'Take the 60-second quiz.', text: 'See what missed calls may cost you each month.' },
    { icon: 'cal', title: 'Book a 15-minute call.', text: 'We show you where leads leak out and how to fix it.' },
    { icon: 'zap', title: 'Go live in 72 hours.', text: 'Your site and lead system start catching calls.' },
  ] satisfies { icon: IconName; title: string; text: string }[],
  photo: { src: photo('1792799888905-8696bd32a11a', 1600), alt: 'An HVAC technician services an outdoor unit' },
}

export const inbox = [
  { initials: 'JR', title: 'AC not cooling', detail: 'Missed call · text sent', status: 'New', tone: 'new' },
  { initials: 'SM', title: 'Furnace tune-up', detail: 'Web form · booked Tue 9:00 AM', status: 'Booked', tone: 'done' },
  { initials: 'DK', title: 'Heat pump quote', detail: 'Follow-up sent by text and email', status: 'Nudged', tone: 'muted' },
  { initials: 'LP', title: 'Job done', detail: 'Review request sent', status: 'Review', tone: 'muted' },
] as const

export const included = {
  eyebrow: 'What you get',
  heading: 'An HVAC website and lead system that catches every lead.',
  items: [
    { icon: 'layout', title: 'A website built for HVAC', text: 'Fast on phones. Google and AI search can find your services. Every page pushes the call.' },
    { icon: 'file', title: 'Landing pages', text: 'Pages built to turn your best offers into calls.' },
    { icon: 'phone', title: 'A call tracking number', text: 'It forwards to your existing number, so you keep the number you have.' },
    { icon: 'phone-missed', title: 'Missed call text back', text: "If you can't answer, the homeowner gets a text in seconds. They stay with you." },
    { icon: 'bell', title: 'Lead alerts', text: 'You know the moment a new lead comes in.' },
    { icon: 'inbox', title: 'One inbox for every lead', text: 'Calls, texts and web forms land in one inbox.' },
    { icon: 'reply', title: 'Automatic follow-up', text: "Leads who don't book get a friendly nudge by text and email. They don't go cold." },
    { icon: 'cal', title: 'Online booking', text: "Homeowners can book a time online, even while you're on a job." },
    { icon: 'star', title: 'Review requests', text: 'After the job, customers get a simple link to leave a Google review.' },
    { icon: 'pin', title: 'Google Business Profile setup', text: 'Filled out right, so homeowners can find you on the map.' },
    { icon: 'server', title: 'Hosting and care', text: 'We host your site, update it, back it up and keep it secure.' },
  ] satisfies { icon: IconName; title: string; text: string }[],
  cta: 'Find out what missed calls cost you.',
}

export const success = {
  eyebrow: '30 days from now',
  heading: 'Picture your shop 30 days from now.',
  body: [
    'You finish a job and check your phone. Two calls came in while you worked. Both got a text back in seconds. You call one back, and the job is on your calendar by lunch.',
    'New reviews are coming in. Every lead sits in one place. Nothing slips through.',
  ],
  close: "You stopped wondering where the leads went. You're the shop that always picks up.",
  photo: { src: photo('1758598497049-da3b63569529', 1400), alt: 'A contractor smiles while he takes a call' },
  notes: [
    { icon: 'msg', title: 'Missed call text back', text: 'Sent in seconds' },
    { icon: 'cal', title: 'New job booked', text: 'On your calendar by lunch' },
    { icon: 'star', title: 'New review', text: 'From your last job' },
  ] satisfies { icon: IconName; title: string; text: string }[],
}

export const pricing = {
  eyebrow: 'Pricing',
  heading: 'Simple pricing.',
  intro: 'Your website, your lead system, hosting and care. One monthly price.',
  tag: 'Limited time',
  save: 'Save $1,200',
  was: '$698',
  now: '$598',
  term: 'a month for 12 months',
  includesTitle: 'Every plan includes',
  includes: [
    'Your website, with hosting and care',
    'Landing pages',
    'Google Business Profile setup',
    'A call tracking number that forwards to your number',
    'Missed call text back and lead alerts',
    'Lead follow-up by text and email',
    'Online booking',
    'Review requests',
    'One inbox for every lead, on GoHighLevel',
  ],
  planLink: 'See the full plan',
  own: { lead: 'You own everything:', text: 'your website, domain, Google profile, ad accounts and contact list. Need a change? Ask, and we handle it.' },
}

/** Standalone services. Each one gets its own page from the shared service template. */
export const services = {
  eyebrow: 'More services',
  heading: 'Want more calls coming in? <em>We do that too.</em>',
  intro: 'Each of these stands on its own. Get one by itself, or add it to your plan.',
  allLabel: 'View all services',
  allHref: '/services',
  items: [
    { icon: 'map', name: 'Local SEO', short: 'local SEO', text: 'Show up at the top of Google and AI search engines like ChatGPT.', href: '/hvac-local-seo' },
    { icon: 'search', name: 'Google Ads management', short: 'Google Ads', text: 'Ads that bring calls from people ready to book.', href: '/services/google-ads-hvac' },
    { icon: 'megaphone', name: 'Meta ads on Facebook and Instagram', short: 'Meta ads', text: 'Reach homeowners near you before they need you.', href: '/services/facebook-instagram-ads-hvac' },
    { icon: 'bot', name: 'Custom AI agents', short: 'custom AI agents', text: 'Custom AI agents built for any job in your shop.', href: '/services/ai-agents-hvac' },
    { icon: 'flow', name: 'Custom workflows', short: 'custom workflows', text: 'Automations built around how your shop really works.', href: '/services/automated-workflows-hvac' },
    { icon: 'code', name: 'Custom software', short: 'custom software', text: 'Tools like a CRM built just for your shop.', href: '/services/custom-software-hvac' },
  ] satisfies { icon: IconName; name: string; short: string; text: string; href: string }[],
}

export const nationwide = {
  eyebrow: 'Where we work',
  heading: 'Serving HVAC shops nationwide.',
  body: 'We build for HVAC shops in any city and any state. Every climate has its rush, and every rush brings missed calls. Wherever your shop is, the system works the same way.',
  climates: [
    { icon: 'sun', title: 'Long, hot summers in Texas and Arizona.', text: 'AC repair in July.' },
    { icon: 'snow', title: 'Hard winters in Ohio and Minnesota.', text: 'No-heat calls in January.' },
    { icon: 'drop', title: 'Sticky, humid air on the Gulf Coast.', text: 'Heat pumps, tune-ups and new installs all year.' },
  ] satisfies { icon: IconName; title: string; text: string }[],
}

export const faq = {
  eyebrow: 'FAQ',
  heading: 'Questions shop owners ask.',
  body: "Don't see yours? Book a quick call and ask us.",
  items: [
    { q: 'What do you need from me to start?', a: 'Access to your domain and Google profile, plus your logo and a few photos. We send a simple checklist for the rest.' },
    { q: 'How fast can my site go live?', a: 'Your site goes live 72 hours after we have everything we need.' },
    { q: 'Who owns the website?', a: 'You do. Your website, domain, Google profile, ad accounts and contact list are all in your name.' },
    { q: 'Do I keep my phone number?', a: 'Yes. We set up a call tracking number that forwards to your existing number.' },
    { q: 'What does the plan include?', a: 'Your website, hosting and care, and the full lead system, GoHighLevel included. Ads, local SEO, custom AI agents, custom workflows and custom software cost extra, on their own or with the plan.' },
    { q: 'What if I already have a website?', a: "If it's a WordPress site you want to keep, we can host and care for it. On any other platform, we build you a new site." },
  ],
}

export const finalCta = {
  eyebrow: 'The missed call quiz',
  heading: 'Find out what missed calls <em>cost you.</em>',
  body: "It takes 60 seconds. You'll get a dollar range, a call handling score and 3 fixes you can use today.",
  teardown: 'Or get a free video teardown of your website.',
}

/** Google reviews of Ascend AI Marketing, copied word for word from the Business Profile. */
export const reviewSummary = { rating: '5.0' }

export const reviews: { name: string; detail: string; text: string }[] = [
  {
    name: 'Camille H.',
    detail: 'Etheric Networks · SEO',
    text: "Before starting SEO work with Mark and Ascend AI Marketing, we hardly had any business leads coming through organic search. Within just two months, we saw incredible results - 45 qualified leads and has seen a sizeable increase in our website traffic! What's particularly impressive is that these have been our strongest months historically for business leads. Mark's clear communication and hands-on approach made the whole process seamless. I'm very pleased with how things have improved since we began working together, and I look forward to our continued partnership and the future growth we'll achieve with Mark and his team.",
  },
  {
    name: 'Alisha',
    detail: 'Catering business · Website',
    text: 'Before working with Ascend AI Marketing, most of our business came from referrals. Now our new website brings in 3-4 quality leads every week from Google searches. They took the time to understand our catering business and created a website that perfectly shows what makes us unique. The results have been amazing - our calendar is booked weeks in advance with exactly the type of clients we want to work with!',
  },
  {
    name: 'Paulette S.',
    detail: 'Childcare center · Website and Google Business',
    text: "Mark and his team at Ascend AI Marketing transformed our online presence completely. As a childcare center, we needed a website that would make parents feel confident and comfortable - and that's precisely what they delivered. The custom website they created is beautiful, easy to navigate, and really shows what makes our center special. They also helped us get set up properly on Google Business, which has made a huge difference in helping local families find us. We regularly get calls from Google from parents looking for childcare services. What really stands out is their attention to detail and how well they understood our needs. We couldn't be any happier with the results Ascend AI Marketing has helped us get.",
  },
  {
    name: 'Nicole S.',
    detail: 'The N Johnson Foundation · Logo design',
    text: 'I recently had the pleasure of working with Ascend AI Marketing for a new logo for my company, The N Johnson Foundation. Mark and his team did an awesome job designing my logo. Mark was super responsive, answering all my questions and guiding me with his expertise. In the end, they created a logo that I absolutely love. I would highly recommend these guys if you need a professional logo or any digital marketing services! I look forward to working with Mark and his team on other projects in the future!',
  },
]

export const footer = {
  columns: [
    { heading: 'The lead system', links: [{ label: 'What you get', href: '/hvac-lead-system#included' }, { label: 'Pricing', href: '/hvac-lead-system#pricing' }, { label: 'All services', href: '/services' }] },
    { heading: 'Company', links: [{ label: 'About', href: '/about' }, { label: 'Our work', href: '/work' }, { label: 'FAQ', href: '/#faq' }] },
    { heading: 'Start', links: [{ label: 'The quiz', href: '/missed-calls' }, { label: 'Book a call', href: '/book' }, { label: 'Video teardown', href: '/teardown' }] },
  ],
}
