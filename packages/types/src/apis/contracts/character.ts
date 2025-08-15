import { initContract } from '@ts-rest/core'
import z from 'zod'
import { CharacterSchema } from '../..'
import { ErrorResponseSchema } from '../common'
const c = initContract()

export const CharactersResponseSchema = z.object({
  characters: z.array(CharacterSchema),
})
export type CharactersResponse = z.infer<typeof CharactersResponseSchema>

export const characterContract = c.router(
  {
    getCharactersByWorldId: {
      method: 'GET',
      path: '/by-world/:id',
      responses: {
        200: CharactersResponseSchema,
        400: ErrorResponseSchema,
      },
    },
  },
  {
    pathPrefix: '/characters',
  }
)
