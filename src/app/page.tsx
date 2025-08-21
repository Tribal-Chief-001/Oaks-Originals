"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Search, Loader2, SortAsc, SortDesc, Github, Twitter, Sun, Moon, Heart, Star, X, Plus, Minus, BarChart3, BookOpen, Zap, Users, MapPin, Info, Filter, SlidersHorizontal, RotateCcw, ChevronDown } from "lucide-react"

interface Pokemon {
  id: number
  name: string
  types: string[]
  height: number
  weight: number
  abilities: string[]
  hiddenAbilities: string[]
  image: string
  shinyImage: string
  stats?: Array<{
    name: string
    value: number
  }>
  evolutionChain?: {
    id: number
    name: string
    image: string
    method: string
  }[]
  // Enhanced data structure
  japaneseName?: string
  romanizedName?: string
  ipaPronunciation?: string
  category?: string
  sprites?: {
    frontDefault: string
    frontShiny: string
    backDefault?: string
    backShiny?: string
  }
  shinyColorPalette?: string
  baseFriendship?: number
  baseExperience?: number
  catchRate?: number
  genderRatio?: string
  eggGroups?: string[]
  eggCycles?: number
  averageLifespan?: string
  ecologicalRole?: string
  naturalHabitat?: string[]
  abilityDescriptions?: {
    primary?: string
    secondary?: string
    hidden?: string
  }
  statRatings?: {
    hp: string
    attack: string
    defense: string
    spAtk: string
    spDef: string
    speed: string
    total: string
  }
  statNotes?: string
  alternateForms?: Array<{
    name: string
    image: string
    description: string
  }>
  learnset?: {
    levelUp: Array<{
      level: number
      name: string
      type: string
      category: string
      power: number
      accuracy: number
    }>
    tmMoves: string[]
    eggMoves: string[]
    tutorMoves: string[]
  }
  competitive?: {
    strengths: string[]
    weaknesses: string[]
    smogonTier: string
    commonRoles: string[]
    optimalMovesets: string[]
    counters: string[]
    teamSynergy: string
  }
  flavorText?: {
    red?: string
    blue?: string
    yellow?: string
  }
  encounterData?: Array<{
    location: string
    method: string
    rate: string
    game: string
  }>
  trivia?: {
    designOrigin: string
    nameEtymology: string
    notableAppearances: string[]
    historicalContext: string
    developerTrivia: string
  }
  advancedMechanics?: {
    hiddenPowerRange: string
    breedingQuirks: string
    formChangeTriggers: string
    eventExclusive: string
    statChanges: string
  }
}

interface Move {
  id: number
  name: string
  type: string
  category: string
  power: number
  accuracy: number
  pp: number
  description: string
  effectChance?: number
  priority: number
  target: string
  contestType?: string
}

