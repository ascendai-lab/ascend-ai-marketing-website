/**
 * The privacy policy, the terms and the consent line under every form. Drafted for Mark to review:
 * these are not from the approved copy, except the two SMS sections, which are Mark's A2P campaign
 * wording (privacy "Text messages (SMS)" and terms "Text message terms"). Keep those word for word.
 *
 * Only say what the site really does. The analytics and ad tags (GA4, Tag Manager, Meta Pixel) load
 * only when their IDs are set in the Studio (SEO & tracking), so the policy says "when we use them".
 */
export const PRIVACY_PATH = '/privacy'
export const TERMS_PATH = '/terms'
export const COOKIES_PATH = '/cookies'
export const CONTACT_EMAIL = 'hello@ascendaimarketing.com'

/** Under every form that asks for an email or a mobile number. Texts need the separate box below. */
export const consent = {
  text: 'By sending this, you agree that Ascend AI Marketing can contact you about your request by email and phone. We only text you if you tick the box above.',
  link: 'Privacy policy',
}

/**
 * The text message (A2P 10DLC) opt-in on every form with a phone number. Mark's approved wording.
 * The box is never ticked for the visitor and is optional: the form sends without it.
 */
export const smsConsent = {
  text: 'I agree to receive text messages from Ascend AI Marketing about my inquiry, appointments and account. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help.',
  privacy: 'Privacy Policy',
  terms: 'Terms',
  /** Shown when the box is ticked but the phone field is empty. */
  needsPhone: 'Enter your mobile number to get texts, or untick the box.',
}

export interface LegalSection {
  heading: string
  body: string[]
  /** A bulleted list shown after the paragraphs. */
  list?: string[]
  /** Paragraphs shown after the list. */
  after?: string[]
}

export interface LegalPage {
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}

