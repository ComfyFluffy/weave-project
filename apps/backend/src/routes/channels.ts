import { channelContract } from '@weave/types/apis'
import { initServer } from '@ts-rest/express'
import { mapChannel } from '../utils/mapper'
import { prisma } from '../services/database'
import { defaultWorldState } from '../utils/misc'

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
    createChannel: async ({ body }) => {
      // Check if world exists
      const world = await prisma.world.findUnique({
        where: { id: body.worldId },
      })

      if (!world) {
        return {
          status: 404,
          body: {
            message: 'World not found',
          },
        }
      }

      // Create worldState first
      const worldState = await prisma.worldState.create({
        data: {
          worldId: body.worldId,
          state: defaultWorldState(),
        },
      })

      // Create channel with worldState
      const channel = await prisma.channel.create({
        data: {
          name: body.name,
          type: body.type,
          description: body.description,
          worldId: body.worldId,
          worldStateId: worldState.id,
        },
      })

      const mappedChannel = mapChannel(channel)
      return {
        status: 201,
        body: {
          channel: mappedChannel,
        },
      }
    },
    deleteChannel: async ({ params }) => {
      const channel = await prisma.channel.findUnique({
        where: { id: params.channelId },
        include: { worldState: true },
      })

      if (!channel) {
        return {
          status: 404,
          body: {
            message: 'Channel not found',
          },
        }
      }

      // Delete associated worldState if exists
      if (channel.worldStateId) {
        await prisma.worldState.delete({
          where: { id: channel.worldStateId },
        })
      }

      // Delete the channel
      await prisma.channel.delete({
        where: { id: params.channelId },
      })

      return {
        status: 200,
        body: {
          message: 'Channel deleted successfully',
        },
      }
    },
  })
}
