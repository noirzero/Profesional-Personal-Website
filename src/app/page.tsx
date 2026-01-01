import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home — Your Name',
  description: 'Hi — I\'m Your Name, a developer and designer.'
}

export default function Home() {
  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Hi, I&apos;m Your Name</h1>
        <p className="text-lg text-slate-600 mb-6">I build web apps and design product experiences. I write about design and engineering.</p>
        <div className="flex gap-3 justify-center">
          <a href="/portfolio" className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors">View portfolio</a>
          <a href="/contact" className="px-4 py-2 border border-slate-900 text-slate-900 rounded hover:bg-slate-50 transition-colors">Contact</a>
        </div>
      </div>
    </section>
  )
}
