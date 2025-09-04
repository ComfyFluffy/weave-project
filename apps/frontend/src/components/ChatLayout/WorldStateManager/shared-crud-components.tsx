import React, { useState } from 'react'
import { Box, Button, HStack, Input, VStack, Text } from '@chakra-ui/react'
import { GenericSelect, Tag } from './shared-select-components'

// 通用的添加项到列表的函数
export const addItemToList = <T,>(
  list: T[] | undefined,
  newItem: T,
  onListChange?: (newList: T[]) => void
): void => {
  if (!onListChange) return
  const newList = [...(list || []), newItem]
  onListChange(newList)
}

// 通用的从列表中移除项的函数
export const removeItemFromList = <T,>(
  list: T[] | undefined,
  itemToRemove: T,
  onListChange?: (newList: T[]) => void
): void => {
  if (!onListChange) return
  const newList = list?.filter((item) => item !== itemToRemove) || []
  onListChange(newList)
}

// 通用的选择并添加项的组件
interface SelectAndAddItemProps {
  items: string[]
  selectedItem: string | null
  onSelectionChange: (item: string | null) => void
  onAdd: () => void
  placeholder: string
  disabled?: boolean
  icon?: React.ReactNode
}

export function SelectAndAddItem({
  items,
  selectedItem,
  onSelectionChange,
  onAdd,
  placeholder,
  disabled,
  icon,
}: SelectAndAddItemProps) {
  return (
    <HStack>
      <GenericSelect
        items={items}
        selectedItem={selectedItem}
        onSelectionChange={onSelectionChange}
        placeholder={placeholder}
        icon={icon}
      />
      <Button
        size="sm"
        colorPalette="green"
        onClick={onAdd}
        disabled={disabled || !selectedItem}
      >
        添加
      </Button>
    </HStack>
  )
}

// 通用的输入并添加项的组件
interface InputAndAddItemProps {
  newItem: string
  onNewItemChange: (item: string) => void
  onAdd: () => void
  placeholder: string
  disabled?: boolean
  hideAddButton?: boolean
}

export function InputAndAddItem({
  newItem,
  onNewItemChange,
  onAdd,
  placeholder,
  disabled,
  hideAddButton = false,
}: InputAndAddItemProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newItem.trim()) {
      onAdd()
    }
  }

  return (
    <HStack>
      <Input
        value={newItem}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onNewItemChange(e.target.value)
        }
        placeholder={placeholder}
        width="150px"
        size="sm"
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      {!hideAddButton && (
        <Button
          size="sm"
          colorPalette="green"
          onClick={onAdd}
          disabled={disabled || !newItem.trim()}
        >
          添加
        </Button>
      )}
    </HStack>
  )
}

// 通用的可编辑标签列表组件
interface EditableTagListProps {
  items: string[]
  onItemsChange?: (newItems: string[]) => void
  onRemove?: (item: string) => void
  colorScheme?: string
}

export function EditableTagList({
  items,
  onItemsChange,
  onRemove,
  colorScheme = 'blue',
}: EditableTagListProps) {
  if (onItemsChange) {
    // 可编辑模式
    return (
      <VStack align="stretch" gap={2}>
        {items.map((item, index) => (
          <HStack key={index} justify="space-between">
            <Text fontSize="sm">{item}</Text>
            <Button
              size="xs"
              colorPalette="red"
              onClick={() => {
                const newItems = items.filter((_, i) => i !== index)
                onItemsChange(newItems)
              }}
            >
              删除
            </Button>
          </HStack>
        ))}
      </VStack>
    )
  } else {
    // 只读模式
    return (
      <HStack wrap="wrap" gap={2}>
        {items.map((item, index) => (
          <Tag
            key={index}
            colorScheme={colorScheme}
            onRemove={onRemove ? () => onRemove(item) : undefined}
          >
            {item}
          </Tag>
        ))}
      </HStack>
    )
  }
}

// 通用的选择并添加项到列表的组件（用于显著特征和物品等）
interface SelectAndAddToListProps {
  items: string[]
  allOptions: string[]
  onItemsChange: (newItems: string[]) => void
  placeholder: string
  label: string
}

export function SelectAndAddToList({
  items,
  allOptions,
  onItemsChange,
  placeholder,
  label,
}: SelectAndAddToListProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const handleAdd = () => {
    if (selectedItem && !items.includes(selectedItem)) {
      onItemsChange([...items, selectedItem])
      setSelectedItem(null)
    }
  }

  const handleRemove = (itemToRemove: string) => {
    onItemsChange(items.filter((item) => item !== itemToRemove))
  }

  // Filter out already selected items from the options
  const availableOptions = allOptions.filter(
    (option) => !items.includes(option)
  )

  return (
    <VStack align="stretch" gap={2}>
      <Text fontSize="sm" color="gray.400" fontWeight="bold">
        {label}:
      </Text>

      {/* Display selected items as tags */}
      <HStack wrap="wrap" gap={2}>
        {items.map((item, index) => (
          <Tag key={index} onRemove={() => handleRemove(item)}>
            {item}
          </Tag>
        ))}
      </HStack>

      {/* Select and add new item */}
      <HStack>
        <GenericSelect
          items={availableOptions}
          selectedItem={selectedItem}
          onSelectionChange={setSelectedItem}
          placeholder={placeholder}
        />
        <Button
          size="sm"
          colorPalette="green"
          onClick={handleAdd}
          disabled={!selectedItem}
        >
          添加
        </Button>
      </HStack>
    </VStack>
  )
}
