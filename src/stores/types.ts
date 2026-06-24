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

export interface PokedexState {
  // Auth state
  session: any | null
  user: any | null
  setSession: (session: any | null) => void

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
  setSelectedType2: (type: string) => void
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
