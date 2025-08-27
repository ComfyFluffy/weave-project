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

export const UpdateCharacterRequestSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  avatar: z.string().optional(),
})
export type UpdateCharacterRequest = z.infer<
  typeof UpdateCharacterRequestSchema
>

export const UpdateWorldStateCharactersRequestSchema = z.object({
  characterIds: z.array(z.string()),
})
export type UpdateWorldStateCharactersRequest = z.infer<
  typeof UpdateWorldStateCharactersRequestSchema
>

export const RemoveCharacterFromWorldStateRequestSchema = z.object({
  characterId: z.string(),
})
export type RemoveCharacterFromWorldStateRequest = z.infer<
  typeof RemoveCharacterFromWorldStateRequestSchema
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
    updateCharacter: {
      method: 'PUT',
      path: '/:characterId',
      body: UpdateCharacterRequestSchema,
      responses: {
        200: CharacterResponseSchema,
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
    removeCharacterFromWorldState: {
      method: 'DELETE',
      path: '/world-state/:worldStateId/character/:characterId',
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
