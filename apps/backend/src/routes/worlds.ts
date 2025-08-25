import { initServer } from '@ts-rest/express'
import { worldContract } from '@weave/types/apis'
import { World } from '@weave/types'
import { prisma } from '../services/database'
import { mapWorld } from '../utils/mapper'
import { defaultWorldState } from '../utils/misc'

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
      const oocWorldState = await prisma.worldState.create({
        data: {
          worldId: world.id,
          state: defaultWorldState(),
        },
      })

      const icWorldState = await prisma.worldState.create({
        data: {
          worldId: world.id,
          state: defaultWorldState(),
        },
      })

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
  })
}
