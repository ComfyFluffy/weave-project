import { initServer } from '@ts-rest/express'
import { worldContract } from '@weave/types/apis'
import { World } from '@weave/types'
import { prisma } from '../services/database'
import { mapWorld } from '../utils/mapper'

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
  })
}
