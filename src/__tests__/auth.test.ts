import { createPokemonSlice } from '@/stores/pokemonSlice'

// Simple mock for Zustand StateCreator arguments
const mockSet = jest.fn()
const mockGet = jest.fn()

describe('Zustand Auth State Slice', () => {
  beforeEach(() => {
    mockSet.mockClear()
    mockGet.mockClear()
  })

  test('Initial state parameters are correct', () => {
    // We instantiate the slice using our creator with mock set/get
    const slice = (createPokemonSlice as any)(mockSet, mockGet, {})
    
    expect(slice.session).toBeNull()
    expect(slice.user).toBeNull()
    expect(slice.loading).toBe(true)
    expect(slice.searchTerm).toBe('')
  })

  test('setSession updates store session and user state', () => {
    const slice = (createPokemonSlice as any)(mockSet, mockGet, {})
    
    // Trigger setSession action
    const mockSession = {
      access_token: 'fake-token',
      user: { id: 'fake-user-id', email: 'ash@ketchum.com' }
    }
    
    // We mock the fetchInitialData call on the get() return value
    mockGet.mockReturnValue({
      fetchInitialData: jest.fn()
    })

    slice.setSession(mockSession)

    expect(mockSet).toHaveBeenCalledWith({
      session: mockSession,
      user: mockSession.user
    })
  })
})
