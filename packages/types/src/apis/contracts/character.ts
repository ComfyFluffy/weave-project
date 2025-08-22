import { initContract } from '@ts-rest/core'
import z from 'zod'
import { CharacterSchema } from '../..'
import { commonResponses } from '../common'
const c = initContract()

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
  },

  {
    commonResponses,
    pathPrefix: '/characters',
  }
)
