import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Input,
  InputGroup,
} from '@chakra-ui/react'
import {
  EditableStatValue,
  EditableText,
  EditableNumberInput,
} from './EditableComponents'
import { ItemDetailPanel } from './ItemDetailPanel'
import type {
  Character,
  CharacterState,
  StatValue,
  Item,
  ItemTemplate,
} from '@weave/types'
import { useState } from 'react'

interface CharacterStatusPanelProps {
  character: Character
  state: CharacterState
  items?: Record<string, Item>
  itemTemplates?: ItemTemplate[]
  onUpdateStat?: (
    characterId: string,
    statName: string,
    newValue: number
  ) => void | Promise<void>
  onUpdateCharacterInfo?: (
    characterId: string,
    updates: Partial<Character>
  ) => void
  onUpdateCharacterNumericFields?: (
    characterId: string,
    updates: {
      currentLocation?: string
      inventoryCount?: number
      discoveredLoresCount?: number
    }
  ) => void
  onUpdateCharacterPropertiesAndKnowledge?: (
    characterId: string,
    updates: {
      properties?: Record<string, string>
      knowledge?: Record<string, string[]>
    }
  ) => void
  onUpdateCharacterGoals?: (
    characterId: string,
    updates: Record<string, string[]>
  ) => void
  onUpdateCharacterSecrets?: (
    characterId: string,
    updates: Record<string, string[]>
  ) => void
  onUpdateItemName?: (itemKey: string, newName: string) => void
  onUpdateItemProperty?: (
    itemKey: string,
    property: string,
    newValue: any
  ) => void
  onAddItemToCharacterInventory?: (characterId: string, item: any) => void
  onRemoveItemFromCharacterInventory?: (
    characterId: string,
    itemKey: string
  ) => void
}

interface StatDisplayProps {
  label: string
  stat: StatValue
  color: string
}

const StatDisplay = ({ label, stat, color }: StatDisplayProps) => (
  <VStack align="stretch" gap={1}>
    <HStack justify="space-between">
      <Text fontSize="xs" color="gray.400">
        {label}
      </Text>
      <Text fontSize="xs" color="white">
        {stat.current}/{stat.max}
      </Text>
    </HStack>
    <Box height="4px" bg="gray.700" borderRadius="full" overflow="hidden">
      <Box
        height="100%"
        bg={color}
        width={`${stat.max ? (stat.current / stat.max) * 100 : 0}%`}
      />
    </Box>
  </VStack>
)

interface EditableStatProps {
  label: string
  stat: StatValue
  onChange: (newValue: number) => void
}

const EditableStat = ({ label, stat, onChange }: EditableStatProps) => (
  <EditableStatValue
    label={label}
    stat={stat}
    onChange={onChange}
    max={stat.max}
  />
)

interface EditableCategorySectionProps {
  title: string
  data: Record<string, string[]> | undefined
  onAddCategory?: (categoryName: string) => void
  onDeleteCategory?: (categoryName: string) => void
  onAddItem?: (categoryName: string, item: string) => void
  onUpdateItem?: (categoryName: string, index: number, newValue: string) => void
  onDeleteItem?: (categoryName: string, index: number) => void
  newItemValues: Record<string, string>
  setNewItemValues: React.Dispatch<React.SetStateAction<Record<string, string>>>
  characterId: string
}

