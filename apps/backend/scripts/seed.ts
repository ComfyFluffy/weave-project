import { withAccelerate } from '@prisma/extension-accelerate'
import bcrypt from 'bcrypt'
import {
  users as mockUsers,
  worlds as mockWorlds,
  worldState as mockWorldState,
  worldState2 as mockWorldState2,
  messages as mockMessages,
} from '../src/mock'
import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient().$extends(withAccelerate())
const saltRounds = 10

async function seed() {
  try {
    console.log('Seeding database...')
    // Clear existing data (in correct order due to foreign key constraints)
    await prisma.message.deleteMany()
    await prisma.channel.deleteMany()
    await prisma.character.deleteMany()
    await prisma.worldState.deleteMany()
    await prisma.world.deleteMany()
    await prisma.user.deleteMany()

    // Create users
    console.log('Creating users...')
    for (const user of mockUsers) {
      const hashedPassword = await bcrypt.hash('password123', saltRounds)
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          password: hashedPassword,
          displayName: user.displayName,
          avatar: user.avatar,
        },
      })
    }

    // Create characters
    console.log('Creating characters...')
    // Assign characters to users (first 3 to players, NPCs to GM)
    const characterOwnerMap = {
      'char-1': 'user-1', // 阿尔萨斯 -> 龙骑士玩家
      'char-2': 'user-2', // 梅林 -> 法师玩家
      'char-3': 'user-3', // 凯瑟琳 -> 盗贼玩家
      'npc-1': 'gm-1', // 托尼 -> 游戏主持人
      'npc-2': 'gm-1', // 艾莉娅 -> 游戏主持人
    }

    for (const character of mockWorldState.characters) {
      const creatorId =
        characterOwnerMap[character.id as keyof typeof characterOwnerMap] ||
        'gm-1'
      await prisma.character.create({
        data: {
          id: character.id,
          name: character.name,
          description: character.description,
          avatar: character.avatar,
          creatorId,
        },
      })
    }

    // Create worlds
    console.log('Creating worlds...')
    const hostUser = mockUsers.find((u) => u.id === 'gm-1') || mockUsers[0]

    for (const world of mockWorlds) {
      const createdWorld = await prisma.world.create({
        data: {
          id: world.id,
          name: world.name,
          description: world.description,
          tags: world.tags,
          rules: world.rules,
          hostId: hostUser.id,
        },
      })

      // Create channels for the world (world state will be linked later)
      console.log('Creating channels...')
      for (const channel of world.channels) {
        await prisma.channel.create({
          data: {
            id: channel.id,
            name: channel.name,
            type: channel.type,
            description: channel.description,
            worldId: world.id,
            // worldStateId will be updated later after world states are created
          },
        })
      }
    }

    // Create world states (after worlds and characters are created)
    console.log('Creating world state...')
    const worldStateData = {
      keyEventsLog: mockWorldState.state.keyEventsLog,
      locations: mockWorldState.state.locations,
      plots: mockWorldState.state.plots,
      lore: mockWorldState.state.lore,
      characterStates: mockWorldState.state.characterStates,
      items: mockWorldState.state.items,
      itemTemplates: mockWorldState.state.itemTemplates,
      currentGameTime: mockWorldState.state.currentGameTime,
      outline: mockWorldState.state.outline,
    }

    await prisma.worldState.create({
      data: {
        id: mockWorldState.id,
        worldId: mockWorldState.worldId,
        state: worldStateData,
        characters: {
          connect: mockWorldState.characters.map((char) => ({ id: char.id })),
        },
      },
    })

    // Create second world state (Cyberpunk world)
    const worldStateData2 = {
      keyEventsLog: mockWorldState2.state.keyEventsLog,
      locations: mockWorldState2.state.locations,
      plots: mockWorldState2.state.plots,
      lore: mockWorldState2.state.lore,
      characterStates: mockWorldState2.state.characterStates,
      items: mockWorldState2.state.items,
      itemTemplates: mockWorldState2.state.itemTemplates,
      currentGameTime: mockWorldState2.state.currentGameTime,
      outline: mockWorldState2.state.outline,
    }

    await prisma.worldState.create({
      data: {
        id: mockWorldState2.id,
        worldId: mockWorldState2.worldId,
        state: worldStateData2,
        characters: {
          connect: mockWorldState2.characters.map((char) => ({ id: char.id })),
        },
      },
    })

    // Update channels with their worldStateId
    console.log('Updating channels with world state references...')
    for (const world of mockWorlds) {
      for (const channel of world.channels) {
        await prisma.channel.update({
          where: { id: channel.id },
          data: {
            worldStateId: channel.worldStateId,
          },
        })
      }
    }

    // Create messages
    console.log('Creating messages...')
    // We'll use the first channel for all messages
    const channelId = mockWorlds[0].channels[0].id

    if (mockMessages[channelId]) {
      for (const message of mockMessages[channelId]) {
        await prisma.message.create({
          data: {
            id: message.id,
            channelId: message.channelId,
            userId: message.userId,
            characterId: message.characterId,
            type: message.type,
            content: message.content,
          },
        })
      }
    }

    console.log('Database seeding completed!')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

void seed()
