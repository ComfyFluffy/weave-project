import type { DatabaseService } from '../services/database.interface'
import { channelContract } from '@weave/types/apis'
import { initServer } from '@ts-rest/express'

export function createChannelRouter(dbService: DatabaseService) {
  const s = initServer()
  return s.router(channelContract, {
    getChannelsByWorldId: async ({ params }) => {
      const channels = await dbService.getChannelsByWorldId(params.worldId)
      return {
        status: 200,
        body: { channels },
      }
    },
  })
}
