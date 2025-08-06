import type {
  World,
  WorldState,
  Message,
  Character,
  Channel,
  User,
  ItemTemplate,
} from '@weave/types'

const API_BASE_URL = 'http://localhost:3001/api'

class ApiService {
  // World endpoints
  async fetchWorlds(): Promise<World[]> {
    const response = await fetch(`${API_BASE_URL}/worlds`)
    if (!response.ok) {
      throw new Error('Failed to fetch worlds')
    }
    return response.json()
  }

  async fetchWorld(worldId: string): Promise<World> {
    const response = await fetch(`${API_BASE_URL}/worlds/${worldId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch world')
    }
    return response.json()
  }

  async createWorld(worldData: Omit<World, 'id'>): Promise<World> {
    const response = await fetch(`${API_BASE_URL}/worlds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(worldData),
    })
    if (!response.ok) throw new Error('Failed to create world')
    return response.json()
  }

  async updateWorld(worldId: string, data: Partial<World>): Promise<World> {
    const response = await fetch(`${API_BASE_URL}/worlds/${worldId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update world')
    return response.json()
  }

  async deleteWorld(worldId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/worlds/${worldId}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete world')
  }

  // World State endpoints
  async fetchWorldState(worldStateId: string): Promise<WorldState> {
    const response = await fetch(`${API_BASE_URL}/world-states/${worldStateId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch world state')
    }
    return response.json()
  }

  async fetchWorldStatesByWorldId(worldId: string): Promise<WorldState[]> {
    const response = await fetch(
      `${API_BASE_URL}/world-states/by-world/${worldId}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch world states')
    }
    return response.json()
  }

  async createWorldState(
    worldStateData: Omit<WorldState, 'id'>
  ): Promise<WorldState> {
    const response = await fetch(`${API_BASE_URL}/world-states`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(worldStateData),
    })
    if (!response.ok) throw new Error('Failed to create world state')
    return response.json()
  }

  async updateWorldState(
    worldStateId: string,
    data: Partial<WorldState>
  ): Promise<WorldState> {
    const response = await fetch(
      `${API_BASE_URL}/world-states/${worldStateId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    if (!response.ok) throw new Error('Failed to update world state')
    return response.json()
  }

  // Character endpoints
  async fetchCharactersByWorldId(worldId: string): Promise<Character[]> {
    const response = await fetch(
      `${API_BASE_URL}/characters/by-world/${worldId}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch characters')
    }
    return response.json()
  }

  async fetchCharacter(characterId: string): Promise<Character> {
    const response = await fetch(`${API_BASE_URL}/characters/${characterId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch character')
    }
    return response.json()
  }

  async createCharacter(
    characterData: Omit<Character, 'id'>
  ): Promise<Character> {
    const response = await fetch(`${API_BASE_URL}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(characterData),
    })
    if (!response.ok) throw new Error('Failed to create character')
    return response.json()
  }

  async updateCharacter(
    characterId: string,
    data: Partial<Character>
  ): Promise<Character> {
    const response = await fetch(`${API_BASE_URL}/characters/${characterId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update character')
    return response.json()
  }

  async deleteCharacter(characterId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/characters/${characterId}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete character')
  }

  // Message endpoints
  async fetchChannelMessages(
    channelId: string,
    limit?: number
  ): Promise<Message[]> {
    const url = new URL(`${API_BASE_URL}/messages/channel/${channelId}`)
    if (limit) url.searchParams.set('limit', limit.toString())

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error('Failed to fetch messages')
    }
    return response.json()
  }

  async createMessage(messageData: Omit<Message, 'id'>): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData),
    })
    if (!response.ok) throw new Error('Failed to create message')
    return response.json()
  }

  async updateMessage(
    messageId: string,
    data: Partial<Message>
  ): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update message')
    return response.json()
  }

  async deleteMessage(messageId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete message')
  }

  // User endpoints
  async fetchUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`)
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }
    return response.json()
  }

  async fetchUser(userId: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }
    return response.json()
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
    if (!response.ok) throw new Error('Failed to create user')
    return response.json()
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update user')
    return response.json()
  }

  // Item Template endpoints
  async fetchItemTemplates(): Promise<ItemTemplate[]> {
    const response = await fetch(`${API_BASE_URL}/items/templates`)
    if (!response.ok) {
      throw new Error('Failed to fetch item templates')
    }
    return response.json()
  }

  async fetchItemTemplate(name: string): Promise<ItemTemplate> {
    const response = await fetch(
      `${API_BASE_URL}/items/templates/${encodeURIComponent(name)}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch item template')
    }
    return response.json()
  }

  async createItemTemplate(template: ItemTemplate): Promise<ItemTemplate> {
    const response = await fetch(`${API_BASE_URL}/items/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template),
    })
    if (!response.ok) throw new Error('Failed to create item template')
    return response.json()
  }

  // Channel endpoints (for channel data within worlds)
  async getChannelInfo(
    worldId: string,
    channelId: string
  ): Promise<{ channel: Channel; world: World }> {
    const response = await fetch(
      `${API_BASE_URL}/worlds/${worldId}/channels/${channelId}`
    )
    if (!response.ok) throw new Error('Failed to fetch channel info')
    return response.json()
  }

  // Legacy channel methods for backward compatibility
  async getChannels(worldId: string): Promise<Channel[]> {
    const world = await this.fetchWorld(worldId)
    return world.channels
  }

  async createChannel(
    worldId: string,
    data: { name: string; type?: string; description?: string }
  ): Promise<Channel> {
    // This would need to be implemented on the backend to add channels to worlds
    throw new Error(
      'Create channel not implemented in new backend architecture'
    )
  }

  async deleteChannel(worldId: string, channelId: string): Promise<void> {
    // This would need to be implemented on the backend to remove channels from worlds
    throw new Error(
      'Delete channel not implemented in new backend architecture'
    )
  }

  // Legacy compatibility methods (can be removed once frontend is fully updated)
  async fetchWorldCharacters(worldId: string): Promise<Character[]> {
    return this.fetchCharactersByWorldId(worldId)
  }
}

export const apiService = new ApiService()
