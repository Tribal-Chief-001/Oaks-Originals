import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { usePokedexStore, Pokemon } from '@/hooks/usePokedexStore'

export const TeamBuilder: React.FC = () => {
  const {
    showTeamBuilder,
    setShowTeamBuilder,
    currentTeam,
    removeFromTeam,
    teamName,
    setTeamName,
    saveTeam,
    savedTeams,
    setCurrentTeam,
    deleteTeam,
    darkMode
  } = usePokedexStore()

  if (!showTeamBuilder) return null

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      normal: '⚪', fire: '🔥', water: '💧', electric: '⚡', grass: '🌿', ice: '❄️',
      fighting: '👊', poison: '☠️', ground: '🌍', flying: '🦅', psychic: '🔮', bug: '🐛',
      rock: '🪨', ghost: '👻', dragon: '🐉', dark: '🌙', steel: '⚙️', fairy: '🧚'
    }
    return icons[type] || '❓'
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
      weaknesses: results.filter(r => r.multiplier > 1).map(x => x.type),
      resistances: results.filter(r => r.multiplier < 1 && r.multiplier > 0).map(x => x.type),
      immunities: results.filter(r => r.multiplier === 0).map(x => x.type)
    }
  }

  const analyzeTeamSynergy = () => {
    if (currentTeam.length === 0) return null

    const typeCount: Record<string, number> = {}
    const weaknesses = new Set<string>()
    const resistances = new Set<string>()
    const immunities = new Set<string>()

    currentTeam.forEach(pokemon => {
      pokemon.types.forEach(type => {
        typeCount[type] = (typeCount[type] || 0) + 1
      })

      const eff = getComprehensiveTypeEffectiveness(pokemon.types)
      eff.weaknesses.forEach(w => weaknesses.add(w))
      eff.resistances.forEach(r => resistances.add(r))
      eff.immunities.forEach(i => immunities.add(i))
    })

    const totalStats = currentTeam.reduce((acc, p) => {
      const stats = p.stats || []
      return {
        hp: acc.hp + (stats.find(s => s.name === 'hp')?.value || 0),
        attack: acc.attack + (stats.find(s => s.name === 'attack')?.value || 0),
        defense: acc.defense + (stats.find(s => s.name === 'defense')?.value || 0),
        specialAttack: acc.specialAttack + (stats.find(s => s.name === 'special-attack')?.value || 0),
        specialDefense: acc.specialDefense + (stats.find(s => s.name === 'special-defense')?.value || 0),
        speed: acc.speed + (stats.find(s => s.name === 'speed')?.value || 0)
      }
    }, { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 })

    return {
      typeCount,
      weaknesses: Array.from(weaknesses),
      resistances: Array.from(resistances),
      immunities: Array.from(immunities),
      totalStats,
      averageStats: {
        hp: Math.round(totalStats.hp / currentTeam.length),
        attack: Math.round(totalStats.attack / currentTeam.length),
        defense: Math.round(totalStats.defense / currentTeam.length),
        specialAttack: Math.round(totalStats.specialAttack / currentTeam.length),
        specialDefense: Math.round(totalStats.specialDefense / currentTeam.length),
        speed: Math.round(totalStats.speed / currentTeam.length)
      }
    }
  }

  const loadTeam = (team: SavedTeam) => {
    // Look up Pokemon by ID
    const pokemonList = usePokedexStore.getState().pokemon
    const teamMembers = team.pokemonIds
      .map(id => pokemonList.find(p => p.id === id))
      .filter(Boolean) as Pokemon[]
    setCurrentTeam(teamMembers)
    setTeamName(team.name)
  }

  const synergy = analyzeTeamSynergy()

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className={`max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'border-blue-200'}`}>
        <CardHeader className={`pb-4 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-100'}`}>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Trainer Team Builder</CardTitle>
              <CardDescription>Assemble and analyze a team of 6 Kanto Pokemon</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTeamBuilder(false)}
              className="h-8 w-8 p-0 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          
          {/* Active Drafting Team */}
          <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <h3 className="font-semibold text-lg mb-3">Active Roster ({currentTeam.length}/6)</h3>
            {currentTeam.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Roster is empty. Click the team icon on Pokemon cards to add draft picks.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {currentTeam.map((poke) => (
                  <div key={poke.id} className={`relative rounded-lg p-3 text-center border shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <button
                      onClick={() => removeFromTeam(poke.id)}
                      className="absolute top-1 right-1 p-0.5 text-gray-400 hover:text-red-500 rounded-full"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <img src={poke.image} alt={poke.name} className="w-16 h-16 mx-auto object-contain mb-1" />
                    <p className="font-bold text-xs capitalize truncate">{poke.name}</p>
                    <div className="flex justify-center gap-1 mt-1">
                      {poke.types.map(t => (
                        <Badge key={t} variant="secondary" className={`text-xxs px-1 ${getTypeColor(t)}`}>
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentTeam.length > 0 && (
              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="Enter team name..."
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="max-w-xs"
                />
                <Button onClick={saveTeam} disabled={!teamName.trim()}>Save Team</Button>
              </div>
            )}
          </div>

          {/* Team Analysis Details */}
          {synergy && (
            <div className={`p-5 rounded-lg border ${darkMode ? 'bg-gray-700/30' : 'bg-white'}`}>
              <h3 className="font-semibold text-lg mb-4">Synergy & Coverage Report</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-bold text-sm text-gray-400 mb-2">Type Distribution</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(synergy.typeCount).map(([type, count]) => (
                      <Badge key={type} className={`text-xs capitalize ${getTypeColor(type)}`}>
                        {type}: {count}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-gray-400 mb-2">Average Stats</h4>
                  <div className="space-y-1 text-xs">
                    {Object.entries(synergy.averageStats).map(([stat, val]) => (
                      <div key={stat} className="flex justify-between">
                        <span className="capitalize">{stat.replace('special', 'Sp. ')}:</span>
                        <span className="font-bold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-red-500 mb-1">Shared Weaknesses</h4>
                    <div className="flex flex-wrap gap-1">
                      {synergy.weaknesses.map(w => (
                        <Badge key={w} variant="destructive" className="text-xxs capitalize">{w}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-green-500 mb-1">Shared Resistances</h4>
                    <div className="flex flex-wrap gap-1">
                      {synergy.resistances.map(r => (
                        <Badge key={r} variant="secondary" className="text-xxs capitalize">{r}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Saved Teams List */}
          {savedTeams.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Saved Teams</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedTeams.map((team) => (
                  <Card key={team.id} className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                    <CardContent className="p-4 flex justify-between items-start">
                      <div className="space-y-2">
                        <h4 className="font-bold capitalize">{team.name}</h4>
                        <p className="text-xxs text-gray-400">Created: {new Date(team.createdAt).toLocaleDateString()}</p>
                        <div className="flex gap-1.5 flex-wrap">
                          {team.pokemonIds.map(id => {
                            const pList = usePokedexStore.getState().pokemon
                            const name = pList.find(x => x.id === id)?.name || '?'
                            return (
                              <Badge key={id} variant="outline" className="text-xxs capitalize">{name}</Badge>
                            )
                          })}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Button size="sm" variant="outline" onClick={() => loadTeam(team)}>Load</Button>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => deleteTeam(team.id)}>Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
