import { DatabaseService } from '../services/database.interface'
import { initServer } from '@ts-rest/express'
import { characterContract } from '@weave/types/apis'

export function createCharacterRouter(dbService: DatabaseService) {
  const s = initServer()
  return s.router(characterContract, {
    getCharactersByWorldId: async ({ params }) => {
      try {
        const characters = await dbService.getCharactersByWorldId(params.id)
        return {
          status: 200,
          body: {
            characters: characters,
          },
        }
      } catch (error) {
        console.error('Error fetching characters by world id:', error)
        return {
          status: 400,
          body: {
            message: 'Failed to fetch characters',
          },
        }
      }
    },
  })
}
