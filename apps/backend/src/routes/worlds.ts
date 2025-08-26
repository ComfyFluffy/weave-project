import { initServer } from '@ts-rest/express'
import { worldContract } from '@weave/types/apis'
import { World } from '@weave/types'
import { prisma } from '../services/database'
import { mapWorld } from '../utils/mapper'
import { defaultWorldState } from '../utils/misc'

// Helper function to check if world exists and user is the host
const validateWorldOwnership = async (worldId: string, userId: string) => {
  const world = await prisma.world.findUnique({
    where: { id: worldId },
  })

  if (!world) {
    return {
      status: 404 as const,
      body: { message: 'World not found!' },
    }
  }

  if (world.hostId !== userId) {
    return {
      status: 403 as const,
      body: { message: 'You are not authorized to perform this action on this world!' },
    }
  }

  return null // Validation passed
}

// Helper function to create world state
const createWorldState = async (worldId: string) => {
  return await prisma.worldState.create({
    data: {
      worldId,
      state: defaultWorldState(),
    },
  })
}

export function createWorldRouter() {
  const s = initServer()
  return s.router(worldContract, {
    getWorlds: async () => {
      const worlds = await prisma.world.findMany({
        include: { channels: true },
      })
      const mappedWorlds: World[] = worlds.map(mapWorld)
      return {
        status: 200,
        body: {
          worlds: mappedWorlds,
        },
      }
    },
    getWorldById: async ({ params: { worldId } }) => {
      const world = await prisma.world.findUnique({
        where: { id: worldId },
        include: { channels: true },
      })
      if (!world) {
        return {
          status: 404,
          body: {
            message: 'World not found!',
          },
        }
      }
      const mappedWorld: World = mapWorld(world)
      return {
        status: 200,
        body: {
          world: mappedWorld,
        },
      }
    },
    createWorld: async ({ body, req }) => {
      // Create the world first
      const world = await prisma.world.create({
        data: {
          name: body.name,
          description: body.description,
          tags: body.tags,
          rules: body.rules,
          hostId: req.auth!.userId,
        },
      })

      // Create worldStates for default channels
      const [oocWorldState, icWorldState] = await Promise.all([
        createWorldState(world.id),
        createWorldState(world.id),
      ])

      // Create default channels with worldStates
      await prisma.channel.createMany({
        data: [
          {
            name: '一般',
            type: 'ooc',
            description: '一般讨论频道',
            worldId: world.id,
            worldStateId: oocWorldState.id,
          },
          {
            name: '角色扮演',
            type: 'ic',
            description: '角色扮演频道',
            worldId: world.id,
            worldStateId: icWorldState.id,
          },
        ],
      })

      // Fetch the complete world with channels
      const completeWorld = await prisma.world.findUnique({
        where: { id: world.id },
        include: { channels: true },
      })

      const mappedWorld: World = mapWorld(completeWorld!)
      return {
        status: 201,
        body: {
          world: mappedWorld,
        },
      }
    },
    updateWorld: async ({ params: { worldId }, body, req }) => {
      // Validate world ownership
      const validationError = await validateWorldOwnership(worldId, req.auth!.userId)
      if (validationError) return validationError

      // Update the world
      const updatedWorld = await prisma.world.update({
        where: { id: worldId },
        data: {
          name: body.name,
          description: body.description,
          tags: body.tags,
          rules: body.rules,
        },
        include: { channels: true },
      })

      const mappedWorld: World = mapWorld(updatedWorld)
      return {
        status: 200,
        body: {
          world: mappedWorld,
        },
      }
    },
    deleteWorld: async ({ params: { worldId }, req }) => {
      // Validate world ownership
      const validationError = await validateWorldOwnership(worldId, req.auth!.userId)
      if (validationError) return validationError

      // First, get all channel IDs in this world
      const channels = await prisma.channel.findMany({
        where: { worldId },
        select: { id: true },
      })
      
      const channelIds = channels.map(channel => channel.id)
      
      // Delete all related data in parallel
      await Promise.all([
        // Delete all messages associated with channels in this world
        prisma.message.deleteMany({
          where: { channelId: { in: channelIds } },
        }),
        // Delete all channels associated with the world
        prisma.channel.deleteMany({
          where: { worldId },
        }),
        // Delete all world states associated with the world
        prisma.worldState.deleteMany({
          where: { worldId },
        }),
      ])

      // Finally, delete the world
      await prisma.world.delete({
        where: { id: worldId },
      })

      return {
        status: 200,
        body: {
          message: 'World deleted successfully',
        },
      }
    },
  })
}
