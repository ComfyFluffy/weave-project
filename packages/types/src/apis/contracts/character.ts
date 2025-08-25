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

export const CreateCharacterRequestSchema = CharacterSchema.omit({ id: true })
export type CreateCharacterRequest = z.infer<
  typeof CreateCharacterRequestSchema
>

export const CreateCharacterResponseSchema = CharacterResponseSchema
export type CreateCharacterResponse = z.infer<typeof CharacterResponseSchema>

export const UpdateWorldStateCharactersRequestSchema = z.object({
  characterIds: z.array(z.string()),
})
export type UpdateWorldStateCharactersRequest = z.infer<
  typeof UpdateWorldStateCharactersRequestSchema
>

export const characterContract = c.router(
  {
    getAllCharacters: {
      method: 'GET',
      path: '/all',
      responses: {
        200: CharactersResponseSchema,
      },
    },
    getCharactersByChannelId: {
      method: 'GET',
      path: '/by-channel/:channelId',
      responses: {
        200: CharactersResponseSchema,
      },
    },
    getCharactersByWorldStateId: {
      method: 'GET',
      path: '/by-world-state/:worldStateId',
      responses: {
        200: CharactersResponseSchema,
      },
    },
    getCharacterById: {
      method: 'GET',
      path: '/by-id/:characterId',
      responses: {
        200: CharacterResponseSchema,
      },
    },
    getMyCharacters: {
      method: 'GET',
      path: '/my',
      responses: {
        200: CharactersResponseSchema,
      },
    },
    createCharacter: {
      method: 'POST',
      path: '/',
      body: CreateCharacterRequestSchema,
      responses: {
        201: CreateCharacterResponseSchema,
      },
    },
    deleteCharacterById: {
      method: 'DELETE',
      path: '/by-id/:id',
      responses: {
        200: c.noBody(),
      },
    },
    updateWorldStateCharacters: {
      method: 'PUT',
      path: '/world-state/:worldStateId',
      body: UpdateWorldStateCharactersRequestSchema,
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
