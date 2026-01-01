import SignInForm from '@/components/SignInForm'
import { getProviders } from 'next-auth/react'

export const metadata = {
  title: 'Sign in'
}

export default async function SignInPage() {
  const enableDev = Boolean(process.env.ADMIN_PASSWORD && process.env.NODE_ENV !== 'production')

  // Try to fetch configured providers server-side. In some build environments
  // `getProviders()` may attempt an HTTP fetch and fail (missing
  // NEXTAUTH_URL). Fall back to environment-based detection so the page
  // still renders in CI/build environments.
  let providers: { id: string; name?: string }[] = []
  try {
    const rawProviders = await getProviders()
    if (rawProviders) {
      providers = Object.values(rawProviders).map((p) => ({ id: p.id, name: p.name }))
    }
  } catch (err) {
    // Fallback: infer from environment variables
    if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) providers.push({ id: 'github', name: 'GitHub' })
    if (process.env.ADMIN_PASSWORD && process.env.NODE_ENV !== 'production') providers.unshift({ id: 'dev-credentials', name: 'Dev Admin' })
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      {/* providers is serializable and will be passed to the client component */}
      <SignInForm enableDev={enableDev} providers={providers} />
    </main>
  )
}
