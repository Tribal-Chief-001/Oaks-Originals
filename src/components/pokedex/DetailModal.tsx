import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Heart, Plus, X, Info, Users, Zap, BarChart3, BookOpen, MapPin, ChevronDown, Loader2
} from 'lucide-react'
import { usePokedexStore, Pokemon } from '@/hooks/usePokedexStore'

const kantoMapLocations: Record<string, { x: number; y: number; label: string }> = {
  "Pallet Town": { x: 2, y: 7, label: "Pallet Town" },
  "Viridian City": { x: 2, y: 5, label: "Viridian City" },
  "Pewter City": { x: 2, y: 2, label: "Pewter City" },
  "Cerulean City": { x: 5, y: 2, label: "Cerulean City" },
  "Vermilion City": { x: 6, y: 6, label: "Vermilion City" },
  "Lavender Town": { x: 8, y: 4, label: "Lavender Town" },
  "Celadon City": { x: 4, y: 4, label: "Celadon City" },
  "Fuchsia City": { x: 5, y: 8, label: "Fuchsia City" },
  "Saffron City": { x: 6, y: 4, label: "Saffron City" },
  "Cinnabar Island": { x: 2, y: 9, label: "Cinnabar Island" },
  "Indigo Plateau": { x: 1, y: 1, label: "Indigo Plateau" },
  "Viridian Forest": { x: 2, y: 3, label: "Viridian Forest" },
  "Mt Moon": { x: 3.5, y: 2, label: "Mt Moon" },
  "Rock Tunnel": { x: 8, y: 2.5, label: "Rock Tunnel" },
  "Seafoam Islands": { x: 3.5, y: 9, label: "Seafoam Islands" },
  "Power Plant": { x: 9, y: 3, label: "Power Plant" },
  "Safari Zone": { x: 5, y: 7.2, label: "Safari Zone" },
  "Victory Road": { x: 1, y: 2, label: "Victory Road" },
  "Cerulean Cave": { x: 5, y: 1.2, label: "Cerulean Cave" },
  "Route 1": { x: 2, y: 6, label: "Route 1" },
  "Route 2": { x: 2, y: 4, label: "Route 2" },
  "Route 3": { x: 3, y: 2, label: "Route 3" },
  "Route 4": { x: 4.2, y: 2, label: "Route 4" },
  "Route 5": { x: 6, y: 3, label: "Route 5" },
  "Route 6": { x: 6, y: 5, label: "Route 6" },
  "Route 7": { x: 5, y: 4, label: "Route 7" },
  "Route 8": { x: 7, y: 4, label: "Route 8" },
  "Route 9": { x: 6.5, y: 2, label: "Route 9" },
  "Route 10": { x: 8, y: 3.2, label: "Route 10" },
  "Route 11": { x: 7, y: 6, label: "Route 11" },
  "Route 12": { x: 8, y: 5, label: "Route 12" },
  "Route 13": { x: 8, y: 6.2, label: "Route 13" },
  "Route 14": { x: 7, y: 7.2, label: "Route 14" },
  "Route 15": { x: 6, y: 8, label: "Route 15" },
  "Route 16": { x: 3, y: 4, label: "Route 16" },
  "Route 17": { x: 3, y: 6, label: "Route 17" },
  "Route 18": { x: 4, y: 8, label: "Route 18" },
  "Route 19": { x: 5, y: 9, label: "Route 19" },
  "Route 20": { x: 4.2, y: 9, label: "Route 20" },
  "Route 21": { x: 2, y: 8, label: "Route 21" },
  "Route 22": { x: 1.2, y: 5, label: "Route 22" },
  "Route 23": { x: 1, y: 3, label: "Route 23" },
  "Route 24": { x: 5, y: 1.5, label: "Route 24" },
  "Route 25": { x: 5.5, y: 1.5, label: "Route 25" }
}

