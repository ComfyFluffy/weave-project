import { initContract } from '@ts-rest/core'
import z from 'zod'
import { CharacterSchema } from '../..'
import { ErrorResponseSchema } from '../common'
const c = initContract()

export const CharactersResponseSchema = z.object({
  characters: z.array(CharacterSchema),
})
export type CharactersResponse = z.infer<typeof CharactersResponseSchema>

export const CreateCharacterRequestSchema = CharacterSchema.omit({ id: true })
export type CreateCharacterRequest = z.infer<typeof CreateCharacterRequestSchema>

export const CreateCharacterResponseSchema = CharacterSchema
export type CreateCharacterResponse = z.infer<typeof CreateCharacterResponseSchema>

export const DeleteCharacterResponseSchema = z.object({
  message: z.string(),
})
export type DeleteCharacterResponse = z.infer<typeof DeleteCharacterResponseSchema>

export const characterContract = c.router(
  {
    getCharactersByWorldId: {
      method: 'GET',
      path: '/by-world/:id',
      responses: {
        200: CharactersResponseSchema,
        400: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    createCharacter: {
      method: 'POST',
      path: '/',
      body: CreateCharacterRequestSchema,
      responses: {
        201: CreateCharacterResponseSchema,
        400: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    deleteCharacter: {
      method: 'DELETE',
      path: '/:id',
      responses: {
        200: DeleteCharacterResponseSchema,
        400: ErrorResponseSchema,
        404: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
  },
  {
    pathPrefix: '/characters',
  }
)
