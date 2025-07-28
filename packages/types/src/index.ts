// World State Management Types
export interface WorldState {
  world_info: {
    name: string
    description: string
    genre: string
    themes: string[]
    current_time: string
    weather?: string
  }
  characters: Record<string, PlayerCharacter>
  key_events_log: TimelineEvent[]
  npc_status: Record<string, NPCState>
  locations: Record<string, Location>
  items: Record<string, Item>
  active_plots: Plot[]
  rules: Rule[]
  lore: LoreEntry[]
}

export interface TimelineEvent {
  id: string
  timestamp: Date
  type: 'story' | 'combat' | 'social' | 'exploration' | 'system'
  title: string
  description: string
  participants: string[]
  location: string
  consequences: string[]
  importance: 'low' | 'medium' | 'high' | 'critical'
}

export interface NPCState {
  id: string
  name: string
  description: string
  current_location: string
  personality_traits: string[]
  relationships: Record<string, Relationship>
  knowledge: string[]
  goals: string[]
  secrets: string[]
  last_interaction: Date
  disposition: 'hostile' | 'unfriendly' | 'neutral' | 'friendly' | 'allied'
}

export interface Relationship {
  type:
    | 'family'
    | 'friend'
    | 'rival'
    | 'enemy'
    | 'romantic'
    | 'professional'
    | 'acquaintance'
  strength: number // -100 to 100
  history: string[]
  last_updated: Date
}

export interface Location {
  id: string
  name: string
  description: string
  type: 'town' | 'dungeon' | 'wilderness' | 'building' | 'other'
  connected_locations: string[]
  notable_features: string[]
  current_occupants: string[]
  hidden_secrets: string[]
  danger_level: number
}

export interface Item {
  id: string
  name: string
  description: string
  type: 'weapon' | 'armor' | 'consumable' | 'tool' | 'treasure' | 'key_item'
  properties: Record<string, unknown>
  location: string // where it currently is
  owner?: string // which character owns it
}

export interface Plot {
  id: string
  title: string
  description: string
  status: 'active' | 'completed' | 'failed' | 'paused'
  participants: string[]
  key_events: string[]
  next_steps: string[]
  deadline?: Date
  importance: 'main' | 'side' | 'personal'
}

export interface Rule {
  id: string
  name: string
  description: string
  category: 'combat' | 'social' | 'magic' | 'skill' | 'general'
  conditions: string[]
  effects: string[]
  examples: string[]
}

export interface LoreEntry {
  id: string
  title: string
  content: string
  category:
    | 'history'
    | 'geography'
    | 'culture'
    | 'religion'
    | 'magic'
    | 'politics'
  tags: string[]
  related_entries: string[]
  access_level: 'public' | 'gm_only' | 'player_discovered'
}

export interface PlayerCharacter {
  id: string
  name: string
  class: string
  hp: number
  maxHp: number
  location: string
  inventory: string[]
  relationships: Record<string, Relationship>
  personal_goals: string[]
  known_lore: string[] // IDs of lore entries this character knows
  secrets: string[]
}

export interface World {
  id: string
  name: string
  description: string
  channels: Channel[]
  members: WorldMember[]
  state: WorldState
}

export interface Channel {
  id: string
  name: string
  type: 'announcement' | 'rules' | 'ooc' | 'ic'
  description?: string
  readonly?: boolean
  createdBy?: string
  createdAt?: Date
}

export interface WorldMember {
  id: string // socket ID
  username: string
  character?: PlayerCharacter
  role: 'player' | 'gm' | 'spectator'
  isOnline: boolean
}

export interface Message {
  id: string
  channelId: string
  worldId: string
  authorId: string
  authorName: string
  content: string
  timestamp: Date
  type: 'user' | 'system' | 'ai' | 'action'
  characterName?: string
}

export interface User {
  id: string
  username: string
  avatar?: string
}
