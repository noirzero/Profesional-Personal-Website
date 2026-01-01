"use client"

import { SessionProvider } from 'next-auth/react'
import * as Sentry from '@sentry/react'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import CookieConsent from './CookieConsent'

// Initialize Sentry on the client when NEXT_PUBLIC_SENTRY_DSN is set.
function getConsent(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('analytics_consent') === 'true'
}

function initSentry() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
  if (!dsn) return
  if (!getConsent()) return

  try {
    Sentry.init({
      dsn,
      // small default sample rate for performance (can be tuned)
      tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_RATE) || 0.0
    })
  } catch (err) {
    // ignore Sentry init errors in dev
    // eslint-disable-next-line no-console
    console.warn('Sentry init failed', err)
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initSentry()

    function onConsentChange() {
      // Re-init or no-op; for simplicity we try to init Sentry again if consent granted
      if (getConsent()) initSentry()
    }

    window.addEventListener('analytics-consent-changed', onConsentChange)
    return () => window.removeEventListener('analytics-consent-changed', onConsentChange)
  }, [])

  // Register service worker on production-like hosts (not localhost)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1') return

    navigator.serviceWorker
      .register('/sw.js')
      .catch(() => {
        // ignore registration errors
      })
  }, [])

  // Google Analytics SPA pageview tracking: fire gtag config on pathname changes.
  // This relies on gtag script being injected in the head when NEXT_PUBLIC_GA_ID is set.
  const pathname = usePathname()
  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID
    if (!gaId) return
    if (!getConsent()) return
    // Ensure gtag exists
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      try {
        ;(window as any).gtag('config', gaId, { page_path: pathname })
      } catch (e) {
        // ignore
      }
    }
  }, [pathname])

  return (
    <SessionProvider>
      {children}
      <CookieConsent />
    </SessionProvider>
  )
}
