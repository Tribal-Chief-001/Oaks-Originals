import { z } from 'zod'

export const favoriteSchema = z.object({
  pokemonId: z.number().int().positive()
})

export const savedTeamSchema = z.object({
  name: z.string().trim().min(1).max(100),
  pokemonIds: z.array(z.number().int().positive()).max(6)
})

export const pokedexTrackerSchema = z.object({
  pokemonId: z.number().int().positive(),
  seen: z.boolean().optional(),
  caught: z.boolean().optional(),
  shiny: z.boolean().optional(),
  notes: z.string().trim().max(1000).optional().nullable()
})
