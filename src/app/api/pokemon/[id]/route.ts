import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pokemonId = parseInt(id)
    if (isNaN(pokemonId)) {
      return NextResponse.json({ error: 'Invalid Pokemon ID' }, { status: 400 })
    }

    const pokemon = await db.pokemon.findUnique({
      where: { id: pokemonId }
    })

    if (!pokemon) {
      return NextResponse.json({ error: 'Pokemon not found' }, { status: 404 })
    }

    return NextResponse.json(pokemon)
  } catch (error) {
    console.error('Error fetching Pokemon details from cache:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon details' },
      { status: 500 }
    )
  }
}