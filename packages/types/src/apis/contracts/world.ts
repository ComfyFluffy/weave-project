import { initContract } from '@ts-rest/core'
import z from 'zod'
import { ChannelSchema, WorldSchema } from '../..'
import { commonResponses } from '../common'
const c = initContract()

export const WorldsResponseSchema = z.object({
  worlds: z.array(WorldSchema),
})
export type WorldsResponse = z.infer<typeof WorldsResponseSchema>

export const WorldSingleResponseSchema = z.object({
  world: WorldSchema,
})
export type WorldSingleResponse = z.infer<typeof WorldSingleResponseSchema>

export const CreateWorldRequestSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  tags: z.array(z.string()),
  rules: z.string(),
})
export type CreateWorldRequest = z.infer<typeof CreateWorldRequestSchema>

export const worldContract = c.router(
  {
    getWorlds: {
      method: 'GET',
      path: '/',
      responses: {
        200: WorldsResponseSchema,
      },
    },
    getWorldById: {
      method: 'GET',
      path: '/:worldId',
      responses: {
        200: WorldSingleResponseSchema,
      },
    },
    createWorld: {
      method: 'POST',
      path: '/',
      body: CreateWorldRequestSchema,
      responses: {
        201: WorldSingleResponseSchema,
      },
    },
  },
  {
    pathPrefix: '/worlds',
    commonResponses,
  }
)
