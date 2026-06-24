import { StateCreator } from 'zustand'
import { PokedexState } from './types'

export interface UISlice {
  darkMode: boolean
  activeTab: string
  selectedPokemon: any | null
  compareMode: boolean
  compareList: any[]
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
  soundEnabled: boolean
  soundVolume: number
  calculatorAttackerId: number | null
  calculatorMoveName: string | null

  setDarkMode: (val: boolean) => void
  setActiveTab: (tab: string) => void
  setSelectedPokemon: (p: any | null) => void
  setCompareMode: (val: boolean) => void
  addToCompare: (p: any) => void
  removeFromCompare: (id: number) => void
  setShowTeamBuilder: (val: boolean) => void
  setShowMoveDatabase: (val: boolean) => void
  setShowDamageCalculator: (val: boolean) => void
  setShowBreedingTools: (val: boolean) => void
  setShowPokedexTracker: (val: boolean) => void
  setShowTypeChart: (val: boolean) => void
  setShowItemsDirectory: (val: boolean) => void
  setTypeChartMode: (mode: 'chart' | 'calculator' | 'coverage') => void
  setSelectedType1: (type: string) => void
  setSelectedType2: (type: string) => void
  setSoundEnabled: (val: boolean) => void
  setSoundVolume: (val: number) => void
  playCry: (pokemonId: number) => void
  setCalculatorAttackerId: (id: number | null) => void
  setCalculatorMoveName: (name: string | null) => void
}

export const createUISlice: StateCreator<PokedexState, [], [], UISlice> = (set, get) => ({
  darkMode: false,
  activeTab: 'overview',
  selectedPokemon: null,
  compareMode: false,
  compareList: [],
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
  soundEnabled: false,
  soundVolume: 0.5,
  calculatorAttackerId: null,
  calculatorMoveName: null,

  setDarkMode: (val) => set({ darkMode: val }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSelectedPokemon: (selectedPokemon) => set({ selectedPokemon, activeTab: 'overview' }),
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
})
