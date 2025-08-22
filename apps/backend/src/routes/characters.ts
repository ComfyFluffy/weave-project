import { DatabaseService } from '../services/database.interface'
import { initServer } from '@ts-rest/express'
import { characterContract } from '@weave/types/apis'
import { CharacterSchema } from '@weave/types'

export function createCharacterRouter(dbService: DatabaseService) {
  const s = initServer()
  return s.router(characterContract, {
    getCharactersByWorldId: async ({ params }) => {
      try {
        const characters = await dbService.getCharactersByWorldId(params.id)
        return {
          status: 200,
          body: {
            characters,
          },
        }
      } catch (error) {
        console.error(`Error fetching characters for world ${params.id}:`, error)
        return {
          status: 500,
          body: {
            message: 'Failed to fetch characters',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        }
      }
    },
    createCharacter: async ({ body }) => {
      try {
        // Validate input data
        const validatedData = CharacterSchema.omit({ id: true }).parse(body)
        
        // Additional validation for field lengths
        if (validatedData.name.length > 50) {
          return {
            status: 400,
            body: {
              message: 'Character name must be less than 50 characters',
              error: 'Validation error',
            },
          }
        }
        
        if (validatedData.description && validatedData.description.length > 500) {
          return {
            status: 400,
            body: {
              message: 'Character description must be less than 500 characters',
              error: 'Validation error',
            },
          }
        }
        
        // If avatar is provided, validate it's a valid base64 string
        if (validatedData.avatar) {
          const base64Regex = /^data:image\/(?:jpeg|png|gif|webp);base64,[A-Za-z0-9+/]*={0,2}$/
          if (!base64Regex.test(validatedData.avatar)) {
            return {
              status: 400,
              body: {
                message: 'Invalid avatar format. Must be a valid base64 encoded image.',
                error: 'Validation error',
              },
            }
          }
        }
        
        // For now, we don't have world ID in the request, so we pass undefined
        // In a real implementation, this would come from the request context or body
        const character = await dbService.createCharacter(validatedData, undefined)
        
        console.log(`Created character: ${character.id} - ${character.name}`)
        
        return {
          status: 201,
          body: character,
        }
      } catch (error: any) {
        console.error('Error creating character:', error)
        
        if (error.name === 'ZodError') {
          return {
            status: 400,
            body: {
              message: 'Invalid character data',
              error: 'Validation error',
              details: error.errors,
            },
          }
        }
        
        return {
          status: 500,
          body: {
            message: 'Failed to create character',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        }
      }
    },
    deleteCharacter: async ({ params }) => {
      try {
        const success = await dbService.deleteCharacter(params.id)
        if (success) {
          console.log(`Deleted character: ${params.id}`)
          return {
            status: 200,
            body: {
              message: 'Character deleted successfully',
            },
          }
        } else {
          return {
            status: 404,
            body: {
              message: 'Character not found',
              error: 'Character not found',
            },
          }
        }
      } catch (error) {
        console.error(`Error deleting character ${params.id}:`, error)
        return {
          status: 500,
          body: {
            message: 'Failed to delete character',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        }
      }
    },
  })
}
