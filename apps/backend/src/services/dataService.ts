import { worlds, messages, worldState } from '../mock'
import { WorldState } from '@weave/types'

export async function getWorldState(
  worldId: string
): Promise<WorldState | null> {
  // For now, we have a single world state
  // In a real database, this would query based on worldId
  if (worldId === '1') {
    return worldState
  }
  return null
}

export async function getChannelMessages(
  channelId: string,
  limit: number = 20
) {
  const channelMessages = messages[channelId] || []
  return channelMessages
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, limit)
    .reverse()
}
