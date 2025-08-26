import { worldStateContract } from '@weave/types/apis'
import { initServer } from '@ts-rest/express'
import { mapWorldState, mapCharacter } from '../utils/mapper'
import { prisma } from '../services/database'

// Helper function to map world state with characters
const mapWorldStateWithCharacters = (worldState: any) => {
  const mappedWorldState = mapWorldState(worldState)
  mappedWorldState.characters = worldState.characters.map(mapCharacter)
  return mappedWorldState
}

export function createWorldStateRouter() {
  const s = initServer()
  return s.router(worldStateContract, {
    getWorldStateById: async ({ params }) => {
      const worldState = await prisma.worldState.findUnique({
        where: { id: params.worldStateId },
        include: {
          characters: true,
        },
      })
      if (!worldState) {
        return {
          status: 404,
          body: { message: 'World state not found' },
        }
      }
      return {
        status: 200,
        body: { worldState: mapWorldStateWithCharacters(worldState) },
      }
    },
    getWorldStateByChannelId: async ({ params }) => {
      const channel = await prisma.channel.findUnique({
        where: { id: params.channelId },
        include: {
          worldState: {
            include: {
              characters: true,
            },
          },
        },
      })
      if (!channel?.worldState) {
        return {
          status: 404,
          body: { message: 'World state or channel not found' },
        }
      }
      return {
        status: 200,
        body: { worldState: mapWorldStateWithCharacters(channel.worldState) },
      }
    },
    updateWorldState: async ({ params, body }) => {
      const { worldState } = body

      // Update the world state in the database
      await prisma.worldState.update({
        where: { id: params.worldStateId },
        data: {
          state: worldState.state,
        },
      })

      // Update characters separately if they're included in the request
      if (worldState.characters) {
        for (const character of worldState.characters) {
          // Check if the character exists
          const existingCharacter = await prisma.character.findUnique({
            where: { id: character.id },
          })

          if (existingCharacter) {
            // Update the existing character
            await prisma.character.update({
              where: { id: character.id },
              data: {
                name: character.name,
                description: character.description,
                avatar: character.avatar,
              },
            })
          }
        }
      }

      // Get the updated world state with characters
      const finalWorldState = await prisma.worldState.findUnique({
        where: { id: params.worldStateId },
        include: {
          characters: true,
        },
      })

      if (!finalWorldState) {
        return {
          status: 404,
          body: { message: 'World state not found after update' },
        }
      }

      return {
        status: 200,
        body: { worldState: mapWorldStateWithCharacters(finalWorldState) },
      }
    },
  })
}
