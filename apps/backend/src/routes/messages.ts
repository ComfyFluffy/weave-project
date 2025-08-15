import { messageContract } from '@weave/types/apis'
import { DatabaseService } from '../services/database.interface'
import { initServer } from '@ts-rest/express'

export function createMessageRouter(dbService: DatabaseService) {
  const s = initServer()
  return s.router(messageContract, {
    getMessagesByChannelId: async ({ params }) => {
      const messages = await dbService.getMessagesByChannelId(params.channelId)

      return {
        status: 200,
        body: { messages },
      }
    },
  })
}
