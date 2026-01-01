"use client"

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'analytics_consent'

export default function CookieConsent() {
  const [consent, setConsent] = useState<string | null>(null)

  useEffect(() => {
    const existing = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    setConsent(existing)
  }, [])

  // allow other UI (footer) to reopen the consent dialog
  useEffect(() => {
    function openHandler() {
      setConsent(null)
    }
    window.addEventListener('open-analytics-consent', openHandler)
    return () => window.removeEventListener('open-analytics-consent', openHandler)
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'true')
    setConsent('true')
    // notify other parts of the app
    window.dispatchEvent(new Event('analytics-consent-changed'))
  }

  function reject() {
    localStorage.setItem(STORAGE_KEY, 'false')
    setConsent('false')
    window.dispatchEvent(new Event('analytics-consent-changed'))
  }

  // Already decided
  if (consent === 'true' || consent === 'false') return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 z-50 bg-white border p-4 rounded shadow-md max-w-xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <p className="text-sm text-slate-800">We use analytics and error reporting to improve the site. Do you consent to anonymous usage tracking?</p>
          <div className="mt-2 flex gap-2">
            <button onClick={accept} className="px-3 py-1 bg-blue-600 text-white rounded">Accept</button>
            <button onClick={reject} className="px-3 py-1 border rounded">Reject</button>
          </div>
        </div>
      </div>
    </div>
  )
}
