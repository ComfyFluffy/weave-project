/* eslint-disable @typescript-eslint/require-await */
// Mock database implementation - will be replaced with Prisma
import { nanoid } from 'nanoid'
import { DatabaseService } from './database.interface'
import {
  World,
  WorldState,
  Character,
  User,
  Message,
  ItemTemplate,
  Channel,
} from '@weave/types'
import {
  worlds,
  worldState,
  characters,
  users,
  messages,
  itemTemplates,
} from '../mock'

export class MockDatabaseService implements DatabaseService {
  // Mock storage (in-memory)
  private worlds: World[] = worlds
  private worldStates: Record<string, WorldState> = { 'ws-1': worldState }
  private characters: Character[] = characters
  private users: User[] = users
  private messages: Record<string, Message[]> = messages
  private itemTemplates: ItemTemplate[] = itemTemplates

  // World operations
  async getWorlds(): Promise<World[]> {
    return [...this.worlds]
  }

  async getWorldById(id: string): Promise<World | null> {
    return this.worlds.find((w) => w.id === id) || null
  }

  async createWorld(worldData: Omit<World, 'id'>): Promise<World> {
    const world: World = {
      id: nanoid(),
      ...worldData,
    }
    this.worlds.push(world)
    return world
  }

  async updateWorld(id: string, data: Partial<World>): Promise<World | null> {
    const index = this.worlds.findIndex((w) => w.id === id)
    if (index === -1) return null

    this.worlds[index] = { ...this.worlds[index], ...data }
    return this.worlds[index]
  }

  async deleteWorld(id: string): Promise<boolean> {
    const index = this.worlds.findIndex((w) => w.id === id)
    if (index === -1) return false

    this.worlds.splice(index, 1)
    return true
  }

  // WorldState operations
  async getWorldStateById(id: string): Promise<WorldState | null> {
    return this.worldStates[id] || null
  }

  async getWorldStatesByWorldId(worldId: string): Promise<WorldState[]> {
    return Object.values(this.worldStates).filter(
      (ws) => ws.worldId === worldId
    )
  }

  async getWorldStateByChannelId(
    channelId: string
  ): Promise<WorldState | null> {
    const result = await this.getChannelById(channelId)
    if (result && result.channel.worldStateId) {
      return this.worldStates[result.channel.worldStateId] || null
    }
    return null
  }

  async createWorldState(
    worldStateData: Omit<WorldState, 'id'>
  ): Promise<WorldState> {
    const id = nanoid()
    const worldState: WorldState = {
      id,
      ...worldStateData,
    }
    this.worldStates[id] = worldState
    return worldState
  }

  async updateWorldState(
    id: string,
    data: Partial<WorldState>
  ): Promise<WorldState | null> {
    if (!this.worldStates[id]) return null

    this.worldStates[id] = { ...this.worldStates[id], ...data }
    return this.worldStates[id]
  }

  async deleteWorldState(id: string): Promise<boolean> {
    if (!this.worldStates[id]) return false

    delete this.worldStates[id]
    return true
  }

  // Channel operations
  async getChannelById(
    channelId: string
  ): Promise<{ channel: Channel; world: World } | null> {
    for (const world of this.worlds) {
      const channel = world.channels.find((c) => c.id === channelId)
      if (channel) {
        return { channel, world }
      }
    }
    return null
  }

  // Character operations
  async getCharactersByWorldId(worldId: string): Promise<Character[]> {
    // In mock implementation, we return all characters
    // In real DB, we'd filter by worldId relationship
    return [...this.characters]
  }

  async getCharacterById(id: string): Promise<Character | null> {
    return this.characters.find((c) => c.id === id) || null
  }

  async createCharacter(
    characterData: Omit<Character, 'id'>
  ): Promise<Character> {
    const character: Character = {
      id: nanoid(),
      ...characterData,
    }
    this.characters.push(character)
    return character
  }

  async updateCharacter(
    id: string,
    data: Partial<Character>
  ): Promise<Character | null> {
    const index = this.characters.findIndex((c) => c.id === id)
    if (index === -1) return null

    this.characters[index] = { ...this.characters[index], ...data }
    return this.characters[index]
  }

  async deleteCharacter(id: string): Promise<boolean> {
    const index = this.characters.findIndex((c) => c.id === id)
    if (index === -1) return false

    this.characters.splice(index, 1)
    return true
  }

  // User operations
  async getUsers(): Promise<User[]> {
    return [...this.users]
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) || null
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const user: User = {
      id: nanoid(),
      ...userData,
    }
    this.users.push(user)
    return user
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex((u) => u.id === id)
    if (index === -1) return null

    this.users[index] = { ...this.users[index], ...data }
    return this.users[index]
  }

  // Message operations
  async getMessagesByChannelId(
    channelId: string,
    limit = 50
  ): Promise<Message[]> {
    const channelMessages = this.messages[channelId] || []
    return channelMessages
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit)
      .reverse()
  }

  async createMessage(messageData: Omit<Message, 'id'>): Promise<Message> {
    const message: Message = {
      id: nanoid(),
      ...messageData,
    }

    if (!this.messages[message.channelId]) {
      this.messages[message.channelId] = []
    }
    this.messages[message.channelId].push(message)
    return message
  }

  async updateMessage(
    id: string,
    data: Partial<Message>
  ): Promise<Message | null> {
    for (const channelId in this.messages) {
      const index = this.messages[channelId].findIndex((m) => m.id === id)
      if (index !== -1) {
        this.messages[channelId][index] = {
          ...this.messages[channelId][index],
          ...data,
        }
        return this.messages[channelId][index]
      }
    }
    return null
  }

  async deleteMessage(id: string): Promise<boolean> {
    for (const channelId in this.messages) {
      const index = this.messages[channelId].findIndex((m) => m.id === id)
      if (index !== -1) {
        this.messages[channelId].splice(index, 1)
        return true
      }
    }
    return false
  }

  // Item Template operations
  async getItemTemplates(): Promise<ItemTemplate[]> {
    return [...this.itemTemplates]
  }

  async getItemTemplateByName(name: string): Promise<ItemTemplate | null> {
    return this.itemTemplates.find((t) => t.name === name) || null
  }

  async createItemTemplate(template: ItemTemplate): Promise<ItemTemplate> {
    this.itemTemplates.push(template)
    return template
  }
}
