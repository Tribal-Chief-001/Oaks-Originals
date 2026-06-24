import { StateCreator } from 'zustand'
import { PokedexState } from './types'

export interface FavoriteSlice {
  favorites: number[]
  toggleFavorite: (pokemonId: number) => Promise<void>
}

export const createFavoriteSlice: StateCreator<PokedexState, [], [], FavoriteSlice> = (set, get) => ({
  favorites: [],
  toggleFavorite: async (pokemonId) => {
    const { favorites, user, session } = get()
    const isFav = favorites.includes(pokemonId)
    const nextFavorites = isFav ? favorites.filter(id => id !== pokemonId) : [...favorites, pokemonId]

    // Optimistic Update
    set({ favorites: nextFavorites })

    if (user) {
      // Authenticated sync
      try {
        const token = session?.access_token
        await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ pokemonId })
        })
      } catch (e) {
        console.error('Failed to sync favorite with database:', e)
      }
    } else {
      // Guest mode LocalStorage backup
      if (typeof window !== 'undefined') {
        localStorage.setItem('pokedex_guest_favorites', JSON.stringify(nextFavorites))
      }
    }
  }
})
