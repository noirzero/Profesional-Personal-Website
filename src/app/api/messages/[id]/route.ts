import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { isCuid } from '@paralleldrive/cuid2'
import authOptions from '@/lib/auth'
import prisma from '@/lib/prismadb'

// Validate CUID format for security
function validateCuid(id: string): boolean {
  return isCuid(id)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = params
  
  if (!validateCuid(id)) {
    return NextResponse.json({ error: 'Invalid message ID' }, { status: 400 })
  }
  
  try {
    await prisma.message.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Delete message error:', err)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = params
  
  if (!validateCuid(id)) {
    return NextResponse.json({ error: 'Invalid message ID' }, { status: 400 })
  }
  
  try {
    const body = await req.json()
    const { read } = body as { read?: boolean }
    const updated = await prisma.message.update({ where: { id }, data: { read: !!read } })
    return NextResponse.json({ ok: true, message: updated })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Update message error:', err)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
