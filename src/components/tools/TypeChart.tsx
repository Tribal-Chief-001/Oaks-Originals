import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { usePokedexStore } from '@/hooks/usePokedexStore'

export const TypeChart: React.FC = () => {
  const {
    showTypeChart,
    setShowTypeChart,
    typeChartMode,
    setTypeChartMode,
    selectedType1,
    setSelectedType1,
    selectedType2,
    setSelectedType2,
    currentTeam,
    darkMode
  } = usePokedexStore()

  if (!showTypeChart) return null

  const allTypes = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']

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

  const getEffectivenessColor = (m: number) => {
    if (m === 0) return 'text-gray-500 font-bold'
    if (m === 0.25) return 'text-green-700 font-bold'
    if (m === 0.5) return 'text-green-500'
    if (m === 2) return 'text-red-500'
    if (m === 4) return 'text-red-700 font-bold'
    return 'text-gray-400'
  }

  const analyzeTeamCoverage = () => {
    const coverage: Record<string, number> = {}
    allTypes.forEach(t => { coverage[t] = 1 })

    currentTeam.forEach(p => {
      p.types.forEach(atkType => {
        allTypes.forEach(defType => {
          const mult = getTypeEffectiveness(atkType, [defType])
          if (mult > coverage[defType]) {
            coverage[defType] = mult // Record best offensive coverage
          }
        })
      })
    })

    return Object.entries(coverage).map(([type, effectiveness]) => ({
      type,
      effectiveness
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className={`max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'border-blue-200'}`}>
        <CardHeader className={`pb-4 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-red-50 to-orange-100'}`}>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Type Chart & Coverage Analysis</CardTitle>
              <CardDescription>Verify elemental types compatibility and coverage</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTypeChart(false)}
              className="h-8 w-8 p-0 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="flex gap-2 border-b pb-2">
            {(['chart', 'calculator', 'coverage'] as const).map(mode => (
              <Button
                key={mode}
                variant={typeChartMode === mode ? 'default' : 'outline'}
                onClick={() => setTypeChartMode(mode)}
                size="sm"
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </div>

          {/* Matrix Chart View */}
          {typeChartMode === 'chart' && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Atk \ Def</th>
                    {allTypes.map(t => (
                      <th key={t} className="p-1 min-w-[50px] capitalize">
                        <Badge variant="secondary" className={`text-xxs px-1 ${getTypeColor(t)}`}>{t.slice(0, 3)}</Badge>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allTypes.map(atkType => (
                    <tr key={atkType} className="border-b hover:bg-gray-50/5">
                      <td className="p-2 text-left font-bold capitalize">
                        <Badge variant="secondary" className={`text-xxs ${getTypeColor(atkType)}`}>{atkType}</Badge>
                      </td>
                      {allTypes.map(defType => {
                        const mult = getTypeEffectiveness(atkType, [defType])
                        return (
                          <td key={defType} className={`p-1 font-semibold ${getEffectivenessColor(mult)}`}>
                            {mult === 1 ? '-' : `${mult}x`}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Calculator View */}
          {typeChartMode === 'calculator' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type 1</label>
                  <select
                    value={selectedType1}
                    onChange={(e) => setSelectedType1(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'}`}
                  >
                    <option value="">Select Type</option>
                    {allTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type 2 (Optional)</label>
                  <select
                    value={selectedType2}
                    onChange={(e) => setSelectedType2(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'}`}
                  >
                    <option value="">None</option>
                    {allTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedType1 && (
                <div className={`p-4 rounded border ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`}>
                  <h4 className="font-semibold text-sm mb-3">Vulnerability Mapping</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {allTypes.map(atkType => {
                      const def = selectedType2 ? [selectedType1, selectedType2] : [selectedType1]
                      const mult = getTypeEffectiveness(atkType, def)
                      return (
                        <div key={atkType} className="flex justify-between p-1.5 border rounded">
                          <span className="capitalize">{atkType}:</span>
                          <span className={getEffectivenessColor(mult)}>{mult}x</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Offensive Coverage View */}
          {typeChartMode === 'coverage' && (
            <div className="space-y-4">
              {currentTeam.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Roster is empty. Build a team first to analyze offensive coverage.</p>
              ) : (
                <div className={`p-4 rounded border ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`}>
                  <h4 className="font-semibold text-sm mb-3">Team Offensive Coverage Matrix</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    {analyzeTeamCoverage().map(({ type, effectiveness }) => (
                      <div key={type} className="flex justify-between p-2 border rounded">
                        <span className="capitalize font-medium">{type}:</span>
                        <span className={`font-bold ${getEffectivenessColor(effectiveness)}`}>
                          {effectiveness > 1 ? `Super Effective (${effectiveness}x)` : `${effectiveness}x`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
