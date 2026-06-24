import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Heart, Plus, X, Info, Users, Zap, BarChart3, BookOpen, MapPin, ChevronDown
} from 'lucide-react'
import { usePokedexStore, Pokemon } from '@/hooks/usePokedexStore'

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
    setShowShiny
  } = usePokedexStore()

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
          <div className="space-y-6">
            
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
              <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Move Learnset</h3>
                <div className="space-y-6">
                  {selectedPokemon.learnset?.levelUp && selectedPokemon.learnset.levelUp.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-md mb-2">Level Up Moves (Gen I Red/Blue)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {selectedPokemon.learnset.levelUp.map((m, idx) => (
                          <div key={idx} className={`p-2 rounded border text-xs capitalize flex justify-between ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white'}`}>
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
                          <Badge key={idx} variant="secondary" className="capitalize text-xxs">{m}</Badge>
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
                <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Encounters & Locations</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-400 mb-1">Wild Kanto Locations</h4>
                    <p className={`p-3 rounded ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                      {selectedPokemon.id === 150 ? 'Cerulean Cave (Post-Game)' :
                       selectedPokemon.id === 151 ? 'Special Event Distribution Only' :
                       selectedPokemon.id <= 9 ? 'Starter choices from Professor Oak' :
                       'Various routes and grassy regions throughout the Kanto continent.'}
                    </p>
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

          </div>
        </CardContent>
      </Card>
    </div>
  )
}
