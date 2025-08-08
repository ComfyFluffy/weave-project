import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '../services/apiService'

export const useChannels = (worldId: string) => {
  return useQuery({
    queryKey: ['channels', worldId],
    queryFn: () => apiService.getChannels(worldId),
    enabled: !!worldId,
  })
}

export const useCreateChannel = (worldId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string; type?: string; description?: string }) =>
      apiService.createChannel(worldId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['channels', worldId] })
    },
  })
}

export const useDeleteChannel = (worldId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (channelId: string) =>
      apiService.deleteChannel(worldId, channelId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['channels', worldId] })
    },
  })
}
