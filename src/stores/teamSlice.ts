import { StateCreator } from 'zustand'
import { PokedexState, SavedTeam } from './types'

export interface TeamSlice {
  savedTeams: SavedTeam[]
  currentTeam: any[]
  teamName: string
  teamBuilderMode: boolean

  setTeamBuilderMode: (val: boolean) => void
  setCurrentTeam: (team: any[]) => void
  setTeamName: (name: string) => void
  addToTeam: (p: any) => void
  removeFromTeam: (id: number) => void
  saveTeam: () => Promise<void>
  deleteTeam: (id: string) => Promise<void>
}

export const createTeamSlice: StateCreator<PokedexState, [], [], TeamSlice> = (set, get) => ({
  savedTeams: [],
  currentTeam: [],
  teamName: '',
  teamBuilderMode: false,

  setTeamBuilderMode: (teamBuilderMode) => set({ teamBuilderMode }),
  setCurrentTeam: (currentTeam) => set({ currentTeam }),
  setTeamName: (teamName) => set({ teamName }),
  addToTeam: (p) => {
    const { currentTeam } = get()
    if (currentTeam.find(x => x.id === p.id)) {
      get().playErrorSound()
      return
    }
    if (currentTeam.length >= 6) {
      get().playErrorSound()
      return
    }
    get().playSuccessSound()
    set({ currentTeam: [...currentTeam, p] })
  },
  removeFromTeam: (id) => {
    get().playClickSound()
    set(state => ({ currentTeam: state.currentTeam.filter(x => x.id !== id) }))
  },
  saveTeam: async () => {
    const { currentTeam, teamName, savedTeams, user, session } = get()
    if (!teamName.trim() || currentTeam.length === 0) {
      get().playErrorSound()
      return
    }

    get().playSuccessSound()
    const pokemonIds = currentTeam.map(x => x.id)

    if (user) {
      // Authenticated sync
      try {
        const token = session?.access_token
        const res = await fetch('/api/teams', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ name: teamName.trim(), pokemonIds })
        })
        const newTeam = await res.json()
        set({
          savedTeams: [newTeam, ...savedTeams],
          teamName: '',
          currentTeam: []
        })
      } catch (e) {
        console.error('Failed to save team in database:', e)
      }
    } else {
      // Guest mode LocalStorage backup
      const newTeam: SavedTeam = {
        id: `guest-team-${Date.now()}`,
        name: teamName.trim(),
        pokemonIds,
        createdAt: new Date().toISOString()
      }
      const nextSavedTeams = [newTeam, ...savedTeams]
      set({
        savedTeams: nextSavedTeams,
        teamName: '',
        currentTeam: []
      })
      if (typeof window !== 'undefined') {
        localStorage.setItem('pokedex_guest_teams', JSON.stringify(nextSavedTeams))
      }
    }
  },
  deleteTeam: async (id) => {
    const { savedTeams, user, session } = get()
    get().playClickSound()
    const nextSavedTeams = savedTeams.filter(t => t.id !== id)
    set({ savedTeams: nextSavedTeams })

    if (user) {
      // Authenticated sync
      try {
        const token = session?.access_token
        await fetch(`/api/teams?id=${id}`, {
          method: 'DELETE',
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        })
      } catch (e) {
        console.error('Failed to delete team from database:', e)
      }
    } else {
      // Guest mode LocalStorage backup
      if (typeof window !== 'undefined') {
        localStorage.setItem('pokedex_guest_teams', JSON.stringify(nextSavedTeams))
      }
    }
  }
})
