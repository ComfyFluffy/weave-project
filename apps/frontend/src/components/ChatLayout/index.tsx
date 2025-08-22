import { useState, useEffect } from 'react'
import { WorldSidebar } from './WorldSidebar'
import { ChannelSidebar } from './ChannelSidebar'
import { ChatArea } from './ChatArea'
import { AIWorldPanel } from '../AIWorldPanel'
import { CharacterManagementModal } from '../CharacterManagementModal'
import { socketService } from '../../services/socketService'
import type { UserRole } from '../RoleSelector'
import {
  useWorlds,
  useWorld,
  useWorldState,
  useChannelMessages,
  useWorldCharacters,
  useCreateCharacter,
} from '../../hooks/queries'
import type { Message, Character } from '@weave/types'
import { Flex } from '@chakra-ui/react'
import { toaster } from '../ui/toaster'

export function ChatLayout() {
  const [selectedWorldId, setSelectedWorldId] = useState<string>('1')
  const [selectedChannelId, setSelectedChannelId] = useState<string>('1')
  const [selectedRole, setSelectedRole] = useState<UserRole>('player')
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  )
  const [isCharacterManagementModalOpen, setIsCharacterManagementModalOpen] = useState(false)
  const [myCharacters, setMyCharacters] = useState<Character[]>([])
  const [availableCharacters, setAvailableCharacters] = useState<Character[]>([])

  const { data: worldsData } = useWorlds()
  const { data: currentWorldData } = useWorld(selectedWorldId)
  const { data: worldStateData } = useWorldState('ws-1')
  const { data: messagesData, refetch: refetchMessages } =
    useChannelMessages(selectedChannelId)
  const { data: worldCharactersData, refetch: refetchWorldCharacters } = useWorldCharacters(selectedWorldId)
  const { mutate: createCharacter } = useCreateCharacter()

  // Extract data from ts-rest responses
  const worlds = worldsData?.body.worlds || []
  const messages = messagesData?.body.messages || []
  const worldCharacters = worldCharactersData?.body.characters || []
  const worldState = worldStateData?.body.worldState

  const channels = worlds?.find((w) => w.id === selectedWorldId)?.channels
  const currentChannel = channels?.find((c) => c.id === selectedChannelId)

  // Initialize socket connection and auto-select world/channel
  useEffect(() => {
    // Connect to socket
    socketService.connect()

    // Auto-select first world if available
    if (worldsData && worldsData.body.worlds.length > 0 && !selectedWorldId) {
      setSelectedWorldId(worldsData.body.worlds[0].id)
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
  }, [worldsData, selectedWorldId, refetchMessages])

  // Auto-select first channel when channels data changes
  useEffect(() => {
    if (channels && channels.length && !selectedChannelId) {
      setSelectedChannelId(channels[0].id)
    }
  }, [channels, selectedChannelId])

  // Handle channel selection
  useEffect(() => {
    if (selectedChannelId) {
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
      !currentWorldData ||
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
  }

  const handleOpenCharacterModal = () => {
    setIsCharacterManagementModalOpen(true);
  }

  const handleCreateCharacter = (characterData: { name: string; description: string }) => {
    createCharacter(
      { body: characterData },
      {
        onSuccess: (data) => {
          // After creating the character, don't automatically select it
          // The user can manually select it from the character list if they want to use it
          
          // Also add to my characters list if it's not already there
          if (data.body && !myCharacters.some(c => c.id === data.body.id)) {
            setMyCharacters(prev => [...prev, data.body])
          }
          
          // Refresh the world characters list
          void refetchWorldCharacters()
        },
        onError: (error) => {
          console.error('Failed to create character:', error)
        },
      }
    )
  }

  const handleCreateWorld = () => {
    // TODO: Implement world creation modal
    console.log('Create world clicked')
  }

  const handleRemoveFromAvailableCharacters = (characterId: string) => {
    // Remove the character from available characters list
    setAvailableCharacters(prev => prev.filter(c => c.id !== characterId));
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
        worldName={currentWorldData?.body.world.name}
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
        worldId={selectedWorldId}
        worldCharacters={worldCharacters}
        myCharacters={availableCharacters}
        selectedCharacter={selectedCharacter}
        selectedRole={selectedRole}
        onSendMessage={handleSendMessage}
        onSelectCharacter={handleSelectCharacter}
        onCreateCharacter={handleCreateCharacter}
        onOpenCharacterManagement={handleOpenCharacterModal}
        onRemoveFromAvailableCharacters={handleRemoveFromAvailableCharacters}
      />

      {/* AI World Panel - World Data Viewer and AI Chat */}
      <AIWorldPanel
        worldState={worldState} // Use the world state data
        worldId={selectedWorldId}
        channelId={selectedChannelId}
        selectedCharacterId={selectedCharacter?.id}
        selectedRole={selectedRole}
      />
      
      {/* Character Management Modal */}
      <CharacterManagementModal
        worldId={selectedWorldId}
        myCharacters={myCharacters}
        isOpen={isCharacterManagementModalOpen}
        onClose={() => setIsCharacterManagementModalOpen(false)}
        onRemoveFromMyCharacters={(characterId) => {
          // Remove the character from my characters list
          setMyCharacters(prev => prev.filter(c => c.id !== characterId));
        }}
        onSelectCharacter={(character) => {
          // Add the character to my characters list only, don't automatically select it
          if (character && !myCharacters.some(c => c.id === character.id)) {
            setMyCharacters(prev => [...prev, character]);
          }
        }}
        onAddToChatCharacters={(character) => {
          // Add the character to available characters for chatting
          if (character && !availableCharacters.some(c => c.id === character.id)) {
            setAvailableCharacters(prev => [...prev, character]);
            // Show success toast
            toaster.success({
              title: '角色已添加',
              description: `"${character.name}" 已成功添加到聊天角色列表`,
              duration: 3000,
            });
          }
        }}
      />
    </Flex>
  )
}
