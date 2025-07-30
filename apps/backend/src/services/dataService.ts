import { worlds, messages } from '../mock'
import { WorldState } from '@weave/types'

export async function getWorldState(
  worldId: string
): Promise<WorldState | null> {
  const world = worlds.find((w) => w.id === worldId)
  return world?.state || null
}

export async function getChannelMessages(
  channelId: string,
  limit: number = 20
) {
  const channelMessages = messages[channelId] || []
  return channelMessages
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, limit)
    .reverse()
}
