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
        id: worldId,
      },
    },
  })
}

// World states query
export function useWorldStates(worldId: string) {
  return tsr.worldState.getWorldStateByWorldId.useQuery({
    queryKey: ['worldState', worldId],
    queryData: {
      params: {
        worldId: worldId,
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
        channelId: channelId,
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
