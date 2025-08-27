import { useState, useCallback } from 'react'
import { Box, Text, VStack, HStack, Tabs } from '@chakra-ui/react'
import { produce } from 'immer'
import { useQueryClient } from '@tanstack/react-query'
import { WorldStateOverview } from './WorldStateOverview'
import { CharacterPanel } from './CharacterPanel'
import { LocationsPanel } from './LocationsPanel'
import { PlotsPanel } from './PlotsPanel'
import { ItemPanel } from './ItemPanel'
import { useWorldState, useUpdateWorldState } from '../../../hooks/queries'
import type { WorldState, Location, Plot, Character, Item } from '@weave/types'

interface WorldStateManagerProps {
  worldStateId: string
}

export function WorldStateManager({ worldStateId }: WorldStateManagerProps) {
  const [activeTab, setActiveTab] = useState('overview')
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

  // Single update handler using immer for immutable updates
  const updateWorldState = useCallback(
    async (updater: (draft: WorldState) => void) => {
      if (!worldState) return

      const updatedWorldState = produce(worldState, updater)

      await queryClient.cancelQueries({
        queryKey: ['worldState', worldStateId],
      })

      queryClient.setQueryData(['worldState', worldStateId], updatedWorldState)

      updateWorldStateMutation.mutate(
        {
          params: { worldStateId },
          body: { worldState: updatedWorldState },
        },
        {
          onSettled: () => {
            // Invalidate and refetch the query to ensure consistency
            void queryClient.invalidateQueries({
              queryKey: ['worldState', worldStateId],
            })
          },
          onError: (error) => {
            console.error('Failed to update world state:', error)
          },
        }
      )
    },
    [worldState, worldStateId, updateWorldStateMutation, queryClient]
  )

  // Simplified handlers using the single update function
  const handleStatUpdate = useCallback(
    (characterId: string, statName: string, newValue: number) => {
      void updateWorldState((draft) => {
        if (draft.state.characterStates[characterId]) {
          draft.state.characterStates[characterId].stats[statName] = {
            current: newValue,
            max: draft.state.characterStates[characterId].stats[statName]?.max,
          }
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
        if (draft.state.characterStates[characterId]) {
          const characterState = draft.state.characterStates[characterId]
          if (updates.currentLocation !== undefined) {
            characterState.currentLocationName = updates.currentLocation
          }
          // Note: inventoryCount and discoveredLoresCount are computed from arrays
        }
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
      if (draft.state.characterStates[characterId]) {
        const characterState = draft.state.characterStates[characterId]
        if (updates.properties) {
          Object.assign(characterState.properties, updates.properties)
        }
        if (updates.knowledge) {
          Object.assign(characterState.knowledge, updates.knowledge)
        }
        if (updates.goals) {
          Object.assign(characterState.goals, updates.goals)
        }
        if (updates.secrets) {
          Object.assign(characterState.secrets, updates.secrets)
        }
      }
    })
  }

  const handleItemNameUpdate = useCallback(
    (itemKey: string, newName: string) => {
      void updateWorldState((draft) => {
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
        if (draft.state.characterStates[characterId]) {
          draft.state.characterStates[characterId].inventory.push(item.key)
          draft.state.items[item.key] = item
        }
      })
    },
    [updateWorldState]
  )

  const handleRemoveItemFromCharacterInventory = useCallback(
    (characterId: string, itemKey: string) => {
      void updateWorldState((draft) => {
        if (draft.state.characterStates[characterId]) {
          const inventory = draft.state.characterStates[characterId].inventory
          const index = inventory.indexOf(itemKey)
          if (index !== -1) {
            inventory.splice(index, 1)
          }
        }
      })
    },
    [updateWorldState]
  )

  const handleItemPropertyUpdate = useCallback(
    (itemKey: string, property: string, newValue: any) => {
      void updateWorldState((draft) => {
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

  if (error) {
    return (
      <Box p={4} bg="red.500" color="white" borderRadius="md">
        Failed to load world state data
      </Box>
    )
  }

  if (!worldState) {
    return (
      <Box p={4} bg="yellow.500" color="white" borderRadius="md">
        未找到世界状态数据
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
              />
            </Tabs.Content>

            <Tabs.Content value="plots">
              <PlotsPanel
                plots={worldState.state?.plots || []}
                characterNames={worldState.characters.map((char) => char.name)}
                onUpdatePlot={handlePlotUpdate}
                onUpdatePlotCounts={() => {}} // This is computed
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
