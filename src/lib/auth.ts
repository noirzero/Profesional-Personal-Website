import { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from './prismadb'

// Build providers array conditionally so we can enable a safe, dev-only
// Credentials provider when `ADMIN_PASSWORD` is set. This makes it easy to
// test the admin UI locally without provisioning OAuth credentials.
const providers = [] as any[]

// GitHub provider (if configured)
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  )
}

// Dev-only credentials provider: enabled when ADMIN_PASSWORD is set and
// not running in production. This protects accidental exposure.
if (process.env.ADMIN_PASSWORD && process.env.NODE_ENV !== 'production') {
  providers.push(
    CredentialsProvider({
      id: 'dev-credentials',
      name: 'Dev Admin',
      credentials: {
        password: { label: 'Admin Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials || !credentials.password) return null
        // Simple equality check against the environment variable.
        // This provider is only enabled in non-production when ADMIN_PASSWORD
        // is present to make local testing feasible.
        if (credentials.password === process.env.ADMIN_PASSWORD) {
          return { id: 'dev-admin', name: 'Local Admin' }
        }
        return null
      }
    })
  )
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  }
}

export default authOptions