const EditableCategorySection = ({
  title,
  data,
  onAddCategory,
  onDeleteCategory,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  newItemValues,
  setNewItemValues,
  characterId,
}: EditableCategorySectionProps) => {
  return (
    <VStack align="stretch" gap={2}>
      <HStack justify="space-between">
        <Text fontSize="sm" fontWeight="bold" color="white">
          {title}
        </Text>
        {onAddCategory && (
          <Button
            size="xs"
            colorPalette="blue"
            onClick={() => {
              const categoryName = prompt(`请输入新的${title}类别名称:`)
              if (categoryName) {
                onAddCategory(categoryName)
              }
            }}
          >
            添加类别
          </Button>
        )}
      </HStack>

      {data && Object.keys(data).length > 0 ? (
        Object.entries(data).map(([category, items]) => (
          <VStack key={category} align="stretch" gap={1}>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.400">
                {category}:
              </Text>
              {onDeleteCategory && (
                <HStack gap={1}>
                  <Button
                    size="xs"
                    colorPalette="red"
                    onClick={() => {
                      if (
                        confirm(
                          `确定要删除"${category}"类别吗？这将删除该类别的所有${title}。`
                        )
                      ) {
                        onDeleteCategory(category)
                      }
                    }}
                  >
                    ×
                  </Button>
                </HStack>
              )}
            </HStack>
            {items.map((item, index) => (
              <HStack key={index} justify="space-between" pl={2}>
                {onUpdateItem ? (
                  <HStack width="100%" justify="space-between">
                    <EditableText
                      value={item}
                      onChange={(newValue) => {
                        onUpdateItem(category, index, newValue)
                      }}
                      placeholder={`${title}...`}
                    />
                    <Button
                      size="xs"
                      colorPalette="red"
                      onClick={() => {
                        if (confirm('确定要删除这个项目吗？')) {
                          onDeleteItem?.(category, index)
                        }
                      }}
                    >
                      ×
                    </Button>
                  </HStack>
                ) : (
                  <Text fontSize="sm" color="white">
                    {item}
                  </Text>
                )}
              </HStack>
            ))}
            {onAddItem && (
              <InputGroup mt={2} width="200px">
                <Input
                  value={newItemValues[category] || ''}
                  onChange={(e) =>
                    setNewItemValues((prev) => ({
                      ...prev,
                      [category]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const newItem = newItemValues[category]?.trim()
                      if (newItem) {
                        onAddItem(category, newItem)
                        // Clear the input
                        setNewItemValues((prev) => ({
                          ...prev,
                          [category]: '',
                        }))
                      }
                    }
                  }}
                  onBlur={() => {
                    const newItem = newItemValues[category]?.trim()
                    if (newItem) {
                      onAddItem(category, newItem)
                      // Clear the input
                      setNewItemValues((prev) => ({ ...prev, [category]: '' }))
                    }
                  }}
                  placeholder={`输入${title}并按回车或失焦添加`}
                  size="xs"
                />
              </InputGroup>
            )}
          </VStack>
        ))
      ) : (
        <Text fontSize="sm" color="gray.500">
          暂无{title}信息
        </Text>
      )}
    </VStack>
  )
}

interface InventoryItemProps {
  itemKey: string
  item: Item | undefined
  template: ItemTemplate | null | undefined
  itemName: string
  rarity: string
  type: string
  isNPC: boolean
  characterId: string
  setSelectedItemKey: (key: string | null) => void
  onUpdateItemName?: (itemKey: string, newName: string) => void
  onRemoveItemFromCharacterInventory?: (
    characterId: string,
    itemKey: string
  ) => void
  onUpdateCharacterNumericFields?: (
    characterId: string,
    updates: {
      currentLocation?: string
      inventoryCount?: number
      discoveredLoresCount?: number
    }
  ) => void
  state: CharacterState
}

const InventoryItem = ({
  itemKey,
  item,
  template,
  itemName,
  rarity,
  type,
  isNPC,
  characterId,
  setSelectedItemKey,
  onUpdateItemName,
  onRemoveItemFromCharacterInventory,
  onUpdateCharacterNumericFields,
  state,
}: InventoryItemProps) => {
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
    <Box bg="gray.700" p={2} borderRadius="md" _hover={{ bg: 'gray.600' }}>
      <HStack justify="space-between">
        <HStack>
          <Button
            size="xs"
            colorPalette="gray"
            onClick={() => setSelectedItemKey(itemKey)}
          >
            查看
          </Button>
          <Text fontSize="sm" color="white">
            {itemName}
          </Text>
          <Badge
            colorPalette={rarityColors[rarity] || 'gray'}
            variant="solid"
            fontSize="xs"
          >
            {rarity}
          </Badge>
          <Badge colorPalette="teal" variant="solid" fontSize="xs">
            {typeDisplay[type] || type}
          </Badge>
        </HStack>
        <HStack>
          {onUpdateItemName && item && !isNPC ? (
            <EditableText
              value={itemName}
              onChange={(newValue) => {
                onUpdateItemName(itemKey, newValue)
              }}
              placeholder="物品名称..."
            />
          ) : null}
          <Button
            size="xs"
            colorPalette="red"
            onClick={() => {
              if (confirm('确定要删除这个物品吗？')) {
                if (onRemoveItemFromCharacterInventory) {
                  onRemoveItemFromCharacterInventory(characterId, itemKey)
                } else if (onUpdateCharacterNumericFields) {
                  const updatedInventory = (state.inventory || []).filter(
                    (key) => key !== itemKey
                  )
                  onUpdateCharacterNumericFields(characterId, {
                    inventoryCount: updatedInventory.length,
                  })
                }
              }
            }}
          >
            ×
          </Button>
        </HStack>
      </HStack>
    </Box>
  )
}

