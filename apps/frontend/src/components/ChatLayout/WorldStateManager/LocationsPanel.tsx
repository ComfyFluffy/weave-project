import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Select,
  Portal,
  createListCollection,
  Input,
} from '@chakra-ui/react'
import { useState } from 'react'
import type { Location } from '@weave/types'
import { MapPin, Users } from 'lucide-react'

interface LocationsPanelProps {
  locations: Location[]
  characterNames?: string[]
  onLocationUpdate?: (
    locationName: string,
    field:
      | 'connectedLocations'
      | 'currentOccupants'
      | 'description'
      | 'notableFeatures'
      | 'items',
    value: string[] | string
  ) => void
  onAddLocation?: (newLocation: Location) => void
  onDeleteLocation?: (locationName: string) => void
}

// EditableText component for inline editing
interface EditableTextProps {
  value: string
  onChange: (newValue: string) => void
  placeholder?: string
  isEditing?: boolean
  onEditChange?: (editing: boolean) => void
}

const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  placeholder = '双击编辑...',
  isEditing,
  onEditChange,
}) => {
  const [internalIsEditing, setInternalIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  const isCurrentlyEditing =
    isEditing !== undefined ? isEditing : internalIsEditing
  const setIsCurrentlyEditing = onEditChange || setInternalIsEditing

  const handleDoubleClick = () => {
    setTempValue(value)
    setIsCurrentlyEditing(true)
  }

  const handleSave = () => {
    onChange(tempValue)
    setIsCurrentlyEditing(false)
  }

  const handleCancel = () => {
    setTempValue(value)
    setIsCurrentlyEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempValue(e.target.value)
  }

  if (isCurrentlyEditing) {
    return (
      <Box>
        <Input
          value={tempValue}
          onChange={handleChange}
          placeholder={placeholder}
          autoFocus
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave()
            } else if (e.key === 'Escape') {
              handleCancel()
            }
          }}
          bg="gray.700"
          color="white"
          borderColor="gray.600"
          _focus={{ borderColor: 'blue.400' }}
        />
      </Box>
    )
  }

  return (
    <Text
      color={value ? 'white' : 'gray.500'}
      _hover={{ bg: 'gray.700', cursor: 'pointer' }}
      onDoubleClick={handleDoubleClick}
      p={1}
      borderRadius="sm"
    >
      {value || placeholder}
    </Text>
  )
}

// EditableList component for editing lists of items
interface EditableListProps {
  items: string[]
  onItemsChange: (newItems: string[]) => void
  placeholder?: string
  itemPrefix?: string
}

const EditableList: React.FC<EditableListProps> = ({
  items,
  onItemsChange,
  placeholder = '双击编辑...',
  itemPrefix = '',
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [newItem, setNewItem] = useState('')

  const handleItemChange = (index: number, newValue: string) => {
    const newItems = [...items]
    newItems[index] = newValue
    onItemsChange(newItems)
  }

  const handleAddItem = () => {
    if (newItem.trim()) {
      onItemsChange([...items, newItem.trim()])
      setNewItem('')
    }
  }

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onItemsChange(newItems)
  }

  return (
    <VStack align="stretch" gap={1}>
      {items.map((item, index) => (
        <HStack key={index} width="100%">
          {editingIndex === index ? (
            <Input
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              onBlur={() => setEditingIndex(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setEditingIndex(null)
                } else if (e.key === 'Escape') {
                  setEditingIndex(null)
                }
              }}
              autoFocus
              size="sm"
              bg="gray.700"
              color="white"
              borderColor="gray.600"
              _focus={{ borderColor: 'blue.400' }}
            />
          ) : (
            <>
              <Text
                fontSize="sm"
                color="gray.300"
                flex={1}
                onDoubleClick={() => setEditingIndex(index)}
                _hover={{ bg: 'gray.700', cursor: 'pointer' }}
                p={1}
                borderRadius="sm"
              >
                {itemPrefix}
                {item}
              </Text>
              <Button
                size="xs"
                colorPalette="red"
                onClick={() => {
                  if (confirm('确定要删除这个项目吗？')) {
                    handleRemoveItem(index)
                  }
                }}
              >
                ×
              </Button>
            </>
          )}
        </HStack>
      ))}

      <HStack>
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          onBlur={handleAddItem}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddItem()
            }
          }}
          size="sm"
          bg="gray.700"
          color="white"
          borderColor="gray.600"
          _focus={{ borderColor: 'blue.400' }}
        />
      </HStack>
    </VStack>
  )
}

