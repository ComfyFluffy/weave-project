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
  useWorldCharacters,
} from '../../hooks/queries'
import type { Message, Character } from '@weave/types'
import { Flex } from '@chakra-ui/react'
import { useChannelSocket } from '../../hooks/channel-socket'

export function ChatLayout() {
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null)
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    null
  )
  const [selectedRole, setSelectedRole] = useState<UserRole>('player')
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  )

  const { data: worldsData } = useWorlds()
  const { data: currentWorldData } = useWorld(selectedWorldId)
  const { data: channelsData } = useChannelsByWorld(selectedWorldId)
  const { data: worldStateData } = useWorldStateByChannel(selectedChannelId)
  const { data: messagesData, refetch: refetchMessages } =
    useChannelMessages(selectedChannelId)
  const { data: worldCharactersData } = useWorldCharacters(selectedWorldId)

  // Use the channel socket hook
  const { sendMessage } = useChannelSocket({
    channelId: selectedChannelId,
    onNewMessage: (message: Message) => {
      console.log('ChatLayout: Received new message', message)
      void refetchMessages()
    },
  })

  const worlds = worldsData?.body.worlds
  const currentWorld = currentWorldData?.body.world
  const channels = channelsData?.body.channels
  const currentChannel = channels?.find((c) => c.id === selectedChannelId)
  const messages = messagesData?.body.messages
  const worldCharacters = worldCharactersData?.body.characters
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
    setSelectedChannelId(channelId)
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
    console.log('Selected character:', character)
    setSelectedCharacter(character)
  }

  const handleOpenCharacterModal = () => {
    // TODO
  }

  const handleCreateWorld = () => {
    // TODO: Implement world creation modal
    console.log('Create world clicked')
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
        worldCharacters={worldCharacters}
        selectedCharacter={selectedCharacter}
        selectedRole={selectedRole}
        onSendMessage={handleSendMessage}
        onSelectCharacter={handleSelectCharacter}
        onOpenCharacterModal={handleOpenCharacterModal}
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
    </Flex>
  )
}
