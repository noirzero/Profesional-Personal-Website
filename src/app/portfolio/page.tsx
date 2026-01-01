import type { Metadata } from 'next'
import { projects } from '@/data/projects'

export const metadata: Metadata = {
  title: 'Portfolio — Your Name',
  description: 'Selected projects.'
}

export default function Portfolio() {
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Portfolio</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((p) => (
            <article key={p.id} className="border rounded p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-slate-600 mb-3">{p.description}</p>
              <p className="text-xs text-slate-500 mb-3">{p.tech.join(' • ')}</p>
              {p.url && p.url !== '#' && (
                <a href={p.url} className="text-sm text-blue-600 hover:underline">View project →</a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