export const privacy: LegalPage = {
  title: 'Privacy policy',
  updated: 'November 20, 2026',
  intro: 'This page explains what Ascend AI Marketing collects when you use this website or contact us, how we use it, who helps us handle it and the choices you have.',
  sections: [
    {
      heading: 'Who we are',
      body: [
        `Ascend AI Marketing, a business registered in New Jersey, runs this website, ascendaimarketing.com. When this policy says "we", "us" or "our", it means Ascend AI Marketing. If you have a question about your information, email us at ${CONTACT_EMAIL}.`,
      ],
    },
    {
      heading: 'What we collect',
      body: ['We collect information in three ways.'],
      list: [
        'What you give us. When you take the missed call quiz, request a teardown, ask for a call or book a time, we collect what you type in: your name, business name, email, website, your mobile number if you give it, your message and your quiz answers. When you book through our calendar, we also get the time you pick.',
        'What your browser sends. Like every website, our hosting receives basic technical details with each visit, such as your IP address, browser and device type, the page you asked for, the page that sent you here and the time. We also use your IP address for a short time to stop the same visitor from sending a form over and over.',
        'What cookies and similar tools record. If you accept cookies, our analytics and advertising tools record how you use the site, such as the pages you view and the buttons you click. The "Cookies, analytics and advertising" section below explains these.',
      ],
    },
    {
      heading: 'How we use it',
      body: ['We use your information to:'],
      list: [
        'send your quiz results or teardown, and set up and hold your call',
        'reply to your request and follow up about it by email, phone or text',
        'provide and manage our services if you become a client',
        'see which pages and ads bring people to the site, and improve the site',
        'keep the site and our forms safe from spam and abuse',
        'meet our legal and accounting duties',
      ],
      after: [
        'We do not sell your personal information for money, and we do not collect sensitive information such as health, financial account or government ID details.',
      ],
    },
    {
      heading: 'Who we share it with',
      body: [
        'We share your information only with the companies that help us run our business. They may use it only to provide their service to us. They include:',
      ],
      list: [
        'Website hosting: Netlify hosts this website. It handles every visit, which includes your IP address and the technical details above.',
        'Form handling and our CRM: when you send a form, it goes through our automation tool (n8n) into our customer relationship software, LeadLine and HighLevel (GoHighLevel), where we keep track of your request and follow up.',
        'Booking calendar: our booking calendar also runs on HighLevel. When you book a call, the details you enter go to HighLevel.',
        'Text messages: LeadLine and Twilio deliver our texts.',
        'Email: the email service we use to reply to you and send follow-ups.',
        'Analytics and advertising: Google (Google Analytics and Google Tag Manager) and Meta (the Meta Pixel), only if you accept cookies. See "Cookies, analytics and advertising" below.',
        'Videos: YouTube and Vimeo, when you play a video on the site.',
        'Website content: our content system (Sanity) stores the words and images on this site. It does not receive what you type into our forms.',
      ],
      after: [
        'We may also share information if the law requires it, to protect our rights or someone\'s safety, or as part of a sale or merger of our business. If that happens, this policy still applies to your information.',
      ],
    },
    {
      heading: 'Text messages (SMS)',
      body: [
        'If you agree to receive text messages from Ascend AI Marketing, we use your phone number to send messages about your inquiry, appointments and account. We send these texts through our messaging providers, LeadLine and Twilio.',
        'No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging opt-in data and consent are not shared with any third parties. This does not include the providers that deliver the texts for us.',
        'Reply STOP to any message to stop getting texts, or HELP for help.',
      ],
    },
    {
      heading: 'Cookies, analytics and advertising',
      body: [
        'We use analytics and advertising tools, such as Google Analytics, Google Tag Manager and the Meta Pixel, only after you click "Accept" on our cookie banner. If you click "Decline", or your browser sends a Global Privacy Control signal, they do not load. You can change your choice at any time with the "Cookie settings" link at the bottom of every page.',
        'When the Meta Pixel or similar ad tools run, some state laws may treat that as "sharing" your information for targeted advertising. Declining cookies or turning on Global Privacy Control opts you out of this.',
        'Our cookie policy lists every cookie and similar tool the site uses: ascendaimarketing.com/cookies.',
      ],
    },
    {
      heading: 'How long we keep it',
      body: [
        'We keep the details you send us for as long as we need them to handle your request, work with you as a client and keep our business records, then we delete them. Our hosting and analytics providers keep technical and visit data for the periods set by their own policies.',
        'You can ask us to delete your details at any time.',
      ],
    },
    {
      heading: 'How we protect it',
      body: [
        'Every page on this site loads over a secure, encrypted connection (HTTPS). We use trusted providers and limit who can see your details. No website or online service can be completely secure, but we work to protect your information.',
      ],
    },
    {
      heading: 'Your choices and rights',
      body: ['Wherever you live, you can:'],
      list: [
        'ask us what personal information we hold about you and get a copy of it',
        'ask us to correct it or delete it',
        'opt out of targeted advertising by declining cookies or using Global Privacy Control',
        'unsubscribe from our emails with the link in any email',
        'reply STOP to any text to stop getting texts',
      ],
      after: [
        "Residents of some states, such as New Jersey, California, Colorado, Connecticut, Virginia, Texas and others with privacy laws, have these rights by law, along with the right to limit how sensitive information is used. We honor them for everyone.",
        `To make a request, email ${CONTACT_EMAIL}. We will confirm we got it and answer within 45 days. We may ask you to confirm who you are first. You can also have an authorized agent ask for you, with your written permission. We will not charge you or treat you differently for using your rights.`,
        `If we turn down your request, you can appeal by replying to our answer or emailing ${CONTACT_EMAIL} with "Appeal" in the subject. We will answer your appeal within 60 days. If you are not happy with the result, you can contact your state attorney general.`,
      ],
    },
    {
      heading: 'Children',
      body: [
        'This website is for business owners. It is not meant for anyone under 18, and we do not knowingly collect information from children under 16. If you think a child has sent us information, email us and we will delete it.',
      ],
    },
    {
      heading: 'Links to other websites',
      body: [
        'Our site links to other websites, such as our social media pages and review sites. Their own privacy policies apply when you visit them.',
      ],
    },
    {
      heading: 'Changes to this policy',
      body: ['If we change this policy, we post the new version on this page and update the date at the top.'],
    },
    {
      heading: 'Contact us',
      body: [`Questions about this policy or your information? Email us at ${CONTACT_EMAIL}.`],
    },
  ],
}

