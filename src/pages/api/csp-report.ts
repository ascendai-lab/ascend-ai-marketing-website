import type { APIRoute } from 'astro'
import { z } from 'zod'

/**
 * Receives Content Security Policy violation reports from the report-only policy (see middleware.ts)
 * and writes a one-line summary to the function log (Netlify → Logs → Functions). Nothing is stored.
 * Accepts both the older report-uri format and the Reporting API batch format.
 */
const Legacy = z.object({
  'csp-report': z.object({
    'document-uri': z.string().optional(),
    'violated-directive': z.string().optional(),
    'effective-directive': z.string().optional(),
    'blocked-uri': z.string().optional(),
    'script-sample': z.string().optional(),
    'source-file': z.string().optional(),
    'line-number': z.number().optional(),
  }),
})
const Batch = z.array(
  z.object({
    type: z.string(),
    body: z.object({
      documentURL: z.string().optional(),
      effectiveDirective: z.string().optional(),
      blockedURL: z.string().optional(),
      sample: z.string().optional(),
      sourceFile: z.string().optional(),
      lineNumber: z.number().optional(),
    }),
  }),
)

const short = (value: string | undefined, max = 120) => (value ?? '').slice(0, max)

export const POST: APIRoute = async ({ request }) => {
  const text = await request.text().catch(() => '')
  if (text.length > 64_000) return new Response(null, { status: 413 })
  let json: unknown
  try { json = JSON.parse(text) } catch { return new Response(null, { status: 400 }) }

  const lines: string[] = []
  const legacy = Legacy.safeParse(json)
  if (legacy.success) {
    const r = legacy.data['csp-report']
    lines.push([r['document-uri'], r['effective-directive'] ?? r['violated-directive'], r['blocked-uri'], r['source-file'] && `${r['source-file']}:${r['line-number'] ?? ''}`, r['script-sample']].map((v) => short(v)).join(' | '))
  }
  const batch = Batch.safeParse(json)
  if (batch.success) {
    for (const { type, body } of batch.data.slice(0, 20)) {
      if (type !== 'csp-violation') continue
      lines.push([body.documentURL, body.effectiveDirective, body.blockedURL, body.sourceFile && `${body.sourceFile}:${body.lineNumber ?? ''}`, body.sample].map((v) => short(v)).join(' | '))
    }
  }
  for (const line of lines) console.warn(`[csp-report-only] ${line}`)
  return new Response(null, { status: 204 })
}
