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
  showBattleArena: boolean
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
  showBattleArena: false,
  typeChartMode: 'chart',
  selectedType1: '',
  selectedType2: '',
  soundEnabled: false,
  soundVolume: 0.5,
  calculatorAttackerId: null,
  calculatorMoveName: null,

  setDarkMode: (val) => {
    set({ darkMode: val })
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokedex_darkMode', String(val))
    }
    const { user } = get()
    if (user) {
      import('@/lib/supabaseClient').then(({ supabase }) => {
        supabase.auth.updateUser({
          data: { darkMode: val }
        }).catch(err => console.error('Failed to sync dark mode settings to user metadata:', err))
      })
    }
  },
  setActiveTab: (activeTab) => {
    get().playClickSound()
    set({ activeTab })
  },
  setSelectedPokemon: (selectedPokemon) => {
    get().playClickSound()
    set({ selectedPokemon, activeTab: 'overview' })
  },
  setCompareMode: (compareMode) => {
    if (compareMode) {
      get().playSuccessSound()
    } else {
      get().playClickSound()
    }
    set({ compareMode, compareList: [] })
  },
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
  setShowBattleArena: (showBattleArena) => {
    get().playClickSound()
    set({ showBattleArena })
  },
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
  playClickSound: () => {
    if (typeof window === 'undefined') return
    const { soundEnabled, soundVolume } = get()
    if (!soundEnabled) return
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05)
      
      gain.gain.setValueAtTime(soundVolume * 0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start()
      osc.stop(ctx.currentTime + 0.05)
    } catch (e) {
      console.warn('Click audio failed:', e)
    }
  },
  playSuccessSound: () => {
    if (typeof window === 'undefined') return
    const { soundEnabled, soundVolume } = get()
    if (!soundEnabled) return
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const notes = [523.25, 659.25, 783.99] // C5, E5, G5
      const noteDuration = 0.08
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * noteDuration)
        
        gain.gain.setValueAtTime(soundVolume * 0.12, ctx.currentTime + idx * noteDuration)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * noteDuration + noteDuration)
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.start(ctx.currentTime + idx * noteDuration)
        osc.stop(ctx.currentTime + idx * noteDuration + noteDuration)
      })
    } catch (e) {
      console.warn('Success audio failed:', e)
    }
  },
  playErrorSound: () => {
    if (typeof window === 'undefined') return
    const { soundEnabled, soundVolume } = get()
    if (!soundEnabled) return
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(150, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2)
      
      gain.gain.setValueAtTime(soundVolume * 0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start()
      osc.stop(ctx.currentTime + 0.2)
    } catch (e) {
      console.warn('Error audio failed:', e)
    }
  },
  setCalculatorAttackerId: (calculatorAttackerId) => set({ calculatorAttackerId }),
  setCalculatorMoveName: (calculatorMoveName) => set({ calculatorMoveName }),
})
