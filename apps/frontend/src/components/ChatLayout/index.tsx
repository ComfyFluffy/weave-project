import { useState, useEffect } from 'react'
import { WorldSidebar } from './WorldSidebar'
import { ChannelSidebar } from './ChannelSidebar'
import { ChatArea } from './ChatArea'
import { AIWorldPanel } from '../AIWorldPanel'
import { socketService } from '../../services/socketService'
import type { UserRole } from '../RoleSelector'
import {
  useWorlds,
  useWorld,
  useWorldStates,
  useChannelMessages,
  useWorldCharacters,
  useCreateCharacter,
} from '../../hooks/useQueries'
import { useChannels } from '../../hooks/useChannels'
import type { Message, Character } from '@weave/types'
import { Flex } from '@chakra-ui/react'

export function ChatLayout() {
  const [selectedWorldId, setSelectedWorldId] = useState<string>('')
  const [selectedChannelId, setSelectedChannelId] = useState<string>('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('player')
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  )

  // Modal states
  const [showCharacterSelection, setShowCharacterSelection] = useState(false)
  const [showCharacterCreation, setShowCharacterCreation] = useState(false)

  // Use React Query hooks for data fetching
  const { data: worlds = [] } = useWorlds()
  const { data: currentWorld } = useWorld(selectedWorldId)
  const { data: worldStates = [] } = useWorldStates(selectedWorldId)
  const { data: channels = [] } = useChannels(selectedWorldId)
  const { data: messages = [], refetch: refetchMessages } =
    useChannelMessages(selectedChannelId)
  const { data: worldCharacters = [] } = useWorldCharacters(selectedWorldId)

  // Mutations
  const createCharacterMutation = useCreateCharacter()

  const currentChannel = channels.find((c) => c.id === selectedChannelId)

  // Initialize socket connection and auto-select world/channel
  useEffect(() => {
    // Connect to socket
    socketService.connect()

    // Auto-select first world if available
    if (worlds.length > 0 && !selectedWorldId) {
      setSelectedWorldId(worlds[0].id)
    }

    // Setup socket event listeners
    socketService.onNewMessage((_message: Message) => {
      // Refetch messages when new message arrives
      void refetchMessages()
    })

    socketService.onMessageHistory((_messageHistory: Message[]) => {
      // Refetch messages when history is updated
      void refetchMessages()
    })

    // Cleanup on unmount
    return () => {
      socketService.disconnect()
    }
  }, [worlds, selectedWorldId, refetchMessages])

  // Auto-select first channel when channels data changes
  useEffect(() => {
    if (channels.length && !selectedChannelId) {
      setSelectedChannelId(channels[0].id)
    }
  }, [channels, selectedChannelId])

  // Handle world selection
  useEffect(() => {
    if (selectedWorldId) {
      socketService.joinWorld(selectedWorldId)
    }
  }, [selectedWorldId])

  // Handle channel selection
  useEffect(() => {
    if (selectedChannelId) {
      socketService.joinChannel(selectedChannelId)
      void refetchMessages() // Refresh messages for the new channel
    }
  }, [selectedChannelId, refetchMessages])

  const handleWorldSelect = (worldId: string) => {
    setSelectedWorldId(worldId)
    setSelectedChannelId('') // Reset channel when world changes
    setSelectedCharacter(null) // Reset character when world changes
  }

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannelId(channelId)
  }

  const handleSendMessage = (content: string) => {
    if (
      !currentChannel ||
      !currentWorld ||
      !selectedChannelId ||
      !selectedWorldId
    ) {
      return
    }

    // For GM role, allow posting without character selection
    let characterName: string | undefined
    if (selectedRole === 'gm') {
      // GM can post as "游戏主持人" or with selected character
      characterName = selectedCharacter?.name || '游戏主持人'
    } else {
      // Regular players need to select a character
      characterName = selectedCharacter?.name
    }

    socketService.sendMessage(
      selectedChannelId,
      selectedWorldId,
      content,
      characterName
    )
  }

  const handleSelectCharacter = (character: Character | null) => {
    setSelectedCharacter(character)
    setShowCharacterSelection(false)
  }

  const handleOpenCharacterModal = () => {
    setShowCharacterCreation(true)
  }

  const handleCreateWorld = () => {
    // TODO: Implement world creation modal
    console.log('Create world clicked')
  }

  return (
    <Flex height="100vh" width="100vw" bg="gray.900">
      {/* World/Server List */}
      <WorldSidebar
        worlds={worlds.map((world) => ({
          id: world.id,
          name: world.name,
          avatar: '🌍', // Default world avatar
          hasNotification: false,
        }))}
        selectedWorldId={selectedWorldId}
        onWorldSelect={handleWorldSelect}
        onCreateWorld={handleCreateWorld}
      />

      {/* Channel List */}
      <ChannelSidebar
        worldId={selectedWorldId}
        worldName={currentWorld?.name}
        channels={channels}
        selectedChannelId={selectedChannelId}
        selectedRole={selectedRole}
        onChannelSelect={handleChannelSelect}
        onRoleChange={setSelectedRole}
      />

      {/* Main Chat Area */}
      <ChatArea
        channel={currentChannel}
        messages={messages}
        worldCharacters={worldCharacters}
        selectedCharacter={selectedCharacter}
        selectedRole={selectedRole}
        onSendMessage={handleSendMessage}
        onSelectCharacter={handleSelectCharacter}
        onOpenCharacterModal={handleOpenCharacterModal}
      />

      {/* AI World Panel - World Data Viewer and AI Chat */}
      <AIWorldPanel
        worldData={worldStates[0]} // Use the first world state
        worldId={selectedWorldId}
        channelId={selectedChannelId}
        selectedCharacterId={selectedCharacter?.id}
        selectedRole={selectedRole}
      />
    </Flex>
  )
}
