import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PokemonCard } from './PokemonCard'
import { usePokedexStore } from '@/hooks/usePokedexStore'

export const PokedexGrid: React.FC = () => {
  const { filteredPokemon, loading, darkMode } = usePokedexStore()

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 15 }).map((_, index) => (
          <Card key={index} className={`overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardContent className="p-4">
              <Skeleton className="w-full h-48 mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <div className="flex gap-2 mb-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (filteredPokemon.length === 0) {
    return (
      <div className="text-center py-12">
        <p className={darkMode ? "text-gray-400 text-lg" : "text-gray-500 text-lg"}>
          No Pokémon found matching your search criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {filteredPokemon.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  )
}
