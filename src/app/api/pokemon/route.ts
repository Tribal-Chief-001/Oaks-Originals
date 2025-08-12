import { NextResponse } from 'next/server'

interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<{
    name: string
    url: string
  }>
}

interface PokemonDetails {
  id: number
  name: string
  types: Array<{
    type: {
      name: string
    }
  }>
  height: number
  weight: number
  abilities: Array<{
    ability: {
      name: string
    }
    is_hidden: boolean
  }>
  sprites: {
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit') || '151'
  const offset = searchParams.get('offset') || '0'

  try {
    // Fetch list of Pokemon
    const listResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!listResponse.ok) {
      throw new Error('Failed to fetch Pokemon list')
    }

    const listData: PokemonListResponse = await listResponse.json()

    // Fetch details for each Pokemon
    const pokemonDetails = await Promise.all(
      listData.results.map(async (pokemon) => {
        const detailResponse = await fetch(pokemon.url, {
          headers: {
            'Accept': 'application/json',
          },
        })

        if (!detailResponse.ok) {
          throw new Error(`Failed to fetch details for ${pokemon.name}`)
        }

        const details: PokemonDetails = await detailResponse.json()

        return {
          id: details.id,
          name: details.name,
          types: details.types.map(t => t.type.name),
          height: details.height,
          weight: details.weight,
          abilities: details.abilities
            .filter(a => !a.is_hidden)
            .map(a => a.ability.name),
          image: details.sprites.other['official-artwork'].front_default,
        }
      })
    )

    return NextResponse.json({
      pokemon: pokemonDetails,
      count: listData.count,
      next: listData.next,
      previous: listData.previous,
    })
  } catch (error) {
    console.error('Error fetching Pokemon:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon data' },
      { status: 500 }
    )
  }
}