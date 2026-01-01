"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Provider = { id: string; name?: string }
type Props = {
  enableDev: boolean
  providers: Provider[]
}

export default function SignInForm({ enableDev, providers }: Props) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDevSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('dev-credentials', { password, redirect: false })
    if (res?.ok) {
      router.push('/admin')
    } else {
      setLoading(false)
      alert('Sign in failed — check your password')
    }
  }

  function handleProviderSignIn(providerId: string) {
    void signIn(providerId, { callbackUrl: '/admin' })
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Sign in</h2>

      {enableDev && (
        <form onSubmit={handleDevSignIn} className="mb-4">
          <label className="block mb-2">Dev admin password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Enter local admin password"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in (dev)'}
          </button>
        </form>
      )}

      {providers.length > 0 && (
        <div>
          <p className="mb-2">Or sign in with:</p>
          <div className="flex gap-2">
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => handleProviderSignIn(p.id)}
                className="px-4 py-2 bg-gray-800 text-white rounded"
              >
                {p.name || p.id}
              </button>
            ))}
          </div>
        </div>
      )}

      {!enableDev && providers.length === 0 && (
        <p className="text-sm text-gray-600">No sign-in methods are currently configured. See `.env.example`.</p>
      )}
    </div>
  )
}