export const terms: LegalPage = {
  title: 'Terms and conditions',
  updated: 'November 20, 2026',
  intro: 'These terms apply when you use ascendaimarketing.com. By using the site, you agree to them.',
  sections: [
    {
      heading: 'Using this website',
      body: [
        'You may use this site to learn about Ascend AI Marketing, take the missed call quiz, request a teardown and book a call. Please give us accurate details when you fill in a form, and only share information you are allowed to share.',
      ],
    },
    {
      heading: 'Our services',
      body: [
        'This website describes our services. It is not an offer or a contract. When you become a client, the proposal or agreement we both sign sets out the work, the price and the terms for that work. If that agreement and these terms disagree, the agreement wins.',
      ],
    },
    {
      heading: 'Quiz results, teardowns and estimates',
      body: [
        'The missed call quiz, teardowns and any numbers we show are estimates based on what you tell us and on typical results. They are not a promise of what your business will earn. Results depend on your market, your team and many other things.',
      ],
    },
    {
      heading: 'Text message terms',
      body: [
        'Program name: Ascend AI Marketing Updates.',
        'What you get: messages about your inquiry, appointment confirmations and reminders, and account updates.',
        'Message frequency varies. Message and data rates may apply.',
        `To stop, reply STOP at any time. You will get one message confirming you are unsubscribed. For help, reply HELP or email ${CONTACT_EMAIL}.`,
        'Carriers are not liable for delayed or undelivered messages.',
        'Our Privacy Policy explains how we handle your information: https://ascendaimarketing.com/privacy-policy',
      ],
    },
    {
      heading: 'Your consent to calls and texts',
      body: [
        'When you give us your phone number and agree to be contacted, you agree that Ascend AI Marketing may call or text you at that number about your request, including with automated tools. Agreeing is never a condition of buying anything from us. You can opt out at any time by replying STOP, or by telling us on a call or by email.',
      ],
    },
    {
      heading: 'Our content',
      body: [
        'The words, designs, logos, photos and videos on this site belong to Ascend AI Marketing or the people who license them to us. You may view and share our pages, but you may not copy, sell or reuse our content without our written permission.',
      ],
    },
    {
      heading: 'What you may not do',
      body: ['When you use this site, please do not:'],
      list: [
        'send spam, false details or someone else\'s information through our forms',
        'try to break into, overload or disrupt the site',
        'copy the site with automated tools or bots',
        'use the site for anything illegal',
      ],
    },
    {
      heading: 'Other websites and tools',
      body: [
        'Our site links to and uses tools from other companies, such as our booking calendar and video players. We do not control them, and their own terms apply.',
      ],
    },
    {
      heading: 'No guarantees',
      body: [
        'We work to keep this site accurate and running, but we provide it "as is". We do not promise that it will always be available, error free or up to date.',
      ],
    },
    {
      heading: 'Limits on our responsibility',
      body: [
        'As far as the law allows, Ascend AI Marketing is not responsible for any indirect or unexpected losses that come from using this site or relying on its content. Nothing in these terms limits a responsibility that the law does not allow us to limit.',
      ],
    },
    {
      heading: 'Your responsibility',
      body: [
        'If you misuse this site or break these terms, you agree to cover the costs and claims that Ascend AI Marketing faces because of it, as far as the law allows.',
      ],
    },
    {
      heading: 'Governing law',
      body: [
        'These terms are governed by the laws of the State of New Jersey, without regard to its conflict of law rules. Any dispute about this website or these terms will be handled in the state or federal courts located in New Jersey, unless the law where you live gives you the right to bring it elsewhere.',
      ],
    },
    {
      heading: 'Privacy',
      body: ['Our privacy policy and cookie policy explain how we handle your information. They are part of these terms.'],
    },
    {
      heading: 'General',
      body: [
        'If a court finds part of these terms unenforceable, the rest still applies. If we do not enforce a term right away, we can still enforce it later. These terms are the whole agreement between you and us about using this website.',
      ],
    },
    {
      heading: 'Changes to these terms',
      body: ['We may update these terms. When we do, we post the new version on this page and update the date at the top.'],
    },
    {
      heading: 'Contact us',
      body: [`Questions about these terms? Email us at ${CONTACT_EMAIL}.`],
    },
  ],
}

