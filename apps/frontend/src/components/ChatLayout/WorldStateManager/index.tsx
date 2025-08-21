import { useState, useEffect, useCallback } from 'react'
import { Box, Text, VStack, HStack, Button, Tabs } from '@chakra-ui/react'
import { WorldStateOverview } from './WorldStateOverview'
import { CharacterPanel } from './CharacterPanel'
import { LocationsPanel } from './LocationsPanel'
import { PlotsPanel } from './PlotsPanel'
import { ItemPanel } from './ItemPanel'
import { worldStateService } from '../../../services/worldStateService'
import { socketService } from '../../../services/socketService'
import type {
  WorldState,
  Location,
  Plot,
  Character,
  CharacterState,
  Item,
} from '@weave/types'

interface WorldStateManagerProps {
  worldStateId: string
}

// Helper function to group items by template name

// Consolidated handler function for world state updates
const useWorldStateUpdater = (
  worldStateId: string,
  setWorldState: React.Dispatch<React.SetStateAction<WorldState | null>>
) => {
  const updateWorldState = useCallback(
    async (updateFn: () => Promise<WorldState>) => {
      try {
        const updatedWorldState = await updateFn()
        setWorldState(updatedWorldState)
      } catch (error) {
        console.error('Failed to update world state:', error)
      }
    },
    [setWorldState]
  )

  const handleStatUpdate = useCallback(
    (characterId: string, statName: string, newValue: number) => {
      void updateWorldState(() =>
        worldStateService.updateCharacterStat(
          worldStateId,
          characterId,
          statName,
          newValue
        )
      )
    },
    [updateWorldState, worldStateId]
  )

  const handleWorldStateMetadataUpdate = useCallback(
    (metadata: { currentGameTime?: string; outline?: string }) => {
      void updateWorldState(() =>
        worldStateService.updateWorldStateMetadata(worldStateId, metadata)
      )
    },
    [updateWorldState, worldStateId]
  )

  const handleLocationUpdate = useCallback(
    (locationName: string, updates: Partial<Location>) => {
      void updateWorldState(() =>
        worldStateService.updateLocationDetails(
          worldStateId,
          locationName,
          updates
        )
      )
    },
    [updateWorldState, worldStateId]
  )

  const handlePlotUpdate = useCallback(
    (plotTitle: string, updates: Partial<Plot>) => {
      void updateWorldState(() =>
        worldStateService.updatePlotDetails(worldStateId, plotTitle, updates)
      )
    },
    [updateWorldState, worldStateId]
  )

  const handleCharacterInfoUpdate = useCallback(
    (characterId: string, updates: Partial<Character>) => {
      void updateWorldState(() =>
        worldStateService.updateCharacterInfo(
          worldStateId,
          characterId,
          updates
        )
      )
    },
    [updateWorldState, worldStateId]
  )

  const handleWorldStateNumericFieldsUpdate = useCallback(
    (updates: {
      characterCount?: number
      locationCount?: number
      activePlotCount?: number
      importantEventCount?: number
    }) => {
      void updateWorldState(() =>
        worldStateService.updateWorldStateNumericFields(worldStateId, updates)
      )
    },
    [updateWorldState, worldStateId]
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
      void updateWorldState(() =>
        worldStateService.updateCharacterNumericFields(
          worldStateId,
          characterId,
          updates
        )
      )
    },
    [updateWorldState, worldStateId]
  )

  const handleCharacterPropertiesAndKnowledgeUpdate = useCallback(
    (
      characterId: string,
      updates: {
        properties?: Record<string, string>
        knowledge?: Record<string, string[]>
      }
    ) => {
      void updateWorldState(() =>
        worldStateService.updateCharacterPropertiesAndKnowledge(
          worldStateId,
          characterId,
          updates
        )
      )
    },
    [updateWorldState, worldStateId]
  )

  const handleCharacterGoalsUpdate = useCallback(
    (characterId: string, updates: Record<string, string[]>) => {
      void updateWorldState(() =>
        worldStateService.updateCharacterPropertiesAndKnowledge(
          worldStateId,
          characterId,
          { goals: updates }
        )
      )
    },
    [updateWorldState, worldStateId]
  )

  const handleCharacterSecretsUpdate = useCallback(
    (characterId: string, updates: Record<string, string[]>) => {
      void updateWorldState(() =>
        worldStateService.updateCharacterPropertiesAndKnowledge(
          worldStateId,
          characterId,
          { secrets: updates }
        )
      )
    },
    [updateWorldState, worldStateId]
  )

  const handleItemNameUpdate = useCallback(
    (itemKey: string, newName: string) => {
      void updateWorldState(() =>
        worldStateService.updateItemName(worldStateId, itemKey, newName)
      )
    },
    [updateWorldState, worldStateId]
  )

  const handleAddItemToCharacterInventory = useCallback(
    (characterId: string, item: any) => {
      void updateWorldState(() =>
        worldStateService.addItemToCharacterInventory(
          worldStateId,
          characterId,
          item
        )
      )
    },
    [updateWorldState, worldStateId]
  )

  const handleRemoveItemFromCharacterInventory = useCallback(
    (characterId: string, itemKey: string) => {
      void updateWorldState(() =>
        worldStateService.removeItemFromCharacterInventory(
          worldStateId,
          characterId,
          itemKey
        )
      )
    },
    [updateWorldState, worldStateId]
  )

  const handleItemPropertyUpdate = useCallback(
    (itemKey: string, property: string, newValue: any) => {
      void updateWorldState(() =>
        worldStateService.updateItemProperty(
          worldStateId,
          itemKey,
          property,
          newValue
        )
      )
    },
    [updateWorldState, worldStateId]
  )

  const handleLocationNumericFieldsUpdate = useCallback(
    (
      locationName: string,
      updates: {
        currentOccupantCount?: number
      }
    ) => {
      void updateWorldState(() =>
        worldStateService.updateLocationNumericFields(
          worldStateId,
          locationName,
          updates
        )
      )
    },
    [updateWorldState, worldStateId]
  )

  const handlePlotCountsUpdate = useCallback(
    (updates: {
      activeCount?: number
      completedCount?: number
      pausedCount?: number
    }) => {
      void updateWorldState(() =>
        worldStateService.updatePlotCounts(worldStateId, updates)
      )
    },
    [updateWorldState, worldStateId]
  )

  return {
    handleStatUpdate,
    handleWorldStateMetadataUpdate,
    handleLocationUpdate,
    handlePlotUpdate,
    handleCharacterInfoUpdate,
    handleWorldStateNumericFieldsUpdate,
    handleCharacterNumericFieldsUpdate,
    handleCharacterPropertiesAndKnowledgeUpdate,
    handleCharacterGoalsUpdate,
    handleCharacterSecretsUpdate,
    handleItemNameUpdate,
    handleAddItemToCharacterInventory,
    handleRemoveItemFromCharacterInventory,
    handleItemPropertyUpdate,
    handleLocationNumericFieldsUpdate,
    handlePlotCountsUpdate,
  }
}

