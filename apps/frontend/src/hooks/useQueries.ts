import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { apiService } from '../services/apiService'
import type { World, Message } from '@weave/types'

// Query keys
export const queryKeys = {
  worlds: ['worlds'] as const,
  world: (worldId: string) => ['world', worldId] as const,
  channelMessages: (channelId: string) =>
    ['channelMessages', channelId] as const,
  worldCharacters: (worldId: string) => ['worldCharacters', worldId] as const,
}

// Worlds list query
export function useWorlds() {
  return useQuery({
    queryKey: queryKeys.worlds,
    queryFn: apiService.fetchWorlds,
  })
}

// Single world query
export function useWorld(worldId: string | null) {
  return useQuery({
    queryKey: queryKeys.world(worldId || ''),
    queryFn: () => apiService.fetchWorld(worldId!),
    enabled: !!worldId,
  })
}

// Channel messages query
export const useChannelMessages = (channelId: string) => {
  return useQuery({
    queryKey: ['channelMessages', channelId],
    queryFn: () => apiService.fetchChannelMessages(channelId),
    enabled: !!channelId, // Only fetch if channelId is provided
    staleTime: 30000, // Consider data stale after 30 seconds
    gcTime: 300000, // Keep in cache for 5 minutes
  })
}

// Character management hooks - now world-based
export const useWorldCharacters = (worldId: string) => {
  return useQuery({
    queryKey: queryKeys.worldCharacters(worldId),
    queryFn: () => apiService.fetchWorldCharacters(worldId),
    enabled: !!worldId,
    staleTime: 60000, // Characters update less frequently
  })
}

export const useCreateCharacter = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      worldId,
      character,
    }: {
      worldId: string
      character: Parameters<typeof apiService.createCharacter>[1]
    }) => apiService.createCharacter(worldId, character),
    onSuccess: (_, { worldId }) => {
      // Invalidate and refetch world characters
      queryClient.invalidateQueries({
        queryKey: queryKeys.worldCharacters(worldId),
      })
      // Also invalidate world data to update member list and world state
      queryClient.invalidateQueries({ queryKey: queryKeys.world(worldId) })
    },
  })
}

export const useSelectCharacter = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      worldId,
      socketId,
      characterId,
    }: {
      worldId: string
      socketId: string
      characterId: string
    }) => apiService.selectCharacter(worldId, socketId, characterId),
    onSuccess: (_, { worldId }) => {
      // Invalidate world data to update member list with selected character
      queryClient.invalidateQueries({ queryKey: queryKeys.world(worldId) })
    },
  })
}

// Hook to update queries when socket events occur
export function useQueryUpdates() {
  const queryClient = useQueryClient()

  const updateWorldData = (world: World) => {
    queryClient.setQueryData(queryKeys.world(world.id), world)
  }

  const updateChannelMessages = (channelId: string, messages: Message[]) => {
    queryClient.setQueryData(queryKeys.channelMessages(channelId), messages)
  }

  const addNewMessage = (message: Message) => {
    queryClient.setQueryData(
      queryKeys.channelMessages(message.channelId),
      (oldMessages: Message[] | undefined) => {
        if (!oldMessages) return [message]
        return [...oldMessages, message]
      }
    )
  }

  const invalidateWorldData = (worldId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.world(worldId) })
  }

  const invalidateChannelMessages = (channelId: string) => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.channelMessages(channelId),
    })
  }

  return {
    updateWorldData,
    updateChannelMessages,
    addNewMessage,
    invalidateWorldData,
    invalidateChannelMessages,
  }
}
