import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Plus, Minus, RefreshCw, Sparkles, Heart, Calculator } from 'lucide-react'
import { usePokedexStore, Pokemon } from '@/hooks/usePokedexStore'
import { toast } from 'sonner'

export const IvCalculator: React.FC = () => {
  const {
    showBreedingTools,
    setShowBreedingTools,
    pokemon,
    darkMode,
    pokedexData,
    playCry
  } = usePokedexStore()

  // Tab State
  const [activeSubTab, setActiveSubTab] = useState<'iv' | 'breeding' | 'hunting'>('iv')

  // Sparkle overlay state for Shiny Finder
  const [sparkles, setSparkles] = useState<Array<{ id: number; left: number; top: number; size: number }>>([])

  // ==========================================
  // 1. IV Calculator State & Logic
  // ==========================================
  const [selectedPoke, setSelectedPoke] = useState<Pokemon | null>(null)
  const [level, setLevel] = useState<number>(50)
  const [nature, setNature] = useState<string>('neutral')
  const [stats, setStats] = useState({
    hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0
  })
  const [ivResults, setIvResults] = useState<Record<string, number> | null>(null)

  const calculateIVs = () => {
    if (!selectedPoke) return

    const baseStats = selectedPoke.stats
    const calculateStatIV = (baseStat: number, currentStat: number, isHp: boolean = false) => {
      const natureMod = nature === 'neutral' ? 1.0 : 1.0 // Gen 1 simple baseline
      let iv = 0
      if (isHp) {
        iv = Math.floor((currentStat - level - 10) * 100 / level) - 2 * baseStat
      } else {
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

  // ==========================================
  // 2. Breeding Matcher State & Logic
  // ==========================================
  const [parentA, setParentA] = useState<Pokemon | null>(null)
  const [parentB, setParentB] = useState<Pokemon | null>(null)
  const [genderA, setGenderA] = useState<string>('Male')
  const [genderB, setGenderB] = useState<string>('Female')

  // Determine allowed genders based on species gender ratio
  const getAllowedGenders = (p: Pokemon | null) => {
    if (!p) return ['Male', 'Female']
    const ratio = p.genderRatio || ''
    if (ratio.toLowerCase().includes('genderless')) return ['Genderless']
    if (ratio.toLowerCase().includes('100% female') || ratio.toLowerCase().includes('100% f')) return ['Female']
    if (ratio.toLowerCase().includes('100% male') || ratio.toLowerCase().includes('100% m')) return ['Male']
    return ['Male', 'Female']
  }

  // Sync gender states when parent selection changes
  useEffect(() => {
    if (parentA) {
      const allowed = getAllowedGenders(parentA)
      if (!allowed.includes(genderA)) setGenderA(allowed[0])
    }
  }, [parentA])

  useEffect(() => {
    if (parentB) {
      const allowed = getAllowedGenders(parentB)
      if (!allowed.includes(genderB)) setGenderB(allowed[0])
    }
  }, [parentB])

  const breedingCheck = () => {
    if (!parentA || !parentB) return null

    const isDittoA = parentA.id === 132
    const isDittoB = parentB.id === 132

    if (isDittoA && isDittoB) {
      return { compatible: false, reason: 'Ditto cannot breed with another Ditto.' }
    }

    const groupsA = parentA.eggGroups || []
    const groupsB = parentB.eggGroups || []

    const isUndiscoveredA = groupsA.includes('undiscovered') || groupsA.includes('no-eggs') || groupsA.length === 0
    const isUndiscoveredB = groupsB.includes('undiscovered') || groupsB.includes('no-eggs') || groupsB.length === 0

    if (isUndiscoveredA || isUndiscoveredB) {
      return { compatible: false, reason: 'Legendary and Baby Pokémon cannot breed.' }
    }

    if (isDittoA || isDittoB) {
      return {
        compatible: true,
        reason: 'Compatible! Ditto is a universal partner.',
        rate: 60,
        rateText: 'They get along moderately.'
      }
    }

    if (genderA === genderB && genderA !== 'Genderless') {
      return { compatible: false, reason: 'Breeding partners must be of opposite genders.' }
    }

    if (genderA === 'Genderless' || genderB === 'Genderless') {
      return { compatible: false, reason: 'Genderless Pokémon can only breed with Ditto.' }
    }

    const sharedGroup = groupsA.find(g => groupsB.includes(g))
    if (!sharedGroup) {
      return { compatible: false, reason: 'Breeding partners do not share any Egg Groups.' }
    }

    const sameSpecies = parentA.id === parentB.id
    const rate = sameSpecies ? 70 : 50
    const rateText = sameSpecies ? 'They seem to get along very well!' : 'They seem to get along.'

    return {
      compatible: true,
      reason: `Compatible! Shared Group: ${sharedGroup.replace(/-/g, ' ').toUpperCase()}`,
      rate,
      rateText
    }
  }

  const breedResult = breedingCheck()

  const getOffspring = () => {
    if (!parentA || !parentB || !breedResult || !breedResult.compatible) return null
    const isDittoA = parentA.id === 132
    const isDittoB = parentB.id === 132

    let targetParent = parentA
    if (isDittoA) {
      targetParent = parentB
    } else if (isDittoB) {
      targetParent = parentA
    } else {
      targetParent = genderA === 'Female' ? parentA : parentB
    }

    // Trace back to first evolution stage
    if (targetParent.evolutionChain && targetParent.evolutionChain.length > 0) {
      const baseId = targetParent.evolutionChain[0].id
      const basePoke = pokemon.find(p => p.id === baseId)
      if (basePoke) return basePoke
    }
    return targetParent
  }

  const offspring = getOffspring()

  // ==========================================
  // 3. Shiny Hunter State & Logic
  // ==========================================
  const [hunterTargetId, setHunterTargetId] = useState<number>(1)
  const [huntMethod, setHuntMethod] = useState<'catch-combo' | 'soft-reset' | 'masuda'>('catch-combo')
  const [chainCount, setChainCount] = useState<number>(0)
  const [hasShinyCharm, setHasShinyCharm] = useState<boolean>(false)
  const [shiniesSession, setShiniesSession] = useState<number>(0)

  // Load shiny hunt states from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTarget = localStorage.getItem('pokedex_hunt_target')
      const savedCount = localStorage.getItem('pokedex_hunt_count')
      const savedMethod = localStorage.getItem('pokedex_hunt_method')
      const savedCharm = localStorage.getItem('pokedex_hunt_charm')
      const savedSession = localStorage.getItem('pokedex_hunt_session')

      if (savedTarget) setHunterTargetId(parseInt(savedTarget))
      if (savedCount) setChainCount(parseInt(savedCount))
      if (savedMethod) setHuntMethod(savedMethod as any)
      if (savedCharm) setHasShinyCharm(savedCharm === 'true')
      if (savedSession) setShiniesSession(parseInt(savedSession))
    }
  }, [])

  // Sync shiny hunt states to local storage
  const saveHuntState = (newCount: number) => {
    setChainCount(newCount)
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokedex_hunt_count', String(newCount))
    }
  }

  const changeHunterTarget = (id: number) => {
    setHunterTargetId(id)
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokedex_hunt_target', String(id))
    }
  }

  const changeHuntMethod = (method: string) => {
    setHuntMethod(method as any)
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokedex_hunt_method', method)
    }
  }

  const changeShinyCharm = (val: boolean) => {
    setHasShinyCharm(val)
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokedex_hunt_charm', String(val))
    }
  }

  const getShinyOdds = () => {
    let denominator = 8192
    if (huntMethod === 'soft-reset') {
      denominator = hasShinyCharm ? 2730 : 8192
    } else if (huntMethod === 'masuda') {
      denominator = hasShinyCharm ? 512 : 1638
    } else if (huntMethod === 'catch-combo') {
      if (chainCount >= 31) {
        denominator = hasShinyCharm ? 273 : 341
      } else if (chainCount >= 21) {
        denominator = hasShinyCharm ? 409 : 512
      } else if (chainCount >= 11) {
        denominator = hasShinyCharm ? 682 : 1024
      } else {
        denominator = hasShinyCharm ? 1365 : 4096
      }
    }
    const percentage = (1 / denominator) * 100
    return { denominator, percentage }
  }

  const odds = getShinyOdds()

  const handleShinyFound = async () => {
    const target = pokemon.find(p => p.id === hunterTargetId)
    if (!target) return

    // Play Target Cry & Sparkle sound
    playCry(hunterTargetId)

    // Trigger Sparkles Overlay
    const newSparkles = Array.from({ length: 25 }).map((_, idx) => ({
      id: Date.now() + idx,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 20 + 10
    }))
    setSparkles(newSparkles)
    setTimeout(() => setSparkles([]), 1200)

    // Increment session shiny counter
    const newSessionVal = shiniesSession + 1
    setShiniesSession(newSessionVal)
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokedex_hunt_session', String(newSessionVal))
    }

    // Sync database state: set as Caught + Shiny in the Pokedex
    usePokedexStore.setState({
      pokedexData: {
        ...pokedexData,
        [hunterTargetId]: { seen: true, caught: true, shiny: true }
      }
    })

    try {
      await fetch('/api/tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pokemonId: hunterTargetId,
          seen: true,
          caught: true,
          shiny: true
        })
      })
      toast.success(`Shiny ${target.name} registered in your Pokedex! ✨`)
    } catch (e) {
      console.error('Failed to sync shiny tracker to DB:', e)
    }
  }

  if (!showBreedingTools) return null

  const hunterTarget = pokemon.find(p => p.id === hunterTargetId) || pokemon[0]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-2xl relative transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-blue-200 bg-white'}`}>
        
        {/* Sparkles Animation Overlay */}
        {sparkles.map((sp) => (
          <div
            key={sp.id}
            className="absolute z-50 pointer-events-none text-yellow-400 animate-sparkle"
            style={{
              left: `${sp.left}%`,
              top: `${sp.top}%`,
              fontSize: `${sp.size}px`
            }}
          >
            ✨
          </div>
        ))}

        <CardHeader className={`pb-4 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-100'}`}>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500 fill-current" />
                V3 Breeder & Hunter Dashboard
              </CardTitle>
              <CardDescription className={`${darkMode ? 'text-gray-300' : 'text-gray-650'}`}>
                Advanced IV calculators, egg compatibility matchers, and shiny chain statistics tools
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBreedingTools(false)}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-200/50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Sub Tab Navigation */}
          <div className="flex gap-2 mt-4 border-b border-gray-200/35 pb-1">
            <Button
              variant={activeSubTab === 'iv' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveSubTab('iv')}
              className="flex items-center gap-1.5 text-xs font-semibold"
            >
              <Calculator className="w-3.5 h-3.5" />
              IV Calculator
            </Button>
            <Button
              variant={activeSubTab === 'breeding' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveSubTab('breeding')}
              className="flex items-center gap-1.5 text-xs font-semibold"
            >
              <Heart className="w-3.5 h-3.5" />
              Breeding Matcher
            </Button>
            <Button
              variant={activeSubTab === 'hunting' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveSubTab('hunting')}
              className="flex items-center gap-1.5 text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Shiny Hunter Counter
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* ========================================================
              TAB 1: IV CALCULATOR
             ======================================================== */}
          {activeSubTab === 'iv' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Select Pokémon</label>
                    <select
                      value={selectedPoke?.id || ''}
                      onChange={(e) => setSelectedPoke(pokemon.find(p => p.id === parseInt(e.target.value)) || null)}
                      className={`w-full px-3 py-2 border rounded-md text-sm outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                    >
                      <option value="">Choose Pokémon...</option>
                      {pokemon.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Level: {level}</label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={level}
                      onChange={(e) => setLevel(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Nature</label>
                    <select
                      value={nature}
                      onChange={(e) => setNature(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md text-sm outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                    >
                      <option value="neutral">Neutral (Serious, Hardy, Bashful)</option>
                      <option value="atk-up">Atk Up (+Atk, -SpA)</option>
                      <option value="def-up">Def Up (+Def, -SpA)</option>
                      <option value="spa-up">Sp. Atk Up (+SpA, -Atk)</option>
                      <option value="spd-up">Sp. Def Up (+SpD, -Atk)</option>
                      <option value="spe-up">Speed Up (+Spe, -Atk)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-xs uppercase text-gray-400">Trainer Stat Values</h4>
                  {['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'].map(s => (
                    <div key={s} className="flex items-center gap-3">
                      <label className="w-24 text-xs font-semibold capitalize text-gray-400">{s.replace('special', 'Sp. ')}:</label>
                      <Input
                        type="number"
                        value={stats[s as keyof typeof stats] || ''}
                        onChange={(e) => setStats({ ...stats, [s]: parseInt(e.target.value) || 0 })}
                        className={`flex-1 text-sm ${darkMode ? 'bg-gray-700 border-gray-650' : ''}`}
                      />
                    </div>
                  ))}
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold" onClick={calculateIVs} disabled={!selectedPoke}>
                    Calculate IVs
                  </Button>
                </div>
              </div>

              {ivResults && (
                <div className={`p-5 rounded-lg border animate-in fade-in duration-300 ${darkMode ? 'bg-gray-700/30 border-gray-650' : 'bg-gray-50 border-gray-200'}`}>
                  <h4 className="font-semibold text-md mb-4 text-center">IV Results (Gen I/II Scale: 0 - 15)</h4>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                    {Object.entries(ivResults).map(([statName, value]) => (
                      <div key={statName} className={`p-2 border rounded shadow-sm ${darkMode ? 'bg-gray-800 border-gray-650' : 'bg-white border-gray-200'}`}>
                        <p className={`text-xl ${getIVColor(value)}`}>{value}</p>
                        <p className="text-xxs uppercase font-semibold text-gray-450 mt-1">{statName.replace('special', 'Sp ')}</p>
                      </div>
                    ))}
                  </div>

                  {hpInfo && (
                    <div className={`mt-6 pt-4 border-t text-center space-y-1 ${darkMode ? 'border-gray-650' : 'border-gray-200'}`}>
                      <h5 className="font-bold text-xs uppercase text-gray-400">Calculated Hidden Power</h5>
                      <p className="text-xl font-bold text-emerald-500">{hpInfo.type} Type</p>
                      <p className="text-xs font-semibold text-gray-450">Base Power: {hpInfo.power}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 2: BREEDING MATCHER
             ======================================================== */}
          {activeSubTab === 'breeding' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Parent A Selection */}
                <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700/20 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <h4 className="font-bold text-xs uppercase text-gray-400 mb-3 text-center">Parent A (Left Breeder)</h4>
                  <select
                    value={parentA?.id || ''}
                    onChange={(e) => setParentA(pokemon.find(p => p.id === parseInt(e.target.value)) || null)}
                    className={`w-full px-3 py-2 border rounded-md text-sm outline-none mb-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                  >
                    <option value="">Select Parent A...</option>
                    {pokemon.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>

                  {parentA && (
                    <div className="text-center space-y-2 animate-in fade-in duration-300">
                      <img src={parentA.image} alt={parentA.name} className="w-24 h-24 object-contain mx-auto bg-white/10 dark:bg-black/10 rounded-full p-2 border border-gray-200/20" />
                      <p className="font-bold text-md capitalize">{parentA.name}</p>
                      <p className="text-xxs text-gray-400 capitalize">Groups: {parentA.eggGroups?.join(', ') || 'None'}</p>

                      <div className="flex justify-center gap-2 mt-2">
                        {getAllowedGenders(parentA).map(g => (
                          <Button
                            key={g}
                            variant={genderA === g ? 'default' : 'outline'}
                            size="xs"
                            onClick={() => setGenderA(g)}
                            className="text-xxs"
                          >
                            {g === 'Male' ? '♂️ Male' : g === 'Female' ? '♀️ Female' : '⚪ Genderless'}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Parent B Selection */}
                <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700/20 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <h4 className="font-bold text-xs uppercase text-gray-400 mb-3 text-center">Parent B (Right Breeder)</h4>
                  <select
                    value={parentB?.id || ''}
                    onChange={(e) => setParentB(pokemon.find(p => p.id === parseInt(e.target.value)) || null)}
                    className={`w-full px-3 py-2 border rounded-md text-sm outline-none mb-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                  >
                    <option value="">Select Parent B...</option>
                    {pokemon.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>

                  {parentB && (
                    <div className="text-center space-y-2 animate-in fade-in duration-300">
                      <img src={parentB.image} alt={parentB.name} className="w-24 h-24 object-contain mx-auto bg-white/10 dark:bg-black/10 rounded-full p-2 border border-gray-200/20" />
                      <p className="font-bold text-md capitalize">{parentB.name}</p>
                      <p className="text-xxs text-gray-400 capitalize">Groups: {parentB.eggGroups?.join(', ') || 'None'}</p>

                      <div className="flex justify-center gap-2 mt-2">
                        {getAllowedGenders(parentB).map(g => (
                          <Button
                            key={g}
                            variant={genderB === g ? 'default' : 'outline'}
                            size="xs"
                            onClick={() => setGenderB(g)}
                            className="text-xxs"
                          >
                            {g === 'Male' ? '♂️ Male' : g === 'Female' ? '♀️ Female' : '⚪ Genderless'}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Breeding Results Output */}
              {parentA && parentB && breedResult && (
                <div className={`p-5 rounded-lg border text-center animate-in zoom-in-95 duration-300 ${darkMode ? 'bg-gray-700/30 border-gray-650' : 'bg-gray-50 border-gray-200'}`}>
                  {breedResult.compatible ? (
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full text-xs font-bold">
                        ❤️ {breedResult.reason}
                      </div>
                      <p className="text-sm font-semibold">{breedResult.rateText} ({breedResult.rate}% Breeding Rate)</p>

                      {offspring && (
                        <div className="max-w-xs mx-auto border rounded-xl p-4 shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-4 animate-in slide-in-from-bottom duration-500">
                          <h5 className="font-bold text-xs uppercase text-gray-400 mb-1">Expected Egg Offspring</h5>
                          <img src={offspring.image} alt={offspring.name} className="w-16 h-16 object-contain mx-auto bg-gray-100 dark:bg-gray-900 rounded p-1 mb-2" />
                          <p className="font-bold text-sm capitalize">{offspring.name}</p>
                          <div className="mt-2 text-xxs text-gray-400 space-y-1">
                            <p>Egg Cycles: {offspring.eggCycles || 20} cycles</p>
                            <p>Estimated Hatch Steps: {((offspring.eggCycles || 20) * 256).toLocaleString()} steps</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-1.5 rounded-full text-xs font-bold">
                        🚫 Breeding Blocked
                      </div>
                      <p className="text-sm text-gray-400 mt-2">{breedResult.reason}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 3: SHINY HUNTER COUNTER
             ======================================================== */}
          {activeSubTab === 'hunting' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Target selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Hunting Target</label>
                    <select
                      value={hunterTargetId}
                      onChange={(e) => changeHunterTarget(parseInt(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-md text-sm outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                    >
                      {pokemon.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Method select */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Method</label>
                    <select
                      value={huntMethod}
                      onChange={(e) => changeHuntMethod(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md text-sm outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
                    >
                      <option value="catch-combo">Catch Combo (Let's Go style)</option>
                      <option value="soft-reset">Soft Reset (Legendaries / Static)</option>
                      <option value="masuda">Masuda Method (Egg Hatching)</option>
                    </select>
                  </div>

                  {/* Shiny Charm Toggle */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="shinyCharm"
                      checked={hasShinyCharm}
                      onChange={(e) => changeShinyCharm(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="shinyCharm" className="text-xs font-semibold text-gray-350 cursor-pointer">
                      Equip Shiny Charm (Boosts Odds)
                    </label>
                  </div>
                </div>

                {/* Counter & Display */}
                <div className={`p-4 rounded-lg border text-center flex flex-col justify-between ${darkMode ? 'bg-gray-700/20 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <div>
                    <h5 className="font-bold text-xs uppercase text-gray-400 mb-2">Current Combo Chain</h5>
                    <div className="text-5xl font-black text-blue-500 font-mono tracking-tight my-2">
                      {chainCount.toString().padStart(4, '0')}
                    </div>
                  </div>

                  <div className="flex justify-center gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => saveHuntState(Math.max(0, chainCount - 1))}>
                      <Minus className="w-4 h-4 mr-1" /> -1
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => saveHuntState(chainCount + 1)}>
                      <Plus className="w-4 h-4 mr-1" /> +1
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => saveHuntState(chainCount + 5)}>
                      +5
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => saveHuntState(0)}>
                      <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reset
                    </Button>
                  </div>
                </div>
              </div>

              {/* Statistics & Success action */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Probability Card */}
                <div className={`p-4 rounded-lg border space-y-2 ${darkMode ? 'bg-gray-700/30 border-gray-650' : 'bg-white border-gray-200 shadow-sm'}`}>
                  <h5 className="font-bold text-xs uppercase text-gray-400">Current Probability</h5>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-yellow-500">1 in {odds.denominator}</span>
                    <span className="text-xs text-gray-400 font-semibold">({odds.percentage.toFixed(4)}%)</span>
                  </div>
                  <p className="text-xxs text-gray-400 leading-relaxed">
                    {huntMethod === 'catch-combo' && 'Catch combo increases odds. Maximizes at 31+ chain.'}
                    {huntMethod === 'masuda' && 'Breeding foreign Pokémon. Constant odds throughout.'}
                    {huntMethod === 'soft-reset' && 'Resetting static spawn. Odds stay constant.'}
                  </p>
                </div>

                {/* Found Card */}
                <div className={`p-4 rounded-lg border flex flex-col justify-between items-center text-center ${darkMode ? 'bg-gray-700/30 border-gray-650' : 'bg-white border-gray-200 shadow-sm'}`}>
                  <div>
                    <h5 className="font-bold text-xs uppercase text-gray-400">Hunt Session Log</h5>
                    <p className="text-xs text-yellow-500 font-bold mt-1">✨ Shinies Found This Session: {shiniesSession}</p>
                  </div>

                  <Button
                    onClick={handleShinyFound}
                    className="w-full mt-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    Shiny Found! 🎉
                  </Button>
                </div>
              </div>

              {/* Target Preview */}
              {hunterTarget && (
                <div className="text-center p-4 border border-dashed rounded-lg border-gray-250 flex items-center justify-center gap-4">
                  <div className="relative">
                    <img src={hunterTarget.image} alt={hunterTarget.name} className="w-16 h-16 object-contain" />
                    <span className="absolute -top-1 -right-1 text-xs">🔍</span>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm capitalize">Hunting: {hunterTarget.name} #{hunterTarget.id.toString().padStart(3, '0')}</p>
                    <p className="text-xxs text-gray-400">Current Pokedex status: {pokedexData[hunterTarget.id]?.shiny ? '✨ Registered Shiny' : '❌ Not Shiny Registered'}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>

        <style>{`
          @keyframes sparkle {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            50% { transform: scale(1.4) rotate(180deg); opacity: 1; }
            100% { transform: scale(0) rotate(360deg); opacity: 0; }
          }
          .animate-sparkle {
            animation: sparkle 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
        `}</style>

      </Card>
    </div>
  )
}
