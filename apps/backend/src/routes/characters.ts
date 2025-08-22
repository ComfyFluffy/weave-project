import { initServer } from '@ts-rest/express'
import { characterContract } from '@weave/types/apis'
import { prisma } from '../services/database'
import { mapCharacter } from '../utils/mapper'

export function createCharacterRouter() {
  const s = initServer()
  return s.router(characterContract, {
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
  })
}
