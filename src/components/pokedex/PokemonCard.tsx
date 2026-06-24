import React, { useState } from 'react'
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
    playCry,
    darkMode
  } = usePokedexStore()

  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const isFav = favorites.includes(pokemon.id)
  const isCompared = compareList.some(p => p.id === pokemon.id)
  const isTeammate = currentTeam.some(p => p.id === pokemon.id)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const box = card.getBoundingClientRect()
    const x = (e.clientX - box.left - box.width / 2) / (box.width / 2)
    const y = (e.clientY - box.top - box.height / 2) / (box.height / 2)
    setTilt({ x: x * 8, y: y * -8 })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    playCry(pokemon.id)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
  }

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

  const getTypeGlowColor = (type: string) => {
    const glows: Record<string, string> = {
      grass: "shadow-[0_0_20px_rgba(34,197,94,0.45)] border-green-500/50",
      poison: "shadow-[0_0_20px_rgba(168,85,247,0.45)] border-purple-500/50",
      fire: "shadow-[0_0_20px_rgba(239,68,68,0.45)] border-red-500/50",
      flying: "shadow-[0_0_20px_rgba(59,130,246,0.45)] border-blue-500/50",
      water: "shadow-[0_0_20px_rgba(6,182,212,0.45)] border-cyan-500/50",
      bug: "shadow-[0_0_20px_rgba(132,204,22,0.45)] border-lime-500/50",
      normal: "shadow-[0_0_20px_rgba(156,163,175,0.45)] border-gray-500/50",
      electric: "shadow-[0_0_20px_rgba(234,179,8,0.45)] border-yellow-500/50",
      ground: "shadow-[0_0_20px_rgba(245,158,11,0.45)] border-amber-500/50",
      fairy: "shadow-[0_0_20px_rgba(244,114,182,0.45)] border-pink-500/50",
      fighting: "shadow-[0_0_20px_rgba(249,115,22,0.45)] border-orange-500/50",
      psychic: "shadow-[0_0_20px_rgba(244,63,94,0.45)] border-rose-500/50",
      rock: "shadow-[0_0_20px_rgba(120,113,108,0.45)] border-stone-500/50",
      ghost: "shadow-[0_0_20px_rgba(99,102,241,0.45)] border-indigo-500/50",
      ice: "shadow-[0_0_20px_rgba(14,165,233,0.45)] border-sky-500/50",
      dragon: "shadow-[0_0_20px_rgba(139,92,246,0.45)] border-violet-500/50",
      dark: "shadow-[0_0_20px_rgba(63,63,70,0.45)] border-zinc-500/50",
      steel: "shadow-[0_0_20px_rgba(100,116,139,0.45)] border-slate-500/50"
    }
    return glows[type] || "shadow-[0_0_20px_rgba(59,130,246,0.45)] border-blue-500/50"
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
  const primaryType = pokemon.types[0] || 'normal'

  const cardStyle: React.CSSProperties = isHovered
    ? {
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateY(-5px)`,
        transition: 'transform 0.1s ease-out, box-shadow 0.3s ease, border-color 0.3s ease',
      }
    : {
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)',
        transition: 'transform 0.4s ease-out, box-shadow 0.4s ease, border-color 0.4s ease',
      }

  const hasAnimation = showShiny ? pokemon.animatedShinyImage : pokemon.animatedImage

  return (
    <Card
      className={`overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
        isHovered
          ? getTypeGlowColor(primaryType)
          : darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-transparent'
      }`}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => setSelectedPokemon(pokemon)}
    >
      <CardContent className="p-4">
        <div className="relative mb-4">
          <div className={`absolute inset-0 rounded-lg ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`} />
          
          <div className="relative w-full h-48 flex items-center justify-center bg-transparent rounded-lg overflow-hidden">
            {/* Static Image */}
            <img
              src={showShiny ? pokemon.shinyImage : pokemon.image}
              alt={pokemon.name}
              className={`absolute w-36 h-36 object-contain transition-opacity duration-300 ${
                isHovered && hasAnimation ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {/* Animated GIF */}
            {hasAnimation && (
              <img
                src={showShiny ? pokemon.animatedShinyImage : pokemon.animatedImage || ''}
                alt={`${pokemon.name} animation`}
                className={`absolute w-24 h-24 object-contain transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}
          </div>

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
