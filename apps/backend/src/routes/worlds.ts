import { DatabaseService } from '../services/database.interface'
import { initServer } from '@ts-rest/express'
import { worldContract } from '@weave/types/apis'

export function createWorldRouter(dbService: DatabaseService) {
  const s = initServer()
  return s.router(worldContract, {
    getWorlds: async () => {
      try {
        const worlds = await dbService.getWorlds()
        return {
          status: 200,
          body: {
            worlds: worlds,
          },
        }
      } catch (error) {
        console.error('Error fetching worlds:', error)
        return {
          status: 500,
          body: {
            message: 'Failed to fetch worlds',
          },
        }
      }
    },
    getWorldById: async ({ params }) => {
      const world = await dbService.getWorldById(params.worldId)
      if (!world) {
        return {
          status: 400,
          body: {
            message: 'World not found!',
          },
        }
      }
      return {
        status: 200,
        body: {
          world: world,
        },
      }
    },
  })
}
