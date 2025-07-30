import { useChat } from '@ai-sdk/react'

const API_BASE_URL = 'http://localhost:3001/api'

export interface AISuggestionResponse {
  success: boolean
  suggestions: string[]
  reasoning?: string
  characterName?: string | null
  timestamp: string
}

export interface NPCDialogueResponse {
  success: boolean
  dialogue: string
  npcName: string
  timestamp: string
}

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
