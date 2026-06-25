import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'
import { favoriteSchema } from '@/lib/schemas'

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const favorites = await db.favorite.findMany({
      where: { userId: user.id }
    })
    return NextResponse.json(favorites.map(f => f.pokemonId))
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = favoriteSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid Pokemon ID', details: validation.error.format() }, { status: 400 })
    }
    const { pokemonId } = validation.data

    // Toggle logic with composite key
    const existing = await db.favorite.findUnique({
      where: {
        userId_pokemonId: {
          userId: user.id,
          pokemonId
        }
      }
    })

    if (existing) {
      await db.favorite.delete({
        where: {
          userId_pokemonId: {
            userId: user.id,
            pokemonId
          }
        }
      })
      return NextResponse.json({ favorited: false })
    } else {
      await db.favorite.create({
        data: {
          userId: user.id,
          pokemonId
        }
      })
      return NextResponse.json({ favorited: true })
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 })
  }
}
