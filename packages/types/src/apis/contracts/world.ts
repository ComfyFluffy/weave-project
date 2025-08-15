import { initContract } from '@ts-rest/core'
import z from 'zod'
import { ChannelSchema, WorldSchema } from '../..'
import { ErrorResponseSchema } from '..'
const c = initContract()

export const WorldsRequestSchema = z.object({})
export type WorldsRequest = z.infer<typeof WorldsRequestSchema>

export const WorldsResponseSchema = z.object({
  worlds: z.array(WorldSchema),
})
export type WorldsResponse = z.infer<typeof WorldsResponseSchema>

export const WorldSingleResponseSchema = z.object({
  world: WorldSchema,
})
export type WorldSingleResponse = z.infer<typeof WorldSingleResponseSchema>

export const WorldChannelsResponseSchema = z.object({
  channels: z.array(ChannelSchema),
})
export type WorldChannelsResponse = z.infer<typeof WorldChannelsResponseSchema>

export const worldContract = c.router(
  {
    getWorlds: {
      method: 'GET',
      path: '/',
      responses: {
        200: WorldsResponseSchema,
        400: ErrorResponseSchema,
      },
    },
    getWorldById: {
      method: 'GET',
      path: '/:worldId',
      responses: {
        200: WorldSingleResponseSchema,
        400: ErrorResponseSchema,
      },
    },
  },
  {
    pathPrefix: '/worlds',
  }
)
