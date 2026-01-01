// Server-side Sentry initialization for @sentry/nextjs
const Sentry = require('@sentry/nextjs')

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || '',
  tracesSampleRate: Number(process.env.SENTRY_TRACES_RATE || process.env.NEXT_PUBLIC_SENTRY_TRACES_RATE || 0) || 0,
  // You can add server-specific options here (e.g., environment, release)
})

module.exports = Sentry
