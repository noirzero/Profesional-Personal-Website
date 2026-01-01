import { NextResponse } from 'next/server'
import { generateToken, generateSecret } from '@/lib/csrf'

export async function GET() {
  try {
    // Generate a secret and token
    const secret = generateSecret()
    const token = generateToken(secret)
    
    // Store secret in response header (will be sent with cookies)
    const response = NextResponse.json({ token })
    
    // Store secret in httpOnly cookie for security
    response.cookies.set('csrf-secret', secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    })
    
    return response
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('CSRF token generation error:', err)
    return NextResponse.json({ error: 'Failed to generate CSRF token' }, { status: 500 })
  }
}
