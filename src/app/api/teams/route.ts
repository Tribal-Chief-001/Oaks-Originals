import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const teams = await db.savedTeam.findMany({
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
    const { name, pokemonIds } = await request.json()
    if (!name || !Array.isArray(pokemonIds)) {
      return NextResponse.json({ error: 'Invalid name or team composition' }, { status: 400 })
    }

    const newTeam = await db.savedTeam.create({
      data: {
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
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing team ID' }, { status: 400 })
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
