import type { World, Message, PlayerCharacter } from '@weave/types'

const API_BASE_URL = 'http://localhost:3001/api'

class ApiService {
  async fetchWorlds(): Promise<
    Array<{
      id: string
      name: string
      avatar: string
      hasNotification: boolean
    }>
  > {
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

  async fetchChannelMessages(channelId: string): Promise<Message[]> {
    const response = await fetch(
      `${API_BASE_URL}/channels/${channelId}/messages`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch messages')
    }
    return response.json()
  }

  // Character management - now world-based
  async fetchWorldCharacters(worldId: string): Promise<PlayerCharacter[]> {
    const response = await fetch(`${API_BASE_URL}/worlds/${worldId}/characters`)
    if (!response.ok) {
      throw new Error('Failed to fetch world characters')
    }
    return response.json()
  }

  async createCharacter(
    worldId: string,
    character: Omit<PlayerCharacter, 'id'>
  ): Promise<PlayerCharacter> {
    const response = await fetch(
      `${API_BASE_URL}/worlds/${worldId}/characters`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(character),
      }
    )
    if (!response.ok) {
      throw new Error('Failed to create character')
    }
    return response.json()
  }

  async selectCharacter(
    worldId: string,
    socketId: string,
    characterId: string
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/worlds/${worldId}/members/${socketId}/character`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ characterId }),
      }
    )
    if (!response.ok) {
      throw new Error('Failed to select character')
    }
  }
}

export const apiService = new ApiService()
