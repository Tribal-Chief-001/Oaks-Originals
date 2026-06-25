import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'
import { savedTeamSchema } from '@/lib/schemas'
import { z } from 'zod'

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

    const body = await request.json()
    const validation = savedTeamSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid name or team composition', details: validation.error.format() }, { status: 400 })
    }
    const { name, pokemonIds } = validation.data

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
    const validation = z.string().trim().min(1).safeParse(id)
    if (!validation.success) {
      return NextResponse.json({ error: 'Missing or invalid team ID' }, { status: 400 })
    }
    const validatedId = validation.data

    // Verify ownership
    const existing = await db.savedTeam.findFirst({
      where: { id: validatedId, userId: user.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Team not found or unauthorized' }, { status: 404 })
    }

    await db.savedTeam.delete({
      where: { id: validatedId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting team:', error)
    return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 })
  }
}
