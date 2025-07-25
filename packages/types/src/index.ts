export interface WorldState {
  world_info: {
    name: string
    description: string
  }
  characters: Record<string, PlayerCharacter>
  key_events_log: string[]
  npc_status: Record<string, string>
}

export interface PlayerCharacter {
  id: string
  name: string
  class: string
  hp: number
  maxHp: number
  location: string
  inventory: string[]
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
  type: 'announcement' | 'rules' | 'character-creation' | 'ooc' | 'ic'
  description?: string
  readonly?: boolean
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
