import { useState } from 'react'
import { VStack, Button, Text, Box, HStack } from '@chakra-ui/react'
import { ItemDetailPanel } from './ItemDetailPanel'
import type { Item, ItemTemplate, WorldState } from '@weave/types'

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

// Helper function to group items by template name
const groupItemsByTemplate = (
  items: Record<string, Item>,
  itemTemplates: ItemTemplate[] = []
): GroupedItem[] => {
  const grouped: Record<string, GroupedItem> = {}

  // Process each item
  Object.values(items).forEach((item) => {
    const templateName = item.templateName || item.name || item.key

    if (!grouped[templateName]) {
      // Find template if exists
      const template = itemTemplates.find((t) => t.name === item.templateName)

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

interface ItemPanelProps {
  worldState: WorldState
  handleItemPropertyUpdate: (
    itemKey: string,
    property: string,
    newValue: any
  ) => void
}

export function ItemPanel({
  worldState,
  handleItemPropertyUpdate,
}: ItemPanelProps) {
  const [selectedItemKey, setSelectedItemKey] = useState<string | null>(null)
  const [selectedGroupedItem, setSelectedGroupedItem] =
    useState<GroupedItem | null>(null)

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
                key:
                  selectedGroupedItem.items[0]?.key ||
                  selectedGroupedItem.templateName,
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
            onUpdateItemProperty={(itemKey, property, newValue) => {
              // 更新分组中的所有物品
              selectedGroupedItem.items.forEach((item) => {
                if (item.key) {
                  handleItemPropertyUpdate(item.key, property, newValue)
                }
              })
            }}
          />
          <Box>
            <Text fontSize="sm" fontWeight="bold" color="white" mb={2}>
              物品实例详情:
            </Text>
            {selectedGroupedItem.items.map((item, index) => (
              <Box key={index} bg="gray.700" p={2} borderRadius="md" mb={2}>
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
  )
}
