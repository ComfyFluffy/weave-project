import { Box, Text, VStack, HStack, Badge } from '@chakra-ui/react'
import { EditableText, EditableNumberInput } from './EditableComponents'
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
  // Find the template for this item if it exists
  const template = item.templateName
    ? itemTemplates.find((t) => t.name === item.templateName)
    : null

  // Merge template and item properties, with item properties taking precedence
  const displayName = item.name || template?.name || item.key
  const description = item.description || template?.description || '暂无描述'
  const type = item.type || template?.type || 'unknown'
  const rarity = item.rarity || template?.rarity || 'common'
  const properties = {
    ...(template?.properties || {}),
    ...(item.properties || {}),
  }
  const stats = { ...(template?.stats || {}), ...(item.stats || {}) }

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

        {/* Quantity if applicable */}
        {item.count && item.count > 1 && (
          <HStack>
            <Text fontSize="sm" color="gray.400">
              数量:
            </Text>
            {onUpdateItemProperty ? (
              <EditableNumberInput
                value={item.count}
                onChange={(newValue) =>
                  onUpdateItemProperty(item.key, 'count', newValue)
                }
                min={1}
              />
            ) : (
              <Text fontSize="sm" color="white">
                {item.count}
              </Text>
            )}
          </HStack>
        )}

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
                      value={value}
                      onChange={(newValue) => {
                        const newStats = { ...stats, [key]: newValue }
                        onUpdateItemProperty(item.key, 'stats', newStats)
                      }}
                      min={0}
                    />
                  ) : (
                    <Text fontSize="sm" color="white">
                      {value}
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
                      value={value}
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
                      {value}
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
