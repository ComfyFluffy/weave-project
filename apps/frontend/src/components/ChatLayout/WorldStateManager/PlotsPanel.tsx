import { Box, Text, VStack, HStack } from '@chakra-ui/react'
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
}

export function PlotsPanel({
  plots,
  characterNames = [],
  onUpdatePlot,
  onUpdatePlotCounts,
}: PlotsPanelProps) {
  const [newParticipant, setNewParticipant] = useState<Record<string, string>>(
    {}
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

  if (plots.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text color="gray.500">暂无剧情数据</Text>
      </Box>
    )
  }

  // Group plots by status
  const activePlots = plots.filter((plot) => plot.status === 'active')
  const completedPlots = plots.filter((plot) => plot.status === 'completed')
  const pausedPlots = plots.filter((plot) => plot.status === 'paused')

  return (
    <VStack align="stretch" gap={4}>
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
                </HStack>
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
    </VStack>
  )
}
