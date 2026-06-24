import React from 'react'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Plus, Users } from 'lucide-react'
import { usePokedexStore, Pokemon } from '@/hooks/usePokedexStore'

interface PokemonCardProps {
  pokemon: Pokemon
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const {
    showShiny,
    favorites,
    compareMode,
    compareList,
    teamBuilderMode,
    currentTeam,
    toggleFavorite,
    addToCompare,
    addToTeam,
    setSelectedPokemon,
    darkMode
  } = usePokedexStore()

  const isFav = favorites.includes(pokemon.id)
  const isCompared = compareList.some(p => p.id === pokemon.id)
  const isTeammate = currentTeam.some(p => p.id === pokemon.id)

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      grass: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      poison: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      fire: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      flying: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      water: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
      bug: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
      normal: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      electric: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      ground: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      fairy: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      fighting: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      psychic: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
      rock: "bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200",
      ghost: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      ice: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
      dragon: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
      dark: "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200",
      steel: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200"
    }
    return colors[type] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      normal: '⚪', fire: '🔥', water: '💧', electric: '⚡', grass: '🌿', ice: '❄️',
      fighting: '👊', poison: '☠️', ground: '🌍', flying: '🦅', psychic: '🔮', bug: '🐛',
      rock: '🪨', ghost: '👻', dragon: '🐉', dark: '🌙', steel: '⚙️', fairy: '🧚'
    }
    return icons[type] || '❓'
  }

  const formatHeight = (h: number) => {
    const meters = h / 10
    const feet = Math.floor(meters * 3.28084)
    const inches = Math.round((meters * 3.28084 - feet) * 12)
    return `${meters}m (${feet}'${inches}")`
  }

  const formatWeight = (w: number) => {
    const kg = w / 10
    const lbs = Math.round(kg * 2.20462)
    return `${kg}kg (${lbs}lbs)`
  }

  const getStatRating = (value: number) => {
    if (value >= 150) return "Exceptional"
    if (value >= 120) return "High"
    if (value >= 90) return "Above Average"
    if (value >= 70) return "Average"
    if (value >= 50) return "Below Average"
    return "Low"
  }

  const totalBaseStats = pokemon.stats?.reduce((sum, stat) => sum + stat.value, 0) || 0

  return (
    <Card
      className={`overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-2 hover:border-blue-200 ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'border-transparent hover:border-blue-200'}`}
      onClick={() => setSelectedPokemon(pokemon)}
    >
      <CardContent className="p-4">
        <div className="relative mb-4">
          <div className={`absolute inset-0 rounded-lg ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`} />
          <img
            src={showShiny ? pokemon.shinyImage : pokemon.image}
            alt={pokemon.name}
            className="relative w-full h-48 object-contain bg-transparent rounded-lg"
          />
          {showShiny && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              ✨
            </div>
          )}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-sm font-semibold shadow-md ${darkMode ? 'bg-gray-700/90 text-white' : 'bg-white/90 backdrop-blur-sm'}`}>
            #{pokemon.id.toString().padStart(3, '0')}
          </div>
          
          {/* Action Buttons */}
          <div className="absolute top-2 left-2 flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(pokemon.id)
              }}
              className={`p-1 rounded-full ${isFav ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
            {compareMode && !isCompared && compareList.length < 2 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  addToCompare(pokemon)
                }}
                className="p-1 rounded-full text-blue-400 hover:text-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
            {teamBuilderMode && !isTeammate && currentTeam.length < 6 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  addToTeam(pokemon)
                }}
                className="p-1 rounded-full text-green-400 hover:text-green-600 transition-colors"
              >
                <Users className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <CardTitle className={`text-lg mb-2 capitalize text-center ${darkMode ? 'text-white' : ''}`}>
          {pokemon.name}
        </CardTitle>
        
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {pokemon.types.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className={`capitalize text-xs font-medium ${getTypeColor(type)}`}
            >
              <span className="mr-1">{getTypeIcon(type)}</span>
              {type}
            </Badge>
          ))}
        </div>
        
        <CardDescription className={`text-sm text-center ${darkMode ? 'text-gray-400' : ''}`}>
          <span className="inline-block mx-1">📏 {formatHeight(pokemon.height)}</span>
          <span className="inline-block mx-1">⚖️ {formatWeight(pokemon.weight)}</span>
        </CardDescription>

        {pokemon.stats && pokemon.stats.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between text-xs">
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total: {totalBaseStats}
              </span>
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {getStatRating(totalBaseStats / 6)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
