import { useState } from 'react'
import {
  Text,
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
} from '@chakra-ui/react'
import type { StatValue } from '@weave/types'

// EditableNumberInput 组件
interface EditableNumberInputProps {
  value: number
  onChange: (newValue: number) => void
  min?: number
  max?: number
  step?: number
}

export const EditableNumberInput: React.FC<EditableNumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
}) => {
  const handleValueChange = (details: {
    value: string
    valueAsNumber: number
  }) => {
    // Only call onChange if we have a valid number
    if (!isNaN(details.valueAsNumber)) {
      onChange(details.valueAsNumber)
    }
  }

  return (
    <NumberInputRoot
      value={value.toString()}
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

export const EditableStatValue: React.FC<EditableStatValueProps> = ({
  label,
  stat,
  onChange,
  min = 0,
  max = stat.max || 100,
  step = 1,
}) => {
  const handleInputChange = (details: {
    value: string
    valueAsNumber: number
  }) => {
    const numValue = details.valueAsNumber
    if (!isNaN(numValue)) {
      onChange(numValue)
    }
  }

  const handleSliderChange = (details: { value: number[] }) => {
    const newValue = details.value[0]
    onChange(newValue)
  }

  return (
    <VStack width="100%" gap={3}>
      <HStack justify="space-between">
        <Text fontSize="xs" color="gray.400">
          {label}
        </Text>
        <Text fontSize="xs" color="white">
          {stat.current}/{stat.max}
        </Text>
      </HStack>

      <NumberInputRoot
        value={stat.current.toString()}
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
        value={[stat.current]}
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
