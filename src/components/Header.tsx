'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header role="banner" className="border-b bg-white/60 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold hover:text-slate-600 transition-colors">Your Name</Link>
        <nav role="navigation" aria-label="Primary" className="flex items-center gap-4 text-sm">
          <div className="space-x-4 hidden sm:inline">
            <Link href="/about" className="hover:underline transition-colors">About</Link>
            <Link href="/portfolio" className="hover:underline transition-colors">Portfolio</Link>
            <Link href="/blog" className="hover:underline transition-colors">Blog</Link>
            <Link href="/contact" className="hover:underline transition-colors">Contact</Link>
            <Link href="/admin" className="hover:underline transition-colors">Admin</Link>
          </div>

          {/* Auth controls */}
          {session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-700">{session.user.name ?? session.user.email}</span>
              <ThemeToggle />
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-3 py-1 bg-gray-100 border rounded text-sm hover:bg-gray-200"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/signin" className="hover:underline transition-colors">Sign in</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
