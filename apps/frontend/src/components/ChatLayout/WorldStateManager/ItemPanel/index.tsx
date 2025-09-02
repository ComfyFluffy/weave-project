import { useState, useMemo, useCallback } from 'react'
import {
  VStack,
  Button,
  Text,
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  NativeSelect,
} from '@chakra-ui/react'
import { ItemDetailPanel } from './ItemDetailPanel'
import { InputAndAddItem } from '../shared-crud-components'
import type { Item, ItemTemplate, WorldState } from '@weave/types'
import { LuTrash2, LuPlus } from 'react-icons/lu'

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
  handleDeleteItem: (itemKey: string) => void
  handleAddItem: (item: Item) => void
}

export function ItemPanel({
  worldState,
  handleItemPropertyUpdate,
  handleDeleteItem,
  handleAddItem,
}: ItemPanelProps) {
  // 添加物品的状态
  const [newItemName, setNewItemName] = useState('')
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [selectedItemKey, setSelectedItemKey] = useState<string | null>(null)
  const [selectedGroupedItemKey, setSelectedGroupedItemKey] = useState<
    string | null
  >(null)

  // Group items by template for the items tab - use useMemo to ensure real-time updates
  const groupedItems = useMemo(() => {
    return worldState.state.items
      ? groupItemsByTemplate(
          worldState.state.items,
          worldState.state.itemTemplates
        )
      : []
  }, [worldState.state.items, worldState.state.itemTemplates])

  // Handle item selection for detail view - use useMemo to ensure real-time updates
  const selectedItem = useMemo(() => {
    if (!selectedItemKey) return null
    return worldState.state.items?.[selectedItemKey] || null
  }, [selectedItemKey, worldState.state.items])

  // Compute selected grouped item from worldState to ensure it updates when worldState changes
  const selectedGroupedItem = useMemo(() => {
    if (!selectedGroupedItemKey) return null

    return (
      groupedItems.find(
        (item) => item.templateName === selectedGroupedItemKey
      ) || null
    )
  }, [selectedGroupedItemKey, groupedItems])

  // 处理添加物品
  const handleAddNewItem = useCallback(() => {
    if (!newItemName.trim()) return

    // 生成唯一键
    const itemKey = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // 创建新物品
    const newItem: Item = {
      key: itemKey,
      name: newItemName.trim(),
      description: '新物品描述',
      type: 'misc',
      rarity: 'common',
      count: 1,
      properties: {},
      stats: {},
    }

    // 调用父组件的处理函数
    handleAddItem(newItem)

    // 重置状态
    setNewItemName('')
    setIsAddingItem(false)
  }, [newItemName, handleAddItem])

  return (
    <VStack align="stretch" gap={3}>
      {selectedGroupedItem ? (
        <VStack align="stretch" gap={3}>
          <Button
            size="sm"
            colorPalette="gray"
            onClick={() => setSelectedGroupedItemKey(null)}
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
            onDeleteItem={(itemKey) => {
              if (
                confirm(
                  `确定要删除物品 "${selectedGroupedItem.displayName}" 吗？`
                )
              ) {
                // 删除该组中的所有物品
                selectedGroupedItem.items.forEach((item) => {
                  if (item.key) {
                    handleDeleteItem(item.key)
                  }
                })
              }
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
                  <HStack>
                    <Text fontSize="sm" color="gray.400">
                      数量: {item.count || 1}
                    </Text>
                    {item.key && (
                      <IconButton
                        size="xs"
                        aria-label="删除物品"
                        colorPalette="red"
                        onClick={() => {
                          if (
                            confirm(
                              `确定要删除物品 "${item.name || item.templateName || item.key}" 吗？`
                            )
                          ) {
                            handleDeleteItem(item.key)
                          }
                        }}
                      >
                        <LuTrash2 />
                      </IconButton>
                    )}
                  </HStack>
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
            onDeleteItem={handleDeleteItem}
          />
        </VStack>
      ) : (
        <>
          <Text fontSize="lg" fontWeight="bold" color="white">
            物品列表
          </Text>

          {/* 添加物品按钮 */}
          <HStack>
            <LuPlus />
            <Button
              size="sm"
              colorPalette="blue"
              onClick={() => setIsAddingItem(!isAddingItem)}
            >
              {isAddingItem ? '取消添加' : '添加物品'}
            </Button>
          </HStack>

          {/* 添加物品表单 */}
          {isAddingItem && (
            <Box bg="gray.700" p={3} borderRadius="md" mt={2}>
              <VStack align="stretch" gap={3}>
                <Input
                  placeholder="物品名称"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddNewItem()
                    }
                  }}
                />

                <Button
                  size="sm"
                  colorPalette="green"
                  onClick={handleAddNewItem}
                  disabled={!newItemName.trim()}
                >
                  创建物品
                </Button>
              </VStack>
            </Box>
          )}

          {groupedItems.length > 0 ? (
            groupedItems.map((groupedItem, index) => (
              <Box
                key={index}
                bg="gray.700"
                p={3}
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: 'gray.600' }}
                onClick={() =>
                  setSelectedGroupedItemKey(groupedItem.templateName)
                }
              >
                <HStack justify="space-between">
                  <Text color="white">{groupedItem.displayName}</Text>
                  <HStack>
                    <Text color="gray.400" fontSize="sm">
                      {groupedItem.totalCount} 个
                    </Text>
                    <IconButton
                      size="xs"
                      aria-label="删除物品"
                      colorPalette="red"
                      onClick={(e) => {
                        e.stopPropagation() // 阻止事件冒泡，避免触发选物品
                        if (
                          confirm(
                            `确定要删除物品 "${groupedItem.displayName}" 吗？`
                          )
                        ) {
                          // 删除该组中的所有物品
                          groupedItem.items.forEach((item) => {
                            if (item.key) {
                              handleDeleteItem(item.key)
                            }
                          })
                        }
                      }}
                    >
                      <LuTrash2 />
                    </IconButton>
                  </HStack>
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
