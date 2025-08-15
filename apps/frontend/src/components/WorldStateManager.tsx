import { useState } from 'react'
import { Box, Text, VStack, HStack, Button } from '@chakra-ui/react'
import { WorldStateOverview } from './WorldStateOverview'
import { CharacterStatusPanel } from './CharacterStatusPanel'
import { LocationsExplorer } from './LocationsExplorer'
import { PlotsTracker } from './PlotsTracker'
import { useWorldState } from '../hooks/useQueries'

interface WorldStateManagerProps {
  worldStateId: string
}

export function WorldStateManager({ worldStateId }: WorldStateManagerProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const { data } = useWorldState(worldStateId)

  if (!data) {
    return (
      <Box p={4} textAlign="center">
        <div>加载中...</div>
        <Text mt={2} color="gray.500">
          加载世界状态中...
        </Text>
      </Box>
    )
  }

  const worldState = data?.body.worldState

  return (
    <Box p={4} height="100%" overflowY="auto">
      <VStack align="stretch" gap={4} height="100%">
        <HStack justify="space-between">
          <Text fontSize="xl" fontWeight="bold" color="white">
            世界状态管理
          </Text>
        </HStack>

        <HStack gap={2} borderBottom="1px solid" borderColor="gray.600" pb={2}>
          <Button
            variant={activeTab === 'overview' ? 'solid' : 'outline'}
            colorPalette="purple"
            size="sm"
            onClick={() => setActiveTab('overview')}
          >
            概览
          </Button>
          <Button
            variant={activeTab === 'characters' ? 'solid' : 'outline'}
            colorPalette="purple"
            size="sm"
            onClick={() => setActiveTab('characters')}
          >
            角色
          </Button>
          <Button
            variant={activeTab === 'locations' ? 'solid' : 'outline'}
            colorPalette="purple"
            size="sm"
            onClick={() => setActiveTab('locations')}
          >
            地点
          </Button>
          <Button
            variant={activeTab === 'plots' ? 'solid' : 'outline'}
            colorPalette="purple"
            size="sm"
            onClick={() => setActiveTab('plots')}
          >
            剧情
          </Button>
        </HStack>

        <Box height="calc(100% - 80px)" overflowY="auto">
          {activeTab === 'overview' && (
            <WorldStateOverview worldState={worldState} />
          )}

          {activeTab === 'characters' && (
            <VStack align="stretch" gap={3}>
              {worldState.characters.map((character) => {
                const characterState =
                  worldState.state.characterStates?.[character.id]
                if (!characterState) return null

                return (
                  <CharacterStatusPanel
                    key={character.id}
                    character={character}
                    state={characterState}
                  />
                )
              })}

              {worldState.characters.length === 0 && (
                <Text color="gray.500" textAlign="center" py={4}>
                  暂无角色数据
                </Text>
              )}
            </VStack>
          )}

          {activeTab === 'locations' && (
            <LocationsExplorer locations={worldState.state?.locations || []} />
          )}

          {activeTab === 'plots' && (
            <PlotsTracker plots={worldState.state?.plots || []} />
          )}
        </Box>
      </VStack>
    </Box>
  )
}
