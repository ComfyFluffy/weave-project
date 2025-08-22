import { messageContract } from '@weave/types/apis'
import { initServer } from '@ts-rest/express'
import { mapMessage } from '../utils/mapper'
import { prisma } from '../services/database'

export function createMessageRouter() {
  const s = initServer()
  return s.router(messageContract, {
    getMessagesByChannelId: async ({ params, req }) => {
      const messages = await prisma.message.findMany({
        where: { channelId: params.channelId },
        orderBy: { createdAt: 'asc' },
      })
      const mappedMessages = messages.map(mapMessage)
      return {
        status: 200,
        body: { messages: mappedMessages },
      }
    },
  })
}
