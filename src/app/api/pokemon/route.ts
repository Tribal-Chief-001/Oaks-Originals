import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '151')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Fetch from Supabase via Prisma ORM
    const pokemonList = await db.pokemon.findMany({
      take: limit,
      skip: offset,
      orderBy: { id: 'asc' }
    })

    return NextResponse.json({
      pokemon: pokemonList,
      count: 151,
      next: offset + limit < 151 ? `/api/pokemon?limit=${limit}&offset=${offset + limit}` : null,
      previous: offset > 0 ? `/api/pokemon?limit=${limit}&offset=${Math.max(0, offset - limit)}` : null,
    })
  } catch (error) {
    console.error('Error fetching cached Pokemon:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon data' },
      { status: 500 }
    )
  }
}