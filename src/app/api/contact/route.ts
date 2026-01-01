import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import sendgrid from '@sendgrid/mail'
import prisma from '@/lib/prismadb'
import { verifyToken } from '@/lib/csrf'

// Simple in-memory rate limiter (per-IP). For production use an external store (Redis).
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 10 // max requests per window
const rateMap: Map<string, { count: number; firstSeen: number }> = new Map()

const ContactSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email(),
  message: z.string().min(5).max(5000),
  csrf: z.string().optional(),
  hp: z.string().optional()
})

function getIp(req: Request) {
  // Try common headers first (behind proxies), fallback to unknown
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real
  return 'unknown'
}

async function sendViaSendGrid({ name, email, message }: { name?: string; email: string; message: string }) {
  const key = process.env.SENDGRID_API_KEY
  if (!key) throw new Error('SendGrid key not configured')
  sendgrid.setApiKey(key)
  const to = process.env.CONTACT_EMAIL || 'you@example.com'
  const from = process.env.FROM_EMAIL || 'no-reply@example.com'
  const subject = `Contact form: ${name ?? 'No name'}`
  const text = `From: ${name ?? 'No name'} <${email}>\n\n${message}`

  await sendgrid.send({
    to,
    from,
    subject,
    text
  })
}

export async function POST(req: Request) {
  try {
    const ip = getIp(req)

    // Rate limiting (in-memory)
    const now = Date.now()
    const entry = rateMap.get(ip)
    if (entry) {
      if (now - entry.firstSeen > RATE_LIMIT_WINDOW_MS) {
        // reset window
        rateMap.set(ip, { count: 1, firstSeen: now })
      } else {
        if (entry.count >= RATE_LIMIT_MAX) {
          return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
        }
        entry.count += 1
        rateMap.set(ip, entry)
      }
    } else {
      rateMap.set(ip, { count: 1, firstSeen: now })
    }

    const data = await req.json()

    // Validate and sanitize input
    const parsed = ContactSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const { name, email, message, csrf, hp } = parsed.data

    // CSRF token verification
    const cookieStore = await cookies()
    const csrfSecret = cookieStore.get('csrf-secret')?.value
    if (!csrfSecret || !csrf || !verifyToken(csrfSecret, csrf)) {
      return NextResponse.json({ error: 'Invalid security token' }, { status: 403 })
    }

    // Honeypot check
    if (hp && hp.length > 0) {
      // Likely bot
      return NextResponse.json({ ok: true, note: 'ignored' })
    }

    // Always persist message to DB first
    try {
      await prisma.message.create({ data: { name: name ?? null, email, message, ip } })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('DB save error:', e)
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }

    // If SendGrid configured, try to send email (non-blocking)
    if (process.env.SENDGRID_API_KEY) {
      try {
        await sendViaSendGrid({ name, email, message })
      } catch (err) {
        // Log but don't fail the response; message already persisted
        // eslint-disable-next-line no-console
        console.error('SendGrid error:', err)
      }
    } else {
      // Dev fallback: log to server console
      // eslint-disable-next-line no-console
      console.log('CONTACT (DEV):', { name, email, message })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Contact error:', err)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
