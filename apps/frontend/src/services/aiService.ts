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

/**
 * Request AI suggestions for the narrator
 */
export async function getNarratorSuggestions(
  worldId: string,
  channelId: string,
  customInstruction?: string
): Promise<AISuggestionResponse> {
  const response = await fetch(`${API_BASE_URL}/ai/narrator-suggestions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      worldId,
      channelId,
      customInstruction,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to get AI suggestions')
  }

  return response.json()
}

/**
 * Request AI suggestions for player actions
 */
export async function getPlayerSuggestions(
  worldId: string,
  channelId: string,
  characterName?: string,
  customInstruction?: string
): Promise<AISuggestionResponse> {
  const response = await fetch(`${API_BASE_URL}/ai/player-suggestions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      worldId,
      channelId,
      characterName,
      customInstruction,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to get player suggestions')
  }

  return response.json()
}

/**
 * Request AI-generated NPC dialogue
 */
export async function getNPCDialogue(
  worldId: string,
  channelId: string,
  npcName: string,
  playerMessage: string
): Promise<NPCDialogueResponse> {
  const response = await fetch(`${API_BASE_URL}/ai/npc-dialogue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      worldId,
      channelId,
      npcName,
      playerMessage,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to get NPC dialogue')
  }

  return response.json()
}
