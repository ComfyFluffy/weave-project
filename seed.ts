import { PrismaClient } from './apps/backend/src/generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate'
import { 
  users as mockUsers, 
  worlds as mockWorlds, 
  worldState as mockWorldState,
  messages as mockMessages 
} from './apps/backend/src/mock'

const prisma = new PrismaClient().$extends(withAccelerate())

async function seed() {
  try {
    
    console.log('Seeding database...')
    // Clear existing data
    await prisma.message.deleteMany()
    await prisma.channel.deleteMany()
    await prisma.world.deleteMany()
    await prisma.user.deleteMany()
    await prisma.character.deleteMany()
    
    // Create users
    console.log('Creating users...')
    for (const user of mockUsers) {
      await prisma.user.create({
        data: {
          id: user.id,
          username: user.username,
          password: 'password', // In a real app, this would be hashed
          avatar: user.avatar || null,
        },
      })
    }
    
    // Create characters
    console.log('Creating characters...')
    for (const character of mockWorldState.characters) {
      await prisma.character.create({
        data: {
          id: character.id,
          name: character.name,
          description: character.description || null,
          avatar: character.avatar || null,
        },
      })
    }
    
    // Create worlds
    console.log('Creating worlds...')
    for (const world of mockWorlds) {
      // Prepare the world data to match the Prisma schema
      const worldData = {
        keyEventsLog: mockWorldState.keyEventsLog,
        locations: mockWorldState.locations,
        plots: mockWorldState.plots,
        lore: mockWorldState.lore,
        characters: mockWorldState.characters,
        characterStates: mockWorldState.characterStates,
        items: mockWorldState.items,
        itemTemplates: mockWorldState.itemTemplates,
        currentGameTime: mockWorldState.currentGameTime,
        outline: mockWorldState.outline,
      }
      
      // Get the host user
      const hostUser = mockUsers.find(u => u.id === 'gm-1') || mockUsers[0]; // Assign the GM as host if available
      
      await prisma.world.create({
        data: {
          id: world.id,
          name: world.name,
          description: world.description || null,
          tags: world.tags,
          rules: world.rules || null,
          host: {
            connect: { id: hostUser.id }
          },
          // Serialize the complex object to JSON string and then parse it back
          // This ensures proper JSON serialization for Prisma
          data: JSON.parse(JSON.stringify(worldData)),
        },
      })
      
      // Create channels for the world
      console.log('Creating channels...')
      for (const channel of world.channels) {
        await prisma.channel.create({
          data: {
            id: channel.id,
            name: channel.name,
            type: channel.type === 'ic' ? 'IC' : channel.type === 'ooc' ? 'OOC' : 'ANNOUNCEMENT',
            description: channel.description || null,
            world: {
              connect: { id: world.id },
            },
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
        // Map message types from mock data to Prisma enum values
        let messageType: any = 'SYSTEM' // default
        switch (message.type) {
          case 'character':
            messageType = 'CHARACTER'
            break
          case 'character-action':
            messageType = 'ACTION'
            break
          case 'system':
            messageType = 'SYSTEM'
            break
          case 'ai':
            messageType = 'AI'
            break
          case 'gm':
            messageType = 'GM'
            break
          default:
            messageType = 'SYSTEM'
        }
        
        await prisma.message.create({
          data: {
            id: message.id,
            channelId: message.channelId,
            userId: message.userId || null,
            characterId: message.characterId || null,
            type: messageType,
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

seed()