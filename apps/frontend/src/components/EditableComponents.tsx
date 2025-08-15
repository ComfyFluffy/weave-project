import { useState, useEffect } from 'react'
import {
  Box,
  Text,
  Input,
  NumberInputRoot,
  NumberInputControl,
  NumberInputInput,
  NumberInputIncrementTrigger,
  NumberInputDecrementTrigger,
  SliderRoot,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
  VStack,
  HStack,
  Button,
} from '@chakra-ui/react'
import type { StatValue } from '@weave/types'

// EditableText 组件
interface EditableTextProps {
  value: string
  onChange: (newValue: string) => void
  placeholder?: string
}

export function EditableText({
  value,
  onChange,
  placeholder = '双击编辑...',
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  const handleDoubleClick = () => {
    setTempValue(value)
    setIsEditing(true)
  }

  const handleSave = () => {
    onChange(tempValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempValue(value)
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempValue(e.target.value)
  }

  if (isEditing) {
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

// EditableNumberInput 组件
interface EditableNumberInputProps {
  value: number
  onChange: (newValue: number) => void
  min?: number
  max?: number
  step?: number
}

export function EditableNumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
}: EditableNumberInputProps) {
  const [tempValue, setTempValue] = useState(value.toString())

  const handleValueChange = (details: {
    value: string
    valueAsNumber: number
  }) => {
    setTempValue(details.value)
    // Only call onChange if we have a valid number
    if (!isNaN(details.valueAsNumber)) {
      onChange(details.valueAsNumber)
    }
  }

  return (
    <NumberInputRoot
      value={tempValue}
      onValueChange={handleValueChange}
      min={min}
      max={max}
      step={step}
      width="fit-content"
    >
      <NumberInputInput width="80px" />
      <NumberInputControl>
        <NumberInputIncrementTrigger />
        <NumberInputDecrementTrigger />
      </NumberInputControl>
    </NumberInputRoot>
  )
}

// EditableStatValue 组件
interface EditableStatValueProps {
  label: string
  stat: StatValue
  onChange: (newValue: number) => void
  min?: number
  max?: number
  step?: number
}

export function EditableStatValue({
  label,
  stat,
  onChange,
  min = 0,
  max = stat.max || 100,
  step = 1,
}: EditableStatValueProps) {
  const [value, setValue] = useState(stat.current)

  // Update value when stat changes externally
  useEffect(() => {
    setValue(stat.current)
  }, [stat])

  const handleInputChange = (details: {
    value: string
    valueAsNumber: number
  }) => {
    const numValue = details.valueAsNumber
    if (!isNaN(numValue)) {
      setValue(numValue)
      onChange(numValue)
    }
  }

  const handleSliderChange = (details: { value: number[] }) => {
    const newValue = details.value[0]
    setValue(newValue)
    onChange(newValue)
  }

  return (
    <VStack width="100%" gap={3}>
      <HStack justify="space-between">
        <Text fontSize="xs" color="gray.400">
          {label}
        </Text>
        <Text fontSize="xs" color="white">
          {value}/{stat.max}
        </Text>
      </HStack>

      <NumberInputRoot
        value={value.toString()}
        onValueChange={handleInputChange}
        min={min}
        max={max}
        step={step}
        width="100%"
      >
        <NumberInputInput />
        <NumberInputControl>
          <NumberInputIncrementTrigger />
          <NumberInputDecrementTrigger />
        </NumberInputControl>
      </NumberInputRoot>

      <SliderRoot
        value={[value]}
        onValueChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        width="100%"
      >
        <SliderControl>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>
          <SliderThumb index={0} />
        </SliderControl>
      </SliderRoot>
    </VStack>
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
