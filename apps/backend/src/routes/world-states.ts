import { worldStateContract } from '@weave/types/apis'
import { initServer } from '@ts-rest/express'
import { mapWorldState } from '../utils/mapper'
import { prisma } from '../services/database'

export function createWorldStateRouter() {
  const s = initServer()
  return s.router(worldStateContract, {
    getWorldStateById: async ({ params }) => {
      const worldState = await prisma.worldState.findUnique({
        where: { id: params.worldStateId },
      })
      if (!worldState) {
        return {
          status: 404,
          body: { message: 'World state not found' },
        }
      }
      const mappedWorldState = mapWorldState(worldState)
      return {
        status: 200,
        body: { worldState: mappedWorldState },
      }
    },
    getWorldStateByChannelId: async ({ params }) => {
      const channel = await prisma.channel.findUnique({
        where: { id: params.channelId },
        select: {
          worldState: true,
        },
      })
      if (!channel?.worldState) {
        return {
          status: 404,
          body: { message: 'World state or channel not found' },
        }
      }
      const mappedWorldState = mapWorldState(channel.worldState)
      return {
        status: 200,
        body: { worldState: mappedWorldState },
      }
    },
  })
}
