/**
 * The privacy policy and the consent line under every form. Drafted for Mark to review: these are
 * not from the approved copy. The SMS part follows the usual A2P 10DLC wording.
 */
export const PRIVACY_PATH = '/privacy'

/** Under every form that asks for an email or a mobile number. */
export const consent = {
  text: 'By sending this, you agree that Ascend AI Marketing can contact you about your request by email, phone and text. Message and data rates may apply. Reply STOP to opt out.',
  link: 'Privacy policy',
}

export const privacy = {
  title: 'Privacy policy',
  updated: 'November 20, 2026',
  intro: 'This page explains what Ascend AI Marketing collects when you use this website, what we do with it and the choices you have.',
  sections: [
    {
      heading: 'What we collect',
      body: [
        'When you take the missed call quiz, request a teardown or ask for a call, we collect what you type in: your name, shop name, email, website and, if you give it, your mobile number. We also keep your quiz answers.',
        'Like most websites, we collect basic visit data, such as the pages you view and the device and browser you use. We use cookies and similar tools for this.',
      ],
    },
    {
      heading: 'How we use it',
      body: [
        'We use your details to send your results or teardown, to set up and hold your call, and to follow up about your request. We use visit data to see which pages help and to improve the site.',
        'We do not sell your personal information.',
      ],
    },
    {
      heading: 'Who we share it with',
      body: [
        'We share details only with the services that help us run our business, such as our CRM, email and text tools, scheduling and website hosting. They may use them only to provide those services to us.',
        'We may also share information when the law requires it.',
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
      heading: 'How long we keep it',
      body: ['We keep your details for as long as we need them for your request and our business records, then delete them.'],
    },
    {
      heading: 'Your choices',
      body: ['You can ask us to show you, correct or delete the personal information we hold about you. You can unsubscribe from our emails with the link in any email, and reply STOP to stop texts.'],
    },
    {
      heading: 'Changes',
      body: ['If we change this policy, we update the date at the top of this page.'],
    },
  ],
}
