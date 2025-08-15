import z from 'zod'

/**
 * Character represents a person or creature in the game world
 */
export const CharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  avatar: z.string().optional(),
})
export type Character = z.infer<typeof CharacterSchema>