export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [sortBy, setSortBy] = useState<"id" | "name" | "height" | "weight" | "hp" | "attack" | "defense" | "special-attack" | "special-defense" | "speed">("id")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [loading, setLoading] = useState(true)
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [showShiny, setShowShiny] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [compareMode, setCompareMode] = useState(false)
  const [compareList, setCompareList] = useState<Pokemon[]>([])
  const [activeTab, setActiveTab] = useState<string>("overview")
  
  // Advanced filtering state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [statRanges, setStatRanges] = useState({
    hp: { min: 0, max: 255 },
    attack: { min: 0, max: 255 },
    defense: { min: 0, max: 255 },
    specialAttack: { min: 0, max: 255 },
    specialDefense: { min: 0, max: 255 },
    speed: { min: 0, max: 255 }
  })
  const [heightRange, setHeightRange] = useState({ min: 0, max: 1000 })  // Increased from 200 to 1000cm (10m)
  const [weightRange, setWeightRange] = useState({ min: 0, max: 5000 })  // Increased from 2000 to 5000kg (5 tons)
  const [abilityFilter, setAbilityFilter] = useState("")
  const [typeFilterMode, setTypeFilterMode] = useState<'any' | 'all'>('any')
  
  // Team Builder state
  const [teamBuilderMode, setTeamBuilderMode] = useState(false)
  const [currentTeam, setCurrentTeam] = useState<Pokemon[]>([])
  const [teamName, setTeamName] = useState("")
  const [savedTeams, setSavedTeams] = useState<{name: string, team: Pokemon[], createdAt: string}[]>([])
  const [showTeamBuilder, setShowTeamBuilder] = useState(false)
  
  // Move Database state
  const [showMoveDatabase, setShowMoveDatabase] = useState(false)
  const [showDamageCalculator, setShowDamageCalculator] = useState(false)
  const [selectedMove, setSelectedMove] = useState<string>("")
  const [attackerPokemon, setAttackerPokemon] = useState<Pokemon | null>(null)
  const [defenderPokemon, setDefenderPokemon] = useState<Pokemon | null>(null)
  const [damageResult, setDamageResult] = useState<{minDamage: number, maxDamage: number, percentage: number} | null>(null)
  
  // Move database
  const [moves, setMoves] = useState<Move[]>([])
  const [filteredMoves, setFilteredMoves] = useState<Move[]>([])
  const [moveSearchTerm, setMoveSearchTerm] = useState("")
  const [selectedMoveType, setSelectedMoveType] = useState("")
  const [selectedMoveCategory, setSelectedMoveCategory] = useState("")
  
  // Breeding and Training Tools
  const [showBreedingTools, setShowBreedingTools] = useState(false)
  const [ivCalculator, setIvCalculator] = useState({
    pokemon: null as Pokemon | null,
    level: 50,
    stats: {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0
    },
    evs: {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0
    },
    nature: 'neutral' as 'neutral' | 'attack' | 'defense' | 'specialAttack' | 'specialDefense' | 'speed',
    ivResults: {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0
    }
  })
  
  // Pokedex Completion Tracking
  const [showPokedexTracker, setShowPokedexTracker] = useState(false)
  const [pokedexData, setPokedexData] = useState<Record<number, {
    caught: boolean
    seen: boolean
    shiny: boolean
    caughtDate?: string
    notes?: string
  }>>({})
  const [trackingMode, setTrackingMode] = useState<'overview' | 'caught' | 'seen' | 'shiny'>('overview')
  
  // Type Chart and Matchups
  const [showTypeChart, setShowTypeChart] = useState(false)
  const [selectedType1, setSelectedType1] = useState<string>("")
  const [selectedType2, setSelectedType2] = useState<string>("")
  const [typeChartMode, setTypeChartMode] = useState<'chart' | 'calculator' | 'coverage'>('chart')

  // Helper functions for breeding tools
  const calculateIVs = () => {
    if (!ivCalculator.pokemon) return
    
    const baseStats = ivCalculator.pokemon.stats || []
    const nature = ivCalculator.nature
    
    const calculateIV = (statName: string, baseStat: number, currentStat: number, level: number) => {
      // Simplified IV calculation for Gen 1
      const natureModifier = nature === statName ? 1.1 : nature === getOpposingStat(statName) ? 0.9 : 1
      const iv = Math.floor(((currentStat / natureModifier) - baseStat - 50) * level / 50 - 5)
      return Math.max(0, Math.min(31, iv))
    }
    
    const getOpposingStat = (stat: string) => {
      const opposites: Record<string, string> = {
        attack: 'specialAttack',
        specialAttack: 'attack',
        defense: 'specialDefense',
        specialDefense: 'defense',
        speed: 'specialAttack',
        hp: 'hp'
      }
      return opposites[stat] || stat
    }
    
    const newIVResults = {
      hp: calculateIV('hp', baseStats.find(s => s.name === 'hp')?.value || 0, ivCalculator.stats.hp, ivCalculator.level),
      attack: calculateIV('attack', baseStats.find(s => s.name === 'attack')?.value || 0, ivCalculator.stats.attack, ivCalculator.level),
      defense: calculateIV('defense', baseStats.find(s => s.name === 'defense')?.value || 0, ivCalculator.stats.defense, ivCalculator.level),
      specialAttack: calculateIV('specialAttack', baseStats.find(s => s.name === 'special-attack')?.value || 0, ivCalculator.stats.specialAttack, ivCalculator.level),
      specialDefense: calculateIV('specialDefense', baseStats.find(s => s.name === 'special-defense')?.value || 0, ivCalculator.stats.specialDefense, ivCalculator.level),
      speed: calculateIV('speed', baseStats.find(s => s.name === 'speed')?.value || 0, ivCalculator.stats.speed, ivCalculator.level)
    }
    
    setIvCalculator(prev => ({ ...prev, ivResults: newIVResults }))
  }
  
  const getIVColor = (iv: number) => {
    if (iv >= 30) return 'text-green-500'
    if (iv >= 20) return 'text-yellow-500'
    if (iv >= 10) return 'text-orange-500'
    return 'text-red-500'
  }
  
  const calculateHiddenPowerType = () => {
    // Simplified Hidden Power calculation based on IVs
    const ivs = ivCalculator.ivResults
    const hpType = ((ivs.hp % 2) * 1 + (ivs.attack % 2) * 2 + (ivs.defense % 2) * 4 + (ivs.speed % 2) * 8 + (ivs.specialAttack % 2) * 16 + (ivs.specialDefense % 2) * 32) * 15 / 63
    
    const types = ['fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark']
    return types[Math.floor(hpType)]
  }
  
  const calculateHiddenPowerPower = () => {
    // Simplified Hidden Power power calculation
    const ivs = ivCalculator.ivResults
    const power = 30 + Math.floor(((ivs.hp % 4) * 1 + (ivs.attack % 4) * 2 + (ivs.defense % 4) * 4 + (ivs.speed % 4) * 8 + (ivs.specialAttack % 4) * 16 + (ivs.specialDefense % 4) * 32) * 40 / 63)
    return power
  }
  
  // Helper functions for pokedex tracker
  const togglePokedexStatus = (pokemonId: number) => {
    setPokedexData(prev => {
      const current = prev[pokemonId] || { caught: false, seen: false, shiny: false }
      
      // Cycle through states: not seen -> seen -> caught -> shiny -> not seen
      if (!current.seen) {
        return { ...prev, [pokemonId]: { ...current, seen: true } }
      } else if (current.seen && !current.caught) {
        return { ...prev, [pokemonId]: { ...current, caught: true, caughtDate: new Date().toISOString() } }
      } else if (current.caught && !current.shiny) {
        return { ...prev, [pokemonId]: { ...current, shiny: true } }
      } else {
        return { ...prev, [pokemonId]: { caught: false, seen: false, shiny: false } }
      }
    })
  }
  
  // Helper functions for type chart
  const getEffectivenessColor = (multiplier: number) => {
    if (multiplier === 0) return 'text-gray-500'
    if (multiplier <= 0.5) return 'text-green-500'
    if (multiplier < 1) return 'text-yellow-500'
    if (multiplier === 1) return 'text-gray-400'
    if (multiplier <= 2) return 'text-orange-500'
    return 'text-red-500'
  }
  
  const analyzeTeamCoverage = () => {
    const typeCoverage: Record<string, number> = {}
    const allTypes = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']
    
    allTypes.forEach(type => {
      typeCoverage[type] = 1
    })
    
    currentTeam.forEach(pokemon => {
      pokemon.types.forEach(pokemonType => {
        allTypes.forEach(defendingType => {
          const multiplier = getTypeEffectiveness(pokemonType, [defendingType])
          if (multiplier > typeCoverage[defendingType]) {
            typeCoverage[defendingType] = multiplier
          }
        })
      })
    })
    
    return Object.entries(typeCoverage).map(([type, effectiveness]) => ({
      type,
      effectiveness
    }))
  }

  // Helper function to parse evolution chain
  const parseEvolutionChain = async (chain: any) => {
    const evolutions: any[] = []
    
    const parseChain = async (currentChain: any, method: string = 'Start') => {
      if (!currentChain) return
      
      const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentChain.species.name}`)
      const pokemonData = await pokemonResponse.json()
      
      evolutions.push({
        id: pokemonData.id,
        name: currentChain.species.name.charAt(0).toUpperCase() + currentChain.species.name.slice(1),
        image: pokemonData.sprites.other['official-artwork'].front_default,
        method: method
      })
      
      if (currentChain.evolves_to.length > 0) {
        for (const evolution of currentChain.evolves_to) {
          let evolutionMethod = 'Level up'
          if (evolution.evolution_details.length > 0) {
            const details = evolution.evolution_details[0]
            if (details.min_level) {
              evolutionMethod = `Level ${details.min_level}`
            } else if (details.item) {
              evolutionMethod = details.item.name.replace('-', ' ').charAt(0).toUpperCase() + details.item.name.replace('-', ' ').slice(1)
            } else if (details.trigger.name === 'trade') {
              evolutionMethod = 'Trade'
            } else if (details.happiness) {
              evolutionMethod = 'High Friendship'
            }
          }
          await parseChain(evolution, evolutionMethod)
        }
      }
    }
    
    await parseChain(chain)
    return evolutions
  }

  // Fetch all Pokémon from API
  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        const data = await response.json()
        
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon: { name: string; url: string }) => {
            const pokemonResponse = await fetch(pokemon.url)
            const pokemonData = await pokemonResponse.json()
            
            // Fetch species data for evolution chain
            const speciesResponse = await fetch(pokemonData.species.url)
            const speciesData = await speciesResponse.json()
            
            // Fetch evolution chain
            let evolutionChain: any[] = []
            try {
              const evolutionResponse = await fetch(speciesData.evolution_chain.url)
              const evolutionData = await evolutionResponse.json()
              evolutionChain = await parseEvolutionChain(evolutionData.chain)
            } catch (error) {
              console.log(`No evolution chain for ${pokemonData.name}`)
            }
            
            // Process moves data
            const learnset = {
              levelUp: pokemonData.moves
                .filter((move: any) => 
                  move.version_group_details.some((detail: any) => 
                    detail.version_group.name === 'red-blue' && detail.move_learn_method.name === 'level-up'
                  )
                )
                .map((move: any) => {
                  const levelUpDetail = move.version_group_details.find((detail: any) => 
                    detail.version_group.name === 'red-blue' && detail.move_learn_method.name === 'level-up'
                  )
                  return {
                    level: levelUpDetail.level_learned_at,
                    name: move.move.name.replace('-', ' ').charAt(0).toUpperCase() + move.move.name.replace('-', ' ').slice(1),
                    type: move.type?.name || 'normal',
                    category: 'Physical', // This would need additional API call to get accurate category
                    power: 0, // This would need additional API call to get accurate power
                    accuracy: 0 // This would need additional API call to get accurate accuracy
                  }
                })
                .sort((a: any, b: any) => a.level - b.level),
              tmMoves: pokemonData.moves
                .filter((move: any) => 
                  move.version_group_details.some((detail: any) => 
                    detail.version_group.name === 'red-blue' && detail.move_learn_method.name === 'machine'
                  )
                )
                .map((move: any) => move.move.name.replace('-', ' ').charAt(0).toUpperCase() + move.move.name.replace('-', ' ').slice(1)),
              eggMoves: pokemonData.moves
                .filter((move: any) => 
                  move.version_group_details.some((detail: any) => 
                    detail.move_learn_method.name === 'egg'
                  )
                )
                .map((move: any) => move.move.name.replace('-', ' ').charAt(0).toUpperCase() + move.move.name.replace('-', ' ').slice(1))
            }
            
            // Get flavor text
            const flavorText = speciesData.flavor_text_entries
              .filter((entry: any) => entry.language.name === 'en')
              .reduce((acc: any, entry: any) => {
                const version = entry.version.name
                if (version.includes('red')) acc.red = entry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ')
                if (version.includes('blue')) acc.blue = entry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ')
                if (version.includes('yellow')) acc.yellow = entry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ')
                return acc
              }, {})
            
            // Get habitat and egg groups
            const habitat = speciesData.habitat?.name || 'unknown'
            const eggGroups = speciesData.egg_groups.map((group: any) => group.name)
            
            // Get gender ratio
            const genderRate = speciesData.gender_rate
            let genderRatio = ''
            if (genderRate === -1) {
              genderRatio = 'Genderless'
            } else {
              const femalePercentage = (genderRate / 8) * 100
              const malePercentage = 100 - femalePercentage
              genderRatio = `${malePercentage}% male, ${femalePercentage}% female`
            }
            
            // Get base stats total and rating
            const totalStats = pokemonData.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0)
            const statRatings = {
              hp: getStatRating(pokemonData.stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 0),
              attack: getStatRating(pokemonData.stats.find((s: any) => s.stat.name === 'attack')?.base_stat || 0),
              defense: getStatRating(pokemonData.stats.find((s: any) => s.stat.name === 'defense')?.base_stat || 0),
              spAtk: getStatRating(pokemonData.stats.find((s: any) => s.stat.name === 'special-attack')?.base_stat || 0),
              spDef: getStatRating(pokemonData.stats.find((s: any) => s.stat.name === 'special-defense')?.base_stat || 0),
              speed: getStatRating(pokemonData.stats.find((s: any) => s.stat.name === 'speed')?.base_stat || 0),
              total: getStatRating(totalStats / 6)
            }
            
            // Generate competitive analysis
            const competitive = {
              strengths: getStrengths(pokemonData.types, pokemonData.stats),
              weaknesses: getWeaknesses(pokemonData.types),
              smogonTier: getSmogonTier(pokemonData.id, totalStats),
              commonRoles: getCommonRoles(pokemonData.types, pokemonData.stats),
              optimalMovesets: getOptimalMovesets(pokemonData.name, pokemonData.types),
              counters: getCounters(pokemonData.types, pokemonData.stats),
              teamSynergy: getTeamSynergy(pokemonData.types)
            }
            
            // Generate trivia
            const trivia = {
              designOrigin: getDesignOrigin(pokemonData.id, pokemonData.name),
              nameEtymology: getNameEtymology(pokemonData.name),
              notableAppearances: getNotableAppearances(pokemonData.id),
              historicalContext: getHistoricalContext(pokemonData.id),
              developerTrivia: getDeveloperTrivia(pokemonData.id)
            }
            
            // Generate advanced mechanics
            const advancedMechanics = {
              hiddenPowerRange: getHiddenPowerRange(pokemonData.stats),
              breedingQuirks: getBreedingQuirks(speciesData),
              formChangeTriggers: getFormChangeTriggers(pokemonData.id),
              eventExclusive: getEventExclusive(pokemonData.id),
              statChanges: getStatChanges(pokemonData.name)
            }
            
            return {
              id: pokemonData.id,
              name: pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1),
              types: pokemonData.types.map((type: { type: { name: string } }) => type.type.name),
              height: pokemonData.height,
              weight: pokemonData.weight,
              abilities: pokemonData.abilities
                .filter((ability: { is_hidden: boolean }) => !ability.is_hidden)
                .map((ability: { ability: { name: string } }) => ability.ability.name.replace('-', '-')),
              hiddenAbilities: pokemonData.abilities
                .filter((ability: { is_hidden: boolean }) => ability.is_hidden)
                .map((ability: { ability: { name: string } }) => ability.ability.name.replace('-', '-')),
              image: pokemonData.sprites.other['official-artwork'].front_default,
              shinyImage: pokemonData.sprites.other['official-artwork'].front_shiny,
              stats: pokemonData.stats.map((stat: { stat: { name: string }; base_stat: number }) => ({
                name: stat.stat.name,
                value: stat.base_stat
              })),
              evolutionChain: evolutionChain,
              learnset: learnset,
              flavorText: flavorText,
              category: speciesData.genera.find((g: any) => g.language.name === 'en')?.genus || 'Pokémon',
              baseFriendship: speciesData.base_happiness,
              baseExperience: pokemonData.base_experience,
              catchRate: Math.round((255 - speciesData.capture_rate) / 255 * 100),
              genderRatio: genderRatio,
              eggGroups: eggGroups,
              eggCycles: speciesData.hatch_counter,
              naturalHabitat: [habitat],
              statRatings: statRatings,
              competitive: competitive,
              trivia: trivia,
              advancedMechanics: advancedMechanics
            }
          })
        )
        
        setPokemon(pokemonDetails)
        setFilteredPokemon(pokemonDetails)
      } catch (error) {
        console.error('Error fetching Pokémon:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAllPokemon()
  }, [])

  // Helper functions for enhanced data analysis
  const getStrengths = (types: string[], stats: any[]) => {
    const strengths: string[] = []
    const totalStats = stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0)
    
    if (totalStats > 500) strengths.push('High base stat total')
    if (types.includes('dragon')) strengths.push('Dragon type advantage')
    if (types.includes('steel')) strengths.push('Steel type defensive utility')
    if (stats.find((s: any) => s.stat.name === 'speed')?.base_stat > 100) strengths.push('High Speed')
    if (stats.find((s: any) => s.stat.name === 'hp')?.base_stat > 100) strengths.push('High HP')
    
    return strengths.length > 0 ? strengths : ['Balanced stat distribution']
  }
  
  const getWeaknesses = (types: string[]) => {
    const typeWeaknesses: Record<string, string[]> = {
      normal: ['fighting'],
      fire: ['water', 'ground', 'rock'],
      water: ['electric', 'grass'],
      electric: ['ground'],
      grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
      ice: ['fire', 'fighting', 'rock', 'steel'],
      fighting: ['flying', 'psychic', 'fairy'],
      poison: ['ground', 'psychic'],
      ground: ['water', 'grass', 'ice'],
      flying: ['electric', 'ice', 'rock'],
      psychic: ['bug', 'ghost', 'dark'],
      bug: ['fire', 'flying', 'rock'],
      rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
      ghost: ['ghost', 'dark'],
      dragon: ['ice', 'dragon', 'fairy'],
      dark: ['fighting', 'bug', 'fairy'],
      steel: ['fire', 'fighting', 'ground'],
      fairy: ['poison', 'steel']
    }
    
    const weaknesses = new Set<string>()
    types.forEach(type => {
      if (typeWeaknesses[type]) {
        typeWeaknesses[type].forEach(weakness => weaknesses.add(weakness))
      }
    })
    
    return Array.from(weaknesses)
  }
  
  const getSmogonTier = (id: number, totalStats: number) => {
    if (id === 144 || id === 145 || id === 150) return 'Uber'
    if (id === 143 || id === 146) return 'OU'
    if (totalStats > 600) return 'OU'
    if (totalStats > 500) return 'UU'
    if (totalStats > 400) return 'RU'
    return 'NU'
  }
  
  const getCommonRoles = (types: string[], stats: any[]) => {
    const roles: string[] = []
    const attack = stats.find((s: any) => s.stat.name === 'attack')?.base_stat || 0
    const spAtk = stats.find((s: any) => s.stat.name === 'special-attack')?.base_stat || 0
    const speed = stats.find((s: any) => s.stat.name === 'speed')?.base_stat || 0
    const defense = stats.find((s: any) => s.stat.name === 'defense')?.base_stat || 0
    const spDef = stats.find((s: any) => s.stat.name === 'special-defense')?.base_stat || 0
    
    if (speed > 100 && (attack > 100 || spAtk > 100)) roles.push('Sweeper')
    if (defense > 100 && spDef > 100) roles.push('Wall')
    if (types.includes('psychic') && spAtk > 90) roles.push('Special Attacker')
    if (types.includes('fighting') && attack > 90) roles.push('Physical Attacker')
    if (types.includes('steel') || types.includes('rock')) roles.push('Tank')
    
    return roles.length > 0 ? roles : ['Support']
  }
  
  const getOptimalMovesets = (name: string, types: string[]) => {
    const movesets: Record<string, string[]> = {
      'Charizard': ['Flamethrower', 'Fire Blast', 'Earthquake', 'Slash'],
      'Blastoise': ['Surf', 'Ice Beam', 'Body Slam', 'Rest'],
      'Venusaur': ['Razor Leaf', 'Sleep Powder', 'Body Slam', 'Hyper Beam'],
      'Pikachu': ['Thunderbolt', 'Thunder', 'Quick Attack', 'Double Team'],
      'Alakazam': ['Psychic', 'Recover', 'Seismic Toss', 'Reflect'],
      'Machamp': ['Submission', 'Body Slam', 'Hyper Beam', 'Submission'],
      'Golem': ['Earthquake', 'Rock Slide', 'Body Slam', 'Explosion'],
      'Gengar': ['Psychic', 'Thunderbolt', 'Mega Drain', 'Hypnosis'],
      'Dragonite': ['Thunderbolt', 'Ice Beam', 'Body Slam', 'Hyper Beam']
    }
    
    return movesets[name] || ['STAB move', 'Coverage move', 'Status move', 'Recovery move']
  }
  
  const getCounters = (types: string[], stats: any[]) => {
    const counters: string[] = []
    const weaknesses = getWeaknesses(types)
    
    weaknesses.forEach(weakness => {
      switch(weakness) {
        case 'ice':
          counters.push('Ice-type moves (Articuno, Lapras)')
          break
        case 'ground':
          counters.push('Ground-type moves (Golem, Rhydon)')
          break
        case 'psychic':
          counters.push('Psychic-type moves (Alakazam, Mewtwo)')
          break
        case 'fire':
          counters.push('Fire-type moves (Charizard, Arcanine)')
          break
        default:
          counters.push(`${weakness}-type moves`)
      }
    })
    
    return counters.length > 0 ? counters : ['No specific counters']
  }
  
  const getTeamSynergy = (types: string[]) => {
    const synergies: Record<string, string> = {
      'water': 'Works well with Grass and Electric types',
      'fire': 'Works well with Water and Rock types',
      'grass': 'Works well with Fire and Water types',
      'electric': 'Works well with Water and Ground types',
      'psychic': 'Works well with Fighting and Dark types',
      'fighting': 'Works well with Flying and Psychic types',
      'poison': 'Works well with Ground and Psychic types',
      'ground': 'Works well with Water and Grass types',
      'flying': 'Works well with Electric and Rock types',
      'bug': 'Works well with Fire and Flying types',
      'rock': 'Works well with Water and Grass types',
      'ghost': 'Works well with Dark and Psychic types',
      'dragon': 'Works well with Ice and Fairy types',
      'dark': 'Works well with Fighting and Bug types',
      'steel': 'Works well with Fire and Fighting types',
      'fairy': 'Works well with Poison and Steel types'
    }
    
    return types.map(type => synergies[type] || 'Standard team synergy').join('; ')
  }
  
  const getDesignOrigin = (id: number, name: string) => {
    const origins: Record<string, string> = {
      'Bulbasaur': 'Based on a frog or dinosaur with a plant bulb',
      'Charmander': 'Based on a salamander with fire characteristics',
      'Squirtle': 'Based on a turtle with water squirting ability',
      'Pikachu': 'Based on a mouse or pika with electrical abilities',
      'Jigglypuff': 'Based on a balloon with singing abilities',
      'Meowth': 'Based on a cat with coin fascination',
      'Psyduck': 'Based on a duck with psychic headaches',
      'Machamp': 'Based on a four-armed wrestler',
      'Golem': 'Based on a golem or rock monster',
      'Dragonite': 'Based on European dragons with friendly demeanor'
    }
    
    return origins[name] || 'Design based on real-world animals and mythological creatures'
  }
  
  const getNameEtymology = (name: string) => {
    const etymologies: Record<string, string> = {
      'Bulbasaur': 'Bulb (plant) + Dinosaur',
      'Charmander': 'Char (burn) + Salamander',
      'Squirtle': 'Squirt (water) + Turtle',
      'Pikachu': 'Pika (mouse sound) + Chu (kiss sound)',
      'Jigglypuff': 'Jiggly (soft) + Puff (inflate)',
      'Meowth': 'Meow (cat sound) + Mouth',
      'Psyduck': 'Psychic + Duck',
      'Machamp': 'Machine + Champion',
      'Golem': 'Hebrew mythological creature',
      'Dragonite': 'Dragon + Knight (suffix)'
    }
    
    return etymologies[name] || 'Name derived from characteristics or abilities'
  }
  
  const getNotableAppearances = (id: number) => {
    const appearances: Record<number, string[]> = {
      1: ['Original 151 starter', 'Main character in Pokémon anime', 'Numerous game appearances'],
      4: ['Original 151 starter', 'Ash\'s main Pokémon in anime', 'Mascot for franchise'],
      7: ['Original 151 starter', 'Popular in competitive play', 'Featured in movies'],
      25: ['Series mascot', 'Most recognizable Pokémon', 'Featured in Super Smash Bros'],
      39: ['Popular singing Pokémon', 'Anime regular', 'Super Smash Bros fighter'],
      52: ['Team Rocket\'s Pokémon', 'Anime antagonist', 'Can speak human language'],
      54: ['Comic relief Pokémon', 'Anime regular', 'Known for headaches'],
      68: ['Four-armed fighter', 'Popular in competitive', 'Evolution of Machop'],
      76: ['Rock-type powerhouse', 'Popular in competitive', 'Evolution of Geodude'],
      149: ['Pseudo-legendary', 'Powerful dragon type', 'Fan favorite']
    }
    
    return appearances[id] || ['Appears in main series games', 'Part of original 151', 'Popular among fans']
  }
  
  const getHistoricalContext = (id: number) => {
    if (id <= 151) {
      return 'Part of the original Generation I Pokémon, designed by Ken Sugimori and the Game Freak team. These Pokémon established the foundation for the entire franchise.'
    }
    return 'Part of the expanded Pokémon universe, building upon the original concepts.'
  }
  
  const getDeveloperTrivia = (id: number) => {
    const trivia: Record<number, string> = {
      1: 'Originally designed to be the mascot before Pikachu was chosen',
      4: 'Designed to appeal to Western audiences with dragon-like appearance',
      7: 'Design influenced by Japanese turtle monsters',
      25: 'Created to be cute and marketable internationally',
      39: 'Designed to be simple and easy to animate',
      52: 'One of the few Pokémon that can speak human language',
      54: 'Designed to express constant confusion',
      68: 'Four arms added to emphasize fighting prowess',
      76: 'Designed to look like a boulder come to life',
      149: 'Originally much larger in concept art'
    }
    
    return trivia[id] || 'Designed as part of the original 151 Pokémon roster'
  }
  
  const getHiddenPowerRange = (stats: any[]) => {
    const hp = stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 0
    const attack = stats.find((s: any) => s.stat.name === 'attack')?.base_stat || 0
    const defense = stats.find((s: any) => s.stat.name === 'defense')?.base_stat || 0
    const speed = stats.find((s: any) => s.stat.name === 'speed')?.base_stat || 0
    const spAtk = stats.find((s: any) => s.stat.name === 'special-attack')?.base_stat || 0
    const spDef = stats.find((s: any) => s.stat.name === 'special-defense')?.base_stat || 0
    
    // Simplified Hidden Power calculation
    const types = ['Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark']
    const typeIndex = ((hp % 2) + (attack % 2) * 2 + (defense % 2) * 4 + (speed % 2) * 8 + (spAtk % 2) * 16 + (spDef % 2) * 32) % 16
    
    return `${types[typeIndex]} type, Power 30-70`
  }
  
  const getBreedingQuirks = (speciesData: any) => {
    const quirks: string[] = []
    if (speciesData.gender_rate === -1) quirks.push('Genderless - can only breed with Ditto')
    if (speciesData.egg_groups.length > 1) quirks.push('Multiple egg groups increase breeding options')
    if (speciesData.hatch_counter > 20) quirks.push('Long hatching time')
    if (speciesData.base_happiness < 70) quirks.push('Low base friendship affects breeding')
    
    return quirks.length > 0 ? quirks.join('; ') : 'Standard breeding mechanics'
  }
  
  const getFormChangeTriggers = (id: number) => {
    const formChanges: Record<number, string> = {
      25: 'Cannot evolve in Generation I',
      143: 'Requires trade to evolve',
      144: 'Requires trade with item to evolve',
      150: 'No evolution - final form',
      151: 'No evolution - mythical Pokémon'
    }
    
    return formChanges[id] || 'No special form changes in Generation I'
  }
  
  const getEventExclusive = (id: number) => {
    const events: Record<number, string> = {
      151: 'Originally only available through special events',
      144: 'Required special item in later generations',
      145: 'Required special item in later generations'
    }
    
    return events[id] || 'Available through normal gameplay in Generation I'
  }
  
  const getStatChanges = (name: string) => {
    const changes: Record<string, string> = {
      'Pikachu': 'Special stat split in Generation II',
      'Eevee': 'Multiple evolution options added in later generations',
      'Porygon': 'Evolution methods changed in later generations',
      'Magmar': 'Special stat split affected its role',
      'Electabuzz': 'Special stat split affected its role'
    }
    
    return changes[name] || 'Stat system remained consistent in Generation I'
  }
  
  const getEncounterLocations = (id: number) => {
    const locations: Record<number, string> = {
      1: 'Available as starter choice in Pallet Town',
      4: 'Available as starter choice in Pallet Town',
      7: 'Available as starter choice in Pallet Town',
      25: 'Viridian Forest, Power Plant (rare)',
      39: 'Route 3, Mt. Moon, Rock Tunnel',
      52: 'Route 5, 6, 7, 8, 11, 12',
      54: 'Route 6, 11, 12, 13, 16, 17, 18',
      68: 'Route 5, Victory Road',
      76: 'Route 10, Rock Tunnel, Victory Road',
      149: 'Safari Zone, Route 23'
    }
    
    return locations[id] || 'Various locations throughout Kanto region'
  }
  
  const getSpecialEncounters = (id: number) => {
    const special: Record<number, string> = {
      143: 'Requires trade to evolve from Porygon',
      144: 'Requires trade with Up-Grade to evolve from Porygon2',
      145: 'Requires trade with Dubious Disc to evolve from Porygon2',
      150: 'Found in Cerulean Cave after becoming Champion',
      151: 'Originally distributed through special events only'
    }
    
    return special[id] || 'Available through normal gameplay methods'
  }
  
  const getEvolutionMethod = (id: number) => {
    const evolution: Record<number, string> = {
      1: 'Evolves from Ivysaur at level 32',
      2: 'Evolves from Bulbasaur at level 16',
      3: 'Final evolution - does not evolve further',
      4: 'Evolves from Charmeleon at level 36',
      5: 'Evolves from Charmander at level 16',
      6: 'Final evolution - does not evolve further',
      7: 'Evolves from Wartortle at level 36',
      8: 'Evolves from Squirtle at level 16',
      9: 'Final evolution - does not evolve further',
      25: 'Cannot evolve in Generation I - Thunder Stone required',
      26: 'Evolves from Pikachu with Thunder Stone',
      133: 'Evolves from Eevee with Water Stone',
      134: 'Evolves from Eevee with Thunder Stone',
      135: 'Evolves from Eevee with Fire Stone',
      143: 'Evolves from Porygon when traded',
      144: 'Evolves from Porygon2 when traded holding Up-Grade',
      145: 'Evolves from Porygon2 when traded holding Dubious Disc',
      150: 'Final evolution - does not evolve further',
      151: 'Final evolution - does not evolve further'
    }
    
    return evolution[id] || 'Evolution method varies by species'
  }

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true')
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon)
  }

  useEffect(() => {
    let filtered = applyAdvancedFilters(pokemon)
    
    // Sort the filtered results
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "id":
          comparison = a.id - b.id
          break
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "height":
          comparison = a.height - b.height
          break
        case "weight":
          comparison = a.weight - b.weight
          break
        case "hp":
        case "attack":
        case "defense":
        case "special-attack":
        case "special-defense":
        case "speed":
          const statA = a.stats?.find(s => s.name === sortBy)?.value || 0
          const statB = b.stats?.find(s => s.name === sortBy)?.value || 0
          comparison = statA - statB
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    setFilteredPokemon(filtered)
  }, [searchTerm, selectedType, sortBy, sortOrder, pokemon, selectedTypes, statRanges, heightRange, weightRange, abilityFilter, typeFilterMode])

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

  const allTypes = Array.from(new Set(pokemon.flatMap(p => p.types)))

  // Helper functions for enhanced features
  const toggleFavorite = (pokemonId: number) => {
    setFavorites(prev => 
      prev.includes(pokemonId) 
        ? prev.filter(id => id !== pokemonId)
        : [...prev, pokemonId]
    )
  }

  const addToCompare = (pokemon: Pokemon) => {
    if (compareList.length < 2 && !compareList.find(p => p.id === pokemon.id)) {
      setCompareList(prev => [...prev, pokemon])
    }
  }

  const removeFromCompare = (pokemonId: number) => {
    setCompareList(prev => prev.filter(p => p.id !== pokemonId))
  }

  // Advanced filtering functions
  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const clearAllFilters = () => {
    setSelectedTypes([])
    setStatRanges({
      hp: { min: 0, max: 255 },
      attack: { min: 0, max: 255 },
      defense: { min: 0, max: 255 },
      specialAttack: { min: 0, max: 255 },
      specialDefense: { min: 0, max: 255 },
      speed: { min: 0, max: 255 }
    })
    setHeightRange({ min: 0, max: 1000 })  // Updated to match the expanded range
    setWeightRange({ min: 0, max: 5000 })  // Updated to match the expanded range
    setAbilityFilter("")
    setSearchTerm("")
    setSelectedType("")
  }

  const applyAdvancedFilters = (pokemonList: Pokemon[]) => {
    return pokemonList.filter(pokemon => {
      // Name search
      if (searchTerm && !pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Type filtering
      if (selectedTypes.length > 0) {
        const hasSelectedType = selectedTypes.some(type => pokemon.types.includes(type))
        if (typeFilterMode === 'all') {
          // Must have ALL selected types
          if (!selectedTypes.every(type => pokemon.types.includes(type))) {
            return false
          }
        } else {
          // Must have ANY selected type
          if (!hasSelectedType) {
            return false
          }
        }
      }

      // Single type filter (legacy)
      if (selectedType && !pokemon.types.includes(selectedType)) {
        return false
      }

      // Stat filtering - Skip filtering for Pokemon with missing stat data
      if (pokemon.stats && pokemon.stats.length > 0) {
        const getStatValue = (statName: string) => {
          const stat = pokemon.stats.find(s => s.name === statName)
          return stat?.value || 0
        }

        const hp = getStatValue('hp')
        const attack = getStatValue('attack')
        const defense = getStatValue('defense')
        const specialAttack = getStatValue('special-attack')
        const specialDefense = getStatValue('special-defense')
        const speed = getStatValue('speed')

        // Skip stat filtering if any stat is 0 (indicates missing data)
        if (hp === 0 || attack === 0 || defense === 0 || specialAttack === 0 || specialDefense === 0 || speed === 0) {
          return true // Don't filter out Pokemon with missing stats
        }

        if (hp < statRanges.hp.min || hp > statRanges.hp.max) return false
        if (attack < statRanges.attack.min || attack > statRanges.attack.max) return false
        if (defense < statRanges.defense.min || defense > statRanges.defense.max) return false
        if (specialAttack < statRanges.specialAttack.min || specialAttack > statRanges.specialAttack.max) return false
        if (specialDefense < statRanges.specialDefense.min || specialDefense > statRanges.specialDefense.max) return false
        if (speed < statRanges.speed.min || speed > statRanges.speed.max) return false
      }

      // Height filtering - FIXED: Increased range to accommodate large Pokemon
      const heightInCm = pokemon.height * 10
      if (heightInCm < heightRange.min || heightInCm > heightRange.max) {
        return false
      }

      // Weight filtering - FIXED: Increased range to accommodate heavy Pokemon
      const weightInKg = pokemon.weight / 10
      if (weightInKg < weightRange.min || weightInKg > weightRange.max) {
        return false
      }

      // Ability filtering
      if (abilityFilter) {
        const allAbilities = [...pokemon.abilities, ...(pokemon.hiddenAbilities || [])]
        if (!allAbilities.some(ability => 
          ability.toLowerCase().includes(abilityFilter.toLowerCase())
        )) {
          return false
        }
      }

      return true
    })
  }

  // Team Builder functions
  const addToTeam = (pokemon: Pokemon) => {
    if (currentTeam.length < 6 && !currentTeam.find(p => p.id === pokemon.id)) {
      setCurrentTeam(prev => [...prev, pokemon])
    }
  }

  const removeFromTeam = (pokemonId: number) => {
    setCurrentTeam(prev => prev.filter(p => p.id !== pokemonId))
  }

  const saveTeam = () => {
    if (currentTeam.length > 0 && teamName.trim()) {
      const newTeam = {
        name: teamName.trim(),
        team: [...currentTeam],
        createdAt: new Date().toISOString()
      }
      setSavedTeams(prev => [...prev, newTeam])
      setTeamName("")
      setCurrentTeam([])
    }
  }

  const loadTeam = (team: {name: string, team: Pokemon[]}) => {
    setCurrentTeam(team.team)
    setTeamName(team.name)
  }

  const deleteTeam = (index: number) => {
    setSavedTeams(prev => prev.filter((_, i) => i !== index))
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

      const effectiveness = getComprehensiveTypeEffectiveness(pokemon.types)
      effectiveness.weaknesses.forEach(w => weaknesses.add(w.type))
      effectiveness.resistances.forEach(r => resistances.add(r.type))
      effectiveness.immunities.forEach(i => immunities.add(i.type))
    })

    const totalStats = currentTeam.reduce((acc, pokemon) => {
      const stats = pokemon.stats || []
      return {
        hp: acc.hp + (stats.find(s => s.name === 'hp')?.value || 0),
        attack: acc.attack + (stats.find(s => s.name === 'attack')?.value || 0),
        defense: acc.defense + (stats.find(s => s.name === 'defense')?.value || 0),
        specialAttack: acc.specialAttack + (stats.find(s => s.name === 'special-attack')?.value || 0),
        specialDefense: acc.specialDefense + (stats.find(s => s.name === 'special-defense')?.value || 0),
        speed: acc.speed + (stats.find(s => s.name === 'speed')?.value || 0),
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
        speed: Math.round(totalStats.speed / currentTeam.length),
      }
    }
  }

  const getStatRating = (value: number) => {
    if (value >= 150) return "Exceptional"
    if (value >= 120) return "High"
    if (value >= 90) return "Above Average"
    if (value >= 70) return "Average"
    if (value >= 50) return "Below Average"
    return "Low"
  }

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

  const getTypeEffectiveness = (attackingType: string, defendingTypes: string[]) => {
    // Comprehensive type effectiveness chart with multipliers
    const effectiveness: Record<string, Record<string, number>> = {
      normal: { rock: 0.5, ghost: 0, steel: 0.5, fighting: 1, flying: 1, poison: 1, ground: 1, bug: 1, fire: 1, water: 1, grass: 1, electric: 1, psychic: 1, ice: 1, dragon: 1, dark: 1, fairy: 1 },
      fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 0.5, rock: 0.5, dragon: 0.5, steel: 2, normal: 1, fighting: 1, flying: 1, poison: 1, ground: 1, ghost: 1, psychic: 1, electric: 1, dark: 1, fairy: 1 },
      water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5, normal: 1, fighting: 1, flying: 1, poison: 1, bug: 1, ghost: 1, steel: 1, psychic: 1, ice: 1, electric: 1, dark: 1, fairy: 1 },
      electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5, normal: 1, fighting: 1, poison: 1, bug: 1, ghost: 1, steel: 1, fire: 1, psychic: 1, ice: 1, dark: 1, fairy: 1 },
      grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5, normal: 1, fighting: 1, ghost: 1, psychic: 1, ice: 1, electric: 1, dark: 1, fairy: 1 },
      ice: { fire: 0.5, water: 0.5, grass: 2, ice: 2, ground: 2, flying: 2, dragon: 2, steel: 0.5, normal: 1, fighting: 1, poison: 1, bug: 1, ghost: 1, rock: 1, psychic: 1, electric: 1, dark: 1, fairy: 1 },
      fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5, fire: 1, water: 1, grass: 1, electric: 1, ground: 1, dragon: 1 },
      poison: { grass: 2, poison: 0.5, ground: 2, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2, normal: 1, fighting: 1, flying: 1, bug: 1, psychic: 1, ice: 1, electric: 1, dragon: 1, dark: 1, water: 1, fire: 1 },
      ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2, normal: 1, fighting: 1, ghost: 1, psychic: 1, ice: 1, dragon: 1, dark: 1, fairy: 1, water: 1 },
      flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5, normal: 1, poison: 1, ground: 1, ghost: 1, psychic: 1, ice: 1, dragon: 1, dark: 1, fairy: 1, water: 1, fire: 1 },
      psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5, normal: 1, flying: 1, bug: 1, ghost: 1, rock: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 1, dragon: 1, fairy: 1 },
      bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5, normal: 1, ground: 1, rock: 1, electric: 1, ice: 1, dragon: 1, water: 1 },
      rock: { fire: 2, ice: 2, fighting: 2, ground: 0.5, flying: 2, bug: 2, steel: 0.5, normal: 1, poison: 1, ghost: 1, psychic: 1, electric: 1, dragon: 1, dark: 1, fairy: 1, water: 1, grass: 1 },
      ghost: { psychic: 2, ghost: 2, dark: 0.5, fighting: 1, flying: 1, poison: 1, bug: 1, rock: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 1, dragon: 1, steel: 1, fairy: 1 },
      dragon: { dragon: 2, steel: 0.5, fairy: 0, normal: 1, fighting: 1, flying: 1, poison: 1, bug: 1, ghost: 1, rock: 1, fire: 1, water: 1, grass: 1, electric: 1, psychic: 1, ice: 2, dark: 1 },
      dark: { fighting: 2, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5, normal: 1, flying: 1, poison: 1, bug: 1, rock: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 1, dragon: 1, steel: 1 },
      steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2, normal: 1, fighting: 1, flying: 1, poison: 1, bug: 1, ghost: 1, psychic: 1, dragon: 1, dark: 1, grass: 1, ground: 1 },
      fairy: { fire: 0.5, poison: 2, fighting: 2, dragon: 2, dark: 2, steel: 0.5, normal: 1, flying: 1, bug: 1, ghost: 1, rock: 1, ground: 1, psychic: 1, ice: 1, electric: 1, water: 1, grass: 1 }
    }

    let totalEffectiveness = 1
    defendingTypes.forEach(defType => {
      totalEffectiveness *= effectiveness[attackingType]?.[defType] || 1
    })
    return totalEffectiveness
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      normal: '⚪',
      fire: '🔥',
      water: '💧',
      electric: '⚡',
      grass: '🌿',
      ice: '❄️',
      fighting: '👊',
      poison: '☠️',
      ground: '🌍',
      flying: '🦅',
      psychic: '🔮',
      bug: '🐛',
      rock: '🪨',
      ghost: '👻',
      dragon: '🐉',
      dark: '🌙',
      steel: '⚙️',
      fairy: '🧚'
    }
    return icons[type] || '❓'
  }

  const getEffectivenessText = (multiplier: number) => {
    if (multiplier === 0) return 'Immune'
    if (multiplier === 0.25) return '¼×'
    if (multiplier === 0.5) return '½×'
    if (multiplier === 1) return '1×'
    if (multiplier === 2) return '2×'
    if (multiplier === 4) return '4×'
    return `${multiplier}×`
  }

  const getComprehensiveTypeEffectiveness = (defendingTypes: string[]) => {
    const allTypes = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']
    
    const effectiveness = allTypes.map(attackingType => {
      const multiplier = getTypeEffectiveness(attackingType, defendingTypes)
      return {
        type: attackingType,
        multiplier: multiplier,
        icon: getTypeIcon(attackingType)
      }
    }).sort((a, b) => a.multiplier - b.multiplier)

    return {
      weaknesses: effectiveness.filter(e => e.multiplier > 1),
      resistances: effectiveness.filter(e => e.multiplier < 1 && e.multiplier > 0),
      immunities: effectiveness.filter(e => e.multiplier === 0),
      neutral: effectiveness.filter(e => e.multiplier === 1)
    }
  }

  // Move Database functions
  const fetchMoves = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/move?limit=500')
      const data = await response.json()
      
      const moveDetails = await Promise.all(
        data.results.slice(0, 200).map(async (move: { name: string; url: string }) => {
          const moveResponse = await fetch(move.url)
          const moveData = await moveResponse.json()
          
          return {
            id: moveData.id,
            name: moveData.name.replace('-', ' ').charAt(0).toUpperCase() + moveData.name.replace('-', ' ').slice(1),
            type: moveData.type.name,
            category: moveData.damage_class.name,
            power: moveData.power || 0,
            accuracy: moveData.accuracy || 0,
            pp: moveData.pp || 0,
            description: moveData.effect_entries[0]?.effect || 'No description available',
            effectChance: moveData.effect_chance,
            priority: moveData.priority,
            target: moveData.target.name,
            contestType: moveData.contest_type?.name
          }
        })
      )
      
      setMoves(moveDetails)
      setFilteredMoves(moveDetails)
    } catch (error) {
      console.error('Error fetching moves:', error)
    }
  }

  const filterMoves = () => {
    let filtered = moves

    if (moveSearchTerm) {
      filtered = filtered.filter(move =>
        move.name.toLowerCase().includes(moveSearchTerm.toLowerCase())
      )
    }

    if (selectedMoveType) {
      filtered = filtered.filter(move => move.type === selectedMoveType)
    }

    if (selectedMoveCategory) {
      filtered = filtered.filter(move => move.category === selectedMoveCategory)
    }

    setFilteredMoves(filtered)
  }

  const calculateDamage = () => {
    if (!attackerPokemon || !defenderPokemon || !selectedMove) return

    // Find the move
    const move = moves.find(m => m.name.toLowerCase() === selectedMove.toLowerCase())
    if (!move) return

    // Get attacker stats
    const attackerAttack = attackerPokemon.stats?.find(s => s.name === 'attack')?.value || 0
    const attackerSpAttack = attackerPokemon.stats?.find(s => s.name === 'special-attack')?.value || 0
    const attackerLevel = 50 // Assume level 50 for competitive

    // Get defender stats
    const defenderHP = defenderPokemon.stats?.find(s => s.name === 'hp')?.value || 0
    const defenderDefense = defenderPokemon.stats?.find(s => s.name === 'defense')?.value || 0
    const defenderSpDefense = defenderPokemon.stats?.find(s => s.name === 'special-defense')?.value || 0

    // Determine attack and defense stats based on move category
    const attackStat = move.category === 'physical' ? attackerAttack : attackerSpAttack
    const defenseStat = move.category === 'physical' ? defenderDefense : defenderSpDefense

    // Calculate type effectiveness
    const typeEffectiveness = getTypeEffectiveness(move.type, defenderPokemon.types)

    // Calculate STAB (Same Type Attack Bonus)
    const stab = attackerPokemon.types.includes(move.type) ? 1.5 : 1

    // Calculate damage (simplified formula)
    const baseDamage = Math.floor((2 * attackerLevel / 5 + 2) * move.power * attackStat / defenseStat / 50 + 2)
    const damageWithModifiers = Math.floor(baseDamage * stab * typeEffectiveness)

    // Add random variance (85% - 100%)
    const minDamage = Math.floor(damageWithModifiers * 0.85)
    const maxDamage = damageWithModifiers

    // Calculate percentage of defender's HP
    const damagePercentage = Math.round((minDamage / defenderHP) * 100)

    setDamageResult({
      minDamage,
      maxDamage,
      percentage: damagePercentage
    })
  }

  useEffect(() => {
    fetchMoves()
  }, [])

  useEffect(() => {
    filterMoves()
  }, [moves, moveSearchTerm, selectedMoveType, selectedMoveCategory])

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} p-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Top Right Controls */}
        <div className="flex justify-between items-start mb-4">
          {/* Social Links */}
          <div className="flex gap-3">
            <a
              href="https://github.com/Tribal-Chief-001/Oaks-Originals"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:bg-gray-50 group ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'}`}
              title="View on GitHub"
            >
              <Github className={`w-5 h-5 transition-colors ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`} />
            </a>
            <a
              href="https://x.com/Nighlok__King"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:bg-blue-50 group ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'}`}
              title="Follow on X (Twitter)"
            >
              <Twitter className={`w-5 h-5 transition-colors ${darkMode ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-500'}`} />
            </a>
          </div>

          {/* Enhanced Controls - Clean Layout */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Dark Mode Toggle */}
            <div className="flex items-center gap-2">
              <Sun className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                className="data-[state=checked]:bg-blue-600"
              />
              <Moon className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-gray-400'}`} />
            </div>

            {/* Shiny Toggle */}
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Normal</span>
              <Switch
                checked={showShiny}
                onCheckedChange={setShowShiny}
                className="data-[state=checked]:bg-yellow-500"
              />
              <span className="text-sm font-medium text-yellow-600">✨ Shiny</span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const favPokemon = pokemon.filter(p => favorites.includes(p.id))
                  setFilteredPokemon(favPokemon.length > 0 ? favPokemon : pokemon)
                }}
                className={`flex items-center gap-2 ${darkMode ? 'border-gray-600' : ''}`}
              >
                <Heart className="w-4 h-4 text-red-500" />
                <span className="hidden sm:inline">Favorites</span>
                <span className="sm:hidden">({favorites.length})</span>
              </Button>

              <Button
                variant={compareMode ? "default" : "outline"}
                size="sm"
                onClick={() => setCompareMode(!compareMode)}
                className={`flex items-center gap-2 ${darkMode ? 'border-gray-600' : ''}`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Compare</span>
                <span className="sm:hidden">({compareList.length}/2)</span>
              </Button>
            </div>

            {/* Tools Dropdown */}
            <div className="relative group">
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 ${darkMode ? 'border-gray-600' : ''}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Tools</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTeamBuilderMode(!teamBuilderMode)
                      setShowTeamBuilder(!showTeamBuilder)
                    }}
                    className={`w-full justify-start ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Team Builder ({currentTeam.length}/6)
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMoveDatabase(!showMoveDatabase)}
                    className={`w-full justify-start ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Move Database
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDamageCalculator(!showDamageCalculator)}
                    className={`w-full justify-start ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Damage Calculator
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTypeChart(!showTypeChart)}
                    className={`w-full justify-start ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Type Chart
                  </Button>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="flex items-center gap-2">
              <Button
                variant={showBreedingTools ? "default" : "outline"}
                size="sm"
                onClick={() => setShowBreedingTools(!showBreedingTools)}
                className={`flex items-center gap-2 ${darkMode ? 'border-gray-600' : ''}`}
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Breeding</span>
              </Button>

              <Button
                variant={showPokedexTracker ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPokedexTracker(!showPokedexTracker)}
                className={`flex items-center gap-2 ${darkMode ? 'border-gray-600' : ''}`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Tracker</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-6xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Oak's Originals
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Professor Oak's personal collection of the original 151 Pokémon
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            <Input
              type="text"
              placeholder="Search Pokémon by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : ''}`}
            />
          </div>

          {/* Results Counter */}
          <div className="text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing {filteredPokemon.length} of {pokemon.length} Pokémon
            </p>
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Button
              variant={selectedType === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("")}
              className={darkMode ? 'border-gray-600' : ''}
            >
              All Types
            </Button>
            {allTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className={`capitalize ${darkMode ? 'border-gray-600' : ''}`}
              >
                <span className="mr-2">{getTypeIcon(type)}</span>
                {type}
              </Button>
            ))}
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex justify-center mb-4">
            <Button
              variant={showAdvancedFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 ${darkMode ? 'border-gray-600' : ''}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Advanced Filters
              {(selectedTypes.length > 0 || 
                Object.values(statRanges).some(range => range.min !== 0 || range.max !== 255) ||
                heightRange.min !== 0 || heightRange.max !== 1000 ||
                weightRange.min !== 0 || weightRange.max !== 5000 ||
                abilityFilter) && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </Button>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className={`rounded-lg p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Advanced Filters
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className={`flex items-center gap-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear All
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Multi-Type Filter */}
                <div>
                  <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Types ({selectedTypes.length}/2)
                  </h4>
                  <div className="space-y-2">
                    <div className="flex gap-2 mb-2">
                      <Button
                        variant={typeFilterMode === 'any' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTypeFilterMode('any')}
                        className="text-xs"
                      >
                        Any
                      </Button>
                      <Button
                        variant={typeFilterMode === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTypeFilterMode('all')}
                        className="text-xs"
                      >
                        All
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {allTypes.map((type) => (
                        <Button
                          key={type}
                          variant={selectedTypes.includes(type) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleTypeFilter(type)}
                          className={`text-xs capitalize ${selectedTypes.includes(type) ? '' : darkMode ? 'border-gray-600' : ''}`}
                          disabled={selectedTypes.length >= 2 && !selectedTypes.includes(type)}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stat Ranges */}
                <div>
                  <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Stat Ranges
                  </h4>
                  <div className="space-y-2">
                    {['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'].map((stat) => (
                      <div key={stat} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className={`capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {stat.replace('special', 'Sp. ')}
                          </span>
                          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {statRanges[stat as keyof typeof statRanges].min} - {statRanges[stat as keyof typeof statRanges].max}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Input
                            type="number"
                            min="0"
                            max="255"
                            value={statRanges[stat as keyof typeof statRanges].min}
                            onChange={(e) => setStatRanges(prev => ({
                              ...prev,
                              [stat]: { ...prev[stat as keyof typeof statRanges], min: parseInt(e.target.value) || 0 }
                            }))}
                            className={`text-xs ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                          />
                          <Input
                            type="number"
                            min="0"
                            max="255"
                            value={statRanges[stat as keyof typeof statRanges].max}
                            onChange={(e) => setStatRanges(prev => ({
                              ...prev,
                              [stat]: { ...prev[stat as keyof typeof statRanges], max: parseInt(e.target.value) || 255 }
                            }))}
                            className={`text-xs ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Physical Characteristics */}
                <div>
                  <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Physical Characteristics
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Height (cm)</span>
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {heightRange.min} - {heightRange.max}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Input
                          type="number"
                          min="0"
                          max="1000"
                          value={heightRange.min}
                          onChange={(e) => setHeightRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                          className={`text-xs ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                        />
                        <Input
                          type="number"
                          min="0"
                          max="1000"
                          value={heightRange.max}
                          onChange={(e) => setHeightRange(prev => ({ ...prev, max: parseInt(e.target.value) || 1000 }))}
                          className={`text-xs ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Weight (kg)</span>
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {weightRange.min} - {weightRange.max}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Input
                          type="number"
                          min="0"
                          max="5000"
                          value={weightRange.min}
                          onChange={(e) => setWeightRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                          className={`text-xs ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                        />
                        <Input
                          type="number"
                          min="0"
                          max="5000"
                          value={weightRange.max}
                          onChange={(e) => setWeightRange(prev => ({ ...prev, max: parseInt(e.target.value) || 5000 }))}
                          className={`text-xs ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs mb-1">
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ability</span>
                      </div>
                      <Input
                        type="text"
                        placeholder="Filter by ability..."
                        value={abilityFilter}
                        onChange={(e) => setAbilityFilter(e.target.value)}
                        className={`text-xs ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sorting Controls */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`px-3 py-1 border rounded-md text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white'}`}
              >
                <option value="id">ID</option>
                <option value="name">Name</option>
                <option value="height">Height</option>
                <option value="weight">Weight</option>
                <option value="hp">HP</option>
                <option value="attack">Attack</option>
                <option value="defense">Defense</option>
                <option value="special-attack">Sp. Attack</option>
                <option value="special-defense">Sp. Defense</option>
                <option value="speed">Speed</option>
              </select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className={`flex items-center gap-2 ${darkMode ? 'border-gray-600' : ''}`}
            >
              {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>
          </div>
        </div>

        {/* Pokemon Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredPokemon.map((pokemon) => (
              <Card
                key={pokemon.id}
                className={`overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-2 hover:border-blue-200 ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'border-transparent hover:border-blue-200'}`}
                onClick={() => handlePokemonClick(pokemon)}
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
                        className={`p-1 rounded-full ${favorites.includes(pokemon.id) ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(pokemon.id) ? 'fill-current' : ''}`} />
                      </button>
                      {compareMode && compareList.length < 2 && !compareList.find(p => p.id === pokemon.id) && (
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
                      {teamBuilderMode && currentTeam.length < 6 && !currentTeam.find(p => p.id === pokemon.id) && (
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

                  {/* Quick Stats Preview */}
                  {pokemon.stats && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between text-xs">
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Total: {pokemon.stats.reduce((sum, stat) => sum + stat.value, 0)}
                        </span>
                        <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {getStatRating(pokemon.stats.reduce((sum, stat) => sum + stat.value, 0) / 6)}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredPokemon.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className={darkMode ? "text-gray-400 text-lg" : "text-gray-500 text-lg"}>
              No Pokémon found matching your search.
            </p>
          </div>
        )}

        {/* Pokemon Detail Modal */}
        {selectedPokemon && (
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
                      className={`h-8 w-8 p-0 rounded-full ${favorites.includes(selectedPokemon.id) ? 'text-red-500' : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200'}`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(selectedPokemon.id) ? 'fill-current' : ''}`} />
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
                    { id: 'evolution', label: 'Evolution', icon: BarChart3 },
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
                {loadingDetails ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                      <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left Column - Image and Basic Info */}
                        <div className="space-y-6">
                          <div className="text-center">
                            <div className={`rounded-xl p-6 mb-4 ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
                              <img
                                src={showShiny ? selectedPokemon.shinyImage : selectedPokemon.image}
                                alt={selectedPokemon.name}
                                className="w-full h-64 object-contain"
                              />
                            </div>
                            <div className="flex justify-center gap-4">
                              <Button
                                variant={showShiny ? "outline" : "default"}
                                size="sm"
                                onClick={() => setShowShiny(false)}
                                className={darkMode ? 'border-gray-600' : ''}
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

                          {/* Types */}
                          <div>
                            <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Types</h3>
                            <div className="flex flex-wrap gap-3">
                              {selectedPokemon.types.map((type) => (
                                <div key={type} className="flex items-center gap-2">
                                  <Badge
                                    variant="secondary"
                                    className={`capitalize text-sm py-2 px-3 ${getTypeColor(type)}`}
                                  >
                                    <span className="mr-2 text-lg">{getTypeIcon(type)}</span>
                                    {type}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Physical Characteristics */}
                          <div>
                            <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Physical Characteristics</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Height</p>
                                <p className={`font-semibold ${darkMode ? 'text-white' : ''}`}>{formatHeight(selectedPokemon.height)}</p>
                              </div>
                              <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Weight</p>
                                <p className={`font-semibold ${darkMode ? 'text-white' : ''}`}>{formatWeight(selectedPokemon.weight)}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Basic Info */}
                        <div className="space-y-6">
                          {/* Core Identification */}
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
                                {selectedPokemon.japaneseName && (
                                  <div className="col-span-2">
                                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Japanese:</span>
                                    <span className={`ml-2 font-medium ${darkMode ? 'text-white' : ''}`}>{selectedPokemon.japaneseName}</span>
                                  </div>
                                )}
                                {selectedPokemon.category && (
                                  <div className="col-span-2">
                                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category:</span>
                                    <span className={`ml-2 font-medium ${darkMode ? 'text-white' : ''}`}>{selectedPokemon.category}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Basic Stats Preview */}
                          {selectedPokemon.stats && (
                            <div>
                              <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Base Stats Total</h3>
                              <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <div className="text-center">
                                  <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {selectedPokemon.stats.reduce((sum, stat) => sum + stat.value, 0)}
                                  </div>
                                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {getStatRating(selectedPokemon.stats.reduce((sum, stat) => sum + stat.value, 0) / 6)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Abilities */}
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
                                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Hidden Abilities:</p>
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
                      <div className="space-y-6">
                        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Biological Profile</h3>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Physical Traits</h4>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Height:</span>
                                  <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{formatHeight(selectedPokemon.height)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Weight:</span>
                                  <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{formatWeight(selectedPokemon.weight)}</span>
                                </div>
                                {selectedPokemon.baseFriendship && (
                                  <div className="flex justify-between">
                                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Base Friendship:</span>
                                    <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{selectedPokemon.baseFriendship}</span>
                                  </div>
                                )}
                                {selectedPokemon.baseExperience && (
                                  <div className="flex justify-between">
                                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Base Experience:</span>
                                    <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{selectedPokemon.baseExperience}</span>
                                  </div>
                                )}
                                {selectedPokemon.catchRate && (
                                  <div className="flex justify-between">
                                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Catch Rate:</span>
                                    <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{selectedPokemon.catchRate} ({Math.round(selectedPokemon.catchRate / 255 * 100)}%)</span>
                                  </div>
                                )}
                                {selectedPokemon.genderRatio && (
                                  <div className="flex justify-between">
                                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gender Ratio:</span>
                                    <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{selectedPokemon.genderRatio}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Breeding</h4>
                              <div className="space-y-3 text-sm">
                                {selectedPokemon.eggGroups && (
                                  <div>
                                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Egg Groups:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {selectedPokemon.eggGroups.map((group) => (
                                        <Badge key={group} variant="outline" className="text-xs capitalize">
                                          {group}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {selectedPokemon.eggCycles && (
                                  <div className="flex justify-between">
                                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Egg Cycles:</span>
                                    <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{selectedPokemon.eggCycles} ({selectedPokemon.eggCycles * 255} steps)</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {selectedPokemon.averageLifespan && (
                            <div className="mt-4">
                              <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Lifespan & Ecology</h4>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Average Lifespan:</span>
                                  <span className={`ml-2 font-medium ${darkMode ? 'text-white' : ''}`}>{selectedPokemon.averageLifespan}</span>
                                </div>
                                {selectedPokemon.ecologicalRole && (
                                  <div>
                                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ecological Role:</span>
                                    <span className={`ml-2 font-medium ${darkMode ? 'text-white' : ''}`}>{selectedPokemon.ecologicalRole}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {selectedPokemon.naturalHabitat && (
                            <div className="mt-4">
                              <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Natural Habitat</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedPokemon.naturalHabitat.map((habitat) => (
                                  <Badge key={habitat} variant="secondary" className="text-xs">
                                    {habitat}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Abilities Tab */}
                    {activeTab === 'abilities' && (
                      <div className="space-y-6">
                        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Abilities & Hidden Traits</h3>
                          <div className="space-y-4">
                            {selectedPokemon.abilities.map((ability, index) => (
                              <div key={ability} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                  {ability.replace('-', ' ')} {index === 0 && '(Primary)'}
                                  {index === 1 && '(Secondary)'}
                                </h4>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {selectedPokemon.abilityDescriptions?.[index === 0 ? 'primary' : 'secondary'] || 
                                   `Standard ability for ${selectedPokemon.name}. Provides various battle advantages depending on the situation.`}
                                </p>
                              </div>
                            ))}
                            
                            {selectedPokemon.hiddenAbilities?.map((ability) => (
                              <div key={ability} className={`p-4 rounded-lg border-2 ${darkMode ? 'bg-gray-600 border-purple-500' : 'bg-white border-purple-300'}`}>
                                <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                  {ability.replace('-', ' ')} (Hidden)
                                </h4>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {selectedPokemon.abilityDescriptions?.hidden || 
                                   `Rare hidden ability that can only be obtained through special breeding methods or events. Provides unique strategic advantages.`}
                                </p>
                              </div>
                            ))}
                            
                            {selectedPokemon.abilityDescriptions && (
                              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Notable Synergies</h4>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  This Pokémon's abilities work particularly well with certain move types and team compositions, creating powerful synergistic effects in battle.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stats Tab */}
                    {activeTab === 'stats' && selectedPokemon.stats && (
                      <div className="space-y-6">
                        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Base Statistics</h3>
                          
                          {/* Stats Table */}
                          <div className="mb-6">
                            <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                              <table className="w-full">
                                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                  <tr>
                                    <th className={`text-left p-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Stat</th>
                                    <th className={`text-center p-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Value</th>
                                    <th className={`text-center p-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Rating</th>
                                    <th className={`text-left p-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Visual</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedPokemon.stats.map((stat) => (
                                    <tr key={stat.name} className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                      <td className={`p-3 text-sm font-medium capitalize ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {stat.name.replace('-', ' ')}
                                      </td>
                                      <td className={`p-3 text-center text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                        {stat.value}
                                      </td>
                                      <td className={`p-3 text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {getStatRating(stat.value)}
                                      </td>
                                      <td className={`p-3`}>
                                        <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                          <div
                                            className={`h-2 rounded-full transition-all duration-300 ${darkMode ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}
                                            style={{ width: `${Math.min((stat.value / 255) * 100, 100)}%` }}
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                  <tr className={`border-t-2 ${darkMode ? 'border-gray-500 bg-gray-700' : 'border-gray-300 bg-gray-100'}`}>
                                    <td className={`p-3 text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Total</td>
                                    <td className={`p-3 text-center text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                      {selectedPokemon.stats.reduce((sum, stat) => sum + stat.value, 0)}
                                    </td>
                                    <td className={`p-3 text-center text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                      {getStatRating(selectedPokemon.stats.reduce((sum, stat) => sum + stat.value, 0) / 6)}
                                    </td>
                                    <td className={`p-3`}></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          
                          {/* Stat Analysis */}
                          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                            <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Stat Distribution Analysis</h4>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {selectedPokemon.statNotes || 
                               `This Pokémon has a balanced stat distribution that makes it versatile in battle. Its highest stats suggest it excels in ${selectedPokemon.stats.reduce((max, stat) => stat.value > max.value ? stat : max, selectedPokemon.stats[0]).name.replace('-', ' ')}, while its lowest stats indicate areas where it may need support.`}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Moves Tab */}
                    {activeTab === 'moves' && selectedPokemon.learnset && (
                      <div className="space-y-6">
                        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Move Learnset</h3>
                          
                          {/* Level Up Moves */}
                          <div className="mb-6">
                            <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Level Up Moves</h4>
                            <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                              <table className="w-full">
                                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                  <tr>
                                    <th className={`text-left p-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Level</th>
                                    <th className={`text-left p-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Move</th>
                                    <th className={`text-left p-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</th>
                                    <th className={`text-left p-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedPokemon.learnset.levelUp.map((move, index) => (
                                    <tr key={index} className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                      <td className={`p-3 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{move.level}</td>
                                      <td className={`p-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{move.name}</td>
                                      <td className={`p-3`}>
                                        <Badge variant="secondary" className={`capitalize text-xs ${getTypeColor(move.type)}`}>
                                          {move.type}
                                        </Badge>
                                      </td>
                                      <td className={`p-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{move.category}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          
                          {/* TM Moves */}
                          {selectedPokemon.learnset.tmMoves.length > 0 && (
                            <div className="mb-6">
                              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>TM Moves</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedPokemon.learnset.tmMoves.map((move, index) => (
                                  <Badge key={index} variant="outline" className={`capitalize ${darkMode ? 'border-gray-600 text-gray-200' : ''}`}>
                                    {move}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Egg Moves */}
                          {selectedPokemon.learnset.eggMoves.length > 0 && (
                            <div>
                              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Egg Moves</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedPokemon.learnset.eggMoves.map((move, index) => (
                                  <Badge key={index} variant="secondary" className="capitalize text-xs">
                                    {move}
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
                      <div className="space-y-6">
                        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Competitive Analysis</h3>
                          
                          {/* Competitive Overview */}
                          <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Competitive Information</h4>
                              <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                <div className="space-y-3 text-sm">
                                  <div>
                                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Smogon Tier:</span>
                                    <span className={`ml-2 font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedPokemon.competitive.smogonTier}</span>
                                  </div>
                                  <div>
                                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Common Roles:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {selectedPokemon.competitive.commonRoles.map((role, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {role}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type Effectiveness Matrix</h4>
                              <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                {/* Type Effectiveness Visual Matrix */}
                                <div className="space-y-4">
                                  {/* Weaknesses */}
                                  {(() => {
                                    const effectiveness = getComprehensiveTypeEffectiveness(selectedPokemon.types)
                                    return (
                                      <>
                                        {effectiveness.weaknesses.length > 0 && (
                                          <div>
                                            <h5 className={`text-sm font-medium mb-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                                              Weaknesses (Takes extra damage)
                                            </h5>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                              {effectiveness.weaknesses.map((weakness, index) => (
                                                <div
                                                  key={index}
                                                  className={`rounded-lg p-2 text-center text-xs font-medium ${getEffectivenessColor(weakness.multiplier)}`}
                                                >
                                                  <div className="text-lg mb-1">{weakness.icon}</div>
                                                  <div className="capitalize">{weakness.type}</div>
                                                  <div className="font-bold">{getEffectivenessText(weakness.multiplier)}</div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        
                                        {/* Resistances */}
                                        {effectiveness.resistances.length > 0 && (
                                          <div>
                                            <h5 className={`text-sm font-medium mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                              Resistances (Takes less damage)
                                            </h5>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                              {effectiveness.resistances.map((resistance, index) => (
                                                <div
                                                  key={index}
                                                  className={`rounded-lg p-2 text-center text-xs font-medium ${getEffectivenessColor(resistance.multiplier)}`}
                                                >
                                                  <div className="text-lg mb-1">{resistance.icon}</div>
                                                  <div className="capitalize">{resistance.type}</div>
                                                  <div className="font-bold">{getEffectivenessText(resistance.multiplier)}</div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        
                                        {/* Immunities */}
                                        {effectiveness.immunities.length > 0 && (
                                          <div>
                                            <h5 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                              Immunities (No damage)
                                            </h5>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                              {effectiveness.immunities.map((immunity, index) => (
                                                <div
                                                  key={index}
                                                  className={`rounded-lg p-2 text-center text-xs font-medium ${getEffectivenessColor(immunity.multiplier)}`}
                                                >
                                                  <div className="text-lg mb-1">{immunity.icon}</div>
                                                  <div className="capitalize">{immunity.type}</div>
                                                  <div className="font-bold">{getEffectivenessText(immunity.multiplier)}</div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Optimal Movesets */}
                          <div className="mb-6">
                            <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Optimal Movesets</h4>
                            <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                              <div className="flex flex-wrap gap-2">
                                {selectedPokemon.competitive.optimalMovesets.map((move, index) => (
                                  <Badge key={index} variant="secondary" className="text-sm">
                                    {move}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {/* Counters and Team Synergy */}
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Counters</h4>
                              <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                <ul className={`space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {selectedPokemon.competitive.counters.map((counter, index) => (
                                    <li key={index}>• {counter}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Team Synergy</h4>
                              <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {selectedPokemon.competitive.teamSynergy}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Flavor Text Tab */}
                    {activeTab === 'flavor' && selectedPokemon.flavorText && (
                      <div className="space-y-6">
                        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Pokédex Entries</h3>
                          
                          <div className="grid md:grid-cols-3 gap-6">
                            {selectedPokemon.flavorText.red && (
                              <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pokémon Red</h4>
                                <p className={`text-sm italic ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  "{selectedPokemon.flavorText.red}"
                                </p>
                              </div>
                            )}
                            
                            {selectedPokemon.flavorText.blue && (
                              <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pokémon Blue</h4>
                                <p className={`text-sm italic ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  "{selectedPokemon.flavorText.blue}"
                                </p>
                              </div>
                            )}
                            
                            {selectedPokemon.flavorText.yellow && (
                              <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pokémon Yellow</h4>
                                <p className={`text-sm italic ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  "{selectedPokemon.flavorText.yellow}"
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {/* If no flavor text available */}
                          {!selectedPokemon.flavorText.red && !selectedPokemon.flavorText.blue && !selectedPokemon.flavorText.yellow && (
                            <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                No Pokédex entries available from Generation I games.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Encounters Tab */}
                    {activeTab === 'encounters' && (
                      <div className="space-y-6">
                        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}}`}>Encounter Data</h3>
                          
                          <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                            <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Generation I Encounter Locations</h4>
                            <div className="space-y-4">
                              {/* Common encounter locations for Kanto region */}
                              <div>
                                <h5 className={`font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wild Encounters</h5>
                                <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {getEncounterLocations(selectedPokemon.id)}
                                  </p>
                                </div>
                              </div>
                              
                              <div>
                                <h5 className={`font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Special Encounters</h5>
                                <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {getSpecialEncounters(selectedPokemon.id)}
                                  </p>
                                </div>
                              </div>
                              
                              <div>
                                <h5 className={`font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Evolution</h5>
                                <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {getEvolutionMethod(selectedPokemon.id)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Trivia Tab */}
                    {activeTab === 'trivia' && selectedPokemon.trivia && (
                      <div className="space-y-6">
                        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Trivia & Background</h3>
                          
                          <div className="space-y-6">
                            <div>
                              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Design Origin</h4>
                              <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {selectedPokemon.trivia.designOrigin}
                                </p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name Etymology</h4>
                              <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {selectedPokemon.trivia.nameEtymology}
                                </p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notable Appearances</h4>
                              <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                <ul className={`space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {selectedPokemon.trivia.notableAppearances.map((appearance, index) => (
                                    <li key={index}>• {appearance}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Historical Context</h4>
                              <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {selectedPokemon.trivia.historicalContext}
                                </p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Developer Trivia</h4>
                              <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {selectedPokemon.trivia.developerTrivia}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mechanics Tab */}
                    {activeTab === 'mechanics' && selectedPokemon.advancedMechanics && (
                      <div className="space-y-6">
                        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Advanced Mechanics</h3>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Hidden Power</h4>
                              <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {selectedPokemon.advancedMechanics.hiddenPowerRange}
                                </p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Breeding Information</h4>
                              <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {selectedPokemon.advancedMechanics.breedingQuirks}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div>
                              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Form Changes</h4>
                              <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {selectedPokemon.advancedMechanics.formChangeTriggers}
                                </p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Event Status</h4>
                              <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {selectedPokemon.advancedMechanics.eventExclusive}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Generation Changes</h4>
                            <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {selectedPokemon.advancedMechanics.statChanges}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Evolution Tab */}
                    {activeTab === 'evolution' && (
                      <div className="space-y-6">
                        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Evolution Chain</h3>
                          
                          {selectedPokemon.evolutionChain && selectedPokemon.evolutionChain.length > 0 ? (
                            <div className="space-y-4">
                              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
                                {selectedPokemon.evolutionChain?.map((evolution, index) => (
                                  <div key={evolution.id} className="flex flex-col items-center">
                                    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'} text-center min-w-[140px]`}>
                                      <img
                                        src={evolution.image}
                                        alt={evolution.name}
                                        className="w-24 h-24 object-contain mx-auto mb-2"
                                      />
                                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{evolution.name}</p>
                                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>#{evolution.id.toString().padStart(3, '0')}</p>
                                    </div>
                                    {index < (selectedPokemon.evolutionChain?.length || 0) - 1 && (
                                      <div className="flex flex-col items-center justify-center h-full">
                                        <div className={`text-2xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>↓</div>
                                        <div className={`text-xs text-center max-w-[100px] mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                          {selectedPokemon.evolutionChain?.[index + 1]?.method}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {selectedPokemon.name} does not evolve.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Compare Modal */}
        {compareMode && compareList.length === 2 && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className={`max-w-7xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'border-blue-200'}`}>
              <CardHeader className={`pb-4 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-100'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Pokémon Comparison
                    </CardTitle>
                    <CardDescription className={`${darkMode ? 'text-gray-300' : ''}`}>
                      Compare {compareList[0].name} vs {compareList[1].name}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCompareList([])}
                      className={`h-8 w-8 p-0 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200'}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Basic Info Comparison */}
                  <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Basic Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {compareList.map((pokemon, index) => (
                        <div key={pokemon.id} className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                          <div className="text-center mb-4">
                            <img
                              src={showShiny ? pokemon.shinyImage : pokemon.image}
                              alt={pokemon.name}
                              className="w-32 h-32 object-contain mx-auto mb-2"
                            />
                            <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{pokemon.name}</h4>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>#{pokemon.id.toString().padStart(3, '0')}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Types:</span>
                              <div className="flex gap-1">
                                {pokemon.types.map((type) => (
                                  <Badge key={type} variant="secondary" className={`text-xs ${getTypeColor(type)}`}>
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Height:</span>
                              <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{formatHeight(pokemon.height)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Weight:</span>
                              <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{formatWeight(pokemon.weight)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category:</span>
                              <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{pokemon.category || 'Pokémon'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats Comparison */}
                  <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Base Stats Comparison</h3>
                    <div className="space-y-4">
                      {['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].map((statName) => {
                        const stat1 = compareList[0].stats?.find(s => s.name === statName)?.value || 0
                        const stat2 = compareList[1].stats?.find(s => s.name === statName)?.value || 0
                        const maxValue = Math.max(stat1, stat2, 255)
                        
                        return (
                          <div key={statName}>
                            <div className="flex justify-between items-center mb-2">
                              <span className={`font-medium capitalize ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {statName.replace('-', ' ')}
                              </span>
                              <div className="flex gap-4">
                                <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                  {compareList[0].name}: {stat1}
                                </span>
                                <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                  {compareList[1].name}: {stat2}
                                </span>
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {compareList[0].name}
                                </div>
                                <div className={`w-full rounded-full h-3 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                  <div
                                    className={`h-3 rounded-full transition-all duration-300 ${darkMode ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}
                                    style={{ width: `${(stat1 / maxValue) * 100}%` }}
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {compareList[1].name}
                                </div>
                                <div className={`w-full rounded-full h-3 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                  <div
                                    className={`h-3 rounded-full transition-all duration-300 ${darkMode ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'}`}
                                    style={{ width: `${(stat2 / maxValue) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Total</span>
                          <div className="flex gap-4">
                            <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {compareList[0].name}: {compareList[0].stats?.reduce((sum, stat) => sum + stat.value, 0) || 0}
                            </span>
                            <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {compareList[1].name}: {compareList[1].stats?.reduce((sum, stat) => sum + stat.value, 0) || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Type Effectiveness Comparison */}
                  <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Type Effectiveness Comparison</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {compareList.map((pokemon, index) => {
                        const effectiveness = getComprehensiveTypeEffectiveness(pokemon.types)
                        return (
                          <div key={pokemon.id} className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                            <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{pokemon.name}</h4>
                            
                            {effectiveness.weaknesses.length > 0 && (
                              <div className="mb-3">
                                <h5 className={`text-sm font-medium mb-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                                  Weaknesses
                                </h5>
                                <div className="flex flex-wrap gap-1">
                                  {effectiveness.weaknesses.slice(0, 6).map((weakness, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs capitalize">
                                      {weakness.type} ({getEffectivenessText(weakness.multiplier)})
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {effectiveness.resistances.length > 0 && (
                              <div className="mb-3">
                                <h5 className={`text-sm font-medium mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                  Resistances
                                </h5>
                                <div className="flex flex-wrap gap-1">
                                  {effectiveness.resistances.slice(0, 6).map((resistance, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs capitalize">
                                      {resistance.type} ({getEffectivenessText(resistance.multiplier)})
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {effectiveness.immunities.length > 0 && (
                              <div>
                                <h5 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Immunities
                                </h5>
                                <div className="flex flex-wrap gap-1">
                                  {effectiveness.immunities.map((immunity, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs capitalize">
                                      {immunity.type}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Team Builder Modal */}
        {showTeamBuilder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className={`max-w-7xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'border-blue-200'}`}>
              <CardHeader className={`pb-4 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-100'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Team Builder
                    </CardTitle>
                    <CardDescription className={`${darkMode ? 'text-gray-300' : ''}`}>
                      Build your perfect team of 6 Pokémon
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTeamBuilder(false)}
                      className={`h-8 w-8 p-0 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200'}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Team Management */}
                  <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <Input
                        placeholder="Team name..."
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className={`max-w-xs ${darkMode ? 'bg-gray-600 border-gray-500' : ''}`}
                      />
                      <Button
                        onClick={saveTeam}
                        disabled={currentTeam.length === 0 || !teamName.trim()}
                        size="sm"
                      >
                        Save Team
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCurrentTeam([])
                          setTeamName("")
                        }}
                        size="sm"
                      >
                        Clear Team
                      </Button>
                    </div>
                    
                    {/* Current Team */}
                    <div className="mb-6">
                      <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Current Team ({currentTeam.length}/6)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {Array.from({ length: 6 }, (_, index) => {
                          const pokemon = currentTeam[index]
                          return (
                            <div key={index} className={`rounded-lg p-3 text-center ${pokemon ? (darkMode ? 'bg-gray-600' : 'bg-white') : (darkMode ? 'bg-gray-800 border-2 border-dashed border-gray-600' : 'bg-gray-100 border-2 border-dashed border-gray-300')}`}>
                              {pokemon ? (
                                <div className="space-y-2">
                                  <img
                                    src={pokemon.image}
                                    alt={pokemon.name}
                                    className="w-16 h-16 object-contain mx-auto"
                                  />
                                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {pokemon.name}
                                  </p>
                                  <div className="flex justify-center gap-1">
                                    {pokemon.types.map((type) => (
                                      <Badge key={type} variant="secondary" className={`text-xs ${getTypeColor(type)}`}>
                                        {type}
                                      </Badge>
                                    ))}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFromTeam(pokemon.id)}
                                    className={`h-6 w-6 p-0 mx-auto ${darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-200'}`}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center h-24">
                                  <Plus className={`w-6 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Team Analysis */}
                    {currentTeam.length > 0 && (() => {
                      const analysis = analyzeTeamSynergy()
                      if (!analysis) return null
                      
                      return (
                        <div className="space-y-4">
                          <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Team Analysis
                          </h4>
                          
                          {/* Type Distribution */}
                          <div>
                            <h5 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Type Distribution
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(analysis.typeCount).map(([type, count]) => (
                                <Badge key={type} variant="outline" className={`text-xs ${darkMode ? 'border-gray-600 text-gray-200' : ''}`}>
                                  {type} ({count})
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Team Stats */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Total Stats
                              </h5>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>HP:</span>
                                  <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{analysis.totalStats.hp}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Attack:</span>
                                  <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{analysis.totalStats.attack}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Defense:</span>
                                  <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{analysis.totalStats.defense}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sp. Atk:</span>
                                  <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{analysis.totalStats.specialAttack}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sp. Def:</span>
                                  <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{analysis.totalStats.specialDefense}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Speed:</span>
                                  <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{analysis.totalStats.speed}</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-600">
                                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total:</span>
                                  <span className={`font-bold ${darkMode ? 'text-white' : ''}`}>
                                    {Object.values(analysis.totalStats).reduce((sum, val) => sum + val, 0)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h5 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Average Stats
                              </h5>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>HP:</span>
                                  <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{analysis.averageStats.hp}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Attack:</span>
                                  <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{analysis.averageStats.attack}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Defense:</span>
                                  <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{analysis.averageStats.defense}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sp. Atk:</span>
                                  <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{analysis.averageStats.specialAttack}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sp. Def:</span>
                                  <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{analysis.averageStats.specialDefense}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Speed:</span>
                                  <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{analysis.averageStats.speed}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Team Coverage */}
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <h5 className={`text-sm font-medium mb-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                                Team Weaknesses
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {analysis.weaknesses.map((weakness) => (
                                  <Badge key={weakness} variant="outline" className="text-xs capitalize">
                                    {weakness}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className={`text-sm font-medium mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                Team Resistances
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {analysis.resistances.map((resistance) => (
                                  <Badge key={resistance} variant="secondary" className="text-xs capitalize">
                                    {resistance}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Team Immunities
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {analysis.immunities.map((immunity) => (
                                  <Badge key={immunity} variant="outline" className="text-xs capitalize">
                                    {immunity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>

                  {/* Saved Teams */}
                  {savedTeams.length > 0 && (
                    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Saved Teams
                      </h4>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savedTeams.map((team, index) => (
                          <div key={index} className={`rounded-lg p-3 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                            <div className="flex justify-between items-start mb-2">
                              <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {team.name}
                              </h5>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTeam(index)}
                                className={`h-6 w-6 p-0 ${darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-200'}`}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {team.team.slice(0, 3).map((pokemon) => (
                                <Badge key={pokemon.id} variant="outline" className="text-xs">
                                  {pokemon.name}
                                </Badge>
                              ))}
                              {team.team.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{team.team.length - 3}
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => loadTeam(team)}
                                className="text-xs"
                              >
                                Load
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Move Database Modal */}
        {showMoveDatabase && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className={`max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'border-blue-200'}`}>
              <CardHeader className={`pb-4 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-100'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Move Database
                    </CardTitle>
                    <CardDescription className={`${darkMode ? 'text-gray-300' : ''}`}>
                      Browse and search through Pokémon moves
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMoveDatabase(false)}
                      className={`h-8 w-8 p-0 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200'}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Move Search and Filters */}
                  <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Input
                          placeholder="Search moves..."
                          value={moveSearchTerm}
                          onChange={(e) => setMoveSearchTerm(e.target.value)}
                          className={darkMode ? 'bg-gray-600 border-gray-500' : ''}
                        />
                      </div>
                      <div>
                        <select
                          value={selectedMoveType}
                          onChange={(e) => setSelectedMoveType(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'}`}
                        >
                          <option value="">All Types</option>
                          {allTypes.map((type) => (
                            <option key={type} value={type} className="capitalize">{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <select
                          value={selectedMoveCategory}
                          onChange={(e) => setSelectedMoveCategory(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'}`}
                        >
                          <option value="">All Categories</option>
                          <option value="physical">Physical</option>
                          <option value="special">Special</option>
                          <option value="status">Status</option>
                        </select>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Showing {filteredMoves.length} of {moves.length} moves
                      </p>
                    </div>
                  </div>

                  {/* Moves List */}
                  <div className={`rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full">
                        <thead className={`sticky top-0 ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                          <tr>
                            <th className={`text-left p-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</th>
                            <th className={`text-left p-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</th>
                            <th className={`text-left p-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</th>
                            <th className={`text-center p-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Power</th>
                            <th className={`text-center p-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Accuracy</th>
                            <th className={`text-center p-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>PP</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMoves.map((move) => (
                            <tr key={move.id} className={`border-t ${darkMode ? 'border-gray-600 hover:bg-gray-600' : 'border-gray-200 hover:bg-gray-100'}`}>
                              <td className={`p-3 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {move.name}
                              </td>
                              <td className={`p-3`}>
                                <Badge variant="secondary" className={`text-xs capitalize ${getTypeColor(move.type)}`}>
                                  {move.type}
                                </Badge>
                              </td>
                              <td className={`p-3`}>
                                <Badge variant="outline" className={`text-xs capitalize ${darkMode ? 'border-gray-600 text-gray-200' : ''}`}>
                                  {move.category}
                                </Badge>
                              </td>
                              <td className={`p-3 text-center text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {move.power > 0 ? move.power : '-'}
                              </td>
                              <td className={`p-3 text-center text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {move.accuracy > 0 ? `${move.accuracy}%` : '-'}
                              </td>
                              <td className={`p-3 text-center text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {move.pp > 0 ? move.pp : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Selected Move Details */}
                  {selectedMove && (
                    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Move Details
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {moves.find(m => m.name === selectedMove)?.description || 'No description available'}
                          </p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Priority:</span>
                            <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>
                              {moves.find(m => m.name === selectedMove)?.priority || 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Target:</span>
                            <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>
                              {moves.find(m => m.name === selectedMove)?.target || 'Normal'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Damage Calculator Modal */}
        {showDamageCalculator && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'border-blue-200'}`}>
              <CardHeader className={`pb-4 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-100'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Damage Calculator
                    </CardTitle>
                    <CardDescription className={`${darkMode ? 'text-gray-300' : ''}`}>
                      Calculate damage between Pokémon
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDamageCalculator(false)}
                      className={`h-8 w-8 p-0 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200'}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Pokemon Selection */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Attacker
                      </h4>
                      <div className="space-y-3">
                        <select
                          value={attackerPokemon?.id || ''}
                          onChange={(e) => {
                            const selectedPoke = pokemon.find(p => p.id === parseInt(e.target.value))
                            setAttackerPokemon(selectedPoke || null)
                          }}
                          className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'}`}
                        >
                          <option value="">Select Attacker</option>
                          {pokemon.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        {attackerPokemon && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-600">
                            <img
                              src={attackerPokemon.image}
                              alt={attackerPokemon.name}
                              className="w-12 h-12 object-contain"
                            />
                            <div>
                              <p className={`text-sm font-medium ${darkMode ? 'text-white' : ''}`}>
                                {attackerPokemon.name}
                              </p>
                              <div className="flex gap-1">
                                {attackerPokemon.types.map((type) => (
                                  <Badge key={type} variant="secondary" className={`text-xs ${getTypeColor(type)}`}>
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Defender
                      </h4>
                      <div className="space-y-3">
                        <select
                          value={defenderPokemon?.id || ''}
                          onChange={(e) => {
                            const selectedPoke = pokemon.find(p => p.id === parseInt(e.target.value))
                            setDefenderPokemon(selectedPoke || null)
                          }}
                          className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'}`}
                        >
                          <option value="">Select Defender</option>
                          {pokemon.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        {defenderPokemon && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-600">
                            <img
                              src={defenderPokemon.image}
                              alt={defenderPokemon.name}
                              className="w-12 h-12 object-contain"
                            />
                            <div>
                              <p className={`text-sm font-medium ${darkMode ? 'text-white' : ''}`}>
                                {defenderPokemon.name}
                              </p>
                              <div className="flex gap-1">
                                {defenderPokemon.types.map((type) => (
                                  <Badge key={type} variant="secondary" className={`text-xs ${getTypeColor(type)}`}>
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Move Selection */}
                  <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Move
                    </h4>
                    <div className="space-y-3">
                      <select
                        value={selectedMove}
                        onChange={(e) => setSelectedMove(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'}`}
                      >
                        <option value="">Select Move</option>
                        {moves.map((move) => (
                          <option key={move.id} value={move.name}>{move.name}</option>
                        ))}
                      </select>
                      {selectedMove && (
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Type:</span>
                            <Badge variant="secondary" className={`text-xs ${getTypeColor(moves.find(m => m.name === selectedMove)?.type || 'normal')}`}>
                              {moves.find(m => m.name === selectedMove)?.type}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Power:</span>
                            <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>
                              {moves.find(m => m.name === selectedMove)?.power || 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category:</span>
                            <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>
                              {moves.find(m => m.name === selectedMove)?.category}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Calculate Button */}
                  <div className="text-center">
                    <Button
                      onClick={calculateDamage}
                      disabled={!attackerPokemon || !defenderPokemon || !selectedMove}
                      size="lg"
                    >
                      Calculate Damage
                    </Button>
                  </div>

                  {/* Damage Results */}
                  {damageResult && (
                    <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h4 className={`font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Damage Results
                      </h4>
                      <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div>
                          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {damageResult.minDamage}-{damageResult.maxDamage}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Damage Range
                          </div>
                        </div>
                        <div>
                          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {damageResult.percentage}%
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            of Defender's HP
                          </div>
                        </div>
                        <div>
                          <div className={`text-2xl font-bold ${damageResult.percentage > 50 ? 'text-red-500' : damageResult.percentage > 25 ? 'text-yellow-500' : 'text-green-500'}`}>
                            {damageResult.percentage > 50 ? 'OHKO' : damageResult.percentage > 25 ? '2HKO' : '3HKO+'}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Likely KO
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Breeding Tools Modal */}
        {showBreedingTools && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'border-green-200'}`}>
              <CardHeader className={`pb-4 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-green-50 to-emerald-100'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Breeding and Training Tools
                    </CardTitle>
                    <CardDescription className={`${darkMode ? 'text-gray-300' : ''}`}>
                      IV Calculator, EV Planner, and Breeding Compatibility
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowBreedingTools(false)}
                    className={`h-8 w-8 p-0 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200'}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* IV Calculator Section */}
                  <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>IV Calculator</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Select Pokémon
                          </label>
                          <select
                            value={ivCalculator.pokemon?.id || ''}
                            onChange={(e) => {
                              const selectedPoke = pokemon.find(p => p.id === parseInt(e.target.value))
                              setIvCalculator(prev => ({ ...prev, pokemon: selectedPoke || null }))
                            }}
                            className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'}`}
                          >
                            <option value="">Select Pokémon</option>
                            {pokemon.map((p) => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Level: {ivCalculator.level}
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={ivCalculator.level}
                            onChange={(e) => setIvCalculator(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Nature
                          </label>
                          <select
                            value={ivCalculator.nature}
                            onChange={(e) => setIvCalculator(prev => ({ ...prev, nature: e.target.value as any }))}
                            className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'}`}
                          >
                            <option value="neutral">Neutral</option>
                            <option value="attack">Attack (+Atk, -SpA)</option>
                            <option value="defense">Defense (+Def, -SpA)</option>
                            <option value="specialAttack">Special Attack (+SpA, -Atk)</option>
                            <option value="specialDefense">Special Defense (+SpD, -SpA)</option>
                            <option value="speed">Speed (+Spe, -SpA)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Current Stats</h4>
                        {['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'].map((stat) => (
                          <div key={stat} className="flex items-center gap-3">
                            <label className={`w-20 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {stat.charAt(0).toUpperCase() + stat.slice(1)}:
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="999"
                              value={ivCalculator.stats[stat as keyof typeof ivCalculator.stats]}
                              onChange={(e) => setIvCalculator(prev => ({
                                ...prev,
                                stats: { ...prev.stats, [stat]: parseInt(e.target.value) || 0 }
                              }))}
                              className={`flex-1 px-2 py-1 border rounded text-sm ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'}`}
                            />
                          </div>
                        ))}
                        
                        <Button
                          onClick={calculateIVs}
                          disabled={!ivCalculator.pokemon}
                          className="w-full"
                        >
                          Calculate IVs
                        </Button>
                      </div>
                    </div>
                    
                    {ivCalculator.ivResults.hp > 0 && (
                      <div className={`mt-6 rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                        <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>IV Results</h4>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                          {['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'].map((stat) => (
                            <div key={stat} className="text-center">
                              <div className={`text-lg font-bold ${getIVColor(ivCalculator.ivResults[stat as keyof typeof ivCalculator.ivResults])}`}>
                                {ivCalculator.ivResults[stat as keyof typeof ivCalculator.ivResults]}
                              </div>
                              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {stat.charAt(0).toUpperCase() + stat.slice(1)}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className={`mt-3 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Total: {Object.values(ivCalculator.ivResults).reduce((a, b) => a + b, 0)}/186
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Hidden Power Calculator */}
                  <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Hidden Power Calculator</h3>
                    <div className="text-center">
                      <div className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {calculateHiddenPowerType()}
                      </div>
                      <div className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Power: {calculateHiddenPowerPower()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pokedex Tracker Modal */}
        {showPokedexTracker && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className={`max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'border-purple-200'}`}>
              <CardHeader className={`pb-4 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-purple-50 to-pink-100'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Pokedex Completion Tracker
                    </CardTitle>
                    <CardDescription className={`${darkMode ? 'text-gray-300' : ''}`}>
                      Track your progress catching and seeing all 151 Pokémon
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowPokedexTracker(false)}
                    className={`h-8 w-8 p-0 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200'}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`rounded-lg p-4 text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {Object.values(pokedexData).filter(d => d.caught).length}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Caught</div>
                    </div>
                    <div className={`rounded-lg p-4 text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {Object.values(pokedexData).filter(d => d.seen).length}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Seen</div>
                    </div>
                    <div className={`rounded-lg p-4 text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {Object.values(pokedexData).filter(d => d.shiny).length}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Shiny</div>
                    </div>
                    <div className={`rounded-lg p-4 text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {Math.round((Object.values(pokedexData).filter(d => d.caught).length / 151) * 100)}%
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Complete</div>
                    </div>
                  </div>
                  
                  {/* Filter Tabs */}
                  <div className="flex gap-2">
                    {(['overview', 'caught', 'seen', 'shiny'] as const).map((mode) => (
                      <Button
                        key={mode}
                        variant={trackingMode === mode ? "default" : "outline"}
                        onClick={() => setTrackingMode(mode)}
                        size="sm"
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Pokemon Grid */}
                  <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-3">
                    {pokemon
                      .filter(p => {
                        if (trackingMode === 'overview') return true
                        if (trackingMode === 'caught') return pokedexData[p.id]?.caught
                        if (trackingMode === 'seen') return pokedexData[p.id]?.seen
                        if (trackingMode === 'shiny') return pokedexData[p.id]?.shiny
                        return true
                      })
                      .map((p) => (
                        <div
                          key={p.id}
                          className={`rounded-lg p-2 text-center cursor-pointer transition-all ${
                            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                          } ${
                            pokedexData[p.id]?.shiny ? 'ring-2 ring-yellow-400' : ''
                          }`}
                          onClick={() => togglePokedexStatus(p.id)}
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 mx-auto mb-1"
                          />
                          <div className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {p.name}
                          </div>
                          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            #{p.id.toString().padStart(3, '0')}
                          </div>
                          <div className="flex justify-center gap-1 mt-1">
                            {pokedexData[p.id]?.caught && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                            {pokedexData[p.id]?.seen && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            {pokedexData[p.id]?.shiny && (
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Type Chart Modal */}
        {showTypeChart && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className={`max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'border-red-200'}`}>
              <CardHeader className={`pb-4 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-red-50 to-orange-100'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Type Chart and Matchups
                    </CardTitle>
                    <CardDescription className={`${darkMode ? 'text-gray-300' : ''}`}>
                      Interactive type effectiveness chart and dual type calculator
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowTypeChart(false)}
                    className={`h-8 w-8 p-0 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200'}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Mode Tabs */}
                  <div className="flex gap-2">
                    {(['chart', 'calculator', 'coverage'] as const).map((mode) => (
                      <Button
                        key={mode}
                        variant={typeChartMode === mode ? "default" : "outline"}
                        onClick={() => setTypeChartMode(mode)}
                        size="sm"
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </Button>
                    ))}
                  </div>
                  
                  {typeChartMode === 'chart' && (
                    <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Type Effectiveness Chart
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr>
                              <th className={`p-2 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</th>
                              {['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'].map(type => (
                                <th key={type} className={`p-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  <Badge variant="secondary" className={`text-xs ${getTypeColor(type)}`}>
                                    {type}
                                  </Badge>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'].map(attackingType => (
                              <tr key={attackingType}>
                                <td className={`p-2 font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                  <Badge variant="secondary" className={`text-xs ${getTypeColor(attackingType)}`}>
                                    {attackingType}
                                  </Badge>
                                </td>
                                {['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'].map(defendingType => {
                                  const multiplier = getTypeEffectiveness(attackingType, [defendingType])
                                  return (
                                    <td key={defendingType} className={`p-2 text-center ${getEffectivenessColor(multiplier)}`}>
                                      {multiplier}x
                                    </td>
                                  )
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  {typeChartMode === 'calculator' && (
                    <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Dual Type Calculator
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Type 1
                            </label>
                            <select
                              value={selectedType1}
                              onChange={(e) => setSelectedType1(e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'}`}
                            >
                              <option value="">Select Type</option>
                              {['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'].map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Type 2 (Optional)
                            </label>
                            <select
                              value={selectedType2}
                              onChange={(e) => setSelectedType2(e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'}`}
                            >
                              <option value="">None</option>
                              {['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'].map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        {selectedType1 && (
                          <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                            <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              Type Effectiveness
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'].map(type => {
                                const types = selectedType2 ? [selectedType1, selectedType2] : [selectedType1]
                                const multiplier = getTypeEffectiveness(type, types)
                                return (
                                  <div key={type} className="flex justify-between items-center">
                                    <Badge variant="secondary" className={`text-xs ${getTypeColor(type)}`}>
                                      {type}
                                    </Badge>
                                    <span className={`font-medium ${getEffectivenessColor(multiplier)}`}>
                                      {multiplier}x
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {typeChartMode === 'coverage' && (
                    <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className={`font-semibold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Team Coverage Analysis
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Select Team Pokémon
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {currentTeam.map((poke, index) => (
                              <div key={poke.id} className={`rounded-lg p-2 text-center ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                                <img src={poke.image} alt={poke.name} className="w-8 h-8 mx-auto mb-1" />
                                <div className={`text-xs ${darkMode ? 'text-white' : 'text-gray-800'}`}>{poke.name}</div>
                                <div className="flex justify-center gap-1">
                                  {poke.types.map(type => (
                                    <Badge key={type} variant="secondary" className={`text-xs ${getTypeColor(type)}`}>
                                      {type}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {currentTeam.length > 0 && (
                          <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                            <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              Coverage Analysis
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              {analyzeTeamCoverage().map(({ type, effectiveness }) => (
                                <div key={type} className="flex justify-between items-center">
                                  <Badge variant="secondary" className={`text-xs ${getTypeColor(type)}`}>
                                    {type}
                                  </Badge>
                                  <span className={`font-medium ${getEffectivenessColor(effectiveness)}`}>
                                    {effectiveness}x
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Credits Section */}
        <div className="mt-16 text-center">
          <div className={`rounded-xl p-6 max-w-md mx-auto shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm'}`}>
            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Made with ❤️ by Xandred</h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Built with Next.js, TypeScript, and Tailwind CSS
            </p>
            <div className={`flex justify-center gap-4 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              <a
                href="https://github.com/Tribal-Chief-001/Oaks-Originals"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                View Source
              </a>
              <span>•</span>
              <a
                href="https://pokeapi.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Data by PokéAPI
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}