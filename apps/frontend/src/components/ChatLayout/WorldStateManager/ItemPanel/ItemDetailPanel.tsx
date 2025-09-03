import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  IconButton,
  Button,
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { EditableText } from '../shared-editable-components'
import { EditableNumberInput } from '../shared-number-slider-components'
import type { Item } from '@weave/types'
import { LuTrash2, LuPlus } from 'react-icons/lu'

interface ItemDetailPanelProps {
  item: Item
  onUpdateItemProperty?: (
    itemKey: string,
    property: string,
    newValue: any
  ) => void
  onDeleteItem?: (itemKey: string) => void
}

export function ItemDetailPanel({
  item,
  onUpdateItemProperty,
  onDeleteItem,
}: ItemDetailPanelProps) {
  const [newStatName, setNewStatName] = useState('')
  const [newStatValue, setNewStatValue] = useState('')
  const [newPropertyName, setNewPropertyName] = useState('')
  const [newPropertyValue, setNewPropertyValue] = useState('')
  // Get item properties directly from the item - use useMemo
  const displayName = useMemo(() => {
    return item.name || item.key
  }, [item.name, item.key])

  const description = useMemo(() => {
    return item.description || '暂无描述'
  }, [item.description])

  const type = useMemo(() => {
    return item.type || 'unknown'
  }, [item.type])

  const rarity = useMemo(() => {
    return item.rarity || 'common'
  }, [item.rarity])

  const properties = useMemo(() => {
    return item.properties || {}
  }, [item.properties])

  const stats = useMemo(() => {
    return item.stats || {}
  }, [item.stats])

  // Rarity color mapping
  const rarityColors: Record<string, string> = {
    common: 'gray',
    uncommon: 'green',
    rare: 'blue',
    'very-rare': 'purple',
    legendary: 'orange',
  }

  // Type display mapping
  const typeDisplay: Record<string, string> = {
    weapon: '武器',
    armor: '护甲',
    consumable: '消耗品',
    tool: '工具',
    'key-item': '关键道具',
    misc: '杂项',
  }

  return (
    <Box
      bg="gray.800"
      p={4}
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.600"
    >
      <VStack align="stretch" gap={3}>
        {/* Header with name and badges */}
        <HStack justify="space-between">
          {onUpdateItemProperty ? (
            <EditableText
              value={displayName}
              onChange={(newValue) =>
                onUpdateItemProperty(item.key, 'name', newValue)
              }
              placeholder="物品名称..."
            />
          ) : (
            <Text fontSize="lg" fontWeight="bold" color="white">
              {displayName}
            </Text>
          )}
          <HStack>
            <Badge
              colorPalette={rarityColors[rarity] || 'gray'}
              variant="solid"
            >
              {rarity}
            </Badge>
            <Badge colorPalette="teal" variant="solid">
              {typeDisplay[type] || type}
            </Badge>
            {onDeleteItem && (
              <IconButton
                size="sm"
                aria-label="删除物品"
                colorPalette="red"
                onClick={() => {
                  if (confirm(`确定要删除物品 "${displayName}" 吗？`)) {
                    onDeleteItem(item.key)
                  }
                }}
              >
                <LuTrash2 />
              </IconButton>
            )}
          </HStack>
        </HStack>

        {/* Description */}
        {onUpdateItemProperty ? (
          <EditableText
            value={description}
            onChange={(newValue) =>
              onUpdateItemProperty(item.key, 'description', newValue)
            }
            placeholder="物品描述..."
          />
        ) : (
          <Text fontSize="sm" color="gray.300">
            {description}
          </Text>
        )}

        {/* Quantity */}
        <HStack>
          <Text fontSize="sm" color="gray.400">
            数量:
          </Text>
          {onUpdateItemProperty ? (
            <EditableNumberInput
              value={item.count || 1}
              onChange={(newValue) =>
                onUpdateItemProperty(item.key, 'count', newValue)
              }
              min={1}
            />
          ) : (
            <Text fontSize="sm" color="white">
              {item.count || 1}
            </Text>
          )}
        </HStack>

        {/* Stats section */}
        <>
          <Box height="1px" bg="gray.600" />
          <VStack align="stretch" gap={2}>
            <Text fontSize="sm" fontWeight="bold" color="white">
              属性数值
            </Text>
            {Object.entries(stats).map(([key, value]) => (
              <HStack key={key} justify="space-between">
                <Text fontSize="sm" color="gray.400">
                  {key}:
                </Text>
                {onUpdateItemProperty ? (
                  <EditableNumberInput
                    value={Number(value)}
                    onChange={(newValue) => {
                      const newStats = { ...stats, [key]: newValue }
                      onUpdateItemProperty(item.key, 'stats', newStats)
                    }}
                    min={0}
                  />
                ) : (
                  <Text fontSize="sm" color="white">
                    {Number(value)}
                  </Text>
                )}
              </HStack>
            ))}
            {onUpdateItemProperty && (
              <VStack align="stretch" gap={2} mt={2}>
                <HStack justify="space-between">
                  <EditableText
                    value={newStatName}
                    onChange={setNewStatName}
                    placeholder="属性名称..."
                  />
                  <EditableNumberInput
                    value={newStatValue ? Number(newStatValue) : 0}
                    onChange={(newValue) => setNewStatValue(String(newValue))}
                    min={0}
                  />
                </HStack>
                <Button
                  size="xs"
                  colorPalette="blue"
                  onClick={() => {
                    if (newStatName.trim()) {
                      const newStats = {
                        ...stats,
                        [newStatName.trim()]: Number(newStatValue) || 0,
                      }
                      onUpdateItemProperty(item.key, 'stats', newStats)
                      setNewStatName('')
                      setNewStatValue('')
                    }
                  }}
                >
                  添加属性数值
                </Button>
              </VStack>
            )}
          </VStack>
        </>

        {/* Properties section */}
        <>
          <Box height="1px" bg="gray.600" />
          <VStack align="stretch" gap={2}>
            <Text fontSize="sm" fontWeight="bold" color="white">
              特殊属性
            </Text>
            {Object.entries(properties).map(([key, value]) => (
              <HStack key={key} justify="space-between">
                <Text fontSize="sm" color="gray.400">
                  {key}:
                </Text>
                {onUpdateItemProperty ? (
                  <EditableText
                    value={String(value)}
                    onChange={(newValue) => {
                      const newProperties = { ...properties, [key]: newValue }
                      onUpdateItemProperty(
                        item.key,
                        'properties',
                        newProperties
                      )
                    }}
                    placeholder="属性值..."
                  />
                ) : (
                  <Text fontSize="sm" color="white">
                    {String(value)}
                  </Text>
                )}
              </HStack>
            ))}
            {onUpdateItemProperty && (
              <VStack align="stretch" gap={2} mt={2}>
                <HStack justify="space-between">
                  <EditableText
                    value={newPropertyName}
                    onChange={setNewPropertyName}
                    placeholder="属性名称..."
                  />
                  <EditableText
                    value={newPropertyValue}
                    onChange={setNewPropertyValue}
                    placeholder="属性值..."
                  />
                </HStack>
                <Button
                  size="xs"
                  colorPalette="blue"
                  onClick={() => {
                    if (newPropertyName.trim() && newPropertyValue.trim()) {
                      const newProperties = {
                        ...properties,
                        [newPropertyName.trim()]: newPropertyValue.trim(),
                      }
                      onUpdateItemProperty(
                        item.key,
                        'properties',
                        newProperties
                      )
                      setNewPropertyName('')
                      setNewPropertyValue('')
                    }
                  }}
                >
                  添加特殊属性
                </Button>
              </VStack>
            )}
          </VStack>
        </>
      </VStack>
    </Box>
  )
}
