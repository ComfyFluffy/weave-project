import { Box, Text, Code } from '@chakra-ui/react'
import type { WorldState } from '@weave/types'

interface WorldDataViewerProps {
  worldData?: WorldState
}

export function WorldDataViewer({ worldData }: WorldDataViewerProps) {
  return (
    <Box
      bg="gray.900"
      border="1px solid"
      borderColor="gray.700"
      borderRadius="md"
      overflowY="auto"
      height="100%"
      p={4}
    >
      <Text fontWeight="bold" color="white" fontSize="sm" mb={3}>
        世界数据 (AI 上下文)
      </Text>
      <Code
        fontSize="xs"
        bg="gray.800"
        color="gray.300"
        p={3}
        borderRadius="md"
        width="100%"
        whiteSpace="pre-wrap"
        fontFamily="mono"
      >
        {worldData ? JSON.stringify(worldData, null, 2) : '暂无世界数据'}
      </Code>
    </Box>
  )
}
