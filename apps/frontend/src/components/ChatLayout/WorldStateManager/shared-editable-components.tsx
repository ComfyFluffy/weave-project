import { useState, useEffect } from 'react'
import { Box, Text, Input, VStack, HStack, Button } from '@chakra-ui/react'
import type { StatValue } from '@weave/types'

// EditableText 组件
interface EditableTextProps {
  value: string
  onChange: (newValue: string) => void
  placeholder?: string
  isEditing?: boolean
  onEditChange?: (editing: boolean) => void
}

export const EditableText: React.FC<EditableTextProps> = ({
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

export const EditableList: React.FC<EditableListProps> = ({
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

// FieldRow 组件 - 用于渲染一致的字段行，支持可编辑模式和只读模式
export interface FieldRowProps {
  label: string
  value: string | number
  onEdit?: (newValue: string | number) => void
  isEditing?: boolean
  placeholder?: string
}

export const FieldRow: React.FC<FieldRowProps> = ({
  label,
  value,
  onEdit,
  isEditing = false,
  placeholder,
}) => (
  <HStack justify="space-between">
    <Text fontSize="sm" color="gray.400">
      {label}:
    </Text>

    {isEditing && onEdit ? (
      typeof value === 'string' ? (
        <EditableText
          value={value}
          onChange={(newValue) => onEdit(newValue)}
          placeholder={placeholder}
        />
      ) : (
        <Text fontSize="sm" color="white">
          {value}
        </Text>
      )
    ) : (
      <Text fontSize="sm" color="white">
        {value}
      </Text>
    )}
  </HStack>
)
