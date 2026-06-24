import { create } from 'zustand'
import { PokedexState, Pokemon, SavedTeam, TrackerStatus } from '@/stores/types'
import { createPokemonSlice } from '@/stores/pokemonSlice'
import { createFavoriteSlice } from '@/stores/favoriteSlice'
import { createTeamSlice } from '@/stores/teamSlice'
import { createTrackerSlice } from '@/stores/trackerSlice'
import { createUISlice } from '@/stores/uiSlice'

// Re-export type definitions for backward compatibility in other parts of the application
export type { Pokemon, SavedTeam, TrackerStatus, PokedexState }

export const usePokedexStore = create<PokedexState>()((set, get, store) => ({
  ...createPokemonSlice(set, get, store),
  ...createFavoriteSlice(set, get, store),
  ...createTeamSlice(set, get, store),
  ...createTrackerSlice(set, get, store),
  ...createUISlice(set, get, store)
}))
