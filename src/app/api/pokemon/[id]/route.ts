import { NextResponse } from 'next/server'

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
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pokemonId = params.id

    // Fetch Pokemon details
    const detailResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!detailResponse.ok) {
      throw new Error(`Failed to fetch details for Pokemon ${pokemonId}`)
    }

    const details: PokemonDetails = await detailResponse.json()

    const pokemonData = {
      id: details.id,
      name: details.name,
      types: details.types.map(t => t.type.name),
      height: details.height,
      weight: details.weight,
      abilities: details.abilities
        .filter(a => !a.is_hidden)
        .map(a => a.ability.name),
      hiddenAbilities: details.abilities
        .filter(a => a.is_hidden)
        .map(a => a.ability.name),
      image: details.sprites.other['official-artwork'].front_default,
      stats: details.stats.map(stat => ({
        name: stat.stat.name,
        value: stat.base_stat
      }))
    }

    return NextResponse.json(pokemonData)
  } catch (error) {
    console.error('Error fetching Pokemon details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon data' },
      { status: 500 }
    )
  }
}