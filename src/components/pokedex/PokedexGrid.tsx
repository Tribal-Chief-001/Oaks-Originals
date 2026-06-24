import React, { useRef, useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PokemonCard } from './PokemonCard'
import { usePokedexStore } from '@/hooks/usePokedexStore'
import { useVirtualizer } from '@tanstack/react-virtual'

const useGridColumns = (containerRef: React.RefObject<HTMLDivElement | null>) => {
  const [columns, setColumns] = useState(5)

  useEffect(() => {
    if (!containerRef.current) return
    const updateColumns = () => {
      const width = containerRef.current?.offsetWidth || 0
      if (width < 640) setColumns(1)
      else if (width < 768) setColumns(2)
      else if (width < 1024) setColumns(3)
      else if (width < 1280) setColumns(4)
      else setColumns(5)
    }

    updateColumns()
    const observer = new ResizeObserver(updateColumns)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [containerRef])

  return columns
}

export const PokedexGrid: React.FC = () => {
  const { filteredPokemon, loading, darkMode } = usePokedexStore()
  const parentRef = useRef<HTMLDivElement>(null)
  const columns = useGridColumns(parentRef)

  // Split filteredPokemon into rows
  const rows = React.useMemo(() => {
    const list: typeof filteredPokemon[] = []
    for (let i = 0; i < filteredPokemon.length; i += columns) {
      list.push(filteredPokemon.slice(i, i + columns))
    }
    return list
  }, [filteredPokemon, columns])

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 380, // Height of card plus row gap
    overscan: 2,
  })

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
    <div
      ref={parentRef}
      className="max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-500"
      style={{ contain: 'content' }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowItems = rows[virtualRow.index];
          if (!rowItems) return null;
          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-3"
            >
              {rowItems.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  )
}
