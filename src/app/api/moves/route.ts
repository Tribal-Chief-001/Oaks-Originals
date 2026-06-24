import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    if (!name) {
      return NextResponse.json({ error: 'Move name is required' }, { status: 400 })
    }

    const move = await db.move.findUnique({
      where: { name }
    })

    if (!move) {
      return NextResponse.json({ error: 'Move not found' }, { status: 404 })
    }

    return NextResponse.json(move)
  } catch (error) {
    console.error('Error fetching move:', error)
    return NextResponse.json({ error: 'Failed to fetch move' }, { status: 500 })
  }
}
