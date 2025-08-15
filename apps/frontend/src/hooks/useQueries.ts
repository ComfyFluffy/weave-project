import { tsr } from '../services/tsr'

// Worlds list query
export function useWorlds() {
  return tsr.world.getWorlds.useQuery({
    queryKey: ['worlds'],
  })
}

// Single world query
export function useWorld(worldId: string) {
  return tsr.world.getWorldById.useQuery({
    queryKey: ['world', worldId],
    queryData: {
      params: {
        worldId,
      },
    },
  })
}

// World states query
export function useWorldState(worldStateId: string) {
  return tsr.worldState.getWorldStateById.useQuery({
    queryKey: ['worldState', worldStateId],
    queryData: {
      params: {
        worldStateId,
      },
    },
  })
}

// Channel messages query
export const useChannelMessages = (channelId: string) => {
  return tsr.message.getMessagesByChannelId.useQuery({
    queryKey: ['channelMessages', channelId],
    queryData: {
      params: {
        channelId,
      },
    },
  })
}

// Character management hooks - now world-based
export const useWorldCharacters = (worldId: string) => {
  return tsr.character.getCharactersByWorldId.useQuery({
    queryKey: ['worldCharacters', worldId],
    queryData: {
      params: {
        id: worldId,
      },
    },
  })
}
