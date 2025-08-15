import { useMemo } from 'react'
import { Box, Text, VStack, HStack } from '@chakra-ui/react'
import type { WorldState, Plot, Event } from '@weave/types'
import { EditableText, EditableNumberInput } from './EditableComponents'

interface WorldStateOverviewProps {
  worldState: WorldState
  onUpdateMetadata?: (metadata: {
    currentGameTime?: string
    outline?: string
  }) => void
  onUpdateNumericFields?: (updates: {
    characterCount?: number
    locationCount?: number
    activePlotCount?: number
    importantEventCount?: number
  }) => void
}

export function WorldStateOverview({
  worldState,
  onUpdateMetadata,
  onUpdateNumericFields,
}: WorldStateOverviewProps) {
  // Calculate the counts with proper typing and memoization
  const {
    characterCount,
    locationCount,
    activePlotCount,
    importantEventCount,
  } = useMemo(() => {
    const characterCount = worldState.characters.length
    const locationCount = worldState.state.locations.length
    const activePlotCount = worldState.state.plots.filter(
      (p: Plot) => p.status === 'active'
    ).length
    const importantEventCount = worldState.state.keyEventsLog.filter(
      (e: Event) => e.importance === 'critical' || e.importance === 'high'
    ).length

    return {
      characterCount,
      locationCount,
      activePlotCount,
      importantEventCount,
    }
  }, [worldState])

  // Helper component for consistent field rendering
  const FieldRow = ({
    label,
    value,
    onEdit,
    isEditing = false,
    placeholder,
  }: {
    label: string
    value: string | number
    onEdit?: (newValue: string | number) => void
    isEditing?: boolean
    placeholder?: string
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
          <EditableNumberInput
            value={value}
            onChange={(newValue) => onEdit(newValue)}
            min={0}
          />
        )
      ) : (
        <Text fontSize="sm" color="white">
          {value}
        </Text>
      )}
    </HStack>
  )

  return (
    <Box
      bg="gray.800"
      p={4}
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.600"
    >
      <VStack align="stretch" gap={4}>
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="bold" color="white">
            世界状态概览
          </Text>
          <Box
            bg="purple.500"
            color="white"
            px={2}
            py={1}
            borderRadius="sm"
            fontSize="sm"
          >
            GM 面板
          </Box>
        </HStack>

        <Box height="1px" bg="gray.600" />

        <VStack align="stretch" gap={3}>
          <FieldRow
            label="当前游戏时间"
            value={worldState.state.currentGameTime}
            onEdit={
              onUpdateMetadata
                ? (newValue) =>
                    onUpdateMetadata({ currentGameTime: newValue as string })
                : undefined
            }
            isEditing={!!onUpdateMetadata}
            placeholder="设置游戏时间..."
          />

          <FieldRow
            label="角色数量"
            value={characterCount}
            onEdit={
              onUpdateNumericFields
                ? (newValue) =>
                    onUpdateNumericFields({
                      characterCount: newValue as number,
                    })
                : undefined
            }
            isEditing={!!onUpdateNumericFields}
          />

          <FieldRow
            label="地点数量"
            value={locationCount}
            onEdit={
              onUpdateNumericFields
                ? (newValue) =>
                    onUpdateNumericFields({ locationCount: newValue as number })
                : undefined
            }
            isEditing={!!onUpdateNumericFields}
          />

          <FieldRow
            label="活跃剧情"
            value={activePlotCount}
            onEdit={
              onUpdateNumericFields
                ? (newValue) =>
                    onUpdateNumericFields({
                      activePlotCount: newValue as number,
                    })
                : undefined
            }
            isEditing={!!onUpdateNumericFields}
          />

          <FieldRow
            label="重要事件"
            value={importantEventCount}
            onEdit={
              onUpdateNumericFields
                ? (newValue) =>
                    onUpdateNumericFields({
                      importantEventCount: newValue as number,
                    })
                : undefined
            }
            isEditing={!!onUpdateNumericFields}
          />
        </VStack>

        {worldState.state.outline !== undefined && (
          <>
            <Box height="1px" bg="gray.600" />
            <VStack align="stretch" gap={2}>
              <Text fontSize="sm" fontWeight="bold" color="white">
                世界概要:
              </Text>
              {onUpdateMetadata ? (
                <EditableText
                  value={worldState.state.outline}
                  onChange={(newValue) =>
                    onUpdateMetadata({ outline: newValue })
                  }
                  placeholder="添加世界概要..."
                />
              ) : (
                <Text fontSize="sm" color="gray.300" fontStyle="italic">
                  {worldState.state.outline}
                </Text>
              )}
            </VStack>
          </>
        )}
      </VStack>
    </Box>
  )
}
