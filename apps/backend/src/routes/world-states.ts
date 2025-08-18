import { worldStateContract } from '@weave/types/apis'
import { DatabaseService } from '../services/database.interface'
import { initServer } from '@ts-rest/express'

export function createWorldStateRouter(dbService: DatabaseService) {
  const s = initServer()
  return s.router(worldStateContract, {
    getWorldStateById: async ({ params }) => {
      const worldState = await dbService.getWorldStateById(params.worldStateId)
      if (!worldState) {
        return {
          status: 404,
          body: { message: 'World state not found' },
        }
      }
      return {
        status: 200,
        body: { worldState },
      }
    },
    getWorldStateByChannelId: async ({ params }) => {
      const worldState = await dbService.getWorldStateByChannelId(
        params.channelId
      )
      if (!worldState) {
        return {
          status: 404,
          body: { message: 'World state not found for channel' },
        }
      }
      return {
        status: 200,
        body: { worldState },
      }
    },
  })
}
