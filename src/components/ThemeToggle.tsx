"use client"

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'site_theme'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    return (localStorage.getItem(STORAGE_KEY) as 'light' | 'dark') ?? 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  function toggle() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={theme === 'dark'}
      aria-label="Toggle dark mode"
      className="px-2 py-1 border rounded text-sm bg-white dark:bg-slate-800 dark:text-slate-100"
    >
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}
