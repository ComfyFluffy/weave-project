import { initContract } from '@ts-rest/core'
import z from 'zod'
import { WorldStateSchema } from '../../state'
import { commonResponses } from '../common'
const c = initContract()

export const WorldStateResponseSchema = z.object({
  worldState: WorldStateSchema,
})
export type WorldStateResponse = z.infer<typeof WorldStateResponseSchema>

export const worldStateContract = c.router(
  {
    getWorldStateById: {
      method: 'GET',
      path: '/by-id/:worldStateId',
      responses: {
        200: WorldStateResponseSchema,
      },
    },
  },
  {
    pathPrefix: '/world-states',
    commonResponses,
  }
)
