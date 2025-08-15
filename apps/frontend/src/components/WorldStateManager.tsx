import { useState, useEffect, useCallback } from 'react'
import { Box, Text, VStack, HStack, Button, Tabs } from '@chakra-ui/react'
import { WorldStateOverview } from './WorldStateOverview'
import { CharacterStatusPanel } from './CharacterStatusPanel'
import { LocationsExplorer } from './LocationsExplorer'
import { PlotsTracker } from './PlotsTracker'
import { ItemDetailPanel } from './ItemDetailPanel'
import { worldStateService } from '../services/worldStateService'
import { socketService } from '../services/socketService'
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
interface GroupedItem {
  templateName: string
  items: Item[]
  totalCount: number
  displayName: string
  description?: string
  type?: 'weapon' | 'armor' | 'consumable' | 'tool' | 'key-item' | 'misc'
  rarity?: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary'
  properties?: Record<string, string>
  stats?: Record<string, number>
}

const groupItemsByTemplate = (
  items: Record<string, Item>,
  itemTemplates: any[] = []
): GroupedItem[] => {
  const grouped: Record<string, GroupedItem> = {}

  // Process each item
  Object.values(items).forEach((item) => {
    const templateName = item.templateName || item.name || item.key

    if (!grouped[templateName]) {
      // Find template if exists
      const template = itemTemplates.find(
        (t: any) => t.name === item.templateName
      )

      grouped[templateName] = {
        templateName,
        items: [item],
        totalCount: item.count || 1,
        displayName: item.name || template?.name || item.key,
        description: item.description || template?.description,
        type: item.type || template?.type,
        rarity: item.rarity || template?.rarity,
        properties: {
          ...(template?.properties || {}),
          ...(item.properties || {}),
        },
        stats: { ...(template?.stats || {}), ...(item.stats || {}) },
      }
    } else {
      // Add to existing group
      grouped[templateName].items.push(item)
      grouped[templateName].totalCount += item.count || 1
    }
  })

  return Object.values(grouped)
}

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
    async (characterId: string, statName: string, newValue: number) => {
      await updateWorldState(() =>
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
  const [selectedItemKey, setSelectedItemKey] = useState<string | null>(null)
  const [selectedGroupedItem, setSelectedGroupedItem] =
    useState<GroupedItem | null>(null)

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

  // Handle item selection for detail view
  const selectedItem =
    selectedItemKey && worldState.state.items?.[selectedItemKey]
      ? worldState.state.items[selectedItemKey]
      : null

  // Group items by template for the items tab
  const groupedItems = worldState.state.items
    ? groupItemsByTemplate(
        worldState.state.items,
        worldState.state.itemTemplates
      )
    : []

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
              <VStack align="stretch" gap={3}>
                {worldState.characters.map((character) => {
                  // For NPCs that don't have a detailed state, create a minimal state object
                  const characterState: CharacterState = worldState.state
                    .characterStates?.[character.id] || {
                    id: character.id,
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

                  return (
                    <CharacterStatusPanel
                      key={character.id}
                      character={character}
                      state={characterState}
                      items={worldState.state.items}
                      onUpdateStat={handleStatUpdate}
                      onUpdateCharacterInfo={handleCharacterInfoUpdate}
                      onUpdateCharacterNumericFields={
                        handleCharacterNumericFieldsUpdate
                      }
                      onUpdateCharacterPropertiesAndKnowledge={
                        handleCharacterPropertiesAndKnowledgeUpdate
                      }
                      onUpdateCharacterGoals={handleCharacterGoalsUpdate}
                      onUpdateCharacterSecrets={handleCharacterSecretsUpdate}
                      onUpdateItemName={handleItemNameUpdate}
                      onUpdateItemProperty={handleItemPropertyUpdate}
                      onAddItemToCharacterInventory={
                        handleAddItemToCharacterInventory
                      }
                      onRemoveItemFromCharacterInventory={
                        handleRemoveItemFromCharacterInventory
                      }
                      itemTemplates={worldState.state.itemTemplates}
                    />
                  )
                })}
              </VStack>
            </Tabs.Content>

            <Tabs.Content value="locations">
              <LocationsExplorer
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
              <PlotsTracker
                plots={worldState.state?.plots || []}
                characterNames={worldState.characters.map((char) => char.name)}
                onUpdatePlot={handlePlotUpdate}
                onUpdatePlotCounts={handlePlotCountsUpdate}
              />
            </Tabs.Content>

            <Tabs.Content value="items">
              <VStack align="stretch" gap={3}>
                {selectedGroupedItem ? (
                  <VStack align="stretch" gap={3}>
                    <Button
                      size="sm"
                      colorPalette="gray"
                      onClick={() => setSelectedGroupedItem(null)}
                      width="fit-content"
                    >
                      ← 返回物品列表
                    </Button>
                    <ItemDetailPanel
                      item={
                        {
                          key: selectedGroupedItem.templateName,
                          name: selectedGroupedItem.displayName,
                          description: selectedGroupedItem.description,
                          type: selectedGroupedItem.type,
                          rarity: selectedGroupedItem.rarity,
                          count: selectedGroupedItem.totalCount,
                          properties: selectedGroupedItem.properties,
                          stats: selectedGroupedItem.stats,
                        } as Item
                      }
                      itemTemplates={worldState.state.itemTemplates || []}
                      onUpdateItemProperty={handleItemPropertyUpdate}
                    />
                    <Box>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color="white"
                        mb={2}
                      >
                        物品实例详情:
                      </Text>
                      {selectedGroupedItem.items.map((item, index) => (
                        <Box
                          key={index}
                          bg="gray.700"
                          p={2}
                          borderRadius="md"
                          mb={2}
                        >
                          <HStack justify="space-between">
                            <Text fontSize="sm" color="white">
                              {item.name || item.templateName || item.key}
                            </Text>
                            <Text fontSize="sm" color="gray.400">
                              数量: {item.count || 1}
                            </Text>
                          </HStack>
                          {item.key && (
                            <Text fontSize="xs" color="gray.500">
                              ID: {item.key}
                            </Text>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </VStack>
                ) : selectedItem ? (
                  <VStack align="stretch" gap={3}>
                    <Button
                      size="sm"
                      colorPalette="gray"
                      onClick={() => setSelectedItemKey(null)}
                      width="fit-content"
                    >
                      ← 返回物品列表
                    </Button>
                    <ItemDetailPanel
                      item={selectedItem}
                      itemTemplates={worldState.state.itemTemplates || []}
                      onUpdateItemProperty={handleItemPropertyUpdate}
                    />
                  </VStack>
                ) : (
                  <>
                    <Text fontSize="lg" fontWeight="bold" color="white">
                      物品列表
                    </Text>
                    {groupedItems.length > 0 ? (
                      groupedItems.map((groupedItem, index) => (
                        <Box
                          key={index}
                          bg="gray.700"
                          p={3}
                          borderRadius="md"
                          cursor="pointer"
                          _hover={{ bg: 'gray.600' }}
                          onClick={() => setSelectedGroupedItem(groupedItem)}
                        >
                          <HStack justify="space-between">
                            <Text color="white">{groupedItem.displayName}</Text>
                            <Text color="gray.400" fontSize="sm">
                              {groupedItem.totalCount} 个
                            </Text>
                          </HStack>
                        </Box>
                      ))
                    ) : (
                      <Text color="gray.500" textAlign="center" py={4}>
                        暂无物品数据
                      </Text>
                    )}
                  </>
                )}
              </VStack>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </VStack>
    </Box>
  )
}
