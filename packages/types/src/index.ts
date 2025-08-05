type Id = string // Each type with an ID is going to have a table in the database

export interface User {
  id: Id
  username: string
  avatar?: string
}

export interface Channel {
  id: Id
  worldId: World['id']
  name: string
  type: 'announcement' | 'ooc' | 'ic'
  description?: string
  createdBy?: User['id']
  createdAt?: Date
  worldStateId: WorldState['id']
  // messages?: Message['id'][] // Channel owns messages.
}

export interface World {
  id: Id
  name: string
  description: string
  tags: string[]
  rules?: string
  channels: Channel[]
}

// A potentially large object representing the state of the world. Can be bound to a specific world and multiple channels.
// Stored directly in the database as a JSON object.
export interface WorldState {
  id: Id
  worldId: World['id']
  characters: Character[]
  keyEventsLog: Event[]
  characterStates: Record<Character['id'], CharacterState>
  locations: Location[]
  items: Record<Item['key'], Item> // Changed from name to id
  itemTemplates?: ItemTemplate[] // Optional templates
  plots: Plot[]
  lore: Lore[]
  currentGameTime: string // e.g., "1372年，夏末时节，傍晚"
  outline?: string // Optional outline of the world or campaign. Can be updated by the GM/LLM.
}

export interface Event {
  title: string
  type: string // e.g., 'story', 'combat', 'social', 'exploration', 'system'
  gameTime: string // e.g., "1372年，夏末时节，傍晚"
  description: string
  participants: Character['id'][]
  locations: Location['name'][]
  consequences: string[]
  importance: 'low' | 'medium' | 'high' | 'critical'
}

export interface Location {
  name: string
  description: string
  connectedLocations: string[]
  notableFeatures: string[]
  currentOccupants: string[]
  hiddenSecrets: string[]
  items: Item['key'][] // Changed from name to key
}

// TODO: Does this need to be an entry in the database?
export type Item = {
  key: string // Unique identifier for each item instance
  count?: number // Optional: for consumables or stackable items
  templateName?: ItemTemplate['name'] // Optional: reference to item template for common items
} & Partial<ItemTemplate> // Optional: can include properties from the template

export interface ItemTemplate {
  name: string
  description: string
  type: 'weapon' | 'armor' | 'consumable' | 'tool' | 'key-item' | 'misc'
  rarity: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary'
  properties: Record<string, string> // Default properties for this item type
  stats: Record<string, number>
}

export interface Plot {
  title: string
  description: string
  status: 'active' | 'completed' | 'paused'
  participants: Character['id'][]
  keyEvents: string[]
  nextSteps: string[]
  importance: 'main' | 'side' | 'personal'
}

export interface Lore {
  title: string
  content: string
  accessLevel: 'public' | 'gm-only' | 'player-discovered'
}

export interface Character {
  id: string
  name: string
  description: string
  isNpc: boolean
  avatar?: string
}

export type StatValue = {
  current: number
  max?: number // Optional max value for stats like health, mana, etc.
}

export interface CharacterState {
  currentLocationName: string
  inventory: Item['key'][] // Changed to reference item keys instead of full objects
  stats: Record<string, StatValue> // e.g., health, mana
  attributes: Record<string, number> // e.g., strength, intelligence, etc.
  properties: Record<string, string> // Additional properties like skills, feats, etc.
  knowledge: Record<string, string[]> // e.g., spells known, languages spoken
  goals: Record<string, string[]> // e.g., character goals, quests
  secrets: Record<string, string[]> // e.g., hidden knowledge, personal secrets
  discoveredLores: Lore['title'][] // Titles of discovered lore entries
}

export interface Message {
  id: Id
  channelId: Channel['id']
  userId?: User['id']
  characterId?: Character['id']
  type: 'character' | 'character-action' | 'system' | 'ai' | 'gm'
  content: string
  createdAt: Date
  updatedAt?: Date
  characterName?: string
}
