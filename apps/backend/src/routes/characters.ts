import { initServer } from '@ts-rest/express'
import { characterContract } from '@weave/types/apis'
import { prisma } from '../services/database'
import { mapCharacter } from '../utils/mapper'
import { Server } from 'socket.io'

// Global reference to Socket.IO server instance
let io: Server

// Function to set the Socket.IO server instance
export function setSocketIO(socketIOInstance: Server) {
  io = socketIOInstance
}

export function createCharacterRouter() {
  const s = initServer()
  return s.router(characterContract, {
    getAllCharacters: async () => {
      const characters = await prisma.character.findMany({
        orderBy: { createdAt: 'desc' },
      })
      const mappedCharacters = characters.map(mapCharacter)
      return {
        status: 200,
        body: { characters: mappedCharacters },
      }
    },
    getCharactersByChannelId: async ({ params }) => {
      const channel = await prisma.channel.findUnique({
        where: { id: params.channelId },
        select: {
          worldState: {
            select: {
              characters: true,
            },
          },
        },
      })
      if (!channel?.worldState?.characters) {
        return { status: 404, body: { message: 'Not Found' } }
      }
      const mappedCharacters = channel.worldState.characters.map(mapCharacter)
      return {
        status: 200,
        body: { characters: mappedCharacters },
      }
    },
    getCharactersByWorldStateId: async ({ params }) => {
      const worldState = await prisma.worldState.findUnique({
        where: { id: params.worldStateId },
        select: {
          characters: true,
        },
      })
      if (!worldState?.characters) {
        return { status: 404, body: { message: 'World state not found' } }
      }
      const mappedCharacters = worldState.characters.map(mapCharacter)
      return {
        status: 200,
        body: { characters: mappedCharacters },
      }
    },
    getCharacterById: async ({ params }) => {
      const character = await prisma.character.findUnique({
        where: { id: params.characterId },
      })

      if (!character) {
        return {
          status: 404,
          body: {
            message: 'Character not found',
          },
        }
      }

      return {
        status: 200,
        body: {
          character: mapCharacter(character),
        },
      }
    },
    getMyCharacters: async ({ req }) => {
      const userId = req.auth!.userId
      const characters = await prisma.character.findMany({
        where: { creatorId: userId },
      })

      const mappedCharacters = characters.map(mapCharacter)

      return {
        status: 200,
        body: { characters: mappedCharacters },
      }
    },
    createCharacter: async ({ body, req }) => {
      const character = await prisma.character.create({
        data: {
          ...body,
          creatorId: req.auth!.userId,
        },
      })

      return {
        status: 201,
        body: {
          character: mapCharacter(character),
        },
      }
    },
    deleteCharacterById: async ({ params, req }) => {
      const result = await prisma.character.deleteMany({
        where: { id: params.id, creatorId: req.auth!.userId },
      })
      if (result.count === 0) {
        return {
          status: 404,
          body: {
            message: 'Character not found or not authorized',
          },
        }
      }

      return {
        status: 200,
      }
    },
    updateWorldStateCharacters: async ({ params, body }) => {
      try {
        // Get current world state with characters
        const currentWorldState = await prisma.worldState.findUnique({
          where: { id: params.worldStateId },
          include: { characters: true },
        })

        if (!currentWorldState) {
          return {
            status: 404,
            body: { message: 'World state not found' },
          }
        }

        // Get current character IDs
        const currentCharacterIds = currentWorldState.characters.map(
          (c) => c.id
        )

        // Add new character IDs, avoiding duplicates
        const newCharacterIds = body.characterIds.filter(
          (id) => !currentCharacterIds.includes(id)
        )
        const updatedCharacterIds = [...currentCharacterIds, ...newCharacterIds]

        // Update the many-to-many relationship between WorldState and Characters
        const worldState = await prisma.worldState.update({
          where: { id: params.worldStateId },
          data: {
            characters: {
              set: updatedCharacterIds.map((id) => ({ id })),
            },
          },
          include: {
            characters: true,
          },
        })

        const mappedCharacters = worldState.characters.map(mapCharacter)
        
        // Broadcast the character update to all connected clients
        if (io) {
          // Find all channels associated with this world state
          const channels = await prisma.channel.findMany({
            where: { worldStateId: params.worldStateId },
          })
          
          // Emit update event to all channels associated with this world state
          channels.forEach((channel) => {
            io.to(channel.id).emit('characters:updated', {
              worldStateId: params.worldStateId,
              characters: mappedCharacters,
            })
          })
        }
        
        return {
          status: 200,
          body: { characters: mappedCharacters },
        }
      } catch (error) {
        console.error('Error updating world state characters:', error)
        return {
          status: 500,
          body: { message: 'Failed to update world state characters' },
        }
      }
    },
   removeCharacterFromWorldState: async ({ params }) => {
     try {
       // Get current world state with characters
       const currentWorldState = await prisma.worldState.findUnique({
         where: { id: params.worldStateId },
         include: { characters: true },
       })

       if (!currentWorldState) {
         return {
           status: 404,
           body: { message: 'World state not found' },
         }
       }

       // Get current character IDs, excluding the one to remove
       const currentCharacterIds = currentWorldState.characters.map((c) => c.id)
       const updatedCharacterIds = currentCharacterIds.filter(
         (id) => id !== params.characterId
       )

       // Update the many-to-many relationship between WorldState and Characters
       const worldState = await prisma.worldState.update({
         where: { id: params.worldStateId },
         data: {
           characters: {
             set: updatedCharacterIds.map((id) => ({ id })),
           },
         },
         include: {
           characters: true,
         },
       })

       const mappedCharacters = worldState.characters.map(mapCharacter)
       
       // Broadcast the character update to all connected clients
       if (io) {
         // Find all channels associated with this world state
         const channels = await prisma.channel.findMany({
           where: { worldStateId: params.worldStateId },
         })
         
         // Emit update event to all channels associated with this world state
         channels.forEach((channel) => {
           io.to(channel.id).emit('characters:updated', {
             worldStateId: params.worldStateId,
             characters: mappedCharacters,
           })
         })
       }
       
       return {
         status: 200,
         body: { characters: mappedCharacters },
       }
     } catch (error) {
       console.error('Error removing character from world state:', error)
       return {
         status: 500,
         body: { message: 'Failed to remove character from world state' },
       }
     }
   },
  })
}
