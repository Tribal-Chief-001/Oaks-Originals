import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { usePokedexStore, Pokemon } from '@/hooks/usePokedexStore'

export const DamageCalculator: React.FC = () => {
  const {
    showDamageCalculator,
    setShowDamageCalculator,
    pokemon,
    darkMode
  } = usePokedexStore()

  const [attacker, setAttacker] = useState<Pokemon | null>(null)
  const [defender, setDefender] = useState<Pokemon | null>(null)
  const [selectedMove, setSelectedMove] = useState<string>('')
  
  // Standard moves list for calculations
  const [movesList, setMovesList] = useState<Array<{ name: string; type: string; power: number; category: string }>>([])
  const [damageResult, setDamageResult] = useState<{ minDamage: number; maxDamage: number; percentage: number } | null>(null)

  useEffect(() => {
    // Generate a default list of popular Kanto moves
    setMovesList([
      { name: 'Fire Blast', type: 'fire', power: 120, category: 'special' },
      { name: 'Flamethrower', type: 'fire', power: 95, category: 'special' },
      { name: 'Surf', type: 'water', power: 95, category: 'special' },
      { name: 'Hydro Pump', type: 'water', power: 120, category: 'special' },
      { name: 'Thunderbolt', type: 'electric', power: 95, category: 'special' },
      { name: 'Thunder', type: 'electric', power: 120, category: 'special' },
      { name: 'Razor Leaf', type: 'grass', power: 55, category: 'special' },
      { name: 'Solar Beam', type: 'grass', power: 120, category: 'special' },
      { name: 'Ice Beam', type: 'ice', power: 95, category: 'special' },
      { name: 'Blizzard', type: 'ice', power: 120, category: 'special' },
      { name: 'Earthquake', type: 'ground', power: 100, category: 'physical' },
      { name: 'Rock Slide', type: 'rock', power: 75, category: 'physical' },
      { name: 'Psychic', type: 'psychic', power: 90, category: 'special' },
      { name: 'Body Slam', type: 'normal', power: 85, category: 'physical' },
      { name: 'Hyper Beam', type: 'normal', power: 150, category: 'physical' }
    ])
  }, [])

  if (!showDamageCalculator) return null

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

  const handleCalculate = () => {
    if (!attacker || !defender || !selectedMove) return

    const move = movesList.find(m => m.name === selectedMove)
    if (!move) return

    // Attacker Stat selection
    const atkStat = move.category === 'physical'
      ? (attacker.stats.find(s => s.name === 'attack')?.value || 0)
      : (attacker.stats.find(s => s.name === 'special-attack')?.value || 0)

    // Defender Stat selection
    const defStat = move.category === 'physical'
      ? (defender.stats.find(s => s.name === 'defense')?.value || 0)
      : (defender.stats.find(s => s.name === 'special-defense')?.value || 0)

    const defenderHP = defender.stats.find(s => s.name === 'hp')?.value || 1

    const level = 50 // Assume level 50 for calculations
    const typeMult = getTypeEffectiveness(move.type, defender.types)
    const stab = attacker.types.includes(move.type) ? 1.5 : 1

    // Simplified Pokemon Gen I damage formula
    const baseDamage = Math.floor((2 * level / 5 + 2) * move.power * atkStat / defStat / 50 + 2)
    const totalDamage = Math.floor(baseDamage * stab * typeMult)

    const minDamage = Math.floor(totalDamage * 0.85)
    const maxDamage = totalDamage
    const percentage = Math.round((minDamage / defenderHP) * 100)

    setDamageResult({
      minDamage,
      maxDamage,
      percentage
    })
  }

  const moveDetail = movesList.find(m => m.name === selectedMove)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'border-blue-200'}`}>
        <CardHeader className={`pb-4 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-100'}`}>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Damage Calculator</CardTitle>
              <CardDescription>Determine battle outcomes between two Pokemon</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDamageCalculator(false)}
              className="h-8 w-8 p-0 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Attacker Pick */}
            <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h4 className="font-semibold mb-3">Attacker</h4>
              <select
                value={attacker?.id || ''}
                onChange={(e) => setAttacker(pokemon.find(p => p.id === parseInt(e.target.value)) || null)}
                className={`w-full px-3 py-2 border rounded-md mb-3 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'}`}
              >
                <option value="">Select Pokemon</option>
                {pokemon.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {attacker && (
                <div className="flex items-center gap-3">
                  <img src={attacker.image} alt={attacker.name} className="w-12 h-12 object-contain" />
                  <div>
                    <p className="font-bold capitalize">{attacker.name}</p>
                    <div className="flex gap-1 mt-0.5">
                      {attacker.types.map(t => (
                        <Badge key={t} variant="secondary" className={`text-xxs ${getTypeColor(t)}`}>{t}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Defender Pick */}
            <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h4 className="font-semibold mb-3">Defender</h4>
              <select
                value={defender?.id || ''}
                onChange={(e) => setDefender(pokemon.find(p => p.id === parseInt(e.target.value)) || null)}
                className={`w-full px-3 py-2 border rounded-md mb-3 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'}`}
              >
                <option value="">Select Pokemon</option>
                {pokemon.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {defender && (
                <div className="flex items-center gap-3">
                  <img src={defender.image} alt={defender.name} className="w-12 h-12 object-contain" />
                  <div>
                    <p className="font-bold capitalize">{defender.name}</p>
                    <div className="flex gap-1 mt-0.5">
                      {defender.types.map(t => (
                        <Badge key={t} variant="secondary" className={`text-xxs ${getTypeColor(t)}`}>{t}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Move Pick */}
          {attacker && defender && (
            <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h4 className="font-semibold mb-3">Attack Move</h4>
              <select
                value={selectedMove}
                onChange={(e) => setSelectedMove(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md mb-3 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'}`}
              >
                <option value="">Select Move</option>
                {movesList.map(m => (
                  <option key={m.name} value={m.name}>{m.name}</option>
                ))}
              </select>

              {moveDetail && (
                <div className="grid grid-cols-3 gap-4 text-sm mt-2">
                  <div>
                    <span className="text-gray-400 block">Type:</span>
                    <Badge variant="secondary" className={`capitalize text-xs ${getTypeColor(moveDetail.type)}`}>{moveDetail.type}</Badge>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Base Power:</span>
                    <span className="font-semibold">{moveDetail.power}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Category:</span>
                    <span className="font-semibold capitalize">{moveDetail.category}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {attacker && defender && selectedMove && (
            <div className="text-center">
              <Button size="lg" onClick={handleCalculate}>Calculate Damage</Button>
            </div>
          )}

          {/* Results Output */}
          {damageResult && (
            <div className={`p-5 rounded-lg border text-center ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
              <h4 className="font-semibold text-lg mb-4">Damage Result</h4>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold">{damageResult.minDamage} - {damageResult.maxDamage}</div>
                  <div className="text-xs text-gray-400">Total Damage</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{damageResult.percentage}%</div>
                  <div className="text-xs text-gray-400">of Defender HP</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${damageResult.percentage >= 100 ? 'text-red-500' : damageResult.percentage >= 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {damageResult.percentage >= 100 ? 'Guaranteed OHKO' : damageResult.percentage >= 50 ? 'Possible 2HKO' : '3HKO+'}
                  </div>
                  <div className="text-xs text-gray-400">Battle Estimate</div>
                </div>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
