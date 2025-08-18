// Database service interface - will be replaced with Prisma later
import {
  World,
  WorldState,
  Character,
  User,
  Message,
  ItemTemplate,
  Channel,
} from '@weave/types'

export interface DatabaseService {
  // World operations
  getWorlds(): Promise<World[]>
  getWorldById(id: string): Promise<World | null>
  createWorld(world: Omit<World, 'id'>): Promise<World>
  updateWorld(id: string, data: Partial<World>): Promise<World | null>
  deleteWorld(id: string): Promise<boolean>

  // WorldState operations
  getWorldStateById(id: string): Promise<WorldState | null>
  getWorldStatesByWorldId(worldId: string): Promise<WorldState[]>
  getWorldStateByChannelId(channelId: string): Promise<WorldState | null>
  createWorldState(worldState: Omit<WorldState, 'id'>): Promise<WorldState>
  updateWorldState(
    id: string,
    data: Partial<WorldState>
  ): Promise<WorldState | null>
  deleteWorldState(id: string): Promise<boolean>

  // Channel operations
  getChannelsByWorldId(worldId: string): Promise<Channel[]>
  getChannelById(channelId: string): Promise<Channel | null>
  getChannelByIdWithWorld(
    channelId: string
  ): Promise<{ channel: Channel; world: World } | null>

  // Character operations
  getCharactersByWorldId(worldId: string): Promise<Character[]>
  getCharacterById(id: string): Promise<Character | null>
  createCharacter(character: Omit<Character, 'id'>): Promise<Character>
  updateCharacter(
    id: string,
    data: Partial<Character>
  ): Promise<Character | null>
  deleteCharacter(id: string): Promise<boolean>

  // User operations
  getUsers(): Promise<User[]>
  getUserById(id: string): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  createUser(user: Omit<User, 'id'>): Promise<User>
  updateUser(id: string, data: Partial<User>): Promise<User | null>

  // Message operations
  getMessagesByChannelId(channelId: string, limit?: number): Promise<Message[]>
  createMessage(message: Omit<Message, 'id'>): Promise<Message>
  updateMessage(id: string, data: Partial<Message>): Promise<Message | null>
  deleteMessage(id: string): Promise<boolean>

  // Item Template operations
  getItemTemplates(): Promise<ItemTemplate[]>
  getItemTemplateByName(name: string): Promise<ItemTemplate | null>
  createItemTemplate(template: ItemTemplate): Promise<ItemTemplate>
}
