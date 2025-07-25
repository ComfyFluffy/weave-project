import type { World, Message } from '@weave/types'

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
}

export const apiService = new ApiService()
