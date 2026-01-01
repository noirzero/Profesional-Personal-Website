'use client'

import { useRouter } from 'next/navigation'

export default function AdminControls({ id, read }: { id: string; read: boolean }) {
  const router = useRouter()

  async function del() {
    if (!confirm('Delete this message?')) return
    await fetch(`/api/messages/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  async function toggleRead() {
    await fetch(`/api/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ read: !read }), headers: { 'Content-Type': 'application/json' } })
    router.refresh()
  }

  return (
    <div className="mt-3 flex gap-2">
      <button onClick={toggleRead} className="px-2 py-1 text-sm border rounded">{read ? 'Mark unread' : 'Mark read'}</button>
      <button onClick={del} className="px-2 py-1 text-sm bg-red-600 text-white rounded">Delete</button>
    </div>
  )
}
