import { Box, HStack, Button } from '@chakra-ui/react'
import { WorldDataViewer } from './WorldDataViewer'
import { AIChatSection } from './AIChatSection'
import { WorldStateManager } from './WorldStateManager'
import type { WorldState } from '@weave/types'
import { useState } from 'react'

interface AIWorldPanelProps {
  worldState?: WorldState
  worldId: string
  channelId: string
  selectedCharacterId?: string
  selectedRole?: string
}

export function AIWorldPanel({
  worldState,
  worldId,
  channelId,
  selectedCharacterId,
  selectedRole,
}: AIWorldPanelProps) {
  const [activeTab, setActiveTab] = useState('worldState')
  const worldStateId = worldState?.id

  return (
    <Box
      height="100%"
      bg="gray.800"
      borderLeft="1px solid"
      borderColor="gray.700"
      flex={1}
      minWidth="400px"
      display="flex"
      flexDirection="column"
    >
      <HStack gap={2} borderBottom="1px solid" borderColor="gray.600" p={2}>
        <Button
          variant={activeTab === 'worldState' ? 'solid' : 'outline'}
          colorPalette="purple"
          size="sm"
          onClick={() => setActiveTab('worldState')}
        >
          世界状态
        </Button>
        <Button
          variant={activeTab === 'context' ? 'solid' : 'outline'}
          colorPalette="purple"
          size="sm"
          onClick={() => setActiveTab('context')}
        >
          AI 上下文
        </Button>
        <Button
          variant={activeTab === 'chat' ? 'solid' : 'outline'}
          colorPalette="purple"
          size="sm"
          onClick={() => setActiveTab('chat')}
        >
          AI 聊天
        </Button>
      </HStack>

      <Box flex={1} overflow="hidden">
        {activeTab === 'worldState' && worldStateId && (
          <WorldStateManager worldStateId={worldStateId} />
        )}

        {activeTab === 'context' && (
          <Box height="100%" p={4}>
            <WorldDataViewer worldData={worldState} />
          </Box>
        )}

        {activeTab === 'chat' && (
          <Box height="100%" p={4}>
            <AIChatSection
              worldId={worldId}
              channelId={channelId}
              selectedCharacterId={selectedCharacterId}
              selectedRole={selectedRole}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}