export function CharacterStatusPanel({
  character,
  state,
  items,
  onUpdateStat,
  onUpdateCharacterInfo,
  onUpdateCharacterNumericFields,
  onUpdateCharacterPropertiesAndKnowledge,
  onUpdateCharacterGoals,
  onUpdateCharacterSecrets,
  onUpdateItemName,
  onUpdateItemProperty,
  onAddItemToCharacterInventory,
  onRemoveItemFromCharacterInventory,
  itemTemplates,
}: CharacterStatusPanelProps) {
  const [selectedItemKey, setSelectedItemKey] = useState<string | null>(null)
  const [newItemName, setNewItemName] = useState('')
  const [newKnowledgeItem, setNewKnowledgeItem] = useState<
    Record<string, string>
  >({})
  const [newGoalItem, setNewGoalItem] = useState<Record<string, string>>({})
  const [newSecretItem, setNewSecretItem] = useState<Record<string, string>>({})

  // Get the most important stats to display
  const healthStat = state.stats?.health
  const manaStat = state.stats?.mana
  const staminaStat = state.stats?.stamina

  const handleStatChange = (statName: string) => (newValue: number) => {
    if (onUpdateStat) {
      void onUpdateStat(character.id, statName, newValue)
    }
  }

  const handleAddItem = () => {
    if (newItemName.trim() && onAddItemToCharacterInventory) {
      // Generate a unique key for the new item
      const newItemKey = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Create a new item
      const newItem = {
        key: newItemKey,
        name: newItemName.trim(),
        description: '新物品',
        type: 'misc',
        rarity: 'common',
      }

      // Add the item to the world state and character's inventory
      onAddItemToCharacterInventory(character.id, newItem)

      // Clear the input
      setNewItemName('')
    }
  }

  const renderStat = (
    stat: StatValue | undefined,
    label: string,
    color: string,
    statName: string
  ) => {
    if (!stat) return null
    return (
      <VStack align="stretch" gap={1}>
        {onUpdateStat ? (
          <EditableStat
            label={label}
            stat={stat}
            onChange={handleStatChange(statName)}
          />
        ) : (
          <StatDisplay label={label} stat={stat} color={color} />
        )}
      </VStack>
    )
  }

  // Check if this is an NPC (id starts with 'npc-')
  const isNPC = character.id.startsWith('npc-')

  // For NPCs, we still want to show their basic info and inventory if they have any
  // Even if they don't have detailed stats like players

  // Handle item selection for detail view
  const selectedItem =
    selectedItemKey && items?.[selectedItemKey] ? items[selectedItemKey] : null

  return (
    <Box
      bg="gray.800"
      p={4}
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.600"
    >
      <VStack align="stretch" gap={3}>
        <HStack justify="space-between">
          <HStack gap={2}>
            {onUpdateCharacterInfo ? (
              <EditableText
                value={character.name}
                onChange={(newValue) =>
                  onUpdateCharacterInfo(character.id, { name: newValue })
                }
                placeholder="角色姓名..."
              />
            ) : (
              <Text fontSize="md" fontWeight="bold" color="white">
                {character.name}
              </Text>
            )}
          </HStack>
          <Box
            bg={isNPC ? 'purple.500' : 'blue.500'}
            color="white"
            px={1}
            py={0.5}
            borderRadius="sm"
            fontSize="xs"
          >
            {isNPC ? 'NPC' : '玩家角色'}
          </Box>
        </HStack>

        {onUpdateCharacterInfo ? (
          <EditableText
            value={character.description}
            onChange={(newValue) =>
              onUpdateCharacterInfo(character.id, { description: newValue })
            }
            placeholder="角色描述..."
          />
        ) : (
          <Text fontSize="sm" color="gray.400">
            {character.description}
          </Text>
        )}

        {/* Current Location Section */}
        <Box height="1px" bg="gray.600" />

        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.400">
            当前位置:
          </Text>
          {onUpdateCharacterNumericFields && !isNPC ? (
            <EditableText
              value={state.currentLocationName || ''}
              onChange={(newValue) =>
                onUpdateCharacterNumericFields(character.id, {
                  currentLocation: newValue,
                })
              }
              placeholder="当前位置..."
            />
          ) : (
            <Text fontSize="sm" color="white">
              {state.currentLocationName || '未知'}
            </Text>
          )}
        </HStack>

        {/* Inventory Count Section */}
        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.400">
            拥有物品:
          </Text>
          {onUpdateCharacterNumericFields && !isNPC ? (
            <EditableNumberInput
              value={state.inventory?.length || 0}
              onChange={(newValue: number) =>
                onUpdateCharacterNumericFields(character.id, {
                  inventoryCount: newValue,
                })
              }
              min={0}
            />
          ) : (
            <Text fontSize="sm" color="white">
              {state.inventory?.length || 0} 件
            </Text>
          )}
        </HStack>

        {/* Discovered Lores Section */}
        {(state.discoveredLores?.length || 0) > 0 && (
          <>
            <Box height="1px" bg="gray.600" />
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.400">
                已知传说:
              </Text>
              {onUpdateCharacterNumericFields && !isNPC ? (
                <EditableNumberInput
                  value={state.discoveredLores?.length || 0}
                  onChange={(newValue: number) =>
                    onUpdateCharacterNumericFields(character.id, {
                      discoveredLoresCount: newValue,
                    })
                  }
                  min={0}
                />
              ) : (
                <Text fontSize="sm" color="white">
                  {state.discoveredLores?.length || 0} 项
                </Text>
              )}
            </HStack>
          </>
        )}

        {/* Stats Section for Non-NPC Characters */}
        {!isNPC && (
          <>
            <Box height="1px" bg="gray.600" />

            <VStack align="stretch" gap={2}>
              <Text fontSize="sm" fontWeight="bold" color="white">
                当前状态
              </Text>

              {renderStat(healthStat, '生命值', 'red.500', 'health')}
              {renderStat(manaStat, '法力值', 'blue.500', 'mana')}
              {renderStat(staminaStat, '体力', 'green.500', 'stamina')}
            </VStack>
          </>
        )}

        {/* Attributes Section for Non-NPC Characters */}
        {!isNPC &&
          state.attributes &&
          Object.keys(state.attributes).length > 0 && (
            <>
              <Box height="1px" bg="gray.600" />

              <VStack align="stretch" gap={2}>
                <Text fontSize="sm" fontWeight="bold" color="white">
                  属性
                </Text>

                {Object.entries(state.attributes).map(([key, value]) => (
                  <HStack key={key} justify="space-between">
                    <Text fontSize="sm" color="gray.400">
                      {key}:
                    </Text>
                    {onUpdateCharacterPropertiesAndKnowledge ? (
                      <EditableNumberInput
                        value={value}
                        onChange={(newValue: number) =>
                          onUpdateCharacterPropertiesAndKnowledge(
                            character.id,
                            {
                              properties: {
                                ...state.properties,
                                [key]: String(newValue),
                              },
                            }
                          )
                        }
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

        {/* Skills Section for Non-NPC Characters */}
        {!isNPC &&
          state.properties &&
          Object.keys(state.properties).length > 0 && (
            <>
              <Box height="1px" bg="gray.600" />

              <VStack align="stretch" gap={2}>
                <Text fontSize="sm" fontWeight="bold" color="white">
                  技能与能力
                </Text>

                {Object.entries(state.properties).map(([key, value]) => (
                  <HStack key={key} justify="space-between">
                    <Text fontSize="sm" color="gray.400">
                      {key}:
                    </Text>
                    {onUpdateCharacterPropertiesAndKnowledge ? (
                      <EditableText
                        value={value}
                        onChange={(newValue) =>
                          onUpdateCharacterPropertiesAndKnowledge(
                            character.id,
                            {
                              properties: { [key]: newValue },
                            }
                          )
                        }
                        placeholder={`${key}...`}
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

        {/* Knowledge Section for Non-NPC Characters */}
        {!isNPC && (
          <>
            <Box height="1px" bg="gray.600" />
            <EditableCategorySection
              title="知识与专长"
              data={state.knowledge}
              onAddCategory={
                onUpdateCharacterPropertiesAndKnowledge
                  ? (categoryName) => {
                      const updatedKnowledge = {
                        ...state.knowledge,
                        [categoryName]: [],
                      }
                      onUpdateCharacterPropertiesAndKnowledge(character.id, {
                        knowledge: updatedKnowledge,
                      })
                    }
                  : undefined
              }
              onDeleteCategory={
                onUpdateCharacterPropertiesAndKnowledge
                  ? (categoryName) => {
                      const updatedKnowledge = { ...state.knowledge }
                      delete updatedKnowledge[categoryName]
                      onUpdateCharacterPropertiesAndKnowledge(character.id, {
                        knowledge: updatedKnowledge,
                      })
                    }
                  : undefined
              }
              onAddItem={
                onUpdateCharacterPropertiesAndKnowledge
                  ? (categoryName, item) => {
                      const updatedItems = [
                        ...(state.knowledge?.[categoryName] || []),
                        item,
                      ]
                      const updatedKnowledge = {
                        ...state.knowledge,
                        [categoryName]: updatedItems,
                      }
                      onUpdateCharacterPropertiesAndKnowledge(character.id, {
                        knowledge: updatedKnowledge,
                      })
                    }
                  : undefined
              }
              onUpdateItem={
                onUpdateCharacterPropertiesAndKnowledge
                  ? (categoryName, index, newValue) => {
                      const items = state.knowledge?.[categoryName] || []
                      const updatedItems = [...items]
                      updatedItems[index] = newValue
                      onUpdateCharacterPropertiesAndKnowledge(character.id, {
                        knowledge: { [categoryName]: updatedItems },
                      })
                    }
                  : undefined
              }
              onDeleteItem={
                onUpdateCharacterPropertiesAndKnowledge
                  ? (categoryName, index) => {
                      const items = state.knowledge?.[categoryName] || []
                      const updatedItems = items.filter((_, i) => i !== index)
                      onUpdateCharacterPropertiesAndKnowledge(character.id, {
                        knowledge: { [categoryName]: updatedItems },
                      })
                    }
                  : undefined
              }
              newItemValues={newKnowledgeItem}
              setNewItemValues={setNewKnowledgeItem}
              characterId={character.id}
            />
          </>
        )}

        {/* Goals Section for Non-NPC Characters */}
        {!isNPC && (
          <>
            <Box height="1px" bg="gray.600" />
            <EditableCategorySection
              title="目标"
              data={state.goals}
              onAddCategory={
                onUpdateCharacterGoals
                  ? (categoryName) => {
                      const updatedGoals = {
                        ...state.goals,
                        [categoryName]: [],
                      }
                      onUpdateCharacterGoals(character.id, updatedGoals)
                    }
                  : undefined
              }
              onDeleteCategory={
                onUpdateCharacterGoals
                  ? (categoryName) => {
                      const updatedGoals = { ...state.goals }
                      delete updatedGoals[categoryName]
                      onUpdateCharacterGoals(character.id, updatedGoals)
                    }
                  : undefined
              }
              onAddItem={
                onUpdateCharacterGoals
                  ? (categoryName, item) => {
                      const updatedItems = [
                        ...(state.goals?.[categoryName] || []),
                        item,
                      ]
                      const updatedGoals = {
                        ...state.goals,
                        [categoryName]: updatedItems,
                      }
                      onUpdateCharacterGoals(character.id, updatedGoals)
                    }
                  : undefined
              }
              onUpdateItem={
                onUpdateCharacterGoals
                  ? (categoryName, index, newValue) => {
                      const items = state.goals?.[categoryName] || []
                      const updatedItems = [...items]
                      updatedItems[index] = newValue
                      onUpdateCharacterGoals(character.id, {
                        [categoryName]: updatedItems,
                      })
                    }
                  : undefined
              }
              onDeleteItem={
                onUpdateCharacterGoals
                  ? (categoryName, index) => {
                      const items = state.goals?.[categoryName] || []
                      const updatedItems = items.filter((_, i) => i !== index)
                      onUpdateCharacterGoals(character.id, {
                        [categoryName]: updatedItems,
                      })
                    }
                  : undefined
              }
              newItemValues={newGoalItem}
              setNewItemValues={setNewGoalItem}
              characterId={character.id}
            />
          </>
        )}

        {/* Secrets Section for Non-NPC Characters */}
        {!isNPC && (
          <>
            <Box height="1px" bg="gray.600" />
            <EditableCategorySection
              title="秘密"
              data={state.secrets}
              onAddCategory={
                onUpdateCharacterSecrets
                  ? (categoryName) => {
                      const updatedSecrets = {
                        ...state.secrets,
                        [categoryName]: [],
                      }
                      onUpdateCharacterSecrets(character.id, updatedSecrets)
                    }
                  : undefined
              }
              onDeleteCategory={
                onUpdateCharacterSecrets
                  ? (categoryName) => {
                      const updatedSecrets = { ...state.secrets }
                      delete updatedSecrets[categoryName]
                      onUpdateCharacterSecrets(character.id, updatedSecrets)
                    }
                  : undefined
              }
              onAddItem={
                onUpdateCharacterSecrets
                  ? (categoryName, item) => {
                      const updatedItems = [
                        ...(state.secrets?.[categoryName] || []),
                        item,
                      ]
                      const updatedSecrets = {
                        ...state.secrets,
                        [categoryName]: updatedItems,
                      }
                      onUpdateCharacterSecrets(character.id, updatedSecrets)
                    }
                  : undefined
              }
              onUpdateItem={
                onUpdateCharacterSecrets
                  ? (categoryName, index, newValue) => {
                      const items = state.secrets?.[categoryName] || []
                      const updatedItems = [...items]
                      updatedItems[index] = newValue
                      onUpdateCharacterSecrets(character.id, {
                        [categoryName]: updatedItems,
                      })
                    }
                  : undefined
              }
              onDeleteItem={
                onUpdateCharacterSecrets
                  ? (categoryName, index) => {
                      const items = state.secrets?.[categoryName] || []
                      const updatedItems = items.filter((_, i) => i !== index)
                      onUpdateCharacterSecrets(character.id, {
                        [categoryName]: updatedItems,
                      })
                    }
                  : undefined
              }
              newItemValues={newSecretItem}
              setNewItemValues={setNewSecretItem}
              characterId={character.id}
            />
          </>
        )}

        {/* Inventory Items Section */}
        {!isNPC && (
          <>
            <Box height="1px" bg="gray.600" />

            <VStack align="stretch" gap={2}>
              <Text fontSize="sm" fontWeight="bold" color="white">
                拥有物品
              </Text>

              {selectedItem ? (
                <VStack align="stretch" gap={2}>
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
                    itemTemplates={itemTemplates}
                    onUpdateItemProperty={onUpdateItemProperty}
                  />
                </VStack>
              ) : state.inventory && state.inventory.length > 0 ? (
                state.inventory.map((itemKey, index) => {
                  const item = items?.[itemKey]
                  // Find the template for this item if it exists
                  const template = item?.templateName
                    ? itemTemplates?.find((t) => t.name === item.templateName)
                    : null

                  // Merge template and item properties, with item properties taking precedence
                  const itemName = item?.name || template?.name || itemKey
                  const rarity = item?.rarity || template?.rarity || 'common'
                  const type = item?.type || template?.type || 'unknown'

                  return (
                    <InventoryItem
                      key={index}
                      itemKey={itemKey}
                      item={item}
                      template={template}
                      itemName={itemName}
                      rarity={rarity}
                      type={type}
                      isNPC={isNPC}
                      characterId={character.id}
                      setSelectedItemKey={setSelectedItemKey}
                      onUpdateItemName={onUpdateItemName}
                      onRemoveItemFromCharacterInventory={
                        onRemoveItemFromCharacterInventory
                      }
                      onUpdateCharacterNumericFields={
                        onUpdateCharacterNumericFields
                      }
                      state={state}
                    />
                  )
                })
              ) : (
                <Text fontSize="sm" color="gray.500">
                  暂无物品
                </Text>
              )}
              {onAddItemToCharacterInventory && (
                <InputGroup mt={2}>
                  <Input
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddItem()
                      }
                    }}
                    onBlur={handleAddItem}
                    placeholder="输入物品名称并按回车或失焦添加"
                    size="xs"
                  />
                </InputGroup>
              )}
            </VStack>
          </>
        )}
      </VStack>
    </Box>
  )
}
