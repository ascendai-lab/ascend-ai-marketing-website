import { defineMiddleware } from 'astro:middleware'
import { DRAFT_MODE_COOKIE, isValidDraftModeCookie } from '@cms/lib/draftMode'
import { loadQuery } from '@cms/lib/load'
import { resolveLink } from '@cms/lib/links'
import { redirectQuery } from '@cms/queries'

/**
 * Published pages are cached on Netlify's CDN for a minute, then refreshed in
 * the background, so the site stays fast without hammering the Sanity API.
 * Draft-mode responses are never cached.
 */
const CDN_CACHE = 'public, durable, s-maxage=60, stale-while-revalidate=604800'

/**
 * Content Security Policy for public pages: the browser only loads scripts, frames and data from the
 * places listed here, so a script injected from anywhere else won't run. Studio (/studio) and draft
 * mode are left out because the Sanity editor needs far more. Inline scripts stay allowed: Astro's
 * islands, JSON-LD and the GA / pixel snippets are inline. If a new embed or tracker stops working,
 * add its domain here.
 */
// The booking calendar (GoHighLevel) can live on its own domain, so its origin is allowed as a frame too.
const calendarOrigin = (() => {
  try { return new URL(import.meta.env.PUBLIC_GHL_CALENDAR_URL ?? '').origin } catch { return '' }
})()

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.google-analytics.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.google-analytics.com https://*.googletagmanager.com https://www.facebook.com https://*.googleapis.com https://*.gstatic.com https://*.googleusercontent.com https://i.ytimg.com https://*.vimeocdn.com https://images.unsplash.com",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://www.facebook.com https://connect.facebook.net",
  `frame-src https://www.google.com https://maps.google.com https://www.youtube-nocookie.com https://www.youtube.com https://player.vimeo.com https://www.googletagmanager.com https://api.leadconnectorhq.com https://link.msgsndr.com ${calendarOrigin}`.trim(),
  "media-src 'self' https://cdn.sanity.io",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Keep in step with netlify.toml: lets Sanity's Presentation tool show the site in its iframe.
  "frame-ancestors 'self' https://*.sanity.studio https://sanity.studio",
  'upgrade-insecure-requests',
].join('; ')

/**
 * A stricter policy, sent as Report-Only for now: it blocks nothing, the browser only reports what it
 * would have blocked to /api/csp-report. It drops 'unsafe-inline' for scripts and allows each inline
 * script on the page by its hash instead, so an injected inline script would no longer run. Once the
 * reports are quiet for a couple of weeks it can replace the script-src above.
 */
const REPORT_ENDPOINT = '/api/csp-report'
const strictPolicy = (hashes: string[]) =>
  CSP.replace(
    /script-src [^;]+/,
    `script-src 'self' ${hashes.join(' ')} 'report-sample' https://www.googletagmanager.com https://*.google-analytics.com https://connect.facebook.net`,
  )
    // Browsers ignore these two in a report-only policy and warn about them, so they're left out here.
    .replace(/; frame-ancestors [^;]+/, '')
    .replace('; upgrade-insecure-requests', '') + `; report-uri ${REPORT_ENDPOINT}; report-to csp`

// Inline <script> blocks (no src). JSON-LD is data, not code, so it needs no hash.
const INLINE_SCRIPT = /<script\b(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return `'sha256-${btoa(String.fromCharCode(...new Uint8Array(digest)))}'`
}

/** Adds the report-only policy, with a hash for each inline script in the page. Never breaks the page. */
async function withReportOnlyPolicy(response: Response): Promise<Response> {
  try {
    const html = await response.clone().text()
    const hashes = new Set<string>()
    for (const [, attrs, body] of html.matchAll(INLINE_SCRIPT)) {
      if (/type\s*=\s*["']?application\/(ld\+)?json/i.test(attrs) || !body) continue
      hashes.add(await sha256(body))
    }
    const headers = new Headers(response.headers)
    headers.set('Content-Security-Policy-Report-Only', strictPolicy([...hashes]))
    headers.set('Reporting-Endpoints', `csp="${REPORT_ENDPOINT}"`)
    return new Response(html, { status: response.status, statusText: response.statusText, headers })
  } catch {
    return response
  }
}

const skipPrefixes = ['/studio', '/api/', '/_astro/', '/_image']

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url
  const skip = skipPrefixes.some((prefix) => pathname.startsWith(prefix))

  context.locals.draftMode = skip
    ? false
    : await isValidDraftModeCookie(context.cookies.get(DRAFT_MODE_COOKIE)?.value)

  const response = await next()
  if (skip) return response

  // Unknown URL? Check the CMS Redirects list before showing the 404.
  if (response.status === 404) {
    const trimmed = pathname.replace(/\/+$/, '') || '/'
    const found = await loadQuery(false, redirectQuery, { paths: [trimmed, `${trimmed}/`] }).catch(() => null)
    const target = resolveLink(found?.destination)
    if (found && target) {
      return new Response(null, {
        status: found.permanent === false ? 302 : 301,
        headers: { Location: target.href, 'Cache-Control': 'public, max-age=300' },
      })
    }
  }

  try {
    response.headers.set('Netlify-Vary', `cookie=${DRAFT_MODE_COOKIE}`)
    const isHtml = response.headers.get('content-type')?.includes('text/html')
    if (isHtml && !context.locals.draftMode) response.headers.set('Content-Security-Policy', CSP)
    if (context.locals.draftMode) {
      response.headers.set('Cache-Control', 'private, no-store')
    } else if (response.status === 200 && isHtml) {
      response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
      response.headers.set('Netlify-CDN-Cache-Control', CDN_CACHE)
    }
  } catch {
    // Some responses (e.g. redirects) have immutable headers. Nothing to add there.
  }

  const isHtml = response.headers.get('content-type')?.includes('text/html')
  return isHtml && !context.locals.draftMode && (response.status === 200 || response.status === 404) ? withReportOnlyPolicy(response) : response
})
