import { StateCreator } from 'zustand'
import { PokedexState, Pokemon } from './types'
import { toast } from '@/hooks/use-toast'

export interface PokemonSlice {
  session: any | null
  user: any | null
  setSession: (session: any | null) => void

  pokemon: Pokemon[]
  filteredPokemon: Pokemon[]
  loading: boolean

  searchTerm: string
  selectedType: string
  sortBy: 'id' | 'name' | 'height' | 'weight' | 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed'
  sortOrder: 'asc' | 'desc'
  showShiny: boolean

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

  setSearchTerm: (term: string) => void
  setSelectedType: (type: string) => void
  setSortBy: (sortBy: PokedexState['sortBy']) => void
  setSortOrder: (order: 'asc' | 'desc') => void
  setShowShiny: (val: boolean) => void
  setShowAdvancedFilters: (val: boolean) => void
  toggleTypeFilter: (type: string) => void
  setTypeFilterMode: (mode: 'any' | 'all') => void
  setStatRanges: (ranges: Partial<PokedexState['statRanges']>) => void
  setHeightRange: (range: { min: number; max: number }) => void
  setWeightRange: (range: { min: number; max: number }) => void
  setAbilityFilter: (filter: string) => void
  clearAllFilters: () => void
  applyFilters: () => void
  fetchInitialData: () => Promise<void>
}

export const createPokemonSlice: StateCreator<PokedexState, [], [], PokemonSlice> = (set, get) => ({
  session: null,
  user: null,
  setSession: (session) => {
    const user = session?.user || null
    set({ session, user })
    if (user && user.user_metadata && typeof user.user_metadata.darkMode === 'boolean') {
      set({ darkMode: user.user_metadata.darkMode })
    }
    // Automatically trigger reload when session changes
    get().fetchInitialData()
  },

  pokemon: [],
  filteredPokemon: [],
  loading: true,

  searchTerm: '',
  selectedType: '',
  sortBy: 'id',
  sortOrder: 'asc',
  showShiny: false,

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

  setSearchTerm: (term) => { set({ searchTerm: term }); get().applyFilters() },
  setSelectedType: (type) => { set({ selectedType: type }); get().applyFilters() },
  setSortBy: (sortBy) => { set({ sortBy }); get().applyFilters() },
  setSortOrder: (order) => { set({ sortOrder: order }); get().applyFilters() },
  setShowShiny: (val) => set({ showShiny: val }),
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
  },

  fetchInitialData: async () => {
    set({ loading: true })
    const { user, session } = get()
    const token = session?.access_token

    try {
      // 1. Fetch Pokemon Database Cache (static public list, same for guest/user)
      let pokemonList: Pokemon[] = []
      try {
        const pkRes = await fetch('/api/pokemon')
        if (pkRes.ok) {
          const pkData = await pkRes.json()
          pokemonList = pkData.pokemon || []
        }
      } catch (e) {
        console.error('Error fetching Pokemon:', e)
      }

      if (pokemonList.length === 0) {
        toast({
          title: 'Database Error',
          description: 'Failed to load Pokémon database. Please check your Supabase settings.',
          variant: 'destructive'
        })
      }

      // 2. Fetch User Data or Guest Data
      let favoritesList: number[] = []
      let trackerMap: Record<number, any> = {}
      let savedTeamsList: any[] = []

      if (user) {
        // Authenticated: Fetch from database with JWT
        try {
          const headers = { 'Authorization': `Bearer ${token}` }

          const [favRes, trRes, tmRes] = await Promise.all([
            fetch('/api/favorites', { headers }),
            fetch('/api/tracker', { headers }),
            fetch('/api/teams', { headers })
          ])

          if (favRes.ok) favoritesList = await favRes.json()
          if (trRes.ok) trackerMap = await trRes.json()
          if (tmRes.ok) {
            const tmData = await tmRes.json()
            if (Array.isArray(tmData)) {
              savedTeamsList = tmData.map(t => ({
                id: t.id,
                name: t.name,
                pokemonIds: t.pokemonIds,
                createdAt: t.createdAt
              }))
            }
          }
        } catch (e) {
          console.error('Error loading authenticated data:', e)
        }
      } else {
        // Unauthenticated: Fetch from guest local storage
        if (typeof window !== 'undefined') {
          try {
            const savedFavs = localStorage.getItem('pokedex_guest_favorites')
            if (savedFavs) favoritesList = JSON.parse(savedFavs)

            const savedTracker = localStorage.getItem('pokedex_guest_tracker')
            if (savedTracker) trackerMap = JSON.parse(savedTracker)

            const savedTeams = localStorage.getItem('pokedex_guest_teams')
            if (savedTeams) savedTeamsList = JSON.parse(savedTeams)
          } catch (e) {
            console.error('Error parsing guest LocalStorage:', e)
          }
        }
      }

      // 3. Audio persistence config
      let soundEnabled = false
      let soundVolume = 0.5
      if (typeof window !== 'undefined') {
        soundEnabled = localStorage.getItem('pokedex_soundEnabled') === 'true'
        const savedVolume = localStorage.getItem('pokedex_soundVolume')
        if (savedVolume) soundVolume = parseFloat(savedVolume)
      }

      set({
        pokemon: pokemonList,
        favorites: favoritesList,
        pokedexData: trackerMap,
        savedTeams: savedTeamsList,
        soundEnabled,
        soundVolume,
        loading: false
      })
      get().applyFilters()
    } catch (err) {
      console.error('Error during initial fetch:', err)
      set({ loading: false })
    }
  }
})
