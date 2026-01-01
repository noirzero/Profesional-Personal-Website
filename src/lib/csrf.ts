import Csrf from 'csrf'

const csrf = new Csrf()

export function generateToken(secret: string): string {
  return csrf.create(secret)
}

export function verifyToken(secret: string, token: string): boolean {
  return csrf.verify(secret, token)
}

// Generate a server-side secret (should be stored in session)
export function generateSecret(): string {
  return csrf.secretSync()
}
