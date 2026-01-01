'use client'

export default function Footer() {
  return (
    <footer role="contentinfo" className="border-t mt-12 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-slate-700 flex items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Your Name. Built with Next.js.</p>
        <div>
          <button
            aria-label="Open cookie settings"
            onClick={() => window.dispatchEvent(new Event('open-analytics-consent'))}
            className="text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
          >
            Cookie settings
          </button>
        </div>
      </div>
    </footer>
  )
}
