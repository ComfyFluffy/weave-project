import { initContract } from '@ts-rest/core'
import z from 'zod'
import { ErrorResponseSchema } from '..'
const c = initContract()

export const WorldStateResponseSchema = z.unknown()
export type WorldStateResponse = z.infer<typeof WorldStateResponseSchema>

export const worldStateContract = c.router(
  {
    getWorldStateByWorldId: {
      method: 'GET',
      path: '/by-world/:worldId',
      responses: {
        200: WorldStateResponseSchema,
        400: ErrorResponseSchema,
      },
    },
  },
  {
    pathPrefix: '/world-states',
  }
)
