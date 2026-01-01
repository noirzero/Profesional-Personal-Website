import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Your Name',
  description: 'About — Your Name'
}

export default function About() {
  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">About me</h2>
        <p className="text-slate-700 mb-4">Short bio here. Experience, skills, and what you offer.</p>
        <p className="text-slate-700 mb-4">I&apos;m passionate about creating beautiful and functional digital experiences.</p>
      </div>
    </section>
  )
}
