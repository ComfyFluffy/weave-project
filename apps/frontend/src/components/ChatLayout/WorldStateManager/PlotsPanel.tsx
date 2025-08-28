import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Select,
  Portal,
  createListCollection,
} from '@chakra-ui/react'
import type { Plot } from '@weave/types'
import { EditableText, EditableList } from './shared-editable-components'
import { Tag } from './shared-select-components'
import { SelectAndAddItem } from './shared-crud-components'
import { useState } from 'react'
import { Users } from 'lucide-react'

interface PlotsPanelProps {
  plots: Plot[]
  characterNames?: string[]
  onUpdatePlot?: (plotTitle: string, updates: Partial<Plot>) => void
  onUpdatePlotCounts?: (updates: {
    activeCount?: number
    completedCount?: number
    pausedCount?: number
  }) => void
  onAddPlot?: (newPlot: Plot) => void
  onDeletePlot?: (plotTitle: string) => void
}

// EditableSelect component for inline editing of select fields
interface EditableSelectProps {
  value: string
  onChange: (newValue: string) => void
  options: { label: string; value: string }[]
  placeholder?: string
  isEditing?: boolean
  onEditChange?: (editing: boolean) => void
  disabled?: boolean
}

const EditableSelect: React.FC<EditableSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = '点击编辑...',
  isEditing,
  onEditChange,
  disabled = false,
}) => {
  const [internalIsEditing, setInternalIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  const isCurrentlyEditing =
    isEditing !== undefined ? isEditing : internalIsEditing
  const setIsCurrentlyEditing = onEditChange || setInternalIsEditing

  const handleDoubleClick = () => {
    if (disabled) return
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

  // Create collection for select component
  const collection = createListCollection({
    items: options,
  })

  const currentValue =
    options.find((option) => option.value === value)?.label || value

  if (isCurrentlyEditing && !disabled) {
    return (
      <Box>
        <Select.Root
          collection={collection}
          value={[tempValue]}
          onValueChange={(details) => setTempValue(details.value[0])}
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
              <Select.ValueText placeholder={placeholder} />
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
                {collection.items.map((item) => (
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
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        <HStack mt={2} gap={2}>
          <Button size="xs" colorPalette="green" onClick={handleSave}>
            保存
          </Button>
          <Button size="xs" colorPalette="gray" onClick={handleCancel}>
            取消
          </Button>
        </HStack>
      </Box>
    )
  }

  return (
    <Box
      bg={
        disabled
          ? 'gray.600'
          : value === 'active' || value === 'main'
            ? 'green.500'
            : value === 'completed' || value === 'side'
              ? 'blue.500'
              : value === 'paused'
                ? 'yellow.500'
                : 'gray.500'
      }
      color="white"
      px={1}
      py={0.5}
      borderRadius="sm"
      fontSize="xs"
      cursor={disabled ? 'default' : 'pointer'}
      _hover={disabled ? {} : { bg: 'gray.600' }}
      onClick={handleDoubleClick}
    >
      <Text>{currentValue}</Text>
    </Box>
  )
}

export function PlotsPanel({
  plots,
  characterNames = [],
  onUpdatePlot,
  onUpdatePlotCounts,
  onAddPlot,
  onDeletePlot,
}: PlotsPanelProps) {
  const [newParticipant, setNewParticipant] = useState<Record<string, string>>(
    {}
  )
  const [newPlotTitle, setNewPlotTitle] = useState<string>('')
  const [newPlotDescription, setNewPlotDescription] = useState<string>('')
  const [isAddingPlot, setIsAddingPlot] = useState<boolean>(false)
  const [editingStatus, setEditingStatus] = useState<string | null>(null)
  const [editingImportance, setEditingImportance] = useState<string | null>(
    null
  )

  const handleParticipantChange = (plotTitle: string, item: string | null) => {
    setNewParticipant((prev) => ({
      ...prev,
      [plotTitle]: item || '',
    }))
  }

  const handleAddParticipant = (plotTitle: string) => {
    if (!newParticipant[plotTitle]?.trim() || !onUpdatePlot) return

    const plot = plots.find((p) => p.title === plotTitle)
    if (!plot) return

    const updatedParticipants = [
      ...(plot.participants || []),
      newParticipant[plotTitle].trim(),
    ]

    onUpdatePlot(plotTitle, { participants: updatedParticipants })

    // Clear the selection for this plot
    setNewParticipant((prev) => ({
      ...prev,
      [plotTitle]: '',
    }))
  }

  const handleRemoveParticipant = (
    plotTitle: string,
    participantToRemove: string
  ) => {
    if (!onUpdatePlot) return

    const plot = plots.find((p) => p.title === plotTitle)
    if (!plot) return

    const updatedParticipants = (plot.participants || []).filter(
      (p) => p !== participantToRemove
    )
    onUpdatePlot(plotTitle, { participants: updatedParticipants })
  }

  // Handler for adding a new plot
  const handleAddPlot = () => {
    if (!newPlotTitle.trim() || !onAddPlot) return

    // Check if plot with the same title already exists
    const existingPlot = plots.find(
      (plot) => plot.title.toLowerCase() === newPlotTitle.trim().toLowerCase()
    )

    if (existingPlot) {
      alert('已存在同名剧情，请使用其他名称')
      return
    }

    const newPlot: Plot = {
      title: newPlotTitle.trim(),
      description: newPlotDescription.trim(),
      status: 'active',
      participants: [],
      keyEvents: [],
      nextSteps: [],
      importance: 'side',
    }

    onAddPlot(newPlot)
    setNewPlotTitle('')
    setNewPlotDescription('')
    setIsAddingPlot(false)
  }

  // Handler for deleting a plot
  const handleDeletePlot = (plotTitle: string) => {
    if (!onDeletePlot) return

    if (confirm(`确定要删除剧情 "${plotTitle}" 吗？此操作不可撤销。`)) {
      onDeletePlot(plotTitle)
    }
  }

  // Handler for updating plot status
  const handleStatusUpdate = (plotTitle: string, newStatus: string) => {
    if (!onUpdatePlot) return

    onUpdatePlot(plotTitle, {
      status: newStatus as 'active' | 'completed' | 'paused',
    })
    setEditingStatus(null)
  }

  // Handler for updating plot importance
  const handleImportanceUpdate = (plotTitle: string, newImportance: string) => {
    if (!onUpdatePlot) return

    onUpdatePlot(plotTitle, {
      importance: newImportance as 'main' | 'side' | 'personal',
    })
    setEditingImportance(null)
  }

  if (plots.length === 0 && !isAddingPlot) {
    return (
      <VStack align="stretch" gap={3}>
        <Box p={4} textAlign="center">
          <Text color="gray.500">暂无剧情数据</Text>
        </Box>
        {onAddPlot && (
          <Button
            size="sm"
            colorPalette="green"
            onClick={() => setIsAddingPlot(true)}
            width="fit-content"
            mx="auto"
          >
            添加新剧情
          </Button>
        )}
      </VStack>
    )
  }

  // Group plots by status
  const activePlots = plots.filter((plot) => plot.status === 'active')
  const completedPlots = plots.filter((plot) => plot.status === 'completed')
  const pausedPlots = plots.filter((plot) => plot.status === 'paused')

  return (
    <VStack align="stretch" gap={4}>
      {/* Add New Plot Form */}
      {isAddingPlot && onAddPlot && (
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
                添加新剧情
              </Text>
              <HStack gap={2}>
                <Button
                  size="sm"
                  colorPalette="green"
                  onClick={handleAddPlot}
                  disabled={!newPlotTitle.trim()}
                >
                  保存
                </Button>
                <Button
                  size="sm"
                  colorPalette="gray"
                  onClick={() => {
                    setIsAddingPlot(false)
                    setNewPlotTitle('')
                    setNewPlotDescription('')
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
                  剧情标题:
                </Text>
                <Input
                  value={newPlotTitle}
                  onChange={(e) => setNewPlotTitle(e.target.value)}
                  placeholder="输入剧情标题..."
                  size="sm"
                  bg="gray.700"
                  color="white"
                  borderColor="gray.600"
                  _focus={{ borderColor: 'blue.400' }}
                />
              </VStack>

              <VStack align="stretch" gap={1}>
                <Text fontSize="sm" color="gray.400" fontWeight="bold">
                  剧情描述:
                </Text>
                <Input
                  value={newPlotDescription}
                  onChange={(e) => setNewPlotDescription(e.target.value)}
                  placeholder="输入剧情描述..."
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

      <HStack gap={4}>
        <Box
          bg="green.500"
          color="white"
          px={2}
          py={1}
          borderRadius="sm"
          fontSize="sm"
        >
          活跃: {activePlots.length}
        </Box>
        <Box
          bg="blue.500"
          color="white"
          px={2}
          py={1}
          borderRadius="sm"
          fontSize="sm"
        >
          已完成: {completedPlots.length}
        </Box>
        <Box
          bg="yellow.500"
          color="white"
          px={2}
          py={1}
          borderRadius="sm"
          fontSize="sm"
        >
          暂停: {pausedPlots.length}
        </Box>
      </HStack>

      <VStack align="stretch" gap={3}>
        {plots.map((plot, index) => (
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
              <HStack justify="space-between" py={2} gap={3}>
                <HStack flex="1" gap={3}>
                  {onUpdatePlot ? (
                    <EditableText
                      value={plot.title}
                      onChange={(newValue) =>
                        onUpdatePlot(plot.title, { title: newValue })
                      }
                      placeholder="剧情标题..."
                    />
                  ) : (
                    <Text fontWeight="bold" color="white">
                      {plot.title}
                    </Text>
                  )}
                  {onUpdatePlot ? (
                    <EditableSelect
                      value={plot.status}
                      onChange={(newValue) =>
                        handleStatusUpdate(plot.title, newValue)
                      }
                      options={[
                        { label: '活跃', value: 'active' },
                        { label: '已完成', value: 'completed' },
                        { label: '暂停', value: 'paused' },
                      ]}
                      isEditing={editingStatus === plot.title}
                      onEditChange={(editing) =>
                        setEditingStatus(editing ? plot.title : null)
                      }
                    />
                  ) : (
                    <Box
                      bg={
                        plot.status === 'active'
                          ? 'green.500'
                          : plot.status === 'completed'
                            ? 'blue.500'
                            : 'yellow.500'
                      }
                      color="white"
                      px={1}
                      py={0.5}
                      borderRadius="sm"
                      fontSize="xs"
                    >
                      {plot.status === 'active'
                        ? '活跃'
                        : plot.status === 'completed'
                          ? '已完成'
                          : '暂停'}
                    </Box>
                  )}
                  {onUpdatePlot ? (
                    <EditableSelect
                      value={plot.importance}
                      onChange={(newValue) =>
                        handleImportanceUpdate(plot.title, newValue)
                      }
                      options={[
                        { label: '主线', value: 'main' },
                        { label: '支线', value: 'side' },
                        { label: '个人', value: 'personal' },
                      ]}
                      isEditing={editingImportance === plot.title}
                      onEditChange={(editing) =>
                        setEditingImportance(editing ? plot.title : null)
                      }
                    />
                  ) : (
                    <Box
                      bg={
                        plot.importance === 'main'
                          ? 'red.500'
                          : plot.importance === 'side'
                            ? 'purple.500'
                            : 'gray.500'
                      }
                      color="white"
                      px={1}
                      py={0.5}
                      borderRadius="sm"
                      fontSize="xs"
                    >
                      {plot.importance === 'main'
                        ? '主线'
                        : plot.importance === 'side'
                          ? '支线'
                          : '个人'}
                    </Box>
                  )}
                </HStack>
                {onDeletePlot && (
                  <Button
                    size="xs"
                    colorPalette="red"
                    onClick={() => handleDeletePlot(plot.title)}
                  >
                    删除
                  </Button>
                )}
              </HStack>
            </Box>

            <Box bg="gray.800" p={4}>
              <VStack align="stretch" gap={3}>
                {onUpdatePlot ? (
                  <EditableText
                    value={plot.description}
                    onChange={(newValue) =>
                      onUpdatePlot(plot.title, { description: newValue })
                    }
                    placeholder="剧情描述..."
                  />
                ) : (
                  <Text fontSize="sm" color="gray.300">
                    {plot.description}
                  </Text>
                )}

                <Box height="1px" bg="gray.600" />

                <Box height="1px" bg="gray.600" />

                <VStack align="stretch" gap={2}>
                  <Text fontSize="sm" color="gray.400" fontWeight="bold">
                    关键事件:
                  </Text>
                  {onUpdatePlot ? (
                    <EditableList
                      items={plot.keyEvents || []}
                      onItemsChange={(newKeyEvents) =>
                        onUpdatePlot(plot.title, { keyEvents: newKeyEvents })
                      }
                      placeholder="添加关键事件..."
                      itemPrefix="• "
                    />
                  ) : plot.keyEvents && plot.keyEvents.length > 0 ? (
                    plot.keyEvents.map((event, idx) => (
                      <Text key={idx} fontSize="sm" color="gray.300">
                        • {event}
                      </Text>
                    ))
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      暂无关键事件
                    </Text>
                  )}
                </VStack>

                <VStack align="stretch" gap={2}>
                  <Text fontSize="sm" color="gray.400" fontWeight="bold">
                    下一步:
                  </Text>
                  {onUpdatePlot ? (
                    <EditableList
                      items={plot.nextSteps || []}
                      onItemsChange={(newNextSteps) =>
                        onUpdatePlot(plot.title, { nextSteps: newNextSteps })
                      }
                      placeholder="添加下一步..."
                      itemPrefix="• "
                    />
                  ) : plot.nextSteps && plot.nextSteps.length > 0 ? (
                    plot.nextSteps.map((step, idx) => (
                      <Text key={idx} fontSize="sm" color="gray.300">
                        • {step}
                      </Text>
                    ))
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      暂无下一步计划
                    </Text>
                  )}
                </VStack>

                <VStack align="stretch" gap={2}>
                  <Text fontSize="sm" color="gray.400" fontWeight="bold">
                    参与者:
                  </Text>
                  {onUpdatePlot ? (
                    <>
                      <HStack wrap="wrap" gap={2}>
                        {plot.participants?.map((participant, idx) => (
                          <Tag
                            key={idx}
                            colorScheme="blue"
                            onRemove={() => {
                              if (confirm('确定要删除这个参与者吗？')) {
                                handleRemoveParticipant(plot.title, participant)
                              }
                            }}
                          >
                            {participant}
                          </Tag>
                        ))}
                      </HStack>

                      <SelectAndAddItem
                        items={characterNames}
                        selectedItem={newParticipant[plot.title] || null}
                        onSelectionChange={(item: string | null) =>
                          handleParticipantChange(plot.title, item)
                        }
                        onAdd={() => handleAddParticipant(plot.title)}
                        placeholder="添加新参与者..."
                        icon={<Users size={16} />}
                        disabled={
                          !onUpdatePlot || !newParticipant[plot.title]?.trim()
                        }
                      />
                    </>
                  ) : (
                    <HStack wrap="wrap" gap={2}>
                      {plot.participants?.map((participant, idx) => (
                        <Tag key={idx} colorScheme="blue">
                          {participant}
                        </Tag>
                      ))}
                    </HStack>
                  )}
                </VStack>
              </VStack>
            </Box>
          </Box>
        ))}
      </VStack>
      {/* Add New Plot Button */}
      {!isAddingPlot && onAddPlot && (
        <Button
          size="sm"
          colorPalette="green"
          onClick={() => setIsAddingPlot(true)}
          width="fit-content"
          mx="auto"
        >
          添加新剧情
        </Button>
      )}
    </VStack>
  )
}
