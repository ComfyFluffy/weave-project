import { useState, useEffect, useCallback } from 'react'
import { Box, Text, VStack, HStack, Button } from '@chakra-ui/react'
import { WorldStateOverview } from './WorldStateOverview'
import { CharacterStatusPanel } from './CharacterStatusPanel'
import { LocationsExplorer } from './LocationsExplorer'
import { PlotsTracker } from './PlotsTracker'
import { worldStateService } from '../services/worldStateService'
import { socketService } from '../services/socketService'
import type { WorldState, Character } from '@weave/types'

interface WorldStateManagerProps {
  worldStateId: string
}

export function WorldStateManager({ worldStateId }: WorldStateManagerProps) {
  const [worldState, setWorldState] = useState<WorldState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const fetchWorldState = useCallback(async () => {
    try {
      setLoading(true)
      const data = await worldStateService.fetchWorldState(worldStateId)
      setWorldState(data)
    } catch (err) {
      setError('Failed to load world state data')
      console.error('Error fetching world state:', err)
    } finally {
      setLoading(false)
    }
  }, [worldStateId])

  useEffect(() => {
    fetchWorldState()
  }, [fetchWorldState])

  // Subscribe to real-time updates
  useEffect(() => {
    // Subscribe to world state updates
    socketService.subscribeToWorldState(worldStateId)
    
    // Listen for updates
    const handleWorldStateUpdate = (data: { worldStateId: string; worldState: any }) => {
      if (data.worldStateId === worldStateId) {
        if (data.worldState === null) {
          // World state was deleted
          setWorldState(null)
        } else {
          // Update the world state
          setWorldState(data.worldState)
        }
      }
    }
    
    socketService.onWorldStateUpdate(handleWorldStateUpdate)
    
    // Cleanup
    return () => {
      socketService.unsubscribeFromWorldState(worldStateId)
      socketService.off('world-state:updated', handleWorldStateUpdate)
    }
  }, [worldStateId])

  const handleRefresh = async () => {
    await fetchWorldState()
  }

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <div>加载中...</div>
        <Text mt={2} color="gray.500">
          加载世界状态中...
        </Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={4} bg="red.500" color="white" borderRadius="md">
        {error}
      </Box>
    )
  }

  if (!worldState) {
    return (
      <Box p={4} bg="yellow.500" color="white" borderRadius="md">
        未找到世界状态数据
      </Box>
    )
  }

  return (
    <Box p={4} height="100%" overflowY="auto">
      <VStack align="stretch" gap={4} height="100%">
        <HStack justify="space-between">
          <Text fontSize="xl" fontWeight="bold" color="white">
            世界状态管理
          </Text>
          <Button size="sm" colorPalette="blue" onClick={handleRefresh}>
            刷新
          </Button>
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
                const characterState = worldState.characterStates?.[character.id]
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
            <LocationsExplorer locations={worldState.locations || []} />
          )}
          
          {activeTab === 'plots' && (
            <PlotsTracker plots={worldState.plots || []} />
          )}
        </Box>
      </VStack>
    </Box>
  )
}