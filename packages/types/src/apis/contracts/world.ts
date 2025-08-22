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
  },
  {
    pathPrefix: '/worlds',
    commonResponses,
  }
)
