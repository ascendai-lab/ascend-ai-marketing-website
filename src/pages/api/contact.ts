import type { APIRoute } from 'astro'
import { z } from 'zod'

/* ── Validation Schema ────────────────────────────────────────────────────── */

const ContactSchema = z.object({
  name:    z.string().min(2,  'Name must be at least 2 characters'),
  email:   z.string().email('Please enter a valid email address'),
  phone:   z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  page:    z.string().max(200).optional(),
  // Honeypot — real people never see or fill this field.
  website: z.string().max(0).optional(),
})

/* ── Rate Limit (simple in-memory) ───────────────────────────────────────── */
// For production, replace with Netlify Edge rate limiting or Upstash Redis.
// Allows a few sends per visitor per minute, so a retry or a typo fix still goes through.
const submissions = new Map<string, number[]>()
const RATE_WINDOW_MS = 60_000
const RATE_MAX = 3

function isRateLimited(ip: string | null): boolean {
  if (!ip) return false // Without a visitor address, don't lump everyone into one bucket.
  const now = Date.now()
  const recent = (submissions.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  if (recent.length >= RATE_MAX) return true
  recent.push(now)
  submissions.set(ip, recent)
  return false
}

/* ── Handler ─────────────────────────────────────────────────────────────── */

export const POST: APIRoute = async ({ request, site }) => {
  // Rate limit
  const ip =
    request.headers.get('x-nf-client-connection-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    null
  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: 'Too many submissions. Please wait a minute and try again.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Parse body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Validate
  const result = ContactSchema.safeParse(body)
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return new Response(
      JSON.stringify({ error: Object.values(errors).flat()[0] ?? 'Please check the form and try again.', fields: errors }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { name, email, phone, message, page } = result.data

  // Build n8n payload
  const payload = {
    name,
    email,
    phone:     phone ?? '',
    message,
    source:    'website-contact-form',
    timestamp: new Date().toISOString(),
    siteUrl:   site?.href ?? request.headers.get('origin') ?? '',
    page:      page ?? '',
  }

  // Send to n8n. Awaited: serverless functions can stop as soon as we respond,
  // which would silently drop a fire-and-forget request (and the lead).
  const webhookUrl = import.meta.env.N8N_CONTACT_WEBHOOK_URL
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
        signal:  AbortSignal.timeout(8000),
      })
      if (!res.ok) throw new Error(`n8n webhook returned ${res.status}`)
    } catch (err) {
      console.error('[contact] n8n webhook error:', err)
      return new Response(
        JSON.stringify({ error: 'We could not send your message. Please call or email us instead.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      )
    }
  } else {
    console.warn('[contact] N8N_CONTACT_WEBHOOK_URL is not set; submission was not forwarded.')
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}

// Block all other methods
export const GET:  APIRoute = () => new Response('Method Not Allowed', { status: 405 })
export const PUT:  APIRoute = () => new Response('Method Not Allowed', { status: 405 })