export const DetailModal: React.FC = () => {
  const {
    selectedPokemon,
    setSelectedPokemon,
    favorites,
    toggleFavorite,
    compareMode,
    compareList,
    addToCompare,
    darkMode,
    activeTab,
    setActiveTab,
    showShiny,
    setShowShiny,
    setCalculatorAttackerId,
    setCalculatorMoveName,
    setShowDamageCalculator
  } = usePokedexStore()

  const [selectedMoveName, setSelectedMoveName] = useState<string | null>(null)
  const [moveDetails, setMoveDetails] = useState<any | null>(null)
  const [loadingMove, setLoadingMove] = useState(false)

  useEffect(() => {
    if (!selectedMoveName) {
      setMoveDetails(null)
      return
    }
    const fetchMove = async () => {
      setLoadingMove(true)
      try {
        const res = await fetch(`/api/moves?name=${encodeURIComponent(selectedMoveName)}`)
        if (res.ok) {
          const data = await res.json()
          setMoveDetails(data)
        }
      } catch (err) {
        console.error('Failed to fetch move:', err)
      } finally {
        setLoadingMove(false)
      }
    }
    fetchMove()
  }, [selectedMoveName])

  if (!selectedPokemon) return null

  const isFav = favorites.includes(selectedPokemon.id)

  const formatHeight = (height: number) => {
    const meters = height / 10
    const feet = Math.floor(meters * 3.28084)
    const inches = Math.round((meters * 3.28084 - feet) * 12)
    return `${meters}m (${feet}'${inches}")`
  }

  const formatWeight = (weight: number) => {
    const kg = weight / 10
    const lbs = Math.round(kg * 2.20462)
    return `${kg}kg (${lbs}lbs)`
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

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      normal: '⚪', fire: '🔥', water: '💧', electric: '⚡', grass: '🌿', ice: '❄️',
      fighting: '👊', poison: '☠️', ground: '🌍', flying: '🦅', psychic: '🔮', bug: '🐛',
      rock: '🪨', ghost: '👻', dragon: '🐉', dark: '🌙', steel: '⚙️', fairy: '🧚'
    }
    return icons[type] || '❓'
  }

  const getStatRating = (value: number) => {
    if (value >= 150) return "Exceptional"
    if (value >= 120) return "High"
    if (value >= 90) return "Above Average"
    if (value >= 70) return "Average"
    if (value >= 50) return "Below Average"
    return "Low"
  }

  const getTypeEffectiveness = (attackingType: string, defendingTypes: string[]) => {
    const effectiveness: Record<string, Record<string, number>> = {
      normal: { rock: 0.5, ghost: 0, steel: 0.5 },
      fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 0.5, rock: 0.5, dragon: 0.5, steel: 2 },
      water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
      electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
      grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
      ice: { fire: 0.5, water: 0.5, grass: 2, ice: 2, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
      fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
      poison: { grass: 2, poison: 0.5, ground: 2, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
      ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
      flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
      psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
      bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
      rock: { fire: 2, ice: 2, fighting: 2, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
      ghost: { psychic: 2, ghost: 2, dark: 0.5, fighting: 1 },
      dragon: { dragon: 2, steel: 0.5, fairy: 0, ice: 2 },
      dark: { fighting: 2, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
      steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
      fairy: { fire: 0.5, poison: 2, fighting: 2, dragon: 2, dark: 2, steel: 0.5 }
    }

    let total = 1
    defendingTypes.forEach(defType => {
      const row = effectiveness[attackingType]
      if (row && row[defType] !== undefined) {
        total *= row[defType]
      }
    })
    return total
  }

  const getComprehensiveTypeEffectiveness = (defendingTypes: string[]) => {
    const allTypes = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']
    const results = allTypes.map(type => ({
      type,
      multiplier: getTypeEffectiveness(type, defendingTypes),
      icon: getTypeIcon(type)
    }))

    return {
      weaknesses: results.filter(r => r.multiplier > 1),
      resistances: results.filter(r => r.multiplier < 1 && r.multiplier > 0),
      immunities: results.filter(r => r.multiplier === 0)
    }
  }

  const getEffectivenessColor = (m: number) => {
    if (m === 0) return 'text-gray-500 bg-gray-100 dark:bg-gray-800'
    if (m === 0.25) return 'text-green-700 bg-green-100 dark:bg-green-950 dark:text-green-300'
    if (m === 0.5) return 'text-green-600 bg-green-50 dark:bg-green-900/50 dark:text-green-400'
    if (m === 2) return 'text-red-600 bg-red-50 dark:bg-red-900/50 dark:text-red-400'
    if (m === 4) return 'text-red-700 bg-red-100 dark:bg-red-950 dark:text-red-300'
    return 'text-gray-500 bg-gray-50 dark:bg-gray-800/50'
  }

  const totalBaseStats = selectedPokemon.stats?.reduce((sum, stat) => sum + stat.value, 0) || 0

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className={`max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'border-blue-200'}`}>
        <CardHeader className={`pb-4 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-100'}`}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className={`text-3xl capitalize ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {selectedPokemon.name}
              </CardTitle>
              <CardDescription className={`text-lg ${darkMode ? 'text-gray-300' : ''}`}>
                #{selectedPokemon.id.toString().padStart(3, '0')} • {selectedPokemon.category || 'Pokémon'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(selectedPokemon.id)}
                className={`h-8 w-8 p-0 rounded-full ${isFav ? 'text-red-500' : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200'}`}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
              </Button>
              {compareMode && compareList.length < 2 && !compareList.find(p => p.id === selectedPokemon.id) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addToCompare(selectedPokemon)}
                  className={`h-8 w-8 p-0 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200'}`}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPokemon(null)}
                className={`h-8 w-8 p-0 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200'}`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mt-4 border-b border-gray-200 dark:border-gray-600">
            {[
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'biology', label: 'Biology', icon: Users },
              { id: 'abilities', label: 'Abilities', icon: Zap },
              { id: 'stats', label: 'Stats', icon: BarChart3 },
              { id: 'evolution', label: 'Evolution', icon: ChevronDown },
              { id: 'moves', label: 'Moves', icon: Zap },
              { id: 'competitive', label: 'Competitive', icon: BarChart3 },
              { id: 'flavor', label: 'Flavor Text', icon: BookOpen },
              { id: 'encounters', label: 'Encounters', icon: MapPin },
              { id: 'trivia', label: 'Trivia', icon: Info },
              { id: 'mechanics', label: 'Mechanics', icon: Zap }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                  activeTab === id
                    ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`
                    : `${darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="space-y-6"
          >
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className={`rounded-xl p-6 mb-4 ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
                      <img
                        src={showShiny ? selectedPokemon.shinyImage : selectedPokemon.image}
                        alt={selectedPokemon.name}
                        className="w-full h-64 object-contain mx-auto"
                      />
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button
                        variant={showShiny ? "outline" : "default"}
                        size="sm"
                        onClick={() => setShowShiny(false)}
                      >
                        Normal
                      </Button>
                      <Button
                        variant={showShiny ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowShiny(true)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        ✨ Shiny
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Types</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedPokemon.types.map((type) => (
                        <Badge
                          key={type}
                          variant="secondary"
                          className={`capitalize text-sm py-2 px-3 ${getTypeColor(type)}`}
                        >
                          <span className="mr-2 text-lg">{getTypeIcon(type)}</span>
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Physical Characteristics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-55'}`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Height</p>
                        <p className={`font-semibold ${darkMode ? 'text-white' : ''}`}>{formatHeight(selectedPokemon.height)}</p>
                      </div>
                      <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-55'}`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Weight</p>
                        <p className={`font-semibold ${darkMode ? 'text-white' : ''}`}>{formatWeight(selectedPokemon.weight)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Core Identification</h3>
                    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>National Dex:</span>
                          <span className={`ml-2 font-medium ${darkMode ? 'text-white' : ''}`}>#{selectedPokemon.id.toString().padStart(3, '0')}</span>
                        </div>
                        <div>
                          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Kanto Dex:</span>
                          <span className={`ml-2 font-medium ${darkMode ? 'text-white' : ''}`}>#{selectedPokemon.id.toString().padStart(3, '0')}</span>
                        </div>
                        {selectedPokemon.category && (
                          <div className="col-span-2">
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category:</span>
                            <span className={`ml-2 font-medium ${darkMode ? 'text-white' : ''}`}>{selectedPokemon.category}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Base Stats Total</h3>
                    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-55'}`}>
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{totalBaseStats}</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {getStatRating(totalBaseStats / 6)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Abilities</h3>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {selectedPokemon.abilities.map((ability) => (
                          <Badge key={ability} variant="outline" className={`capitalize ${darkMode ? 'border-gray-600 text-gray-200' : ''}`}>
                            {ability.replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                      {selectedPokemon.hiddenAbilities && selectedPokemon.hiddenAbilities.length > 0 && (
                        <div>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Hidden:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedPokemon.hiddenAbilities.map((ability) => (
                              <Badge key={ability} variant="secondary" className="capitalize text-xs">
                                {ability.replace('-', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Biology Tab */}
            {activeTab === 'biology' && (
              <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Biological Profile</h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gender Ratio:</span>
                      <span className="font-medium">{selectedPokemon.genderRatio || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Base Friendship:</span>
                      <span className="font-medium">{selectedPokemon.baseFriendship ?? 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Base Experience:</span>
                      <span className="font-medium">{selectedPokemon.baseExperience ?? 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Catch Rate:</span>
                      <span className="font-medium">{selectedPokemon.catchRate ? `${selectedPokemon.catchRate}%` : 'Unknown'}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-500 block mb-1">Egg Groups:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedPokemon.eggGroups?.map(g => (
                          <Badge key={g} variant="outline" className="capitalize text-xs">{g}</Badge>
                        )) || 'Unknown'}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Egg Cycles:</span>
                      <span className="font-medium">{selectedPokemon.eggCycles ? `${selectedPokemon.eggCycles} (${selectedPokemon.eggCycles * 255} steps)` : 'Unknown'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">Habitat:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedPokemon.naturalHabitat?.map(h => (
                          <Badge key={h} variant="secondary" className="capitalize text-xs">{h}</Badge>
                        )) || 'Unknown'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Abilities Tab */}
            {activeTab === 'abilities' && (
              <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Abilities & Traits</h3>
                <div className="space-y-4">
                  {selectedPokemon.abilities.map((ability, index) => (
                    <div key={ability} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                      <h4 className="font-semibold capitalize mb-1">{ability.replace('-', ' ')} {index === 0 ? '(Primary)' : '(Secondary)'}</h4>
                      <p className="text-sm text-gray-500">
                        {selectedPokemon.abilityDescriptions?.primary || 'Standard combat ability providing various battle effects.'}
                      </p>
                    </div>
                  ))}
                  {selectedPokemon.hiddenAbilities.map(ability => (
                    <div key={ability} className={`p-4 rounded-lg border-2 ${darkMode ? 'bg-gray-600 border-purple-500' : 'bg-white border-purple-200'}`}>
                      <h4 className="font-semibold capitalize text-purple-600 dark:text-purple-400 mb-1">{ability.replace('-', ' ')} (Hidden)</h4>
                      <p className="text-sm text-gray-500">
                        {selectedPokemon.abilityDescriptions?.hidden || 'Rare ability obtained through specific event or breeding mechanisms.'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Base Statistics</h3>
                <div className="space-y-4">
                  {selectedPokemon.stats?.map(stat => {
                    const maxValue = 255
                    const percentage = (stat.value / maxValue) * 100
                    return (
                      <div key={stat.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize font-medium">{stat.name.replace('-', ' ')}</span>
                          <span className="font-semibold">{stat.value}</span>
                        </div>
                        <div className={`w-full rounded-full h-3 ${darkMode ? 'bg-gray-600' : 'bg-gray-250'}`}>
                          <div
                            className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                  <div className="pt-4 border-t flex justify-between font-bold">
                    <span>Stat Total</span>
                    <span>{totalBaseStats} ({getStatRating(totalBaseStats / 6)})</span>
                  </div>
                </div>
              </div>
            )}

            {/* Evolution Tab */}
            {activeTab === 'evolution' && (
              <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Evolution Chain</h3>
                {selectedPokemon.evolutionChain && selectedPokemon.evolutionChain.length > 0 ? (
                  <div className="flex flex-wrap items-center justify-center gap-6">
                    {selectedPokemon.evolutionChain.map((evo, idx) => (
                      <React.Fragment key={evo.id}>
                        <div className={`rounded-lg p-4 text-center min-w-[130px] ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                          <img src={evo.image} alt={evo.name} className="w-20 h-20 object-contain mx-auto mb-1" />
                          <p className="font-semibold text-sm capitalize">{evo.name}</p>
                          <p className="text-xs text-gray-500">#{evo.id.toString().padStart(3, '0')}</p>
                        </div>
                        {idx < (selectedPokemon.evolutionChain?.length || 0) - 1 && (
                          <div className="text-center font-bold text-gray-400">
                            <span>➔</span>
                            <p className="text-xxs font-medium max-w-[80px] leading-tight text-gray-500 mt-1">
                              {selectedPokemon.evolutionChain?.[idx + 1]?.method}
                            </p>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">This Pokémon does not evolve.</p>
                )}
              </div>
            )}

            {/* Moves Tab */}
            {activeTab === 'moves' && (
              <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-55'}`}>
                <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Move Learnset</h3>
                <p className="text-xs text-gray-400 mb-4">Click any move to view detailed stats, power, accuracy, and load it into the Damage Calculator.</p>
                <div className="space-y-6">
                  {selectedPokemon.learnset?.levelUp && selectedPokemon.learnset.levelUp.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-md mb-2">Level Up Moves (Gen I Red/Blue)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {selectedPokemon.learnset.levelUp.map((m, idx) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedMoveName(m.name)}
                            className={`p-2 rounded border text-xs capitalize flex justify-between cursor-pointer transition-all duration-300 hover:scale-102 hover:border-blue-400 hover:shadow-sm ${
                              darkMode ? 'bg-gray-600 border-gray-500 hover:bg-gray-500 text-white' : 'bg-white hover:bg-blue-50'
                            }`}
                          >
                            <span>{m.name}</span>
                            <span className="font-bold text-gray-400">Lv. {m.level}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedPokemon.learnset?.tmMoves && selectedPokemon.learnset.tmMoves.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-md mb-2">TM Moves</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedPokemon.learnset.tmMoves.map((m, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            onClick={() => setSelectedMoveName(m)}
                            className="capitalize text-xxs cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                          >
                            {m}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Competitive Tab */}
            {activeTab === 'competitive' && selectedPokemon.competitive && (
              <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Competitive Analysis</h3>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-400 block mb-1">Smogon Tier:</span>
                        <Badge variant="outline" className="font-bold">{selectedPokemon.competitive.smogonTier}</Badge>
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-1">Roles:</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedPokemon.competitive.commonRoles.map((r, i) => (
                            <Badge key={i} variant="secondary">{r}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-1">Optimal Moveset:</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedPokemon.competitive.optimalMovesets.map((m, i) => (
                            <Badge key={i} variant="outline" className="capitalize">{m}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold block mb-2">Type Effectiveness Mapping:</span>
                      {(() => {
                        const matrix = getComprehensiveTypeEffectiveness(selectedPokemon.types)
                        return (
                          <div className="space-y-3">
                            {matrix.weaknesses.length > 0 && (
                              <div>
                                <p className="text-xs text-red-500 font-bold mb-1">Weaknesses (Extra Damage):</p>
                                <div className="flex flex-wrap gap-1">
                                  {matrix.weaknesses.map(w => (
                                    <span key={w.type} className={`px-2 py-0.5 rounded text-xxs capitalize font-bold ${getEffectivenessColor(w.multiplier)}`}>
                                      {w.icon} {w.type} {w.multiplier}x
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {matrix.resistances.length > 0 && (
                              <div>
                                <p className="text-xs text-green-500 font-bold mb-1">Resistances (Reduced Damage):</p>
                                <div className="flex flex-wrap gap-1">
                                  {matrix.resistances.map(r => (
                                    <span key={r.type} className={`px-2 py-0.5 rounded text-xxs capitalize font-bold ${getEffectivenessColor(r.multiplier)}`}>
                                      {r.icon} {r.type} {r.multiplier}x
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {matrix.immunities.length > 0 && (
                              <div>
                                <p className="text-xs text-gray-500 font-bold mb-1">Immunities (No Damage):</p>
                                <div className="flex flex-wrap gap-1">
                                  {matrix.immunities.map(i => (
                                    <span key={i.type} className={`px-2 py-0.5 rounded text-xxs capitalize font-bold ${getEffectivenessColor(i.multiplier)}`}>
                                      {i.icon} {i.type} 0x
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 pt-4 border-t text-sm">
                    <div>
                      <h4 className="font-semibold text-gray-400 mb-1">Counters</h4>
                      <ul className="list-disc list-inside space-y-0.5">
                        {selectedPokemon.competitive.counters.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-400 mb-1">Team Synergy</h4>
                      <p>{selectedPokemon.competitive.teamSynergy}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Flavor Text Tab */}
            {activeTab === 'flavor' && selectedPokemon.flavorText && (
              <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-55'}`}>
                <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Pokedex Entries</h3>
                <div className="space-y-4 text-sm italic">
                  {selectedPokemon.flavorText.red && (
                    <div className="p-3 border-l-4 border-red-500 bg-white/5">
                      <p className="font-bold text-red-500 not-italic text-xs mb-1">Pokémon Red & Blue</p>
                      "{selectedPokemon.flavorText.red}"
                    </div>
                  )}
                  {selectedPokemon.flavorText.yellow && (
                    <div className="p-3 border-l-4 border-yellow-500 bg-white/5">
                      <p className="font-bold text-yellow-500 not-italic text-xs mb-1">Pokémon Yellow</p>
                      "{selectedPokemon.flavorText.yellow}"
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Encounters Tab */}
            {activeTab === 'encounters' && (
              <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Kanto Spawn Locations & Routes Map</h3>
                
                <div className="grid lg:grid-cols-12 gap-6">
                  {/* Left Column: Interactive SVG Map */}
                  <div className="lg:col-span-7 flex flex-col items-center justify-center bg-gray-950 rounded-xl p-4 shadow-inner relative overflow-hidden border border-gray-800">
                    <div className="absolute top-2 left-2 text-xs font-semibold text-gray-500 bg-gray-900/80 px-2 py-1 rounded">
                      Interactive Kanto Map Visualizer
                    </div>
                    
                    <svg viewBox="0 0 520 420" className="w-full max-w-[480px] h-auto bg-transparent">
                      {/* Connection Paths (Roads / Water routes) */}
                      {[
                        { from: "Pallet Town", to: "Route 1" },
                        { from: "Route 1", to: "Viridian City" },
                        { from: "Viridian City", to: "Route 2" },
                        { from: "Route 2", to: "Viridian Forest" },
                        { from: "Viridian Forest", to: "Pewter City" },
                        { from: "Pewter City", to: "Route 3" },
                        { from: "Route 3", to: "Mt Moon" },
                        { from: "Mt Moon", to: "Route 4" },
                        { from: "Route 4", to: "Cerulean City" },
                        { from: "Cerulean City", to: "Route 24" },
                        { from: "Route 24", to: "Route 25" },
                        { from: "Cerulean City", to: "Route 5" },
                        { from: "Route 5", to: "Saffron City" },
                        { from: "Saffron City", to: "Route 6" },
                        { from: "Route 6", to: "Vermilion City" },
                        { from: "Celadon City", to: "Route 7" },
                        { from: "Route 7", to: "Saffron City" },
                        { from: "Saffron City", to: "Route 8" },
                        { from: "Route 8", to: "Lavender Town" },
                        { from: "Cerulean City", to: "Route 9" },
                        { from: "Route 9", to: "Rock Tunnel" },
                        { from: "Rock Tunnel", to: "Route 10" },
                        { from: "Route 10", to: "Lavender Town" },
                        { from: "Vermilion City", to: "Route 11" },
                        { from: "Route 11", to: "Route 12" },
                        { from: "Lavender Town", to: "Route 12" },
                        { from: "Route 12", to: "Route 13" },
                        { from: "Route 13", to: "Route 14" },
                        { from: "Route 14", to: "Route 15" },
                        { from: "Route 15", to: "Fuchsia City" },
                        { from: "Celadon City", to: "Route 16" },
                        { from: "Route 16", to: "Route 17" },
                        { from: "Route 17", to: "Route 18" },
                        { from: "Route 18", to: "Fuchsia City" },
                        { from: "Fuchsia City", to: "Route 19" },
                        { from: "Route 19", to: "Seafoam Islands" },
                        { from: "Seafoam Islands", to: "Route 20" },
                        { from: "Route 20", to: "Cinnabar Island" },
                        { from: "Cinnabar Island", to: "Route 21" },
                        { from: "Route 21", to: "Pallet Town" },
                        { from: "Viridian City", to: "Route 22" },
                        { from: "Route 22", to: "Route 23" },
                        { from: "Route 23", to: "Victory Road" },
                        { from: "Victory Road", to: "Indigo Plateau" },
                      ].map((path, idx) => {
                        const start = kantoMapLocations[path.from]
                        const end = kantoMapLocations[path.to]
                        if (!start || !end) return null
                        
                        const encountersList = (selectedPokemon.encounters as any[]) || []
                        const isActive = encountersList.some(e => e.locationName === path.from) || encountersList.some(e => e.locationName === path.to)
                        
                        return (
                          <line
                            key={idx}
                            x1={start.x * 50}
                            y1={start.y * 40}
                            x2={end.x * 50}
                            y2={end.y * 40}
                            stroke={isActive ? "#10B981" : "#374151"}
                            strokeWidth={isActive ? 3 : 2}
                            className="transition-all duration-300"
                          />
                        )
                      })}

                      {/* Map Nodes */}
                      {Object.entries(kantoMapLocations).map(([locName, coord]) => {
                        const encountersList = (selectedPokemon.encounters as any[]) || []
                        const encounter = encountersList.find(e => e.locationName.toLowerCase().trim() === locName.toLowerCase().trim())
                        const isActive = !!encounter
                        const isCity = !locName.includes("Route") && !locName.includes("Forest") && !locName.includes("Tunnel") && !locName.includes("Islands") && !locName.includes("Cave") && !locName.includes("Road")
                        
                        return (
                          <g key={locName}>
                            <circle
                              cx={coord.x * 50}
                              cy={coord.y * 40}
                              r={isCity ? 8 : 5}
                              fill={isActive ? "#10B981" : isCity ? "#3B82F6" : "#4B5563"}
                              className="transition-all duration-300 hover:scale-150 hover:stroke-white hover:stroke-2 cursor-pointer"
                            />
                            <title>{locName}{isActive ? " (Active spawn location)" : ""}</title>
                          </g>
                        )
                      })}

                      {/* Map Labels */}
                      {Object.entries(kantoMapLocations).map(([locName, coord]) => {
                        const isCity = !locName.includes("Route") && !locName.includes("Forest") && !locName.includes("Tunnel") && !locName.includes("Islands") && !locName.includes("Cave") && !locName.includes("Road")
                        if (!isCity) return null
                        
                        return (
                          <text
                            key={locName}
                            x={coord.x * 50}
                            y={coord.y * 40 - 12}
                            textAnchor="middle"
                            fill="#9CA3AF"
                            fontSize="8"
                            fontWeight="bold"
                            className="pointer-events-none select-none"
                          >
                            {coord.label}
                          </text>
                        )
                      })}
                    </svg>
                  </div>
                  
                  {/* Right Column: Detailed spawn statistics */}
                  <div className="lg:col-span-5 space-y-4 max-h-[360px] overflow-y-auto pr-2">
                    <h4 className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wild Spawn Details</h4>
                    
                    {(!selectedPokemon.encounters || (selectedPokemon.encounters as any[]).length === 0) ? (
                      <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                        {selectedPokemon.id === 150 ? 'Cerulean Cave (Post-Game, Direct interaction)' :
                         selectedPokemon.id === 151 ? 'Special Event Distribution Only' :
                         selectedPokemon.id <= 9 ? 'Starter choices from Professor Oak' :
                         'No standard wild encounters available.'}
                      </div>
                    ) : (
                      ((selectedPokemon.encounters as any[])).map((enc: any, idx: number) => (
                        <div key={idx} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`font-semibold capitalize ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              📍 {enc.locationName}
                            </span>
                          </div>
                          
                          <div className="space-y-2 text-xs">
                            {enc.versions.map((v: any, vIdx: number) => (
                              <div key={vIdx} className="border-t border-gray-700/50 pt-2 first:border-0 first:pt-0">
                                <div className="flex items-center justify-between mb-1">
                                  <Badge className={
                                    v.version === 'Red' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/10 border-red-500/30' :
                                    v.version === 'Blue' ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/10 border-blue-500/30' :
                                    'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10 border-yellow-500/30'
                                  } variant="outline">
                                    {v.version} version
                                  </Badge>
                                  <span className="text-gray-400">Max Chance: {v.maxChance}%</span>
                                </div>
                                
                                <div className="pl-2 space-y-1 text-gray-400">
                                  {v.methods.map((m: any, mIdx: number) => (
                                    <div key={mIdx} className="flex justify-between">
                                      <span className="capitalize">• {m.method} (Lv. {m.minLevel === m.maxLevel ? m.minLevel : `${m.minLevel}-${m.maxLevel}`})</span>
                                      <span>Chance: {m.chance}%</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Trivia Tab */}
            {activeTab === 'trivia' && selectedPokemon.trivia && (
              <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Trivia & History</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-400 mb-1">Design Origin</h4>
                    <p>{selectedPokemon.trivia.designOrigin}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-400 mb-1">Name Etymology</h4>
                    <p className="capitalize">{selectedPokemon.trivia.nameEtymology}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-400 mb-1">Developer Trivia</h4>
                    <p>{selectedPokemon.trivia.developerTrivia}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mechanics Tab */}
            {activeTab === 'mechanics' && selectedPokemon.advancedMechanics && (
              <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Advanced Mechanics</h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-400 mb-1">Hidden Power Calculations</h4>
                    <p>{selectedPokemon.advancedMechanics.hiddenPowerRange}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-400 mb-1">Breeding Quirks</h4>
                    <p>{selectedPokemon.advancedMechanics.breedingQuirks}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-400 mb-1">Form Triggers</h4>
                    <p>{selectedPokemon.advancedMechanics.formChangeTriggers}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-400 mb-1">Generation-to-Generation Shifts</h4>
                    <p>{selectedPokemon.advancedMechanics.statChanges}</p>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </CardContent>
      </Card>

      {/* Move Details Drawer */}
      {selectedMoveName && (
        <div className={`fixed inset-y-0 right-0 w-80 border-l shadow-2xl p-6 z-50 flex flex-col transition-all duration-300 ${
          darkMode ? 'bg-gray-850 border-gray-700 text-white animate-in slide-in-from-right' : 'bg-white border-gray-200 text-gray-800 animate-in slide-in-from-right'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg capitalize">
              {selectedMoveName}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedMoveName(null)}
              className="w-8 h-8 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {loadingMove ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : moveDetails ? (
            <div className="flex-1 space-y-6 text-sm overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <span className="text-gray-400 block text-xs mb-1">Type</span>
                  <Badge className="capitalize">{moveDetails.type}</Badge>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-55'}`}>
                  <span className="text-gray-400 block text-xs mb-1">Class</span>
                  <span className="font-semibold capitalize block mt-1">
                    {moveDetails.damageClass}
                  </span>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-55'}`}>
                  <span className="text-gray-400 block text-xs mb-1">Power</span>
                  <span className="font-semibold block mt-1">
                    {moveDetails.power !== null ? moveDetails.power : '—'}
                  </span>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-55'}`}>
                  <span className="text-gray-400 block text-xs mb-1">Accuracy</span>
                  <span className="font-semibold block mt-1">
                    {moveDetails.accuracy !== null ? `${moveDetails.accuracy}%` : '—'}
                  </span>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-55'}`}>
                  <span className="text-gray-400 block text-xs mb-1">PP</span>
                  <span className="font-semibold block mt-1">
                    {moveDetails.pp}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block text-xs mb-2 font-medium">Battle Effect</span>
                <p className={`p-3 rounded-lg ${darkMode ? 'bg-gray-750 text-gray-300' : 'bg-gray-50 text-gray-700'} leading-relaxed`}>
                  {moveDetails.description}
                </p>
              </div>

              {moveDetails.power && (
                <Button
                  onClick={() => {
                    setCalculatorAttackerId(selectedPokemon.id)
                    setCalculatorMoveName(moveDetails.name)
                    setShowDamageCalculator(true)
                    setSelectedMoveName(null)
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 mt-4"
                >
                  <Zap className="w-4 h-4" />
                  Load into Calculator
                </Button>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Move data not available.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
