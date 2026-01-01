import prisma from '@/lib/prismadb'

type MessageRecord = {
  id: string
  name?: string | null
  email: string
  message: string
  ip?: string | null
  createdAt: Date
  read: boolean
}
import { getServerSession } from 'next-auth/next'
import authOptions from '@/lib/auth'

const MESSAGES_PER_PAGE = 10

export default async function AdminPage({ searchParams }: { searchParams: { page?: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return (
      <div className="py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Admin</h2>
          <p className="mb-4">You must sign in to view this page.</p>
          <a href="/api/auth/signin" className="px-4 py-2 bg-slate-900 text-white rounded">Sign in</a>
        </div>
      </div>
    )
  }

  const currentPage = Math.max(1, parseInt(searchParams.page || '1', 10))
  const skip = (currentPage - 1) * MESSAGES_PER_PAGE

  const [messages, totalCount] = await Promise.all([
    prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: MESSAGES_PER_PAGE
    }),
    prisma.message.count()
  ])

  const totalPages = Math.ceil(totalCount / MESSAGES_PER_PAGE)

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-2">Messages</h2>
        <p className="text-sm text-slate-600 mb-6">Total: {totalCount} messages</p>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-slate-600">No messages yet.</p>
          ) : (
            messages.map((m) => (
              <article key={m.id} className={`border rounded p-4 ${m.read ? 'bg-slate-50' : 'bg-blue-50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{m.name ?? 'Anonymous'}</p>
                    <p className="text-sm text-slate-600">{m.email}</p>
                    {!m.read && <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-200 text-blue-900 rounded">New</span>}
                  </div>
                  <p className="text-xs text-slate-500">{new Date(m.createdAt).toLocaleString()}</p>
                </div>
                <p className="mt-3 text-slate-700 whitespace-pre-wrap">{m.message}</p>
                {/* client controls */}
                <div className="mt-3">
                  <ClientAdminControls id={m.id} read={m.read} />
                </div>
              </article>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {currentPage > 1 && (
              <a
                href={`/admin?page=${currentPage - 1}`}
                className="px-3 py-2 border rounded hover:bg-slate-100"
              >
                ← Previous
              </a>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <a
                key={page}
                href={`/admin?page=${page}`}
                className={`px-3 py-2 border rounded ${
                  page === currentPage
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'hover:bg-slate-100'
                }`}
              >
                {page}
              </a>
            ))}
            {currentPage < totalPages && (
              <a
                href={`/admin?page=${currentPage + 1}`}
                className="px-3 py-2 border rounded hover:bg-slate-100"
              >
                Next →
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

// Dynamically import client component to avoid server-side rendering issues
import dynamic from 'next/dynamic'
const ClientAdminControls = dynamic(() => import('@/components/AdminControls'), { ssr: false })
