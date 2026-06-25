import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'
import { pokedexTrackerSchema } from '@/lib/schemas'

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const entries = await db.pokedexTracker.findMany({
      where: { userId: user.id }
    })
    
    const trackerMap: Record<number, any> = {}
    entries.forEach(entry => {
      trackerMap[entry.pokemonId] = {
        caught: entry.caught,
        seen: entry.seen,
        shiny: entry.shiny,
        caughtDate: entry.caughtDate?.toISOString(),
        notes: entry.notes
      }
    })
    return NextResponse.json(trackerMap)
  } catch (error) {
    console.error('Error fetching tracker data:', error)
    return NextResponse.json({ error: 'Failed to fetch tracker data' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = pokedexTrackerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid Pokemon ID or tracking data', details: validation.error.format() }, { status: 400 })
    }
    const { pokemonId, seen, caught, shiny, notes } = validation.data

    const caughtDate = caught ? new Date() : null

    const entry = await db.pokedexTracker.upsert({
      where: {
        userId_pokemonId: {
          userId: user.id,
          pokemonId
        }
      },
      update: {
        seen: !!seen,
        caught: !!caught,
        shiny: !!shiny,
        notes: notes || null,
        caughtDate
      },
      create: {
        userId: user.id,
        pokemonId,
        seen: !!seen,
        caught: !!caught,
        shiny: !!shiny,
        notes: notes || null,
        caughtDate
      }
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Error updating tracker entry:', error)
    return NextResponse.json({ error: 'Failed to update tracker entry' }, { status: 500 })
  }
}
