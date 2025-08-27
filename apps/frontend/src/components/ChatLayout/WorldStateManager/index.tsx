import { useState, useCallback, useEffect } from 'react'
import { Box, Text, VStack, HStack, Tabs } from '@chakra-ui/react'
import { produce } from 'immer'
import { useQueryClient } from '@tanstack/react-query'
import { WorldStateOverview } from './WorldStateOverview'
import { CharacterPanel } from './CharacterPanel'
import { LocationsPanel } from './LocationsPanel'
import { PlotsPanel } from './PlotsPanel'
import { ItemPanel } from './ItemPanel'
import { useWorldState, useUpdateWorldState } from '../../../hooks/queries'
import { socketService } from '../../../services/socket'
import type { WorldState, Location, Plot, Character, Item } from '@weave/types'

interface WorldStateManagerProps {
  worldStateId: string
}

export function WorldStateManager({ worldStateId }: WorldStateManagerProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const queryClient = useQueryClient()

  // Single hook for worldState data
  const {
    data: worldStateResponse,
    isLoading: loading,
    error,
  } = useWorldState(worldStateId)

  const worldState = worldStateResponse?.body?.worldState

  // Mutation for updating worldState
  const updateWorldStateMutation = useUpdateWorldState()

  // Set up socket listeners for real-time updates
  useEffect(() => {
    // Listen for world state updates
    const unsubscribeWorldState = socketService.onWorldStateUpdated((data) => {
      if (data.worldStateId === worldStateId) {
        // Invalidate the query to trigger a refetch
        // This ensures we have the latest data from the server
        void queryClient.invalidateQueries({
          queryKey: ['worldState', worldStateId],
        })
      }
    })

    // Listen for character updates
    const unsubscribeCharacters = socketService.onCharactersUpdated((data) => {
      if (data.worldStateId === worldStateId) {
        // Invalidate the query to trigger a refetch
        // This ensures we have the latest character data from the server
        void queryClient.invalidateQueries({
          queryKey: ['worldState', worldStateId],
        })

        // Also invalidate character-related queries
        void queryClient.invalidateQueries({
          queryKey: ['allCharacters'],
        })
        void queryClient.invalidateQueries({
          queryKey: ['myCharacters'],
        })
        void queryClient.invalidateQueries({
          queryKey: ['worldStateCharacters', worldStateId],
        })

        // Get all channels that might be using this world state
        // This is a bit of a hack, but we need to invalidate all channel character queries
        // that might be affected by this update
        void queryClient.invalidateQueries({
          queryKey: ['channelCharacters'],
          type: 'active',
        })
      }
    })

    // Clean up listeners on unmount
    return () => {
      unsubscribeWorldState()
      unsubscribeCharacters()
    }
  }, [worldStateId, queryClient])

  // Single update handler using immer for immutable updates
  // 采用乐观更新策略，避免数据更新时的闪烁问题
  const updateWorldState = useCallback(
    async (updater: (draft: WorldState) => void) => {
      // 使用函数式获取最新的 worldState，避免闭包问题
      const response = queryClient.getQueryData(['worldState', worldStateId])
      const currentWorldState = (response as any)?.body?.worldState
      if (!currentWorldState) return

      const updatedWorldState = produce(worldState, updater)

      await queryClient.cancelQueries({
        queryKey: ['worldState', worldStateId],
      })

      // 强制触发重新渲染，确保UI立即更新
      queryClient.setQueryData(['worldState', worldStateId], (oldData: any) => {
        if (!oldData) return { body: { worldState: updatedWorldState } }
        return { body: { worldState: updatedWorldState } }
      })

      // 后台同步到服务器，不等待结果
      updateWorldStateMutation.mutate(
        {
          params: { worldStateId },
          body: { worldState: updatedWorldState } as any,
        },
        {
          onSuccess: () => {
            // 成功后不刷新，保持本地数据
            // 只在必要时才与服务器同步
          },
          onError: (error) => {
            console.error('Failed to update world state:', error)
            // 出错时恢复原始数据
            queryClient.setQueryData(['worldState', worldStateId], {
              body: { worldState: currentWorldState },
            })
          },
        }
      )
    },
    [worldStateId, updateWorldStateMutation, queryClient]
  )

  // Simplified handlers using the single update function
  const handleStatUpdate = useCallback(
    (characterId: string, statName: string, newValue: number) => {
      void updateWorldState((draft) => {
        // 确保 characterStates 和 stats 对象存在
        if (!draft.state.characterStates) {
          draft.state.characterStates = {}
        }
        if (!draft.state.characterStates[characterId]) {
          draft.state.characterStates[characterId] = {
            currentLocationName: '',
            inventory: [],
            stats: {},
            attributes: {},
            properties: {},
            knowledge: {},
            goals: {},
            secrets: {},
            discoveredLores: [],
          }
        }
        if (!draft.state.characterStates[characterId].stats) {
          draft.state.characterStates[characterId].stats = {}
        }

        // 更新状态值
        draft.state.characterStates[characterId].stats[statName] = {
          current: newValue,
          max:
            draft.state.characterStates[characterId].stats[statName]?.max ||
            100,
        }
      })
    },
    [updateWorldState]
  )

  const handleWorldStateMetadataUpdate = useCallback(
    (metadata: { currentGameTime?: string; outline?: string }) => {
      void updateWorldState((draft) => {
        if (metadata.currentGameTime !== undefined) {
          draft.state.currentGameTime = metadata.currentGameTime
        }
        if (metadata.outline !== undefined) {
          draft.state.outline = metadata.outline
        }
      })
    },
    [updateWorldState]
  )

  const handleLocationUpdate = useCallback(
    (locationName: string, updates: Partial<Location>) => {
      void updateWorldState((draft) => {
        const locationIndex = draft.state.locations.findIndex(
          (loc) => loc.name === locationName
        )
        if (locationIndex !== -1) {
          Object.assign(draft.state.locations[locationIndex], updates)
        }
      })
    },
    [updateWorldState]
  )

  const handleAddLocation = useCallback(
    (newLocation: Location) => {
      void updateWorldState((draft) => {
        // Check if location with the same name already exists
        const existingLocationIndex = draft.state.locations.findIndex(
          (loc) => loc.name === newLocation.name
        )
        if (existingLocationIndex === -1) {
          draft.state.locations.push(newLocation)
        }
      })
    },
    [updateWorldState]
  )

  const handleDeleteLocation = useCallback(
    (locationName: string) => {
      void updateWorldState((draft) => {
        // Remove the location
        draft.state.locations = draft.state.locations.filter(
          (loc) => loc.name !== locationName
        )
        
        // Remove any references to this location in connectedLocations
        draft.state.locations.forEach((location) => {
          if (location.connectedLocations) {
            location.connectedLocations = location.connectedLocations.filter(
              (loc) => loc !== locationName
            )
          }
        })
        
        // Update any characters that were in this location
        Object.values(draft.state.characterStates).forEach((characterState) => {
          if (characterState.currentLocationName === locationName) {
            characterState.currentLocationName = ''
          }
        })
      })
    },
    [updateWorldState]
  )

  const handleAddPlot = useCallback(
    (newPlot: Plot) => {
      void updateWorldState((draft) => {
        // Check if plot with the same title already exists
        const existingPlotIndex = draft.state.plots.findIndex(
          (plot) => plot.title.toLowerCase() === newPlot.title.toLowerCase()
        )
        if (existingPlotIndex === -1) {
          draft.state.plots.push(newPlot)
        }
      })
    },
    [updateWorldState]
  )

  const handleDeletePlot = useCallback(
    (plotTitle: string) => {
      void updateWorldState((draft) => {
        // Remove the plot
        draft.state.plots = draft.state.plots.filter(
          (plot) => plot.title !== plotTitle
        )
        
        // Remove any references to this plot in character goals and secrets
        Object.values(draft.state.characterStates).forEach((characterState) => {
          if (characterState.goals && characterState.goals[plotTitle]) {
            delete characterState.goals[plotTitle]
          }
          if (characterState.secrets && characterState.secrets[plotTitle]) {
            delete characterState.secrets[plotTitle]
          }
        })
      })
    },
    [updateWorldState]
  )

  const handlePlotUpdate = useCallback(
    (plotTitle: string, updates: Partial<Plot>) => {
      void updateWorldState((draft) => {
        const plotIndex = draft.state.plots.findIndex(
          (plot) => plot.title === plotTitle
        )
        if (plotIndex !== -1) {
          Object.assign(draft.state.plots[plotIndex], updates)
        }
      })
    },
    [updateWorldState]
  )

  const handleCharacterInfoUpdate = useCallback(
    (characterId: string, updates: Partial<Character>) => {
      void updateWorldState((draft) => {
        const characterIndex = draft.characters.findIndex(
          (char) => char.id === characterId
        )
        if (characterIndex !== -1) {
          Object.assign(draft.characters[characterIndex], updates)
        }
      })
    },
    [updateWorldState]
  )

  const handleCharacterNumericFieldsUpdate = useCallback(
    (
      characterId: string,
      updates: {
        currentLocation?: string
        inventoryCount?: number
        discoveredLoresCount?: number
      }
    ) => {
      void updateWorldState((draft) => {
        // 确保 characterStates 存在
        if (!draft.state.characterStates) {
          draft.state.characterStates = {}
        }
        if (!draft.state.characterStates[characterId]) {
          draft.state.characterStates[characterId] = {
            currentLocationName: '',
            inventory: [],
            stats: {},
            attributes: {},
            properties: {},
            knowledge: {},
            goals: {},
            secrets: {},
            discoveredLores: [],
          }
        }

        const characterState = draft.state.characterStates[characterId]
        if (updates.currentLocation !== undefined) {
          characterState.currentLocationName = updates.currentLocation
        }
        // Note: inventoryCount and discoveredLoresCount are computed from arrays
      })
    },
    [updateWorldState]
  )

  const handleCharacterPropertiesAndKnowledgeUpdate = (
    characterId: string,
    updates: {
      properties?: Record<string, string>
      knowledge?: Record<string, string[]>
      goals?: Record<string, string[]>
      secrets?: Record<string, string[]>
    }
  ) => {
    void updateWorldState((draft) => {
      // 确保 characterStates 存在
      if (!draft.state.characterStates) {
        draft.state.characterStates = {}
      }
      if (!draft.state.characterStates[characterId]) {
        draft.state.characterStates[characterId] = {
          currentLocationName: '',
          inventory: [],
          stats: {},
          attributes: {},
          properties: {},
          knowledge: {},
          goals: {},
          secrets: {},
          discoveredLores: [],
        }
      }

      const characterState = draft.state.characterStates[characterId]
      if (updates.properties) {
        characterState.properties = characterState.properties || {}
        Object.assign(characterState.properties, updates.properties)
      }
      if (updates.knowledge) {
        characterState.knowledge = characterState.knowledge || {}
        Object.assign(characterState.knowledge, updates.knowledge)
      }
      if (updates.goals) {
        characterState.goals = characterState.goals || {}
        Object.assign(characterState.goals, updates.goals)
      }
      if (updates.secrets) {
        characterState.secrets = characterState.secrets || {}
        Object.assign(characterState.secrets, updates.secrets)
      }
    })
  }

  const handleItemNameUpdate = useCallback(
    (itemKey: string, newName: string) => {
      void updateWorldState((draft) => {
        // 确保 items 存在
        if (!draft.state.items) {
          draft.state.items = {}
        }
        if (draft.state.items[itemKey]) {
          draft.state.items[itemKey].name = newName
        }
      })
    },
    [updateWorldState]
  )

  const handleAddItemToCharacterInventory = useCallback(
    (characterId: string, item: Item) => {
      void updateWorldState((draft) => {
        // 确保 characterStates 和 items 存在
        if (!draft.state.characterStates) {
          draft.state.characterStates = {}
        }
        if (!draft.state.characterStates[characterId]) {
          draft.state.characterStates[characterId] = {
            currentLocationName: '',
            inventory: [],
            stats: {},
            attributes: {},
            properties: {},
            knowledge: {},
            goals: {},
            secrets: {},
            discoveredLores: [],
          }
        }
        if (!draft.state.items) {
          draft.state.items = {}
        }

        draft.state.characterStates[characterId].inventory.push(item.key)
        draft.state.items[item.key] = item
      })
    },
    [updateWorldState]
  )

  const handleRemoveItemFromCharacterInventory = useCallback(
    (characterId: string, itemKey: string) => {
      void updateWorldState((draft) => {
        // 确保 characterStates 存在
        if (!draft.state.characterStates) {
          draft.state.characterStates = {}
        }
        if (!draft.state.characterStates[characterId]) {
          draft.state.characterStates[characterId] = {
            currentLocationName: '',
            inventory: [],
            stats: {},
            attributes: {},
            properties: {},
            knowledge: {},
            goals: {},
            secrets: {},
            discoveredLores: [],
          }
        }

        const inventory = draft.state.characterStates[characterId].inventory
        const index = inventory.indexOf(itemKey)
        if (index !== -1) {
          inventory.splice(index, 1)
        }
      })
    },
    [updateWorldState]
  )

  const handleItemPropertyUpdate = useCallback(
    (itemKey: string, property: string, newValue: any) => {
      void updateWorldState((draft) => {
        // 确保 items 存在
        if (!draft.state.items) {
          draft.state.items = {}
        }
        if (draft.state.items[itemKey]) {
          if (property === 'name') {
            draft.state.items[itemKey].name = newValue
          } else if (property === 'description') {
            draft.state.items[itemKey].description = newValue
          } else if (property === 'count') {
            draft.state.items[itemKey].count = newValue
          } else if (property === 'stats') {
            draft.state.items[itemKey].stats = newValue
          } else {
            // Handle other properties
            draft.state.items[itemKey].properties =
              draft.state.items[itemKey].properties || {}
            draft.state.items[itemKey].properties[property] = newValue
          }
        }
      })
    },
    [updateWorldState]
  )

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <div>加载中...</div>
        <Text mt={2} color="gray.500">
          加载世界状态中...
        </Text>
      </Box>
    )
  }

  // 只在出错且没有数据时才显示错误界面
  if (error && !worldState) {
    return (
      <Box p={4} bg="red.500" color="white" borderRadius="md">
        Failed to load world state data
      </Box>
    )
  }

  // 确保有数据才渲染界面
  if (!worldState) {
    return (
      <Box p={4} textAlign="center">
        <div>加载中...</div>
        <Text mt={2} color="gray.500">
          加载世界状态中...
        </Text>
      </Box>
    )
  }

  return (
    <Box p={4} height="100%" overflowY="auto">
      <VStack align="stretch" gap={4} height="100%">
        <HStack justify="space-between">
          <Text fontSize="xl" fontWeight="bold" color="white">
            世界状态管理
          </Text>
        </HStack>

        <Tabs.Root
          value={activeTab}
          onValueChange={(e) => setActiveTab(e.value)}
          size="sm"
        >
          <Tabs.List borderBottom="1px solid" borderColor="gray.600" pb={2}>
            <Tabs.Trigger value="overview">概览</Tabs.Trigger>
            <Tabs.Trigger value="characters">角色</Tabs.Trigger>
            <Tabs.Trigger value="locations">地点</Tabs.Trigger>
            <Tabs.Trigger value="plots">剧情</Tabs.Trigger>
            <Tabs.Trigger value="items">物品</Tabs.Trigger>
          </Tabs.List>

          <Box pt={4}>
            <Tabs.Content value="overview">
              <WorldStateOverview
                worldState={worldState}
                onUpdateMetadata={handleWorldStateMetadataUpdate}
                onUpdateNumericFields={() => {}} // These are computed fields
              />
            </Tabs.Content>

            <Tabs.Content value="characters">
              <CharacterPanel
                worldState={worldState}
                handleStatUpdate={handleStatUpdate}
                handleCharacterInfoUpdate={handleCharacterInfoUpdate}
                handleCharacterNumericFieldsUpdate={
                  handleCharacterNumericFieldsUpdate
                }
                handleCharacterPropertiesAndKnowledgeUpdate={
                  handleCharacterPropertiesAndKnowledgeUpdate
                }
                handleCharacterGoalsUpdate={(characterId, updates) =>
                  handleCharacterPropertiesAndKnowledgeUpdate(characterId, {
                    goals: updates,
                  })
                }
                handleCharacterSecretsUpdate={(characterId, updates) =>
                  handleCharacterPropertiesAndKnowledgeUpdate(characterId, {
                    secrets: updates,
                  })
                }
                handleItemNameUpdate={handleItemNameUpdate}
                handleAddItemToCharacterInventory={
                  handleAddItemToCharacterInventory
                }
                handleRemoveItemFromCharacterInventory={
                  handleRemoveItemFromCharacterInventory
                }
                handleItemPropertyUpdate={handleItemPropertyUpdate}
              />
            </Tabs.Content>

            <Tabs.Content value="locations">
              <LocationsPanel
                locations={worldState.state?.locations || []}
                characterNames={worldState.characters.map((char) => char.name)}
                onLocationUpdate={(locationName, field, value) => {
                  // Convert the field to the appropriate update format
                  if (field === 'connectedLocations') {
                    handleLocationUpdate(locationName, {
                      connectedLocations: value as string[],
                    })
                  } else if (field === 'currentOccupants') {
                    handleLocationUpdate(locationName, {
                      currentOccupants: value as string[],
                    })
                  } else if (field === 'description') {
                    handleLocationUpdate(locationName, {
                      description: value as string,
                    })
                  } else if (field === 'notableFeatures') {
                    handleLocationUpdate(locationName, {
                      notableFeatures: value as string[],
                    })
                  } else if (field === 'items') {
                    handleLocationUpdate(locationName, {
                      items: value as string[],
                    })
                  }
                }}
                onAddLocation={handleAddLocation}
                onDeleteLocation={handleDeleteLocation}
              />
            </Tabs.Content>

            <Tabs.Content value="plots">
              <PlotsPanel
                plots={worldState.state?.plots || []}
                characterNames={worldState.characters.map((char) => char.name)}
                onUpdatePlot={handlePlotUpdate}
                onUpdatePlotCounts={() => {}} // This is computed
                onAddPlot={handleAddPlot}
                onDeletePlot={handleDeletePlot}
              />
            </Tabs.Content>

            <Tabs.Content value="items">
              <ItemPanel
                worldState={worldState}
                handleItemPropertyUpdate={handleItemPropertyUpdate}
              />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </VStack>
    </Box>
  )
}
