import { worldStateContract } from '@weave/types/apis'
import { initServer } from '@ts-rest/express'
import { mapWorldState, mapCharacter } from '../utils/mapper'
import { prisma } from '../services/database'
import { Server } from 'socket.io'
import { AuthenticatedSocket } from '../middleware/socket-auth'

// Global reference to Socket.IO server instance
let io: Server

// Function to set the Socket.IO server instance
export function setSocketIO(socketIOInstance: Server) {
  io = socketIOInstance
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
      const mappedWorldState = mapWorldState(worldState)
      // Include characters from the worldState
      mappedWorldState.characters = worldState.characters.map(mapCharacter)
      return {
        status: 200,
        body: { worldState: mappedWorldState },
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
      const mappedWorldState = mapWorldState(channel.worldState)
      // Include characters from the worldState
      mappedWorldState.characters =
        channel.worldState.characters.map(mapCharacter)
      return {
        status: 200,
        body: { worldState: mappedWorldState },
      }
    },
    updateWorldState: async ({ params, body }) => {
      const { worldState } = body

      // Update the world state in the database
      const updatedWorldState = await prisma.worldState.update({
        where: { id: params.worldStateId },
        data: {
          state: worldState.state,
          // Note: characters are handled separately since they're a relation
        },
        include: {
          characters: true,
        },
      })

      const mappedWorldState = mapWorldState(updatedWorldState)
      // Include characters from the worldState
      mappedWorldState.characters =
        updatedWorldState.characters.map(mapCharacter)
      
      // Broadcast the world state update to all connected clients
      if (io) {
        // Find all channels associated with this world state
        const channels = await prisma.channel.findMany({
          where: { worldStateId: params.worldStateId },
        })
        
        // Emit update event to all channels associated with this world state
        channels.forEach((channel) => {
          io.to(channel.id).emit('worldState:updated', {
            worldStateId: params.worldStateId,
            worldState: mappedWorldState,
          })
        })
      }
      
      return {
        status: 200,
        body: { worldState: mappedWorldState },
      }
    },
  })
}
