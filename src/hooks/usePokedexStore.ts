import { create } from 'zustand'

export interface Pokemon {
  id: number
  name: string
  types: string[]
  height: number
  weight: number
  image: string
  shinyImage: string
  animatedImage?: string
  animatedShinyImage?: string
  cryUrl?: string
  encounters?: any
  category: string
  baseFriendship?: number
  baseExperience?: number
  catchRate?: number
  genderRatio?: string
  eggCycles?: number
  stats: Array<{ name: string; value: number }>
  abilities: string[]
  hiddenAbilities: string[]
  eggGroups: string[]
  naturalHabitat: string[]
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
  evolutionChain?: Array<{
    id: number
    name: string
    image: string
    method: string
  }>
}

export interface SavedTeam {
  id: string
  name: string
  pokemonIds: number[]
  createdAt: string
}

export interface TrackerStatus {
  caught: boolean
  seen: boolean
  shiny: boolean
  caughtDate?: string
  notes?: string
}

interface PokedexState {
  pokemon: Pokemon[]
  filteredPokemon: Pokemon[]
  favorites: number[]
  savedTeams: SavedTeam[]
  pokedexData: Record<number, TrackerStatus>
  loading: boolean
  
  // Basic UI Filter States
  searchTerm: string
  selectedType: string
  sortBy: 'id' | 'name' | 'height' | 'weight' | 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed'
  sortOrder: 'asc' | 'desc'
  showShiny: boolean
  darkMode: boolean
  selectedPokemon: Pokemon | null
  activeTab: string
  
  // Advanced Filter States
  showAdvancedFilters: boolean
  selectedTypes: string[]
  statRanges: {
    hp: { min: number; max: number }
    attack: { min: number; max: number }
    defense: { min: number; max: number }
    specialAttack: { min: number; max: number }
    specialDefense: { min: number; max: number }
    speed: { min: number; max: number }
  }
  heightRange: { min: number; max: number }
  weightRange: { min: number; max: number }
  abilityFilter: string
  typeFilterMode: 'any' | 'all'
  
  // Compare State
  compareMode: boolean
  compareList: Pokemon[]
  
  // Team Builder State
  teamBuilderMode: boolean
  currentTeam: Pokemon[]
  teamName: string
  
  // Tools Modal States
  showTeamBuilder: boolean
  showMoveDatabase: boolean
  showDamageCalculator: boolean
  showBreedingTools: boolean
  showPokedexTracker: boolean
  showTypeChart: boolean
  showItemsDirectory: boolean
  typeChartMode: 'chart' | 'calculator' | 'coverage'
  selectedType1: string
  selectedType2: string
  
  // Audio state
  soundEnabled: boolean
  soundVolume: number

  // Calculator helper states
  calculatorAttackerId: number | null
  calculatorMoveName: string | null
  
  // Actions
  setSearchTerm: (term: string) => void
  setSelectedType: (type: string) => void
  setSortBy: (sortBy: PokedexState['sortBy']) => void
  setSortOrder: (order: 'asc' | 'desc') => void
  setShowShiny: (val: boolean) => void
  setDarkMode: (val: boolean) => void
  setSelectedPokemon: (p: Pokemon | null) => void
  setActiveTab: (tab: string) => void
  
  setShowAdvancedFilters: (val: boolean) => void
  toggleTypeFilter: (type: string) => void
  setTypeFilterMode: (mode: 'any' | 'all') => void
  setStatRanges: (ranges: Partial<PokedexState['statRanges']>) => void
  setHeightRange: (range: { min: number; max: number }) => void
  setWeightRange: (range: { min: number; max: number }) => void
  setAbilityFilter: (filter: string) => void
  clearAllFilters: () => void
  
  setCompareMode: (val: boolean) => void
  addToCompare: (p: Pokemon) => void
  removeFromCompare: (id: number) => void
  
  setTeamBuilderMode: (val: boolean) => void
  setCurrentTeam: (team: Pokemon[]) => void
  setTeamName: (name: string) => void
  addToTeam: (p: Pokemon) => void
  removeFromTeam: (id: number) => void
  
  setShowTeamBuilder: (val: boolean) => void
  setShowMoveDatabase: (val: boolean) => void
  setShowDamageCalculator: (val: boolean) => void
  setShowBreedingTools: (val: boolean) => void
  setShowPokedexTracker: (val: boolean) => void
  setShowTypeChart: (val: boolean) => void
  setShowItemsDirectory: (val: boolean) => void
  setTypeChartMode: (mode: PokedexState['typeChartMode']) => void
  setSelectedType1: (type: string) => void
  setSoundEnabled: (val: boolean) => void
  setSoundVolume: (val: number) => void
  playCry: (pokemonId: number) => void
  setCalculatorAttackerId: (id: number | null) => void
  setCalculatorMoveName: (name: string | null) => void
  