export function WorldStateManager({ worldStateId }: WorldStateManagerProps) {
  const [worldState, setWorldState] = useState<WorldState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  // Removed item-related states as they're now handled in ItemPanel
  // Removed selectedCharacter state as it's now handled in CharacterPanel

  const {
    handleStatUpdate,
    handleWorldStateMetadataUpdate,
    handleLocationUpdate,
    handlePlotUpdate,
    handleCharacterInfoUpdate,
    handleWorldStateNumericFieldsUpdate,
    handleCharacterNumericFieldsUpdate,
    handleCharacterPropertiesAndKnowledgeUpdate,
    handleCharacterGoalsUpdate,
    handleCharacterSecretsUpdate,
    handleItemNameUpdate,
    handleAddItemToCharacterInventory,
    handleRemoveItemFromCharacterInventory,
    handleItemPropertyUpdate,
    handleLocationNumericFieldsUpdate,
    handlePlotCountsUpdate,
  } = useWorldStateUpdater(worldStateId, setWorldState)

  const fetchWorldState = useCallback(async () => {
    try {
      setLoading(true)
      const data = await worldStateService.fetchWorldState(worldStateId)
      setWorldState(data)
    } catch (err) {
      setError('Failed to load world state data')
      console.error('Error fetching world state:', err)
    } finally {
      setLoading(false)
    }
  }, [worldStateId])

  useEffect(() => {
    void fetchWorldState()
  }, [fetchWorldState])

  // Subscribe to real-time updates
  useEffect(() => {
    // Subscribe to world state updates
    socketService.subscribeToWorldState(worldStateId)

    // Listen for updates
    const handleWorldStateUpdate = (data: {
      worldStateId: string
      worldState: any
    }) => {
      if (data.worldStateId === worldStateId) {
        if (data.worldState === null) {
          // World state was deleted
          setWorldState(null)
        } else {
          // Update the world state
          setWorldState(data.worldState)
        }
      }
    }

    socketService.onWorldStateUpdate(handleWorldStateUpdate)

    // Cleanup
    return () => {
      socketService.unsubscribeFromWorldState(worldStateId)
      socketService.off('world-state:updated', handleWorldStateUpdate)
    }
  }, [worldStateId])

  const handleRefresh = () => {
    void fetchWorldState()
  }

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
        {error}
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
          <Button size="sm" colorPalette="blue" onClick={handleRefresh}>
            刷新
          </Button>
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

          <Box height="calc(100% - 80px)" overflowY="auto" pt={4}>
            <Tabs.Content value="overview">
              <WorldStateOverview
                worldState={worldState}
                onUpdateMetadata={handleWorldStateMetadataUpdate}
                onUpdateNumericFields={handleWorldStateNumericFieldsUpdate}
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
                handleCharacterGoalsUpdate={handleCharacterGoalsUpdate}
                handleCharacterSecretsUpdate={handleCharacterSecretsUpdate}
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
                onUpdatePlotCounts={handlePlotCountsUpdate}
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
