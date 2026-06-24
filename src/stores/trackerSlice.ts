import { StateCreator } from 'zustand'
import { PokedexState, TrackerStatus } from './types'

export interface TrackerSlice {
  pokedexData: Record<number, TrackerStatus>
  toggleTrackerStatus: (pokemonId: number, statusOverride?: Partial<TrackerStatus>) => Promise<void>
}

export const createTrackerSlice: StateCreator<PokedexState, [], [], TrackerSlice> = (set, get) => ({
  pokedexData: {},
  toggleTrackerStatus: async (pokemonId, statusOverride) => {
    const { pokedexData, user, session } = get()
    const current = pokedexData[pokemonId] || { caught: false, seen: false, shiny: false }

    let next: TrackerStatus = { caught: false, seen: false, shiny: false }
    if (statusOverride) {
      next = { ...current, ...statusOverride }
    } else {
      // Cycle state: not seen -> seen -> caught -> caught+shiny -> not seen
      if (!current.seen) {
        next = { seen: true, caught: false, shiny: false }
      } else if (current.seen && !current.caught) {
        next = { seen: true, caught: true, shiny: false }
      } else if (current.caught && !current.shiny) {
        next = { seen: true, caught: true, shiny: true }
      }
    }

    const nextPokedexData = { ...pokedexData, [pokemonId]: next }

    // Optimistic Update
    set({ pokedexData: nextPokedexData })

    if (user) {
      // Authenticated sync
      try {
        const token = session?.access_token
        await fetch('/api/tracker', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ pokemonId, ...next })
        })
      } catch (e) {
        console.error('Failed to sync tracker entry with database:', e)
      }
    } else {
      // Guest mode LocalStorage backup
      if (typeof window !== 'undefined') {
        localStorage.setItem('pokedex_guest_tracker', JSON.stringify(nextPokedexData))
      }
    }
  }
})
