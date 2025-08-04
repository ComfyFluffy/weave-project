type Id = string // Each type with an ID is going to have a table in the database

export interface User {
  id: Id
  username: string
  avatar?: string
}

export interface Channel {
  id: Id
  world_id: World['id']
  name: string
  type: 'announcement' | 'ooc' | 'ic'
  description?: string
  created_by?: User['id']
  created_at?: Date
  world_state_id: WorldState['id']
  messages?: Message['id'][]
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
  world_id: World['id']
  characters: Character[]
  key_events_log: Event[]
  character_states: Record<Character['id'], CharacterState>
  locations: Location[]
  plots: Plot[]
  lore: LoreEntry[]
  current_game_time: string // e.g., "1372年，夏末时节，傍晚"
  outline?: string // Optional outline of the world or campaign. Can be updated by the GM/LLM.
}

export interface Event {
  title: string
  type: 'story' | 'combat' | 'social' | 'exploration' | 'system'
  game_time: string // e.g., "1372年，夏末时节，傍晚"
  description: string
  participants: Character['id'][]
  locations: Location['name'][]
  consequences: string[]
  importance: 'low' | 'medium' | 'high' | 'critical'
}

export interface Location {
  name: string
  description: string
  connected_locations: string[]
  notable_features: string[]
  current_occupants: string[]
  hidden_secrets: string[]
  items: Item[] // IDs of items in this location
}

// TODO: Does this need to be an entry in the database?
export interface Item {
  name: string
  count: number
  description: string
  type: 'weapon' | 'armor' | 'consumable' | 'tool' | 'key_item' | 'misc'
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary'
  properties: string[]
}

export interface Plot {
  title: string
  description: string
  status: 'active' | 'completed' | 'paused'
  participants: Character['id'][]
  key_events: string[]
  next_steps: string[]
  importance: 'main' | 'side' | 'personal'
}

export interface LoreEntry {
  title: string
  content: string
  tags: string[]
  access_level: 'public' | 'gm_only' | 'player_discovered'
}

export interface Character {
  id: string
  name: string
  description: string
  is_npc: boolean
  avatar?: string
}

export interface CharacterState {
  current_location_name: string
  inventory: Item[]
  health: number
  mana: number
  attributes: Record<string, number> // e.g., strength, intelligence, etc.
  properties: Record<string, string> // Additional properties like skills, feats, etc.
  knowledge: string[]
  goals: string[]
  secrets: string[]
}

export interface Message {
  id: Id
  channel_id: Channel['id']
  user_id: User['id']
  character_id?: Character['id']
  type: 'character' | 'character-action' | 'system' | 'ai' | 'gm'
  content: string
  created_at: Date
  updated_at?: Date
  character_name?: string
}
