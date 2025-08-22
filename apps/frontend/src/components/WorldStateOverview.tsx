import { Box, Text, VStack, HStack } from '@chakra-ui/react'
import type { WorldState } from '@weave/types'

interface WorldStateOverviewProps {
  worldState: WorldState
}

export function WorldStateOverview({ worldState }: WorldStateOverviewProps) {
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
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.400">
              当前游戏时间:
            </Text>
            <Text fontSize="sm" color="white">
              {worldState.state.currentGameTime}
            </Text>
          </HStack>

          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.400">
              角色数量:
            </Text>
            <Text fontSize="sm" color="white">
              {worldState.characters.length}
            </Text>
          </HStack>

          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.400">
              地点数量:
            </Text>
            <Text fontSize="sm" color="white">
              {worldState.state.locations.length || 0}
            </Text>
          </HStack>

          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.400">
              活跃剧情:
            </Text>
            <Text fontSize="sm" color="white">
              {worldState.state.plots.filter((p) => p.status === 'active')
                .length || 0}
            </Text>
          </HStack>

          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.400">
              重要事件:
            </Text>
            <Text fontSize="sm" color="white">
              {worldState.state.keyEventsLog.filter(
                (e) => e.importance === 'critical' || e.importance === 'high'
              ).length || 0}
            </Text>
          </HStack>
        </VStack>

        {worldState.state.outline && (
          <>
            <Box height="1px" bg="gray.600" />
            <VStack align="stretch" gap={2}>
              <Text fontSize="sm" fontWeight="bold" color="white">
                世界概要:
              </Text>
              <Text fontSize="sm" color="gray.300" fontStyle="italic">
                {worldState.state.outline}
              </Text>
            </VStack>
          </>
        )}
      </VStack>
    </Box>
  )
}
