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
import {
  EditableText,
  EditableNumberInput,
  EditableList,
} from './EditableComponents'
import { GenericSelect, Tag } from './LocationsExplorer'
import { useState } from 'react'
import { Users } from 'lucide-react'

interface PlotsTrackerProps {
  plots: Plot[]
  characterNames?: string[]
  onUpdatePlot?: (plotTitle: string, updates: Partial<Plot>) => void
  onUpdatePlotCounts?: (updates: {
    activeCount?: number
    completedCount?: number
    pausedCount?: number
  }) => void
}

export function PlotsTracker({
  plots,
  characterNames = [],
  onUpdatePlot,
  onUpdatePlotCounts,
}: PlotsTrackerProps) {
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
        {onUpdatePlotCounts ? (
          <>
            <HStack>
              <Text fontSize="sm" color="white">
                活跃:
              </Text>
              <EditableNumberInput
                value={activePlots.length}
                onChange={(newValue: number) =>
                  onUpdatePlotCounts({ activeCount: newValue })
                }
                min={0}
              />
            </HStack>
            <HStack>
              <Text fontSize="sm" color="white">
                已完成:
              </Text>
              <EditableNumberInput
                value={completedPlots.length}
                onChange={(newValue: number) =>
                  onUpdatePlotCounts({ completedCount: newValue })
                }
                min={0}
              />
            </HStack>
            <HStack>
              <Text fontSize="sm" color="white">
                暂停:
              </Text>
              <EditableNumberInput
                value={pausedPlots.length}
                onChange={(newValue: number) =>
                  onUpdatePlotCounts({ pausedCount: newValue })
                }
                min={0}
              />
            </HStack>
          </>
        ) : (
          <>
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
          </>
        )}
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
                  ) : (
                    plot.keyEvents?.map((event, idx) => (
                      <Text key={idx} fontSize="sm" color="gray.300">
                        • {event}
                      </Text>
                    ))
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
                  ) : (
                    plot.nextSteps?.map((step, idx) => (
                      <Text key={idx} fontSize="sm" color="gray.300">
                        • {step}
                      </Text>
                    ))
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

                      <HStack>
                        <GenericSelect
                          items={characterNames}
                          selectedItem={newParticipant[plot.title] || null}
                          onSelectionChange={(item: string | null) =>
                            handleParticipantChange(plot.title, item)
                          }
                          placeholder="添加新参与者..."
                          icon={<Users size={16} />}
                        />
                        <Button
                          size="sm"
                          colorPalette="green"
                          onClick={() => handleAddParticipant(plot.title)}
                          disabled={!newParticipant[plot.title]?.trim()}
                        >
                          添加
                        </Button>
                      </HStack>
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
