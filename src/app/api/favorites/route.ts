import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const favorites = await db.favorite.findMany()
    return NextResponse.json(favorites.map(f => f.pokemonId))
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { pokemonId } = await request.json()
    if (typeof pokemonId !== 'number') {
      return NextResponse.json({ error: 'Invalid Pokemon ID' }, { status: 400 })
    }

    // Toggle logic
    const existing = await db.favorite.findUnique({
      where: { pokemonId }
    })

    if (existing) {
      await db.favorite.delete({
        where: { pokemonId }
      })
      return NextResponse.json({ favorited: false })
    } else {
      await db.favorite.create({
        data: { pokemonId }
      })
      return NextResponse.json({ favorited: true })
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 })
  }
}
