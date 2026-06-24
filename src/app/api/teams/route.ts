import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const teams = await db.savedTeam.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(teams)
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, pokemonIds } = await request.json()
    if (!name || !Array.isArray(pokemonIds)) {
      return NextResponse.json({ error: 'Invalid name or team composition' }, { status: 400 })
    }

    const newTeam = await db.savedTeam.create({
      data: {
        userId: user.id,
        name,
        pokemonIds
      }
    })

    return NextResponse.json(newTeam)
  } catch (error) {
    console.error('Error saving team:', error)
    return NextResponse.json({ error: 'Failed to save team' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing team ID' }, { status: 400 })
    }

    // Verify ownership
    const existing = await db.savedTeam.findFirst({
      where: { id, userId: user.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Team not found or unauthorized' }, { status: 404 })
    }

    await db.savedTeam.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting team:', error)
    return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 })
  }
}
