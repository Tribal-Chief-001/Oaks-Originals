import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { usePokedexStore, Pokemon } from '@/hooks/usePokedexStore'

export const IvCalculator: React.FC = () => {
  const {
    showBreedingTools,
    setShowBreedingTools,
    pokemon,
    darkMode
  } = usePokedexStore()

  const [selectedPoke, setSelectedPoke] = useState<Pokemon | null>(null)
  const [level, setLevel] = useState<number>(50)
  const [nature, setNature] = useState<string>('neutral')
  const [stats, setStats] = useState({
    hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0
  })
  
  const [ivResults, setIvResults] = useState<Record<string, number> | null>(null)

  if (!showBreedingTools) return null

  const calculateIVs = () => {
    if (!selectedPoke) return

    const baseStats = selectedPoke.stats
    
    const calculateStatIV = (baseStat: number, currentStat: number, isHp: boolean = false) => {
      // Simplified Gen I/II style IV back-calculation
      const natureMod = nature === 'neutral' ? 1.0 : 1.0 // Simple baseline
      
      let iv = 0
      if (isHp) {
        // HP IV is based on level-based HP calculation
        iv = Math.floor((currentStat - level - 10) * 100 / level) - 2 * baseStat
      } else {
        // Other stats
        iv = Math.floor((Math.ceil(currentStat / natureMod) - 5) * 100 / level) - 2 * baseStat
      }
      return Math.max(0, Math.min(15, Math.floor(iv / 2))) // 0-15 scale
    }

    const hpBase = baseStats.find(s => s.name === 'hp')?.value || 0
    const atkBase = baseStats.find(s => s.name === 'attack')?.value || 0
    const defBase = baseStats.find(s => s.name === 'defense')?.value || 0
    const spAtkBase = baseStats.find(s => s.name === 'special-attack')?.value || 0
    const spDefBase = baseStats.find(s => s.name === 'special-defense')?.value || 0
    const speedBase = baseStats.find(s => s.name === 'speed')?.value || 0

    setIvResults({
      hp: calculateStatIV(hpBase, stats.hp, true),
      attack: calculateStatIV(atkBase, stats.attack),
      defense: calculateStatIV(defBase, stats.defense),
      specialAttack: calculateStatIV(spAtkBase, stats.specialAttack),
      specialDefense: calculateStatIV(spDefBase, stats.specialDefense),
      speed: calculateStatIV(speedBase, stats.speed)
    })
  }

  const getIVColor = (iv: number) => {
    if (iv >= 14) return 'text-green-500 font-bold'
    if (iv >= 10) return 'text-yellow-500'
    if (iv >= 6) return 'text-orange-500'
    return 'text-red-500'
  }

  const getHiddenPower = () => {
    if (!ivResults) return null
    // Simple math computation mapping Gen II HP type based on IV parity (odd/even)
    const a = ivResults.attack % 2
    const b = ivResults.defense % 2
    const c = ivResults.speed % 2
    const d = ivResults.specialAttack % 2
    
    const index = (a + 2*b + 4*c + 8*d) % 16
    const types = ['Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark']
    const power = 31 + Math.floor(((a * 1 + b * 2 + c * 4 + d * 8) * 40) / 15)
    return { type: types[index], power }
  }

  const hpInfo = getHiddenPower()

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'border-blue-200'}`}>
        <CardHeader className={`pb-4 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-green-50 to-emerald-100'}`}>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">IV & Hidden Power Calculator</CardTitle>
              <CardDescription>Determine individual values and battle characteristics</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBreedingTools(false)}
              className="h-8 w-8 p-0 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Pokemon</label>
                <select
                  value={selectedPoke?.id || ''}
                  onChange={(e) => setSelectedPoke(pokemon.find(p => p.id === parseInt(e.target.value)) || null)}
                  className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'}`}
                >
                  <option value="">Select Pokemon</option>
                  {pokemon.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Level: {level}</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={level}
                  onChange={(e) => setLevel(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nature</label>
                <select
                  value={nature}
                  onChange={(e) => setNature(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'}`}
                >
                  <option value="neutral">Neutral</option>
                  <option value="atk-up">Atk Up (+Atk, -SpA)</option>
                  <option value="def-up">Def Up (+Def, -SpA)</option>
                  <option value="spa-up">Sp. Atk Up (+SpA, -Atk)</option>
                  <option value="spd-up">Sp. Def Up (+SpD, -Atk)</option>
                  <option value="spe-up">Speed Up (+Spe, -Atk)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Trainer Stat Values</h4>
              {['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'].map(s => (
                <div key={s} className="flex items-center gap-3">
                  <label className="w-24 text-xs font-semibold capitalize">{s.replace('special', 'Sp. ')}:</label>
                  <Input
                    type="number"
                    value={stats[s as keyof typeof stats] || ''}
                    onChange={(e) => setStats({ ...stats, [s]: parseInt(e.target.value) || 0 })}
                    className="flex-1"
                  />
                </div>
              ))}
              <Button className="w-full" onClick={calculateIVs} disabled={!selectedPoke}>Calculate IVs</Button>
            </div>
          </div>

          {ivResults && (
            <div className={`p-5 rounded-lg border ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
              <h4 className="font-semibold text-md mb-4 text-center">IV Results (Gen I/II Scale: 0 - 15)</h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                {Object.entries(ivResults).map(([statName, value]) => (
                  <div key={statName} className="p-2 border rounded bg-white dark:bg-gray-800">
                    <p className={`text-xl ${getIVColor(value)}`}>{value}</p>
                    <p className="text-xxs uppercase font-semibold text-gray-400 mt-1">{statName.replace('special', 'Sp ')}</p>
                  </div>
                ))}
              </div>

              {hpInfo && (
                <div className="mt-6 pt-4 border-t text-center space-y-1">
                  <h5 className="font-bold text-sm text-gray-400">Calculated Hidden Power</h5>
                  <p className="text-xl font-bold text-green-500">{hpInfo.type} Type</p>
                  <p className="text-sm font-semibold text-gray-400">Base Power: {hpInfo.power}</p>
                </div>
              )}
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
