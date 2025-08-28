import { Box, Text, VStack, HStack, Badge } from '@chakra-ui/react'
import { useMemo } from 'react'
import { EditableText } from '../shared-editable-components'
import { EditableNumberInput } from '../shared-number-slider-components'
import type { Item, ItemTemplate } from '@weave/types'

interface ItemDetailPanelProps {
  item: Item
  itemTemplates?: ItemTemplate[]
  onUpdateItemProperty?: (
    itemKey: string,
    property: string,
    newValue: any
  ) => void
}

export function ItemDetailPanel({
  item,
  itemTemplates = [],
  onUpdateItemProperty,
}: ItemDetailPanelProps) {
  // Find the template for this item if it exists - use useMemo to ensure real-time updates
  const template = useMemo(() => {
    return item.templateName
      ? itemTemplates.find((t) => t.name === item.templateName)
      : null
  }, [item.templateName, itemTemplates])

  // Merge template and item properties, with item properties taking precedence - use useMemo
  const displayName = useMemo(() => {
    return item.name || template?.name || item.key
  }, [item.name, template?.name, item.key])

  const description = useMemo(() => {
    return item.description || template?.description || '暂无描述'
  }, [item.description, template?.description])

  const type = useMemo(() => {
    return item.type || template?.type || 'unknown'
  }, [item.type, template?.type])

  const rarity = useMemo(() => {
    return item.rarity || template?.rarity || 'common'
  }, [item.rarity, template?.rarity])

  const properties = useMemo(() => {
    return {
      ...(template?.properties || {}),
      ...(item.properties || {}),
    }
  }, [template?.properties, item.properties])

  const stats = useMemo(() => {
    return { ...(template?.stats || {}), ...(item.stats || {}) }
  }, [template?.stats, item.stats])

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
        {Object.keys(stats).length > 0 && (
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
            </VStack>
          </>
        )}

        {/* Properties section */}
        {Object.keys(properties).length > 0 && (
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
            </VStack>
          </>
        )}
      </VStack>
    </Box>
  )
}
