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
export const CONTACT_EMAIL = 'hello@ascendaimarketing.com'

/** Under every form that asks for an email or a mobile number. */
export const consent = {
  text: 'By sending this, you agree that Ascend AI Marketing can contact you about your request by email, phone and text. Message and data rates may apply. Reply STOP to opt out.',
  link: 'Privacy policy',
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
        `Ascend AI Marketing runs this website, ascendaimarketing.com. When this policy says "we", "us" or "our", it means Ascend AI Marketing. If you have a question about your information, email us at ${CONTACT_EMAIL}.`,
      ],
    },
    {
      heading: 'What we collect',
      body: ['We collect information in three ways.'],
      list: [
        'What you give us. When you take the missed call quiz, request a teardown, ask for a call or book a time, we collect what you type in: your name, business name, email, website, your mobile number if you give it, your message and your quiz answers. When you book through our calendar, we also get the time you pick.',
        'What your browser sends. Like every website, our hosting receives basic technical details with each visit, such as your IP address, browser and device type, the page you asked for, the page that sent you here and the time. We also use your IP address for a short time to stop the same visitor from sending a form over and over.',
        'What cookies and similar tools record. When we use analytics or advertising tools, they record how you use the site, such as the pages you view and the buttons you click. The "Cookies and similar tools" section below explains these.',
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
      after: ['We do not sell your personal information.'],
    },
    {
      heading: 'Who we share it with',
      body: [
        'We share your information only with the companies that help us run our business. They may use it only to provide their service to us. They include:',
      ],
      list: [
        'Website hosting: Netlify hosts this website. It handles every visit, which includes your IP address and the technical details above.',
        'Form handling and our CRM: when you send a form, it goes through our automation tool (n8n) into our customer relationship software, where we keep track of your request.',
        'Booking calendar: our booking calendar runs on HighLevel (GoHighLevel). When you book a call, the details you enter go to HighLevel.',
        'Text messages: LeadLine and Twilio deliver our texts.',
        'Email: the email service we use to reply to you and send follow-ups.',
        'Analytics and advertising: Google (Google Analytics and Google Tag Manager) and Meta (the Meta Pixel), when we use them. See "Cookies and similar tools" below.',
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
      heading: 'Cookies and similar tools',
      body: [
        'Cookies are small files a website saves in your browser. Here is what this site uses.',
      ],
      list: [
        'Analytics: when we use Google Analytics, directly or through Google Tag Manager, it sets cookies to count visits and see how people use the site. Google processes this data for us. You can block it with Google\'s opt-out add-on at tools.google.com/dlpage/gaoptout.',
        'Advertising: when we use the Meta Pixel, it tells Meta that you visited so we can measure our Facebook and Instagram ads and show ads to people who have visited. You can change this in your Facebook ad settings.',
        'Videos: our YouTube videos use YouTube\'s privacy-enhanced mode. A video from YouTube or Vimeo loads, and may set its own cookies, only when you play it.',
        'Booking calendar: when a page shows our booking calendar, HighLevel may set its own cookies to run it.',
        'Quiz results: your quiz results are saved in your browser tab for the results page and are cleared when you close the tab.',
      ],
      after: [
        'You can block or delete cookies in your browser settings. The site still works without them. Our site does not currently respond to "Do Not Track" signals from browsers.',
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
      body: ['You can:'],
      list: [
        'ask us what personal information we hold about you',
        'ask us to correct it or delete it',
        'unsubscribe from our emails with the link in any email',
        'reply STOP to any text to stop getting texts',
        'block or delete cookies in your browser',
      ],
      after: [
        `Depending on where you live, such as California, you may have more rights under your state's privacy law. To make a request, email ${CONTACT_EMAIL}. We may ask you to confirm who you are before we act on it, and we will not treat you differently for using your rights.`,
      ],
    },
    {
      heading: 'Children',
      body: [
        'This website is for business owners. It is not meant for children under 13, and we do not knowingly collect information from them. If you think a child has sent us information, email us and we will delete it.',
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
      heading: 'Changes to these terms',
      body: ['We may update these terms. When we do, we post the new version on this page and update the date at the top.'],
    },
    {
      heading: 'Contact us',
      body: [`Questions about these terms? Email us at ${CONTACT_EMAIL}.`],
    },
  ],
}
