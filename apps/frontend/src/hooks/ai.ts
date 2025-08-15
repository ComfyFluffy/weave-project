import { useChat } from '@ai-sdk/react'

const API_BASE_URL = 'http://localhost:3001/api'

export const useWorldChat = (
  worldId: string,
  channelId: string,
  selectedCharacterId?: string,
  selectedRole?: string
) =>
  useChat({
    api: `${API_BASE_URL}/ai/chat`,
    body: {
      worldId,
      channelId,
      characterId: selectedCharacterId,
      role: selectedRole,
    },
  })
