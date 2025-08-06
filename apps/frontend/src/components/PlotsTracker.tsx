import { Box, Text, VStack, HStack } from '@chakra-ui/react'
import type { Plot } from '@weave/types'

interface PlotsTrackerProps {
  plots: Plot[]
}

export function PlotsTracker({ plots }: PlotsTrackerProps) {
  if (plots.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text color="gray.500">暂无剧情数据</Text>
      </Box>
    )
  }

  // Group plots by status
  const activePlots = plots.filter(plot => plot.status === 'active')
  const completedPlots = plots.filter(plot => plot.status === 'completed')
  const pausedPlots = plots.filter(plot => plot.status === 'paused')

  return (
    <VStack align="stretch" gap={4}>
      <HStack gap={4}>
        <Box bg="green.500" color="white" px={2} py={1} borderRadius="sm" fontSize="sm">
          活跃: {activePlots.length}
        </Box>
        <Box bg="blue.500" color="white" px={2} py={1} borderRadius="sm" fontSize="sm">
          已完成: {completedPlots.length}
        </Box>
        <Box bg="yellow.500" color="white" px={2} py={1} borderRadius="sm" fontSize="sm">
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
                  <Text fontWeight="bold" color="white">
                    {plot.title}
                  </Text>
                  <Box 
                    bg={
                      plot.status === 'active' ? 'green.500' : 
                      plot.status === 'completed' ? 'blue.500' : 'yellow.500'
                    } 
                    color="white" 
                    px={1} 
                    py={0.5} 
                    borderRadius="sm" 
                    fontSize="xs"
                  >
                    {plot.status === 'active' ? '活跃' : 
                     plot.status === 'completed' ? '已完成' : '暂停'}
                  </Box>
                  <Box 
                    bg={
                      plot.importance === 'main' ? 'red.500' : 
                      plot.importance === 'side' ? 'purple.500' : 'gray.500'
                    } 
                    color="white" 
                    px={1} 
                    py={0.5} 
                    borderRadius="sm" 
                    fontSize="xs"
                  >
                    {plot.importance === 'main' ? '主线' : 
                     plot.importance === 'side' ? '支线' : '个人'}
                  </Box>
                </HStack>
              </HStack>
            </Box>
            
            <Box bg="gray.800" p={4}>
              <VStack align="stretch" gap={3}>
                <Text fontSize="sm" color="gray.300">
                  {plot.description}
                </Text>
                
                <Box height="1px" bg="gray.600" />
                
                <VStack align="stretch" gap={2}>
                  <Text fontSize="sm" color="gray.400" fontWeight="bold">
                    关键事件:
                  </Text>
                  {plot.keyEvents?.map((event, idx) => (
                    <Text key={idx} fontSize="sm" color="gray.300">
                      • {event}
                    </Text>
                  ))}
                </VStack>
                
                <VStack align="stretch" gap={2}>
                  <Text fontSize="sm" color="gray.400" fontWeight="bold">
                    下一步:
                  </Text>
                  {plot.nextSteps?.map((step, idx) => (
                    <Text key={idx} fontSize="sm" color="gray.300">
                      • {step}
                    </Text>
                  ))}
                </VStack>
                
                <HStack wrap="wrap" gap={2}>
                  <Text fontSize="sm" color="gray.400" fontWeight="bold">
                    参与者:
                  </Text>
                  {plot.participants?.map((participant, idx) => (
                    <Box key={idx} bg="blue.500" color="white" px={1} py={0.5} borderRadius="sm" fontSize="xs">
                      {participant}
                    </Box>
                  ))}
                </HStack>
              </VStack>
            </Box>
          </Box>
        ))}
      </VStack>
    </VStack>
  )
}