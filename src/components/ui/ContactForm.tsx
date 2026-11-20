import { useState, type SubmitEvent } from 'react'
import { smsConsent, PRIVACY_PATH, TERMS_PATH } from '@/content/legal'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface Props {
  successMessage?: string | null
}

/** Posts to /api/contact, which validates and forwards to LeadLine. */
export default function ContactForm({ successMessage }: Props) {
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('submitting')
    setErrorMsg('')

    const form = e.currentTarget
    const { smsConsent: smsBox, ...data } = Object.fromEntries(new FormData(form).entries())
    const phone = String(data.phone ?? '').trim()
    if (smsBox === 'yes' && !phone) {
      setErrorMsg(smsConsent.needsPhone)
      setState('error')
      return
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, smsConsent: smsBox === 'yes' && Boolean(phone), page: window.location.pathname }),
      })

      if (!res.ok) {
        const json: { error?: string } = await res.json().catch(() => ({}))
        throw new Error(json.error ?? 'Something went wrong. Please try again.')
      }

      setState('success')
      form.reset()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="contact-form__success" role="status">
        <p>{successMessage || "Thanks! We'll get back to you within one business day."}</p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate={false}>
      <div className="contact-form__row">
        <Field label="Name" name="name" type="text" autoComplete="name" required />
        <Field label="Email" name="email" type="email" autoComplete="email" required />
      </div>
      <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
      <div className="sms-consent">
        <label className="sms-consent__label">
          <input type="checkbox" name="smsConsent" value="yes" />
          <span>
            {smsConsent.text} <a href={PRIVACY_PATH}>{smsConsent.privacy}</a> · <a href={TERMS_PATH}>{smsConsent.terms}</a>
          </span>
        </label>
      </div>
      <div className="contact-form__field">
        <label htmlFor="cf-message">Message *</label>
        <textarea id="cf-message" name="message" required minLength={10} rows={5} />
      </div>

      {/* Honeypot: hidden from people, bots fill it in. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state === 'error' && (
        <p className="contact-form__error" role="alert">
          {errorMsg}
        </p>
      )}

      <button type="submit" className="btn btn--primary" disabled={state === 'submitting'}>
        {state === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  type,
  required,
  autoComplete,
}: {
  label: string
  name: string
  type: string
  required?: boolean
  autoComplete?: string
}) {
  return (
    <div className="contact-form__field">
      <label htmlFor={`cf-${name}`}>
        {label}
        {required && ' *'}
      </label>
      <input id={`cf-${name}`} name={name} type={type} required={required} autoComplete={autoComplete} />
    </div>
  )
}
