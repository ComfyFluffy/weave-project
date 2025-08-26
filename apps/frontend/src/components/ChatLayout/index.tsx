import { useState, useEffect } from 'react'
import { WorldSidebar } from './WorldSidebar'
import { ChannelSidebar } from './ChannelSidebar'
import { ChatArea } from './ChatArea'
import { AIWorldPanel } from '../AIWorldPanel'
import type { UserRole } from '../RoleSelector'
import {
  useWorlds,
  useWorld,
  useChannelsByWorld,
  useWorldStateByChannel,
  useChannelMessages,
  useChannelCharacters,
  useCreateCharacter,
  useRemoveCharacterFromWorldState,
} from '../../hooks/queries'
import type { Message, Character } from '@weave/types'
import { Flex } from '@chakra-ui/react'
import { useChannelSocket } from '../../hooks/channel-socket'
import { CharacterManagementModal } from '../CharacterManagementModal'
import { ConfirmDialog } from '../ConfirmDialog'
import { toaster } from '../ui/toaster'

export function ChatLayout() {
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null)
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    null
  )
  const [selectedRole, setSelectedRole] = useState<UserRole>('player')
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  )
  const [isCharacterManagementModalOpen, setIsCharacterManagementModalOpen] =
    useState(false)
  const [isRemoveCharacterConfirmOpen, setIsRemoveCharacterConfirmOpen] =
    useState(false)
  const [characterToRemove, setCharacterToRemove] = useState<{
    id: string
    name: string
  } | null>(null)

  const { data: worldsData, refetch: refetchWorlds } = useWorlds()
  const { data: currentWorldData } = useWorld(selectedWorldId)
  const { data: channelsData } = useChannelsByWorld(selectedWorldId)
  const { data: worldStateData } = useWorldStateByChannel(selectedChannelId)
  const { data: messagesData, refetch: refetchMessages } =
    useChannelMessages(selectedChannelId)
  const { data: channelCharactersData, refetch: refetchChannelCharacters } =
    useChannelCharacters(selectedChannelId)
  const { mutate: createCharacter } = useCreateCharacter()
  const { mutate: removeCharacterFromWorldState } = useRemoveCharacterFromWorldState()

  // Use the channel socket hook
  const { sendMessage } = useChannelSocket({
    channelId: selectedChannelId,
    onNewMessage: (message: Message) => {
      void refetchMessages()
    },
  })

  const worlds = worldsData?.body.worlds
  const currentWorld = currentWorldData?.body.world
  const channels = channelsData?.body.channels
  const currentChannel = channels?.find((c) => c.id === selectedChannelId)
  const messages = messagesData?.body.messages
  const worldCharacters = channelCharactersData?.body.characters
  const worldState = worldStateData?.body.worldState

  // Auto-select first world if available and none selected
  useEffect(() => {
    if (worlds && worlds.length > 0 && !selectedWorldId) {
      setSelectedWorldId(worlds[0].id)
    }
  }, [worlds, selectedWorldId])

  // Auto-select first channel when channels data changes and none selected
  useEffect(() => {
    if (channels && channels.length > 0 && !selectedChannelId) {
      setSelectedChannelId(channels[0].id)
    }
  }, [channels, selectedChannelId])

  // Reset channel when world changes
  useEffect(() => {
    if (selectedWorldId) {
      setSelectedChannelId(null)
      setSelectedCharacter(null)
    }
  }, [selectedWorldId])

  const handleWorldSelect = (worldId: string) => {
    setSelectedWorldId(worldId)
  }

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannelId(channelId || null)
  }

  const handleSendMessage = (content: string) => {
    if (!currentChannel || !selectedChannelId) {
      return
    }

    sendMessage({
      channelId: selectedChannelId,
      content,
      characterId: selectedCharacter?.id,
      type: selectedRole === 'gm' ? 'gm' : 'character',
    })
  }

  const handleSelectCharacter = (character: Character | null) => {
    setSelectedCharacter(character)
  }

  const handleOpenCharacterModal = () => {
    setIsCharacterManagementModalOpen(true)
  }

  const handleRemoveFromAvailableCharacters = (characterId: string, characterName: string) => {
    setCharacterToRemove({ id: characterId, name: characterName })
    setIsRemoveCharacterConfirmOpen(true)
  }

  const confirmRemoveCharacter = () => {
    if (characterToRemove && worldState) {
      // If the character being removed is currently selected, deselect it
      if (selectedCharacter && selectedCharacter.id === characterToRemove.id) {
        setSelectedCharacter(null)
      }
      
      // Call the API to remove the character from the world state
      removeCharacterFromWorldState(
        {
          params: {
            worldStateId: worldState.id,
            characterId: characterToRemove.id,
          },
        },
        {
          onSuccess: () => {
            // Refresh the channel characters list
            void refetchChannelCharacters()
            // Show success message
            toaster.create({
              title: '角色已移除',
              description: `"${characterToRemove.name}" 已从选择角色列表中移除`,
              type: 'success',
            })
          },
          onError: (error) => {
            console.error('Failed to remove character from world state:', error)
            toaster.create({
              title: '移除失败',
              description: '无法从选择角色列表中移除该角色',
              type: 'error',
            })
          },
        }
      )
      
      setCharacterToRemove(null)
      setIsRemoveCharacterConfirmOpen(false)
    }
  }

  const handleCreateCharacter = (characterData: {
    name: string
    description: string
  }) => {
    createCharacter(
      { body: characterData },
      {
        onSuccess: () => {
          // Refresh the world characters list
          void refetchChannelCharacters()
        },
        onError: (error) => {
          console.error('Failed to create character:', error)
        },
      }
    )
  }

  const handleCreateWorld = () => {
    // Refetch worlds after creation
    void refetchWorlds()
  }

  return (
    <Flex height="100vh" width="100vw" bg="gray.900">
      {/* World/Server List */}
      <WorldSidebar
        worlds={worlds?.map((world) => ({
          id: world.id,
          name: world.name,
          avatar: '🌍', // Default world avatar
          hasNotification: false,
        }))}
        selectedWorldId={selectedWorldId || undefined}
        onWorldSelect={handleWorldSelect}
        onCreateWorld={handleCreateWorld}
      />

      {/* Channel List */}
      <ChannelSidebar
        worldId={selectedWorldId || undefined}
        worldName={currentWorld?.name}
        channels={channels}
        selectedChannelId={selectedChannelId || undefined}
        selectedRole={selectedRole}
        onChannelSelect={handleChannelSelect}
        onRoleChange={setSelectedRole}
      />

      {/* Main Chat Area */}
      <ChatArea
        channel={currentChannel}
        messages={messages}
        worldId={selectedWorldId || undefined}
        worldCharacters={worldCharacters}
        myCharacters={[]}
        selectedCharacter={selectedCharacter}
        selectedRole={selectedRole}
        onSendMessage={handleSendMessage}
        onSelectCharacter={handleSelectCharacter}
        onCreateCharacter={handleCreateCharacter}
        onOpenCharacterManagement={handleOpenCharacterModal}
        onRemoveFromAvailableCharacters={handleRemoveFromAvailableCharacters}
      />

      {/* AI World Panel - World Data Viewer and AI Chat */}
      {selectedWorldId && selectedChannelId && (
        <AIWorldPanel
          worldState={worldState} // Use the world state data
          worldId={selectedWorldId}
          channelId={selectedChannelId}
          selectedCharacterId={selectedCharacter?.id}
          selectedRole={selectedRole}
        />
      )}

      {/* Character Management Modal */}
      {selectedWorldId && selectedChannelId && worldState && (
        <CharacterManagementModal
          worldStateId={worldState.id}
          isOpen={isCharacterManagementModalOpen}
          onClose={() => setIsCharacterManagementModalOpen(false)}
        />
      )}

      {/* Remove Character Confirm Dialog */}
      <ConfirmDialog
        isOpen={isRemoveCharacterConfirmOpen}
        onClose={() => {
          setIsRemoveCharacterConfirmOpen(false)
          setCharacterToRemove(null)
        }}
        onConfirm={confirmRemoveCharacter}
        title="确认移除角色"
        message={
          characterToRemove
            ? `确定要从选择角色列表中移除 "${characterToRemove.name}" 吗？该角色仍保留在角色管理中，可以随时重新添加。`
            : ''
        }
        confirmText="移除"
        cancelText="取消"
      />
    </Flex>
  )
}
