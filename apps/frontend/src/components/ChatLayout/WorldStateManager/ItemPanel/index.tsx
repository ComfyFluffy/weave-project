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
} from '@chakra-ui/react'
import { ItemDetailPanel } from './ItemDetailPanel'
import { InputAndAddItem } from '../shared-crud-components'
import { GenericSelect } from '../shared-select-components'
import type { Item, WorldState } from '@weave/types'
import { LuTrash2, LuPlus } from 'react-icons/lu'


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
  const [newItemType, setNewItemType] = useState('misc')
  const [newItemRarity, setNewItemRarity] = useState('common')

  // Handle item selection for detail view - use useMemo to ensure real-time updates
  const selectedItem = useMemo(() => {
    if (!selectedItemKey) return null
    return worldState.state.items?.[selectedItemKey] || null
  }, [selectedItemKey, worldState.state.items])

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
      type: newItemType as 'weapon' | 'armor' | 'consumable' | 'tool' | 'key-item' | 'misc',
      rarity: newItemRarity as 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary',
      count: 1,
      properties: {},
      stats: {},
    }

    // 调用父组件的处理函数
    handleAddItem(newItem)

    // 重置状态
    setNewItemName('')
    setIsAddingItem(false)
  }, [newItemName, newItemType, newItemRarity, handleAddItem])

  return (
    <VStack align="stretch" gap={3}>
      {selectedItem ? (
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
                
                <HStack gap={2}>
                  <Box minWidth="120px">
                    <GenericSelect
                      items={['武器', '护甲', '消耗品', '工具', '关键道具', '杂项']}
                      selectedItem={
                        newItemType === 'weapon' ? '武器' :
                        newItemType === 'armor' ? '护甲' :
                        newItemType === 'consumable' ? '消耗品' :
                        newItemType === 'tool' ? '工具' :
                        newItemType === 'key-item' ? '关键道具' : '杂项'
                      }
                      onSelectionChange={(value) => {
                        const typeMap: Record<string, string> = {
                          '武器': 'weapon',
                          '护甲': 'armor',
                          '消耗品': 'consumable',
                          '工具': 'tool',
                          '关键道具': 'key-item',
                          '杂项': 'misc'
                        }
                        setNewItemType(typeMap[value || '杂项'])
                      }}
                      placeholder="选择类型"
                    />
                  </Box>
                  <Box minWidth="120px">
                    <GenericSelect
                      items={['普通', '不普通', '稀有', '非常稀有', '传说']}
                      selectedItem={
                        newItemRarity === 'common' ? '普通' :
                        newItemRarity === 'uncommon' ? '不普通' :
                        newItemRarity === 'rare' ? '稀有' :
                        newItemRarity === 'very-rare' ? '非常稀有' : '传说'
                      }
                      onSelectionChange={(value) => {
                        const rarityMap: Record<string, string> = {
                          '普通': 'common',
                          '不普通': 'uncommon',
                          '稀有': 'rare',
                          '非常稀有': 'very-rare',
                          '传说': 'legendary'
                        }
                        setNewItemRarity(rarityMap[value || '普通'])
                      }}
                      placeholder="选择稀有度"
                    />
                  </Box>
                </HStack>

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

          {worldState.state.items && Object.keys(worldState.state.items).length > 0 ? (
            Object.values(worldState.state.items).map((item, index) => (
              <Box
                key={item.key || index}
                bg="gray.700"
                p={3}
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: 'gray.600' }}
                onClick={() => setSelectedItemKey(item.key)}
              >
                <HStack justify="space-between">
                  <Text color="white">{item.name || item.key}</Text>
                  <HStack>
                    <Text color="gray.400" fontSize="sm">
                      数量: {item.count || 1}
                    </Text>
                    <IconButton
                      size="xs"
                      aria-label="删除物品"
                      colorPalette="red"
                      onClick={(e) => {
                        e.stopPropagation() // 阻止事件冒泡，避免触发选物品
                        if (
                          confirm(
                            `确定要删除物品 "${item.name || item.key}" 吗？`
                          )
                        ) {
                          handleDeleteItem(item.key)
                        }
                      }}
                    >
                      <LuTrash2 />
                    </IconButton>
                  </HStack>
                </HStack>
                {item.key && (
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    ID: {item.key}
                  </Text>
                )}
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
