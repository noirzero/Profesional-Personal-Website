'use client'

import { useState, useEffect } from 'react'

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [csrfToken, setCsrfToken] = useState<string>('')

  // Fetch CSRF token on component mount
  useEffect(() => {
    async function fetchCsrfToken() {
      try {
        const res = await fetch('/api/csrf')
        const data = await res.json()
        if (data.token) {
          setCsrfToken(data.token)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch CSRF token:', err)
      }
    }
    fetchCsrfToken()
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = new FormData(e.target as HTMLFormElement)
    const body = Object.fromEntries(form.entries())
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (res.ok) {
        setStatus('sent')
        ;(e.target as HTMLFormElement).reset()
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <section className="py-12">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <p className="text-slate-600 mb-6">Get in touch with me. I&apos;ll get back to you as soon as possible.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          {/* CSRF token field */}
          <input type="hidden" name="csrf" value={csrfToken} />
          {/* Honeypot field to catch bots */}
          <input type="hidden" name="hp" value="" />
          <div>
            <label htmlFor="contact-name" className="sr-only">Your name</label>
            <input
              id="contact-name"
              name="name"
              placeholder="Your name"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="sr-only">Your email</label>
            <input
              id="contact-email"
              name="email"
              placeholder="Your email"
              type="email"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="sr-only">Message</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Message"
              className="w-full border rounded px-3 py-2 h-28"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {status === 'sending' ? 'Sending...' : 'Send'}
            </button>
            {status === 'sent' && (
              <div role="status" aria-live="polite" className="mt-3 text-sm text-green-600">✓ Message sent! Thank you for contacting me.</div>
            )}
            {status === 'error' && (
              <div role="status" aria-live="assertive" className="mt-3 text-sm text-red-600">✗ Error sending message. Please try again.</div>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