/** The banner shown before any analytics or ad tool loads. */
export const cookieBanner = {
  text: 'We use cookies for analytics and to measure our ads. They only load if you accept.',
  link: 'Cookie policy',
  accept: 'Accept',
  decline: 'Decline',
  settings: 'Cookie settings',
}

export const cookies: LegalPage = {
  title: 'Cookie policy',
  updated: 'November 20, 2026',
  intro: 'This page explains the cookies and similar tools ascendaimarketing.com uses, why, and how you control them.',
  sections: [
    {
      heading: 'What cookies are',
      body: [
        'Cookies are small text files a website saves in your browser. Similar tools, such as pixels, tags and browser storage, do the same kind of job. In this policy, "cookies" means all of them.',
      ],
    },
    {
      heading: 'Your choice comes first',
      body: [
        'Analytics and advertising cookies load only after you click "Accept" on our cookie banner. If you click "Decline", close the banner or your browser sends a Global Privacy Control signal, they stay off and the site works the same.',
        'You can change your mind at any time with the "Cookie settings" link at the bottom of every page. Your choice is saved in your browser, so it applies to this browser and device only.',
      ],
    },
    {
      heading: 'Needed to run the site',
      body: ['These do not track you and do not need your consent:'],
      list: [
        'Your cookie choice: saved in your browser so we do not ask again on every page.',
        'Quiz results: your quiz results are saved in your browser tab for the results page and are cleared when you close the tab.',
        'Security: our hosting provider (Netlify) may use technical data such as your IP address to deliver pages and protect the site. We do not use it to track you.',
      ],
    },
    {
      heading: 'Analytics (only if you accept)',
      body: ['These help us understand how people use the site so we can improve it:'],
      list: [
        'Google Analytics, directly or through Google Tag Manager: counts visits and records the pages you view, how you got here, and your general location and device. Cookies such as _ga and _ga_<ID> last up to 2 years. Google explains how it uses this data at policies.google.com/technologies/partner-sites, and you can block it everywhere with the opt-out add-on at tools.google.com/dlpage/gaoptout.',
      ],
    },
    {
      heading: 'Advertising (only if you accept)',
      body: ['These help us measure our ads and show them to people who have visited:'],
      list: [
        'Meta Pixel (Facebook and Instagram): tells Meta which pages you visit and which forms you send, so we can measure our ads and reach visitors again. Cookies such as _fbp last about 3 months. You can manage this in your Facebook ad settings.',
      ],
    },
    {
      heading: 'Videos and booking calendar',
      body: [
        'Some pages include tools from other companies. They load their own cookies only when you use them:',
      ],
      list: [
        'YouTube (privacy-enhanced mode) and Vimeo: when you play a video.',
        'HighLevel (GoHighLevel): when a page shows our booking calendar.',
      ],
      after: ['Their own cookie and privacy policies apply to these tools.'],
    },
    {
      heading: 'Managing cookies in your browser',
      body: [
        'Besides our cookie settings, you can block or delete cookies in your browser settings, and you can turn on Global Privacy Control in browsers and extensions that support it. Blocking all cookies may stop some features, such as the booking calendar, from working.',
      ],
    },
    {
      heading: 'Changes to this policy',
      body: ['If we add or change the tools we use, we update this page and the date at the top.'],
    },
    {
      heading: 'Contact us',
      body: [`Questions about cookies? Email us at ${CONTACT_EMAIL}.`],
    },
  ],
}
