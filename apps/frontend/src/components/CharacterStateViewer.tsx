import { Box, Text, Code } from '@chakra-ui/react'
import type { CharacterState } from '@weave/types'

interface CharacterStateViewerProps {
  characterState?: CharacterState
  isVisible?: boolean
}

export function CharacterStateViewer({ 
  characterState, 
  isVisible = false 
}: CharacterStateViewerProps) {
  if (!isVisible || !characterState) {
    return null
  }

  return (
    <Box
      bg="gray.900"
      border="1px solid"
      borderColor="gray.700"
      borderRadius="md"
      overflowY="auto"
      mt={2}
      width="100%"
      p={4}
    >
      <Text fontWeight="bold" color="white" fontSize="sm" mb={3}>
        角色状态
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
        {JSON.stringify(characterState, null, 2)}
      </Code>
    </Box>
  )
}