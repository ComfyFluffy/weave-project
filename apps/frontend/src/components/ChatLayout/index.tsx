import { useState, useEffect } from 'react'
import { WorldSidebar } from './WorldSidebar'
import { ChannelSidebar } from './ChannelSidebar'
import { ChatArea } from './ChatArea'
import { MemberList } from './MemberList'
import {
  CharacterCreationModal,
  CharacterSelectionModal,
} from '../CharacterCreation'
import { socketService } from '../../services/socketService'
import {
  useWorlds,
  useWorld,
  useChannelMessages,
  useWorldCharacters,
  useCreateCharacter,
  useSelectCharacter,
} from '../../hooks/useQueries'
import type { Message, PlayerCharacter } from '@weave/types'
import { Flex } from '@chakra-ui/react'

export function ChatLayout() {
  const [selectedWorldId, setSelectedWorldId] = useState<string>('')
  const [selectedChannelId, setSelectedChannelId] = useState<string>('')
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [currentSocketId] = useState<string>(
    Math.random().toString(36).substr(2, 9)
  ) // Generate socket ID
  const [selectedCharacter, setSelectedCharacter] =
    useState<PlayerCharacter | null>(null)

  // Modal states
  const [showCharacterSelection, setShowCharacterSelection] = useState(false)
  const [showCharacterCreation, setShowCharacterCreation] = useState(false)

  // Use React Query hooks for data fetching
  const { data: worlds = [], isLoading: worldsLoading } = useWorlds()
  const { data: currentWorld } = useWorld(selectedWorldId)
  const { data: messages = [], refetch: refetchMessages } =
    useChannelMessages(selectedChannelId)
  const { data: worldCharacters = [] } = useWorldCharacters(selectedWorldId)

  // Mutations
  const createCharacterMutation = useCreateCharacter()
  const selectCharacterMutation = useSelectCharacter()

  const currentChannel = currentWorld?.channels.find(
    (c) => c.id === selectedChannelId
  )

  // Initialize socket connection and auto-select world/channel
  useEffect(() => {
    // Connect to socket
    socketService.connect()

    // Auto-select first world if available
    if (worlds.length > 0 && !selectedWorldId) {
      setSelectedWorldId(worlds[0].id)
    }

    // Setup socket event listeners
    socketService.onNewMessage((message: Message) => {
      // Refetch messages when new message arrives
      refetchMessages()
    })

    socketService.onMessageHistory((messageHistory: Message[]) => {
      // Refetch messages when history is updated
      refetchMessages()
    })

    socketService.onUserTyping((data) => {
      setTypingUsers((prev) => {
        if (data.typing) {
          return [...prev.filter((u) => u !== data.username), data.username]
        } else {
          return prev.filter((u) => u !== data.username)
        }
      })
    })

    // Cleanup on unmount
    return () => {
      socketService.disconnect()
    }
  }, [worlds, selectedWorldId, refetchMessages])

  // Auto-select first channel when world data changes
  useEffect(() => {
    if (currentWorld?.channels.length && !selectedChannelId) {
      setSelectedChannelId(currentWorld.channels[0].id)
    }
  }, [currentWorld, selectedChannelId])

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
      setTypingUsers([]) // Clear typing indicators
      refetchMessages() // Refresh messages for the new channel
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

  const handleCreateCharacter = async (
    character: Omit<PlayerCharacter, 'id'>
  ) => {
    if (!selectedWorldId) return

    try {
      const newCharacter = await createCharacterMutation.mutateAsync({
        worldId: selectedWorldId,
        character,
        createdBy: currentSocketId,
      })

      // Auto-select the newly created character
      setSelectedCharacter(newCharacter)
      await selectCharacterMutation.mutateAsync({
        worldId: selectedWorldId,
        socketId: currentSocketId,
        characterId: newCharacter.id,
      })
    } catch (error) {
      console.error('Failed to create character:', error)
    }
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

    // Use selected character name if available
    const characterName = selectedCharacter?.name

    socketService.sendMessage(
      selectedChannelId,
      selectedWorldId,
      content,
      characterName
    )
  }

  const handleSelectCharacter = (character: PlayerCharacter) => {
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
        worlds={worlds}
        selectedWorldId={selectedWorldId}
        onWorldSelect={handleWorldSelect}
        onCreateWorld={handleCreateWorld}
      />

      {/* Channel List */}
      <ChannelSidebar
        worldName={currentWorld?.name}
        channels={currentWorld?.channels}
        selectedChannelId={selectedChannelId}
        onChannelSelect={handleChannelSelect}
      />

      {/* Main Chat Area */}
      <ChatArea
        channel={currentChannel}
        messages={messages}
        typingUsers={typingUsers}
        worldCharacters={worldCharacters}
        selectedCharacter={selectedCharacter}
        currentSocketId={currentSocketId}
        onSendMessage={handleSendMessage}
        onStartTyping={() =>
          selectedChannelId && socketService.startTyping(selectedChannelId)
        }
        onStopTyping={() =>
          selectedChannelId && socketService.stopTyping(selectedChannelId)
        }
        onSelectCharacter={handleSelectCharacter}
        onOpenCharacterModal={handleOpenCharacterModal}
      />

      {/* Member List */}
      <MemberList
        members={currentWorld?.members}
        onOpenCharacterManagement={() => setShowCharacterSelection(true)}
      />

      {/* Character Selection Modal - opened through member list management button */}
      <CharacterSelectionModal
        isOpen={showCharacterSelection}
        onClose={() => setShowCharacterSelection(false)}
        characters={worldCharacters}
        selectedCharacterId={selectedCharacter?.id}
        onSelectCharacter={handleSelectCharacter}
        onCreateNew={() => {
          setShowCharacterSelection(false)
          setShowCharacterCreation(true)
        }}
      />

      {/* Character Creation Modal */}
      <CharacterCreationModal
        isOpen={showCharacterCreation}
        onClose={() => setShowCharacterCreation(false)}
        onCreateCharacter={handleCreateCharacter}
      />
    </Flex>
  )
}