// Reusable Tag component for consistent styling
interface TagProps {
  children: React.ReactNode
  onRemove?: () => void
  colorScheme?: string
}

const Tag: React.FC<TagProps> = ({
  children,
  onRemove,
  colorScheme = 'purple',
}) => {
  return (
    <HStack
      bg={`${colorScheme}.500`}
      color="white"
      px={1}
      py={0.5}
      borderRadius="sm"
      fontSize="xs"
    >
      <Text>{children}</Text>
      {onRemove && (
        <Button size="xs" colorPalette="red" onClick={onRemove}>
          ×
        </Button>
      )}
    </HStack>
  )
}

interface GenericSelectProps {
  items: string[]
  selectedItem: string | null
  onSelectionChange: (item: string | null) => void
  placeholder?: string
  label?: string
  icon?: React.ReactNode
}

function GenericSelect({
  items,
  selectedItem,
  onSelectionChange,
  placeholder,
  label,
  icon,
}: GenericSelectProps) {
  // Create collection for select component
  const collection = createListCollection({
    items: items.map((item: string) => ({
      label: item,
      value: item,
    })),
  })

  return (
    <Box>
      {label && (
        <Text
          color="gray.400"
          fontSize="xs"
          fontWeight="semibold"
          textTransform="uppercase"
          letterSpacing="0.5px"
          mb={2}
        >
          {label}
        </Text>
      )}

      <Select.Root
        collection={collection}
        value={selectedItem ? [selectedItem] : []}
        onValueChange={(details) => onSelectionChange(details.value[0] || null)}
        size="sm"
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger
            bg="gray.700"
            borderColor="gray.600"
            color="white"
            _hover={{ bg: 'gray.600' }}
            _focus={{ borderColor: 'blue.400' }}
            width="100%"
          >
            <Box display="flex" alignItems="center" gap={2}>
              {icon}
              <Select.ValueText placeholder={placeholder} />
            </Box>
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>

        <Portal>
          <Select.Positioner>
            <Select.Content
              bg="gray.700"
              borderColor="gray.600"
              shadow="lg"
              maxHeight="200px"
              overflowY="auto"
            >
              {collection.items.map(
                (item: { value: string; label: string }) => (
                  <Select.Item
                    key={item.value}
                    item={item}
                    py={2}
                    px={3}
                    color="white"
                    _hover={{ bg: 'gray.600' }}
                    _selected={{ bg: 'blue.500', color: 'white' }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      width="full"
                    >
                      <Text fontSize="sm">{item.label}</Text>
                    </Box>
                    <Select.ItemIndicator />
                  </Select.Item>
                )
              )}

              {collection.items.length === 0 && (
                <Box py={2} px={3} color="gray.400" fontSize="sm">
                  无可用选项
                </Box>
              )}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Box>
  )
}
export { GenericSelect, Tag }
export function LocationsPanel({
  locations,
  characterNames = [],
  onLocationUpdate,
  onAddLocation,
  onDeleteLocation,
}: LocationsPanelProps) {
  const [editingLocation, setEditingLocation] = useState<string | null>(null)
  const [newConnectedLocation, setNewConnectedLocation] = useState<string>('')
  const [newOccupant, setNewOccupant] = useState<string>('')
  const [editingDescription, setEditingDescription] = useState<string | null>(
    null
  )
  const [editingFeatures, setEditingFeatures] = useState<string | null>(null)
  const [editingItems, setEditingItems] = useState<string | null>(null)
  const [newLocationName, setNewLocationName] = useState<string>('')
  const [newLocationDescription, setNewLocationDescription] = useState<string>('')
  const [isAddingLocation, setIsAddingLocation] = useState<boolean>(false)

  // Extract all unique location names to populate the connection dropdown
  // This includes both existing locations and all referenced connected locations
  const allKnownLocations = new Set<string>()

  // Add current location names
  locations.forEach((location) => {
    allKnownLocations.add(location.name)
  })

  // Add all connected locations (even if they don't exist as location objects yet)
  locations.forEach((location) => {
    if (location.connectedLocations) {
      location.connectedLocations.forEach((conn) => {
        allKnownLocations.add(conn)
      })
    }
  })

  const locationNames = Array.from(allKnownLocations).sort()

  // Generic function to handle adding items to a location's field
  const handleAddToLocationField = (
    locationName: string,
    field: 'connectedLocations' | 'currentOccupants',
    newValue: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!newValue.trim() || !onLocationUpdate) return

    const location = locations.find((loc) => loc.name === locationName)
    if (!location) return

    const updatedValues = [...(location[field] || []), newValue.trim()]

    onLocationUpdate(locationName, field, updatedValues)
    setter('')
  }

  // Generic function to handle removing items from a location's field
  const handleRemoveFromLocationField = (
    locationName: string,
    field: 'connectedLocations' | 'currentOccupants',
    valueToRemove: string
  ) => {
    if (!onLocationUpdate) return

    const location = locations.find((loc) => loc.name === locationName)
    if (!location) return

    const updatedValues = (location[field] || []).filter(
      (val: string) => val !== valueToRemove
    )
    onLocationUpdate(locationName, field, updatedValues)
  }

  // Handler for updating location description
  const handleDescriptionUpdate = (
    locationName: string,
    newDescription: string
  ) => {
    if (!onLocationUpdate) return

    onLocationUpdate(locationName, 'description', newDescription)
    setEditingDescription(null)
  }

  // Handler for updating notable features
  const handleFeaturesUpdate = (
    locationName: string,
    newFeatures: string[]
  ) => {
    if (!onLocationUpdate) return

    onLocationUpdate(locationName, 'notableFeatures', newFeatures)
    setEditingFeatures(null)
  }

  // Handler for updating items
  const handleItemsUpdate = (locationName: string, newItems: string[]) => {
    if (!onLocationUpdate) return

    onLocationUpdate(locationName, 'items', newItems)
    setEditingItems(null)
  }

  // Handler for adding a new location
  const handleAddLocation = () => {
    if (!newLocationName.trim() || !onAddLocation) return

    // Check if location with the same name already exists
    const existingLocation = locations.find(
      (loc) => loc.name.toLowerCase() === newLocationName.trim().toLowerCase()
    )
    
    if (existingLocation) {
      alert('已存在同名地点，请使用其他名称')
      return
    }

    const newLocation: Location = {
      name: newLocationName.trim(),
      description: newLocationDescription.trim(),
      connectedLocations: [],
      notableFeatures: [],
      currentOccupants: [],
      hiddenSecrets: [],
      items: [],
    }

    onAddLocation(newLocation)
    setNewLocationName('')
    setNewLocationDescription('')
    setIsAddingLocation(false)
  }

  // Handler for deleting a location
  const handleDeleteLocation = (locationName: string) => {
    if (!onDeleteLocation) return

    if (confirm(`确定要删除地点 "${locationName}" 吗？此操作不可撤销。`)) {
      onDeleteLocation(locationName)
    }
  }

  if (locations.length === 0 && !isAddingLocation) {
    return (
      <VStack align="stretch" gap={3}>
        <Box p={4} textAlign="center">
          <Text color="gray.500">暂无地点数据</Text>
        </Box>
        {onAddLocation && (
          <Button
            size="sm"
            colorPalette="green"
            onClick={() => setIsAddingLocation(true)}
            width="fit-content"
            mx="auto"
          >
            添加新地点
          </Button>
        )}
      </VStack>
    )
  }

  // Wrapper functions to handle type conversion for onSelectionChange
  const handleConnectedLocationChange = (item: string | null) => {
    setNewConnectedLocation(item || '')
  }

  const handleOccupantChange = (item: string | null) => {
    setNewOccupant(item || '')
  }

  return (
    <VStack align="stretch" gap={3}>
      {/* Add New Location Form */}
      {isAddingLocation && onAddLocation && (
        <Box
          border="1px solid"
          borderColor="gray.600"
          borderRadius="md"
          mb={2}
          bg="gray.700"
        >
          <Box
            bg="gray.600"
            _hover={{ bg: 'gray.500' }}
            borderRadius="md"
            p={3}
          >
            <HStack justify="space-between" py={2}>
              <Text fontWeight="bold" color="white">
                添加新地点
              </Text>
              <HStack gap={2}>
                <Button
                  size="sm"
                  colorPalette="green"
                  onClick={handleAddLocation}
                  disabled={!newLocationName.trim()}
                >
                  保存
                </Button>
                <Button
                  size="sm"
                  colorPalette="gray"
                  onClick={() => {
                    setIsAddingLocation(false)
                    setNewLocationName('')
                    setNewLocationDescription('')
                  }}
                >
                  取消
                </Button>
              </HStack>
            </HStack>
          </Box>

          <Box bg="gray.800" p={4}>
            <VStack align="stretch" gap={3}>
              <VStack align="stretch" gap={1}>
                <Text fontSize="sm" color="gray.400" fontWeight="bold">
                  地点名称:
                </Text>
                <Input
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  placeholder="输入地点名称..."
                  size="sm"
                  bg="gray.700"
                  color="white"
                  borderColor="gray.600"
                  _focus={{ borderColor: 'blue.400' }}
                />
              </VStack>

              <VStack align="stretch" gap={1}>
                <Text fontSize="sm" color="gray.400" fontWeight="bold">
                  地点描述:
                </Text>
                <Input
                  value={newLocationDescription}
                  onChange={(e) => setNewLocationDescription(e.target.value)}
                  placeholder="输入地点描述..."
                  size="sm"
                  bg="gray.700"
                  color="white"
                  borderColor="gray.600"
                  _focus={{ borderColor: 'blue.400' }}
                />
              </VStack>
            </VStack>
          </Box>
        </Box>
      )}

      {/* Existing Locations */}
      {locations.map((location, index) => (
        <Box
          key={index}
          border="1px solid"
          borderColor="gray.600"
          borderRadius="md"
          mb={2}
          bg="gray.700"
        >
          <Box
            bg="gray.700"
            _hover={{ bg: 'gray.600' }}
            borderRadius="md"
            p={3}
          >
            <HStack justify="space-between" py={2}>
              <HStack gap={2}>
                <Text fontWeight="bold" color="white">
                  {location.name}
                </Text>
                <Box
                  bg="green.500"
                  color="white"
                  px={1}
                  py={0.5}
                  borderRadius="sm"
                  fontSize="xs"
                >
                  {location.currentOccupants?.length || 0} 人
                </Box>
              </HStack>
              {onDeleteLocation && (
                <Button
                  size="xs"
                  colorPalette="red"
                  onClick={() => handleDeleteLocation(location.name)}
                >
                  删除
                </Button>
              )}
            </HStack>
          </Box>

          <Box bg="gray.800" p={4}>
            <VStack align="stretch" gap={3}>
              {onLocationUpdate ? (
                <EditableText
                  value={location.description || ''}
                  onChange={(newValue) =>
                    handleDescriptionUpdate(location.name, newValue)
                  }
                  placeholder="暂无描述"
                  isEditing={editingDescription === location.name}
                  onEditChange={(editing) =>
                    setEditingDescription(editing ? location.name : null)
                  }
                />
              ) : (
                <Text fontSize="sm" color="gray.300">
                  {location.description}
                </Text>
              )}

              <Box height="1px" bg="gray.600" />

              {/* Connection Locations Section */}
              <VStack align="stretch" gap={2}>
                <Text fontSize="sm" color="gray.400" fontWeight="bold">
                  连接地点:
                </Text>

                {onLocationUpdate ? (
                  <>
                    <HStack wrap="wrap" gap={2}>
                      {location.connectedLocations?.map((loc, idx) => (
                        <Tag
                          key={idx}
                          onRemove={() => {
                            if (confirm('确定要删除这个连接地点吗？')) {
                              handleRemoveFromLocationField(
                                location.name,
                                'connectedLocations',
                                loc
                              )
                            }
                          }}
                        >
                          {loc}
                        </Tag>
                      ))}
                    </HStack>

                    <HStack>
                      <GenericSelect
                        items={locationNames}
                        selectedItem={newConnectedLocation || null}
                        onSelectionChange={handleConnectedLocationChange}
                        placeholder="添加新连接地点..."
                        icon={<MapPin size={16} />}
                      />
                      <Button
                        size="sm"
                        colorPalette="green"
                        onClick={() =>
                          handleAddToLocationField(
                            location.name,
                            'connectedLocations',
                            newConnectedLocation,
                            setNewConnectedLocation
                          )
                        }
                        disabled={!newConnectedLocation.trim()}
                      >
                        添加
                      </Button>
                    </HStack>
                  </>
                ) : (
                  <HStack wrap="wrap" gap={2}>
                    {location.connectedLocations?.map((loc, idx) => (
                      <Tag key={idx}>{loc}</Tag>
                    ))}
                  </HStack>
                )}
              </VStack>

              {/* Current Occupants Section */}
              <VStack align="stretch" gap={2}>
                <Text fontSize="sm" color="gray.400" fontWeight="bold">
                  当前人员:
                </Text>

                {onLocationUpdate ? (
                  <>
                    <HStack wrap="wrap" gap={2}>
                      {location.currentOccupants?.map((occupant, idx) => (
                        <Tag
                          key={idx}
                          colorScheme="blue"
                          onRemove={() => {
                            if (confirm('确定要删除这个人员吗？')) {
                              handleRemoveFromLocationField(
                                location.name,
                                'currentOccupants',
                                occupant
                              )
                            }
                          }}
                        >
                          {occupant}
                        </Tag>
                      ))}
                    </HStack>

                    <HStack>
                      <GenericSelect
                        items={characterNames}
                        selectedItem={newOccupant || null}
                        onSelectionChange={handleOccupantChange}
                        placeholder="添加新人员..."
                        icon={<Users size={16} />}
                      />
                      <Button
                        size="sm"
                        colorPalette="green"
                        onClick={() =>
                          handleAddToLocationField(
                            location.name,
                            'currentOccupants',
                            newOccupant,
                            setNewOccupant
                          )
                        }
                        disabled={!newOccupant.trim()}
                      >
                        添加
                      </Button>
                    </HStack>
                  </>
                ) : (
                  <HStack wrap="wrap" gap={2}>
                    {location.currentOccupants?.map((occupant, idx) => (
                      <Tag key={idx} colorScheme="blue">
                        {occupant}
                      </Tag>
                    ))}
                  </HStack>
                )}
              </VStack>

              <Box height="1px" bg="gray.600" />
              <VStack align="stretch" gap={1}>
                <Text fontSize="sm" color="gray.400" fontWeight="bold">
                  显著特征:
                </Text>
                {onLocationUpdate ? (
                  <EditableList
                    items={location.notableFeatures || []}
                    onItemsChange={(newFeatures) =>
                      handleFeaturesUpdate(location.name, newFeatures)
                    }
                    placeholder="添加显著特征..."
                    itemPrefix="• "
                  />
                ) : location.notableFeatures &&
                  location.notableFeatures.length > 0 ? (
                  location.notableFeatures.map((feature, idx) => (
                    <Text key={idx} fontSize="sm" color="gray.300">
                      • {feature}
                    </Text>
                  ))
                ) : (
                  <Text fontSize="sm" color="gray.500">
                    暂无显著特征
                  </Text>
                )}
              </VStack>

              <Box height="1px" bg="gray.600" />
              <VStack align="stretch" gap={1}>
                <Text fontSize="sm" color="gray.400" fontWeight="bold">
                  物品:
                </Text>
                {onLocationUpdate ? (
                  <EditableList
                    items={location.items || []}
                    onItemsChange={(newItems) =>
                      handleItemsUpdate(location.name, newItems)
                    }
                    placeholder="添加物品..."
                    itemPrefix="• "
                  />
                ) : location.items && location.items.length > 0 ? (
                  location.items.map((item, idx) => (
                    <Text key={idx} fontSize="sm" color="gray.300">
                      • {item}
                    </Text>
                  ))
                ) : (
                  <Text fontSize="sm" color="gray.500">
                    暂无物品
                  </Text>
                )}
              </VStack>
            </VStack>
          </Box>
        </Box>
      ))}

      {/* Add New Location Button */}
      {!isAddingLocation && onAddLocation && (
        <Button
          size="sm"
          colorPalette="green"
          onClick={() => setIsAddingLocation(true)}
          width="fit-content"
          mx="auto"
        >
          添加新地点
        </Button>
      )}
    </VStack>
  )
}