  // DB Sync Actions
  fetchInitialData: () => Promise<void>
  toggleFavorite: (pokemonId: number) => Promise<void>
  toggleTrackerStatus: (pokemonId: number) => Promise<void>
  saveTeam: () => Promise<void>
  deleteTeam: (id: string) => Promise<void>
  
  // Helper functions
  applyFilters: () => void
}

export const usePokedexStore = create<PokedexState>((set, get) => ({
  pokemon: [],
  filteredPokemon: [],
  favorites: [],
  savedTeams: [],
  pokedexData: {},
  loading: true,
  
  searchTerm: '',
  selectedType: '',
  sortBy: 'id',
  sortOrder: 'asc',
  showShiny: false,
  darkMode: false,
  selectedPokemon: null,
  activeTab: 'overview',
  
  showAdvancedFilters: false,
  selectedTypes: [],
  statRanges: {
    hp: { min: 0, max: 255 },
    attack: { min: 0, max: 255 },
    defense: { min: 0, max: 255 },
    specialAttack: { min: 0, max: 255 },
    specialDefense: { min: 0, max: 255 },
    speed: { min: 0, max: 255 }
  },
  heightRange: { min: 0, max: 1000 },
  weightRange: { min: 0, max: 5000 },
  abilityFilter: '',
  typeFilterMode: 'any',
  
  compareMode: false,
  compareList: [],
  
  teamBuilderMode: false,
  currentTeam: [],
  teamName: '',
  
  showTeamBuilder: false,
  showMoveDatabase: false,
  showDamageCalculator: false,
  showBreedingTools: false,
  showPokedexTracker: false,
  showTypeChart: false,
  showItemsDirectory: false,
  typeChartMode: 'chart',
  selectedType1: '',
  selectedType2: '',
  
  // Audio defaults
  soundEnabled: false,
  soundVolume: 0.5,
  calculatorAttackerId: null,
  calculatorMoveName: null,
  
  setSearchTerm: (term) => { set({ searchTerm: term }); get().applyFilters() },
  setSelectedType: (type) => { set({ selectedType: type }); get().applyFilters() },
  setSortBy: (sortBy) => { set({ sortBy }); get().applyFilters() },
  setSortOrder: (order) => { set({ sortOrder: order }); get().applyFilters() },
  setShowShiny: (val) => set({ showShiny: val }),
  setDarkMode: (val) => set({ darkMode: val }),
  setSelectedPokemon: (selectedPokemon) => set({ selectedPokemon, activeTab: 'overview' }),
  setActiveTab: (activeTab) => set({ activeTab }),
  
  setShowAdvancedFilters: (val) => set({ showAdvancedFilters: val }),
  toggleTypeFilter: (type) => {
    const { selectedTypes } = get()
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type].slice(0, 2)
    set({ selectedTypes: next })
    get().applyFilters()
  },
  setTypeFilterMode: (typeFilterMode) => { set({ typeFilterMode }); get().applyFilters() },
  setStatRanges: (ranges) => {
    set(state => ({ statRanges: { ...state.statRanges, ...ranges } }))
    get().applyFilters()
  },
  setHeightRange: (heightRange) => { set({ heightRange }); get().applyFilters() },
  setWeightRange: (weightRange) => { set({ weightRange }); get().applyFilters() },
  setAbilityFilter: (abilityFilter) => { set({ abilityFilter }); get().applyFilters() },
  clearAllFilters: () => {
    set({
      selectedTypes: [],
      statRanges: {
        hp: { min: 0, max: 255 },
        attack: { min: 0, max: 255 },
        defense: { min: 0, max: 255 },
        specialAttack: { min: 0, max: 255 },
        specialDefense: { min: 0, max: 255 },
        speed: { min: 0, max: 255 }
      },
      heightRange: { min: 0, max: 1000 },
      weightRange: { min: 0, max: 5000 },
      abilityFilter: '',
      searchTerm: '',
      selectedType: ''
    })
    get().applyFilters()
  },
  
  setCompareMode: (compareMode) => set({ compareMode, compareList: [] }),
  addToCompare: (p) => {
    const { compareList } = get()
    if (compareList.length < 2 && !compareList.find(x => x.id === p.id)) {
      set({ compareList: [...compareList, p] })
    }
  },
  removeFromCompare: (id) => {
    set(state => ({ compareList: state.compareList.filter(x => x.id !== id) }))
  },
  
  setTeamBuilderMode: (teamBuilderMode) => set({ teamBuilderMode }),
  setCurrentTeam: (currentTeam) => set({ currentTeam }),
  setTeamName: (teamName) => set({ teamName }),
  addToTeam: (p) => {
    const { currentTeam } = get()
    if (currentTeam.length < 6 && !currentTeam.find(x => x.id === p.id)) {
      set({ currentTeam: [...currentTeam, p] })
    }
  },
  removeFromTeam: (id) => {
    set(state => ({ currentTeam: state.currentTeam.filter(x => x.id !== id) }))
  },
  
  setShowTeamBuilder: (showTeamBuilder) => set({ showTeamBuilder }),
  setShowMoveDatabase: (showMoveDatabase) => set({ showMoveDatabase }),
  setShowDamageCalculator: (showDamageCalculator) => set({ showDamageCalculator }),
  setShowBreedingTools: (showBreedingTools) => set({ showBreedingTools }),
  setShowPokedexTracker: (showPokedexTracker) => set({ showPokedexTracker }),
  setShowTypeChart: (showTypeChart) => set({ showTypeChart }),
  setShowItemsDirectory: (showItemsDirectory) => set({ showItemsDirectory }),
  setTypeChartMode: (typeChartMode) => set({ typeChartMode }),
  setSelectedType1: (selectedType1) => set({ selectedType1 }),
  setSelectedType2: (selectedType2) => set({ selectedType2 }),
  setSoundEnabled: (soundEnabled) => {
    set({ soundEnabled })
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokedex_soundEnabled', String(soundEnabled))
    }
  },
  setSoundVolume: (soundVolume) => {
    set({ soundVolume })
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokedex_soundVolume', String(soundVolume))
    }
  },
  playCry: (pokemonId) => {
    if (typeof window === 'undefined') return
    const { soundEnabled, soundVolume, pokemon } = get()
    if (!soundEnabled) return

    const pk = pokemon.find(p => p.id === pokemonId)
    if (!pk || !pk.cryUrl) return

    const existing = (window as any)._activePokedexAudio
    if (existing) {
      existing.pause()
    }

    try {
      const audio = new Audio(pk.cryUrl)
      audio.volume = soundVolume
      audio.play().catch(e => console.warn('Audio playback failed:', e))
      ;(window as any)._activePokedexAudio = audio
    } catch (e) {
      console.warn('Could not initialize audio:', e)
    }
  },
  setCalculatorAttackerId: (calculatorAttackerId) => set({ calculatorAttackerId }),
  setCalculatorMoveName: (calculatorMoveName) => set({ calculatorMoveName }),
  
  fetchInitialData: async () => {
    set({ loading: true })
    try {
      // 1. Fetch Pokemon Cache
      const pkRes = await fetch('/api/pokemon')
      const pkData = await pkRes.json()
      
      // 2. Fetch Favorites
      const favRes = await fetch('/api/favorites')
      const favData = await favRes.json()
      
      // 3. Fetch Tracker Entries
      const trRes = await fetch('/api/tracker')
      const trData = await trRes.json()
      
      // 4. Fetch Saved Teams
      const tmRes = await fetch('/api/teams')
      const tmData = await tmRes.json()
      
      const pokemon = pkData.pokemon || []
      
      let soundEnabled = false
      let soundVolume = 0.5
      if (typeof window !== 'undefined') {
        soundEnabled = localStorage.getItem('pokedex_soundEnabled') === 'true'
        const savedVolume = localStorage.getItem('pokedex_soundVolume')
        if (savedVolume) soundVolume = parseFloat(savedVolume)
      }
      
      set({
        pokemon,
        favorites: favData,
        pokedexData: trData,
        savedTeams: tmData.map((t: any) => ({
          id: t.id,
          name: t.name,
          pokemonIds: t.pokemonIds,
          createdAt: t.createdAt
        })),
        soundEnabled,
        soundVolume,
        loading: false
      })
      get().applyFilters()
    } catch (e) {
      console.error('Error fetching initial Dex data:', e)
      set({ loading: false })
    }
  },
  
  toggleFavorite: async (pokemonId) => {
    const { favorites } = get()
    const isFav = favorites.includes(pokemonId)
    // Optimistic Update
    set({
      favorites: isFav ? favorites.filter(id => id !== pokemonId) : [...favorites, pokemonId]
    })
    
    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pokemonId })
      })
    } catch (e) {
      console.error('Failed to sync favorite toggle:', e)
    }
  },
  
  toggleTrackerStatus: async (pokemonId) => {
    const { pokedexData } = get()
    const current = pokedexData[pokemonId] || { caught: false, seen: false, shiny: false }
    
    // Cycle state: not seen -> seen -> caught -> caught+shiny -> not seen
    let next: TrackerStatus = { caught: false, seen: false, shiny: false }
    if (!current.seen) {
      next = { seen: true, caught: false, shiny: false }
    } else if (current.seen && !current.caught) {
      next = { seen: true, caught: true, shiny: false }
    } else if (current.caught && !current.shiny) {
      next = { seen: true, caught: true, shiny: true }
    }
    
    set({
      pokedexData: { ...pokedexData, [pokemonId]: next }
    })
    
    try {
      await fetch('/api/tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pokemonId, ...next })
      })
    } catch (e) {
      console.error('Failed to sync tracker entry:', e)
    }
  },
  
  saveTeam: async () => {
    const { currentTeam, teamName, savedTeams } = get()
    if (!teamName.trim() || currentTeam.length === 0) return
    
    try {
      const pokemonIds = currentTeam.map(x => x.id)
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName.trim(), pokemonIds })
      })
      const newTeam = await res.json()
      
      set({
        savedTeams: [newTeam, ...savedTeams],
        teamName: '',
        currentTeam: []
      })
    } catch (e) {
      console.error('Failed to save team:', e)
    }
  },
  
  deleteTeam: async (id) => {
    const { savedTeams } = get()
    set({ savedTeams: savedTeams.filter(t => t.id !== id) })
    
    try {
      await fetch(`/api/teams?id=${id}`, { method: 'DELETE' })
    } catch (e) {
      console.error('Failed to delete team:', e)
    }
  },
  
  applyFilters: () => {
    const {
      pokemon,
      searchTerm,
      selectedType,
      selectedTypes,
      statRanges,
      heightRange,
      weightRange,
      abilityFilter,
      typeFilterMode,
      sortBy,
      sortOrder
    } = get()
    
    let filtered = [...pokemon]
    
    // Search
    if (searchTerm) {
      const query = searchTerm.toLowerCase()
      filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.id.toString().includes(query))
    }
    
    // Legacy Single Type Filter
    if (selectedType) {
      filtered = filtered.filter(p => p.types.includes(selectedType))
    }
    
    // Advanced Multi-type filter
    if (selectedTypes.length > 0) {
      if (typeFilterMode === 'all') {
        filtered = filtered.filter(p => selectedTypes.every(t => p.types.includes(t)))
      } else {
        filtered = filtered.filter(p => selectedTypes.some(t => p.types.includes(t)))
      }
    }
    
    // Stat ranges
    filtered = filtered.filter(p => {
      const getStat = (name: string) => p.stats.find(s => s.name === name)?.value || 0
      const hp = getStat('hp')
      const attack = getStat('attack')
      const defense = getStat('defense')
      const spAtk = getStat('special-attack')
      const spDef = getStat('special-defense')
      const speed = getStat('speed')
      
      if (hp < statRanges.hp.min || hp > statRanges.hp.max) return false
      if (attack < statRanges.attack.min || attack > statRanges.attack.max) return false
      if (defense < statRanges.defense.min || defense > statRanges.defense.max) return false
      if (spAtk < statRanges.specialAttack.min || spAtk > statRanges.specialAttack.max) return false
      if (spDef < statRanges.specialDefense.min || spDef > statRanges.specialDefense.max) return false
      if (speed < statRanges.speed.min || speed > statRanges.speed.max) return false
      
      return true
    })
    
    // Physical Characteristics (height/weight ranges)
    filtered = filtered.filter(p => {
      const heightInCm = p.height * 10
      const weightInKg = p.weight / 10
      return heightInCm >= heightRange.min && heightInCm <= heightRange.max &&
             weightInKg >= weightRange.min && weightInKg <= weightRange.max
    })
    
    // Ability Filter
    if (abilityFilter) {
      const abQuery = abilityFilter.toLowerCase()
      filtered = filtered.filter(p => {
        const list = [...p.abilities, ...p.hiddenAbilities]
        return list.some(a => a.toLowerCase().includes(abQuery))
      })
    }
    
    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'id':
          comparison = a.id - b.id
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'height':
          comparison = a.height - b.height
          break
        case 'weight':
          comparison = a.weight - b.weight
          break
        case 'hp':
        case 'attack':
        case 'defense':
        case 'special-attack':
        case 'special-defense':
        case 'speed':
          const statA = a.stats.find(s => s.name === sortBy)?.value || 0
          const statB = b.stats.find(s => s.name === sortBy)?.value || 0
          comparison = statA - statB
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
    
    set({ filteredPokemon: filtered })
  }
}))
