import { tsr } from '../services/tsr'

// Worlds list query
export function useWorlds() {
  return tsr.world.getWorlds.useQuery({
    queryKey: ['worlds'],
  })
}

// Single world query
export function useWorld(worldId: string | null) {
  return tsr.world.getWorldById.useQuery({
    queryKey: ['world', worldId],
    queryData: {
      params: {
        worldId: worldId!,
      },
    },
    enabled: !!worldId,
  })
}

// Channels by world query
export function useChannelsByWorld(worldId: string | null) {
  return tsr.channel.getChannelsByWorldId.useQuery({
    queryKey: ['channels', worldId],
    queryData: {
      params: {
        worldId: worldId!,
      },
    },
    enabled: !!worldId,
  })
}

// World state by channel query
export function useWorldStateByChannel(channelId: string | null) {
  return tsr.worldState.getWorldStateByChannelId.useQuery({
    queryKey: ['worldStateByChannel', channelId],
    queryData: {
      params: {
        channelId: channelId!,
      },
    },
    enabled: !!channelId,
  })
}

// World states query (legacy - kept for backward compatibility)
export function useWorldState(worldStateId: string | null) {
  return tsr.worldState.getWorldStateById.useQuery({
    queryKey: ['worldState', worldStateId],
    queryData: {
      params: {
        worldStateId: worldStateId!,
      },
    },
    enabled: !!worldStateId,
  })
}

// Channel messages query
export const useChannelMessages = (channelId: string | null) => {
  return tsr.message.getMessagesByChannelId.useQuery({
    queryKey: ['channelMessages', channelId],
    queryData: {
      params: {
        channelId: channelId!,
      },
    },
    enabled: !!channelId,
  })
}

// Character management hooks - now world-based
export const useWorldCharacters = (worldId: string | null) => {
  return tsr.character.getCharactersByWorldId.useQuery({
    queryKey: ['worldCharacters', worldId],
    queryData: {
      params: {
        id: worldId!,
      },
    },
    enabled: !!worldId,
  })
}
