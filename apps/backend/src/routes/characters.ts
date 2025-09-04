import { initServer } from '@ts-rest/express'
import { characterContract } from '@weave/types/apis'
import { prisma } from '../services/database'
import { mapCharacter } from '../utils/mapper'
import { defaultCharacterState } from '../utils/misc'
import { WorldState } from '@weave/types'
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
        where: { isHidden: false }, // Only show non-hidden characters
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
        return { status: 404, body: { message: '未找到相关数据' } }
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
        return { status: 404, body: { message: '世界状态不存在' } }
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
            message: '角色不存在',
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
        where: {
          creatorId: userId,
          isHidden: false, // Only show non-hidden characters
        },
        orderBy: { createdAt: 'desc' },
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
    updateCharacter: async ({ params, body, req }) => {
      try {
        // First check if the character exists and belongs to the user
        const existingCharacter = await prisma.character.findFirst({
          where: {
            id: params.characterId,
            creatorId: req.auth!.userId,
          },
        })

        if (!existingCharacter) {
          return {
            status: 404,
            body: {
              message: '角色不存在或您没有权限',
            },
          }
        }

        // Always hide the old character and create a new version
        await prisma.character.update({
          where: { id: params.characterId },
          data: { isHidden: true },
        })

        // Create a new character version
        const newCharacter = await prisma.character.create({
          data: {
            name: body.name ?? existingCharacter.name,
            description: body.description ?? existingCharacter.description,
            avatar: body.avatar ?? existingCharacter.avatar,
            creatorId: req.auth!.userId,
            originalId: existingCharacter.originalId ?? existingCharacter.id, // Point to the original
            isHidden: false,
          },
        })

        return {
          status: 200,
          body: {
            character: mapCharacter(newCharacter),
          },
        }
      } catch (error) {
        console.error('Error updating character:', error)
        return {
          status: 400,
          body: {
            message: '更新角色失败',
          },
        }
      }
    },
    deleteCharacterById: async ({ params, req }) => {
      // Find the character and check ownership
      const character = await prisma.character.findFirst({
        where: {
          id: params.id,
          creatorId: req.auth!.userId,
        },
      })

      if (!character) {
        return {
          status: 404,
          body: {
            message: '角色不存在或您没有权限',
          },
        }
      }

      // Always hide the character instead of deleting
      await prisma.character.update({
        where: { id: params.id },
        data: { isHidden: true },
      })

      return {
        status: 200,
      }
    },
    updateWorldStateCharacters: async ({ params, body }) => {
      // Get current world state with characters and full state data
      const currentWorldState = await prisma.worldState.findUnique({
        where: { id: params.worldStateId },
        include: { characters: true },
      })

      if (!currentWorldState) {
        return {
          status: 404,
          body: { message: '世界状态不存在' },
        }
      }

      // Get current character IDs
      const currentCharacterIds = currentWorldState.characters.map((c) => c.id)

      // Add new character IDs, avoiding duplicates
      const newCharacterIds = body.characterIds.filter(
        (id) => !currentCharacterIds.includes(id)
      )
      const updatedCharacterIds = [...currentCharacterIds, ...newCharacterIds]

      // Fetch the new characters to get their details
      const newCharacters = await prisma.character.findMany({
        where: { id: { in: newCharacterIds } },
      })

      // Get the current world state JSON data
      const currentState = currentWorldState.state as WorldState['state']

      // Create a default character state for each new character
      newCharacters.forEach((character) => {
        // Only add character state if it doesn't already exist
        if (!currentState.characterStates[character.id]) {
          currentState.characterStates[character.id] = defaultCharacterState()
        }
      })

      // Update the many-to-many relationship between WorldState and Characters
      // and also update the state JSON with the new character states
      const worldState = await prisma.worldState.update({
        where: { id: params.worldStateId },
        data: {
          characters: {
            set: updatedCharacterIds.map((id) => ({ id })),
          },
          state: currentState,
        },
        include: {
          characters: true,
        },
      })

      const mappedCharacters = worldState.characters.map(mapCharacter)

      return {
        status: 200,
        body: { characters: mappedCharacters },
      }
    },
    removeCharacterFromWorldState: async ({ params }) => {
      // Get current world state with characters
      const currentWorldState = await prisma.worldState.findUnique({
        where: { id: params.worldStateId },
        include: { characters: true },
      })

      if (!currentWorldState) {
        return {
          status: 404,
          body: { message: '世界状态不存在' },
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
    },
  })
}
