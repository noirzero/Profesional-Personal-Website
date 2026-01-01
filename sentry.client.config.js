// Client-side Sentry initialization for @sentry/nextjs
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN || '',
  tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_RATE || process.env.SENTRY_TRACES_RATE || 0) || 0,
  // adjust as needed for your project
})
