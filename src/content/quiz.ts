/**
 * The missed call quiz: approved copy (docs/copy/A-core.md, /missed-calls), used as written.
 * The quiz lives on its own page so every start and finish is easy to track.
 */
export const QUIZ_PATH = '/missed-calls'
export const RESULTS_PATH = '/missed-calls/results'
/** Where the quiz hands its answers to the results page. Only this browser tab can read it. */
export const RESULT_KEY = 'ascend-quiz-result'

export const QUESTIONS = [
  { q: 'In a busy week, how many calls come in?', a: ['Under 20', '20 to 50', '50 to 100', 'Over 100'] },
  { q: "When you can't pick up, what happens?", a: ['It goes to voicemail', 'Someone in the office answers', 'An answering service takes it', 'Not sure'] },
  { q: 'About how many calls do you miss?', a: ['Almost none', '1 in 10', '1 in 5', '1 in 3 or more'] },
  { q: "What's your average job worth?", a: ['Under $300', '$300 to $1,000', '$1,000 to $5,000', 'Over $5,000'] },
  { q: 'How fast do you call back a missed call or web lead?', a: ['Within 5 minutes', 'Within an hour', 'Same day', 'Next day or later'] },
]

/** One short line per grade, from the results page copy. */
export const GRADES: Record<string, string> = {
  A: 'You catch almost every call. A few small fixes can still add jobs.',
  B: 'You catch most calls. The leak is in follow-up speed.',
  C: 'Jobs are slipping through every week. A few changes can stop the leak.',
  D: 'The phone is costing you real money. The good news: you can fix this.',
  F: 'The phone is costing you real money. The good news: you can fix this.',
}

/** What the quiz saves for the results page. */
export interface QuizResult {
  first: string
  shop: string
  range: string
  grade: string
  fixes: [string, string][]
}

/** The quiz results page (/missed-calls/results). Not indexed. Approved copy, used as written. */
export const results = {
  scoreLine: 'Your call handling score:',
  book: 'Book a 15-minute call',
  meaning: "You do good work. It's frustrating to lose jobs you never knew you had. A good shop should not lose a job to a voicemail.",
  fixesTitle: 'Your 3 fixes',
  /** Mark's 60-second video. Paste the YouTube (or Vimeo) link here once it's recorded. */
  video: { url: '', title: 'A minute from Mark' },
  empathy: "We've watched good contractors lose jobs to slow callbacks. That's why Ascend AI Marketing exists.",
  authority: 'Mark Johnson has built websites for more than 20 years. He has built hundreds of them.',
  plan: { heading: "Here's how we fix it.", steps: ['Take the 60-second quiz. (Done.)', 'Book a 15-minute call.', 'Go live in 72 hours.'], after: 'The 72 hours start from the day we have everything we need.' },
  picture: 'Every missed call gets a text back in seconds. Every lead waits in one inbox. Jobs land on your calendar while you work.',
  calendarHeading: "Book 15 minutes. We'll show you how to get those jobs back.",
  pricing: { text: 'One simple monthly plan.', link: 'See pricing' },
  notReady: 'Not ready? Get a free video teardown of your website instead.',
  /** Shown when someone opens the page without taking the quiz (approved lines from the lead system page). */
  empty: { heading: 'See what missed calls cost your shop.', body: "It takes 60 seconds. You'll get a dollar range, a call handling score and 3 fixes." },
}

/** The booking confirmation page (/book/confirmed). Not indexed. Approved copy, used as written. */
export const confirmed = {
  headline: "You're booked.",
  subhead: 'Check your email for the time and the call details.',
  before: 'Take the 60-second quiz so we can skip the basics and get to your fixes.',
  plan: ['Take the 60-second quiz.', 'Book a 15-minute call. (Done.)', 'Go live in 72 hours.'],
  after: 'The 72 hours start from the day we have everything we need.',
  reschedule: 'Need a new time? Use the link in your confirmation email.',
  small: 'Want more before the call? Get a free video teardown of your website.',
}
