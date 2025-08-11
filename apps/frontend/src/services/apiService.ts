import type {
  World,
  WorldState,
  Message,
  Character,
  Channel,
  User,
  ItemTemplate,
} from '@weave/types'
import superjson from 'superjson'

const API_BASE_URL = 'http://localhost:3001/api'

type ParseMode = 'superjson' | 'json' | 'text' | 'none'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: HeadersInit
  query?: Record<string, string | number | boolean | undefined>
  parse?: ParseMode
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(`${API_BASE_URL}${path}`)
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) {
        url.searchParams.set(k, String(v))
      }
    }
  }
  return url.toString()
}

async function request<T = unknown>(path: string, opts: RequestOptions = {}) {
  const { method = 'GET', body, headers, query, parse = 'json' } = opts
  const url = buildUrl(path, query)
  const init: RequestInit = {
    method,
    headers: {
      ...(body != null ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body != null ? JSON.stringify(body) : undefined,
  }

  const res = await fetch(url, init)

  // No content case
  if (res.status === 204 || parse === 'none') return undefined as T

  const tryParse = async () => {
    try {
      if (parse === 'superjson') return superjson.deserialize(await res.json())
      if (parse === 'json') return (await res.json()) as T
      if (parse === 'text') return (await res.text()) as unknown as T
    } catch {
      // fallthrough to undefined
    }
    return undefined
  }

  if (!res.ok) {
    const parsed = await tryParse()
    const message =
      (parsed && (parsed as any).error) || `${res.status} ${res.statusText}`
    throw new Error(message)
  }

  return (await tryParse()) as T
}

class ApiService {
  // World endpoints
  fetchWorlds = async (): Promise<World[]> =>
    request('/worlds', { parse: 'superjson' })

  fetchWorld = async (worldId: string): Promise<World> =>
    request(`/worlds/${worldId}`, { parse: 'superjson' })

  createWorld = async (worldData: Omit<World, 'id'>): Promise<World> =>
    request('/worlds', { method: 'POST', body: worldData, parse: 'superjson' })

  updateWorld = async (worldId: string, data: Partial<World>): Promise<World> =>
    request(`/worlds/${worldId}`, {
      method: 'PUT',
      body: data,
      parse: 'superjson',
    })

  deleteWorld = async (worldId: string): Promise<void> => {
    await request(`/worlds/${worldId}`, { method: 'DELETE', parse: 'none' })
  }

  // World State endpoints
  fetchWorldState = async (worldStateId: string): Promise<WorldState> =>
    request(`/world-states/${worldStateId}`, { parse: 'superjson' })

  fetchWorldStatesByWorldId = async (worldId: string): Promise<WorldState[]> =>
    request(`/world-states/by-world/${worldId}`, { parse: 'superjson' })

  async createWorldState(
    worldStateData: Omit<WorldState, 'id'>
  ): Promise<WorldState> {
    return request(`/world-states`, {
      method: 'POST',
      body: worldStateData,
      parse: 'superjson',
    })
  }

  async updateWorldState(
    worldStateId: string,
    data: Partial<WorldState>
  ): Promise<WorldState> {
    return request(`/world-states/${worldStateId}`, {
      method: 'PUT',
      body: data,
      parse: 'superjson',
    })
  }

  // Character endpoints
  fetchCharactersByWorldId = async (worldId: string): Promise<Character[]> =>
    request(`/characters/by-world/${worldId}`, { parse: 'json' })

  fetchCharacter = async (characterId: string): Promise<Character> =>
    request(`/characters/${characterId}`, { parse: 'json' })

  async createCharacter(
    characterData: Omit<Character, 'id'>
  ): Promise<Character> {
    return request(`/characters`, {
      method: 'POST',
      body: characterData,
      parse: 'json',
    })
  }

  async updateCharacter(
    characterId: string,
    data: Partial<Character>
  ): Promise<Character> {
    return request(`/characters/${characterId}`, {
      method: 'PUT',
      body: data,
      parse: 'json',
    })
  }

  deleteCharacter = async (characterId: string): Promise<void> => {
    await request(`/characters/${characterId}`, {
      method: 'DELETE',
      parse: 'none',
    })
  }

  // Message endpoints
  async fetchChannelMessages(
    channelId: string,
    limit?: number
  ): Promise<Message[]> {
    return request(`/messages/channel/${channelId}`, {
      parse: 'json',
      query: limit ? { limit } : undefined,
    })
  }

  createMessage = async (messageData: Omit<Message, 'id'>): Promise<Message> =>
    request(`/messages`, { method: 'POST', body: messageData, parse: 'json' })

  async updateMessage(
    messageId: string,
    data: Partial<Message>
  ): Promise<Message> {
    return request(`/messages/${messageId}`, {
      method: 'PUT',
      body: data,
      parse: 'json',
    })
  }

  deleteMessage = async (messageId: string): Promise<void> => {
    await request(`/messages/${messageId}`, { method: 'DELETE', parse: 'none' })
  }

  // User endpoints
  async fetchUsers(): Promise<User[]> {
    return request('/users', { parse: 'json' })
  }

  fetchUser = async (userId: string): Promise<User> =>
    request(`/users/${userId}`, { parse: 'json' })

  createUser = async (userData: Omit<User, 'id'>): Promise<User> =>
    request(`/users`, { method: 'POST', body: userData, parse: 'json' })

  updateUser = async (userId: string, data: Partial<User>): Promise<User> =>
    request(`/users/${userId}`, { method: 'PUT', body: data, parse: 'json' })

  // Item Template endpoints
  async fetchItemTemplates(): Promise<ItemTemplate[]> {
    return request(`/items/templates`, { parse: 'json' })
  }

  fetchItemTemplate = async (name: string): Promise<ItemTemplate> =>
    request(`/items/templates/${encodeURIComponent(name)}`, { parse: 'json' })

  createItemTemplate = async (
    template: ItemTemplate
  ): Promise<ItemTemplate> => {
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
    return request(`/worlds/${worldId}/channels/${channelId}`, {
      parse: 'superjson',
    })
  }

  // Legacy channel methods for backward compatibility
  getChannels = async (worldId: string): Promise<Channel[]> => {
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

  deleteChannel = async (worldId: string, channelId: string): Promise<void> => {
    // This would need to be implemented on the backend to remove channels from worlds
    throw new Error(
      'Delete channel not implemented in new backend architecture'
    )
  }

  // Legacy compatibility methods (can be removed once frontend is fully updated)
  fetchWorldCharacters = async (worldId: string): Promise<Character[]> => {
    return this.fetchCharactersByWorldId(worldId)
  }
}

export const apiService = new ApiService()
