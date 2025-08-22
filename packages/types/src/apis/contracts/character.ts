import { initContract } from '@ts-rest/core'
import z from 'zod'
import { CharacterSchema } from '../..'
import { commonResponses } from '../common'
const c = initContract()

export const CharacterResponseSchema = z.object({
  character: CharacterSchema,
})
export type CharacterResponse = z.infer<typeof CharacterResponseSchema>

export const CharactersResponseSchema = z.object({
  characters: z.array(CharacterSchema),
})
export type CharactersResponse = z.infer<typeof CharactersResponseSchema>

export const characterContract = c.router(
  {
    getCharactersByChannelId: {
      method: 'GET',
      path: '/by-channel/:channelId',
      responses: {
        200: CharactersResponseSchema,
      },
    },
    getCharacterById: {
      method: 'GET',
      path: '/:characterId',
      responses: {
        200: CharacterResponseSchema,
      },
    },
  },

  {
    commonResponses,
    pathPrefix: '/characters',
  }
)
