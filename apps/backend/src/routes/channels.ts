import { channelContract } from '@weave/types/apis'
import { initServer } from '@ts-rest/express'
import { mapChannel } from '../utils/mapper'
import { prisma } from '../services/database'

export function createChannelRouter() {
  const s = initServer()
  return s.router(channelContract, {
    getChannelsByWorldId: async ({ params }) => {
      const channels = await prisma.channel.findMany({
        where: { worldId: params.worldId },
      })
      const mappedChannels = channels.map(mapChannel)
      return {
        status: 200,
        body: {
          channels: mappedChannels,
        },
      }
    },
  })
}
