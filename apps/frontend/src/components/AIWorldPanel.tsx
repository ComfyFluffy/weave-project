import { VStack } from '@chakra-ui/react'
import { WorldDataViewer } from './WorldDataViewer'
import { AIChatSection } from './AIChatSection'
import type { WorldState } from '@weave/types'

interface AIWorldPanelProps {
  worldData?: WorldState
  worldId: string
  channelId: string
  selectedCharacterId?: string
  selectedRole?: string
}

export function AIWorldPanel({
  worldData,
  worldId,
  channelId,
  selectedCharacterId,
  selectedRole,
}: AIWorldPanelProps) {
  return (
    <VStack
      gap={4}
      height="100%"
      p={4}
      bg="gray.800"
      borderLeft="1px solid"
      borderColor="gray.700"
      align="stretch"
      flex={1}
      minWidth="400px"
    >
      <WorldDataViewer worldData={worldData} />
      <AIChatSection
        worldId={worldId}
        channelId={channelId}
        selectedCharacterId={selectedCharacterId}
        selectedRole={selectedRole}
      />
    </VStack>
  )
}
